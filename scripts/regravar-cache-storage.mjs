#!/usr/bin/env node
/**
 * Regrava os arquivos dos buckets PÚBLICOS do Supabase Storage com cache de 1 ano (`max-age=31536000`),
 * mantendo o mesmo caminho e o mesmo tipo de conteúdo. Roda SÓ NA SUA MÁQUINA: usa a chave
 * `service_role`, que nunca pode entrar no site, no Git nem no `.env.local` (o Next lê esse arquivo).
 *
 * Buckets aceitos: projetos-publico e biblioteca-exemplos. O bucket privado é recusado de propósito.
 * O script NÃO apaga nada (nem no Storage, nem no disco). Só baixa, grava cópia local e reenvia.
 *
 * Passos de cada arquivo:
 *   (a) listar    – lê os dois buckets e vê o cache atual de cada arquivo;
 *   (b) backup    – baixa para backup-storage/<bucket>/<caminho> e confere o tamanho;
 *   (c) reenviar  – envia de volta a CÓPIA LOCAL (upsert) com cacheControl de 1 ano;
 *   (d) conferir  – lê o Storage de novo: tamanho, tipo e cache têm que bater. Depois, relatório CSV.
 *
 * Uso (a partir da raiz do projeto):
 *   node --env-file=.env.scripts scripts/regravar-cache-storage.mjs                  dry-run (padrão)
 *   node --env-file=.env.scripts scripts/regravar-cache-storage.mjs --executar --so-backup   só (b)
 *   node --env-file=.env.scripts scripts/regravar-cache-storage.mjs --executar --limite=3    teste com 3
 *   node --env-file=.env.scripts scripts/regravar-cache-storage.mjs --executar               tudo
 *
 * Opções: --executar  --so-backup  --bucket=<nome>  --lote=<1-50, padrão 10>  --limite=<N arquivos>
 *         --pasta=<backup, padrão backup-storage>  --detalhar (dry-run lista todos)  --ajuda
 *
 * Retomar: é só rodar de novo o mesmo comando. Quem já está com cache de 1 ano é pulado, e o backup
 * que já existe (e confere) não é baixado outra vez. O progresso fica em <pasta>/estado.json.
 *
 * Variáveis (arquivo .env.scripts, que o .gitignore já ignora):
 *   SUPABASE_URL=https://<projeto>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<chave secreta, nunca a publishable>
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { createClient } from '@supabase/supabase-js'

const BUCKETS_PERMITIDOS = ['projetos-publico', 'biblioteca-exemplos']
const CACHE_EM_SEGUNDOS = '31536000'
const CACHE_ESPERADO = `max-age=${CACHE_EM_SEGUNDOS}`
const PASTA_PADRAO = 'backup-storage'
const CONCORRENCIA = 3
const PAUSA_ENTRE_LOTES_MS = 500

const AJUDA = `Regrava os arquivos públicos do Storage com cache de 1 ano.
Sem --executar nada é baixado nem enviado (dry-run).
Opções: --executar  --so-backup  --bucket=<nome>  --lote=<1-50>  --limite=<N>  --pasta=<dir>  --detalhar`

// ── Argumentos e ambiente ────────────────────────────────────────────────────────────────────────

function lerArgumentos(argv) {
  const opcoes = {
    executar: false,
    soBackup: false,
    detalhar: false,
    bucket: null,
    lote: 10,
    limite: Infinity,
    pasta: PASTA_PADRAO,
  }
  for (const arg of argv) {
    if (arg === '--executar') opcoes.executar = true
    else if (arg === '--so-backup') opcoes.soBackup = true
    else if (arg === '--detalhar') opcoes.detalhar = true
    else if (arg === '--ajuda' || arg === '-h') {
      console.log(AJUDA)
      process.exit(0)
    } else if (arg.startsWith('--bucket=')) opcoes.bucket = arg.slice('--bucket='.length)
    else if (arg.startsWith('--lote=')) opcoes.lote = Number(arg.slice('--lote='.length))
    else if (arg.startsWith('--limite=')) opcoes.limite = Number(arg.slice('--limite='.length))
    else if (arg.startsWith('--pasta=')) opcoes.pasta = arg.slice('--pasta='.length)
    else throw new Error(`Opção desconhecida: ${arg}\n\n${AJUDA}`)
  }
  if (opcoes.bucket && !BUCKETS_PERMITIDOS.includes(opcoes.bucket)) {
    throw new Error(`Bucket recusado: "${opcoes.bucket}". Aceitos: ${BUCKETS_PERMITIDOS.join(', ')}.`)
  }
  if (!Number.isInteger(opcoes.lote) || opcoes.lote < 1 || opcoes.lote > 50) {
    throw new Error('--lote precisa ser um inteiro de 1 a 50.')
  }
  if (opcoes.limite !== Infinity && (!Number.isInteger(opcoes.limite) || opcoes.limite < 1)) {
    throw new Error('--limite precisa ser um inteiro maior que zero.')
  }
  return opcoes
}

/** Papel gravado numa chave no formato JWT (`anon` ou `service_role`); `null` se não for JWT. */
function papelDoJwt(chave) {
  try {
    return JSON.parse(Buffer.from(chave.split('.')[1], 'base64url').toString()).role ?? null
  } catch {
    return null
  }
}

function criarCliente() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !chave) {
    throw new Error(
      'Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY. Crie o arquivo .env.scripts (ver o topo deste script) e rode com --env-file=.env.scripts.',
    )
  }
  if (chave.startsWith('sb_publishable_') || papelDoJwt(chave) === 'anon') {
    throw new Error('Essa é a chave pública. Use a chave secreta (service_role) do painel do Supabase.')
  }
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } })
}

// ── Utilidades ───────────────────────────────────────────────────────────────────────────────────

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

function formatarBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Tenta de novo (3x, com espera crescente) as chamadas de rede, que às vezes falham de passagem. */
async function comTentativas(rotulo, acao) {
  let ultimoErro
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      return await acao()
    } catch (erro) {
      ultimoErro = erro
      if (tentativa < 3) await dormir(500 * 2 ** (tentativa - 1))
    }
  }
  throw new Error(`${rotulo}: ${ultimoErro?.message ?? ultimoErro}`)
}

/** Onde fica a cópia local. Recusa qualquer caminho que escape da pasta de backup. */
function caminhoLocal(pasta, bucket, caminho) {
  const base = path.resolve(pasta, bucket)
  const alvo = path.resolve(base, ...caminho.split('/'))
  if (!alvo.startsWith(base + path.sep)) throw new Error(`Caminho suspeito: ${caminho}`)
  return alvo
}

async function tamanhoLocal(arquivo) {
  try {
    return (await stat(arquivo)).size
  } catch (erro) {
    if (erro.code === 'ENOENT') return null
    throw erro
  }
}

// ── (a) Listar ───────────────────────────────────────────────────────────────────────────────────

/** Lista o bucket inteiro, descendo nas pastas (projeto → papel → arquivo). */
async function listarBucket(supabase, bucket, prefixo = '') {
  const itens = []
  for (let deslocamento = 0; ; deslocamento += 100) {
    const { data, error } = await supabase.storage.from(bucket).list(prefixo, {
      limit: 100,
      offset: deslocamento,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error) throw new Error(`Listar ${bucket}/${prefixo}: ${error.message}`)

    for (const item of data) {
      if (item.name === '.emptyFolderPlaceholder') continue
      const caminho = prefixo ? `${prefixo}/${item.name}` : item.name
      if (item.id === null) {
        itens.push(...(await listarBucket(supabase, bucket, caminho)))
      } else {
        itens.push({
          bucket,
          caminho,
          tamanho: item.metadata?.size ?? null,
          mimetype: item.metadata?.mimetype ?? null,
          cacheAntes: item.metadata?.cacheControl ?? null,
        })
      }
    }
    if (data.length < 100) break
  }
  return itens
}

/** Metadados atuais de UM arquivo (lendo a pasta dele), para conferir depois do reenvio. */
async function lerMetadados(supabase, bucket, caminho) {
  const pasta = path.posix.dirname(caminho)
  const nome = path.posix.basename(caminho)
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(pasta === '.' ? '' : pasta, { limit: 100, search: nome })
  if (error) throw new Error(error.message)
  const achado = data.find((item) => item.name === nome)
  if (!achado) return null
  return {
    tamanho: achado.metadata?.size ?? null,
    mimetype: achado.metadata?.mimetype ?? null,
    cache: achado.metadata?.cacheControl ?? null,
  }
}

const precisaRegravar = (item) => item.cacheAntes !== CACHE_ESPERADO

// ── Dry-run ──────────────────────────────────────────────────────────────────────────────────────

function mostrarDryRun(itens, opcoes) {
  const porBucket = new Map()
  for (const item of itens) {
    const grupo = porBucket.get(item.bucket) ?? { total: 0, pendentes: 0, bytes: 0, bytesPendentes: 0 }
    grupo.total += 1
    grupo.bytes += item.tamanho ?? 0
    if (precisaRegravar(item)) {
      grupo.pendentes += 1
      grupo.bytesPendentes += item.tamanho ?? 0
    }
    porBucket.set(item.bucket, grupo)
  }

  console.log('\nDRY-RUN: nada foi baixado, enviado, criado ou apagado.\n')
  console.log('Por bucket:')
  for (const [bucket, g] of porBucket) {
    console.log(
      `  ${bucket}: ${g.total} arquivos (${formatarBytes(g.bytes)}); a regravar: ${g.pendentes} (${formatarBytes(g.bytesPendentes)}); já com cache de 1 ano: ${g.total - g.pendentes}`,
    )
  }

  const pendentes = itens.filter(precisaRegravar)
  const bytesPendentes = pendentes.reduce((soma, item) => soma + (item.tamanho ?? 0), 0)
  const semMime = pendentes.filter((item) => !item.mimetype)
  console.log(`\nSeria feito com ${pendentes.length} arquivo(s):`)
  console.log(`  (b) baixar para ${opcoes.pasta}/<bucket>/<caminho>: ${formatarBytes(bytesPendentes)}`)
  console.log(
    opcoes.soBackup
      ? '  (c) reenviar: NÃO (você pediu --so-backup)'
      : `  (c) reenviar com cacheControl ${CACHE_EM_SEGUNDOS}: ${formatarBytes(bytesPendentes)}`,
  )
  console.log(`  (d) conferir tamanho, tipo e cache de cada um, e gravar o relatório CSV`)
  console.log(`  em lotes de ${opcoes.lote}, ${CONCORRENCIA} ao mesmo tempo${Number.isFinite(opcoes.limite) ? `, no máximo ${opcoes.limite} arquivos nesta rodada` : ''}`)
  if (semMime.length > 0) {
    console.log(`\n  ATENÇÃO: ${semMime.length} arquivo(s) sem tipo de conteúdo; serão marcados como falha, sem reenvio.`)
  }

  const mostrar = opcoes.detalhar ? itens : itens.slice(0, 10)
  console.log(`\n${opcoes.detalhar ? 'Todos os arquivos' : 'Primeiros 10 arquivos (use --detalhar para ver todos)'}:`)
  for (const item of mostrar) {
    const acao = precisaRegravar(item) ? 'REGRAVAR' : 'pular   '
    console.log(
      `  ${acao}  ${item.bucket}/${item.caminho}  ${formatarBytes(item.tamanho ?? 0).padStart(8)}  ${item.mimetype ?? '?'}  cache atual: ${item.cacheAntes ?? '?'}`,
    )
  }
  console.log('\nPara executar de verdade: acrescente --executar (sugestão: comece com --so-backup).')
}

// ── Estado (retomada) ────────────────────────────────────────────────────────────────────────────

async function lerEstado(arquivo) {
  try {
    return JSON.parse(await readFile(arquivo, 'utf8'))
  } catch (erro) {
    if (erro.code === 'ENOENT') return {}
    throw erro
  }
}

function criarGravadorDeEstado(arquivo, estado) {
  let fila = Promise.resolve()
  return () => {
    // Uma gravação de cada vez; escreve num arquivo temporário e troca, para nunca ficar pela metade.
    fila = fila.then(async () => {
      const temporario = `${arquivo}.tmp`
      await writeFile(temporario, JSON.stringify(estado, null, 2))
      await rename(temporario, arquivo)
    })
    return fila
  }
}

// ── (b) (c) (d) Processar um arquivo ─────────────────────────────────────────────────────────────

async function garantirBackup(supabase, item, pasta, registro) {
  const destino = caminhoLocal(pasta, item.bucket, item.caminho)

  const existente = await tamanhoLocal(destino)
  if (existente !== null && existente === item.tamanho) {
    const buffer = await readFile(destino)
    if (!registro.sha256 || registro.sha256 === sha256(buffer)) return { buffer, destino, baixou: false }
  }

  const baixado = await comTentativas('download', async () => {
    const { data, error } = await supabase.storage.from(item.bucket).download(item.caminho)
    if (error) throw new Error(error.message)
    return Buffer.from(await data.arrayBuffer())
  })
  if (item.tamanho !== null && baixado.length !== item.tamanho) {
    throw new Error(`baixou ${baixado.length} bytes, o Storage informa ${item.tamanho}`)
  }
  await mkdir(path.dirname(destino), { recursive: true })
  const parcial = `${destino}.parcial`
  await writeFile(parcial, baixado)
  await rename(parcial, destino)
  return { buffer: baixado, destino, baixou: true }
}

async function processarArquivo(supabase, item, contexto) {
  const chave = `${item.bucket}/${item.caminho}`
  const registro = (contexto.estado[chave] ??= {})
  const resultado = { ...item, cacheDepois: item.cacheAntes ?? '', status: '', erro: '' }

  try {
    // (b) backup, sempre antes de qualquer envio
    const { buffer, baixou } = await garantirBackup(supabase, item, contexto.pasta, registro)
    registro.backup = 'ok'
    registro.sha256 = sha256(buffer)
    registro.tamanho = buffer.length
    if (contexto.soBackup) {
      resultado.status = baixou ? 'backup-feito' : 'backup-ja-existia'
      return resultado
    }

    // (c) reenvio da cópia local, mesmo caminho e mesmo tipo de conteúdo
    if (!item.mimetype) throw new Error('sem tipo de conteúdo no Storage; não vou adivinhar')
    const corpo = new Blob([buffer], { type: item.mimetype })
    await comTentativas('upload', async () => {
      const { error } = await supabase.storage.from(item.bucket).upload(item.caminho, corpo, {
        upsert: true,
        cacheControl: CACHE_EM_SEGUNDOS,
        contentType: item.mimetype,
      })
      if (error) throw new Error(error.message)
    })

    // (d) conferência no próprio Storage
    const depois = await comTentativas('conferir', () => lerMetadados(supabase, item.bucket, item.caminho))
    if (!depois) throw new Error('o arquivo não aparece no Storage depois do reenvio')
    resultado.cacheDepois = depois.cache ?? ''
    if (depois.tamanho !== item.tamanho) {
      throw new Error(`tamanho depois do reenvio: ${depois.tamanho}, esperado ${item.tamanho}. Restaure pela cópia local.`)
    }
    if (depois.mimetype !== item.mimetype) {
      throw new Error(`tipo depois do reenvio: ${depois.mimetype}, esperado ${item.mimetype}`)
    }
    if (depois.cache !== CACHE_ESPERADO) {
      throw new Error(`cache depois do reenvio: ${depois.cache}, esperado ${CACHE_ESPERADO}`)
    }

    registro.reenvio = 'ok'
    delete registro.erro
    resultado.status = 'regravado'
  } catch (erro) {
    registro.erro = erro.message
    resultado.status = 'falha'
    resultado.erro = erro.message
  }
  registro.atualizadoEm = new Date().toISOString()
  await contexto.salvarEstado()
  return resultado
}

/** Roda `tarefa` em todos os itens, no máximo `limite` ao mesmo tempo. */
async function emParalelo(itens, limite, tarefa) {
  const resultados = new Array(itens.length)
  let proximo = 0
  const trabalhadores = Array.from({ length: Math.min(limite, itens.length) }, async () => {
    while (proximo < itens.length) {
      const indice = proximo++
      resultados[indice] = await tarefa(itens[indice])
    }
  })
  await Promise.all(trabalhadores)
  return resultados
}

// ── Relatório (d) ────────────────────────────────────────────────────────────────────────────────

const celula = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`

async function gravarRelatorio(pasta, linhas) {
  const agora = new Date()
  const carimbo = agora.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
  const arquivo = path.join(pasta, `relatorio-${carimbo}.csv`)
  const cabecalho = 'bucket,caminho,tamanho_bytes,tipo,cache_antes,cache_depois,status,erro'
  const corpo = linhas.map((l) =>
    [l.bucket, l.caminho, l.tamanho, l.mimetype, l.cacheAntes, l.cacheDepois, l.status, l.erro]
      .map(celula)
      .join(','),
  )
  await writeFile(arquivo, `${[cabecalho, ...corpo].join('\n')}\n`)
  return arquivo
}

// ── Principal ────────────────────────────────────────────────────────────────────────────────────

async function principal() {
  const opcoes = lerArgumentos(process.argv.slice(2))
  const supabase = criarCliente()

  const buckets = opcoes.bucket ? [opcoes.bucket] : BUCKETS_PERMITIDOS
  console.log(`Listando: ${buckets.join(', ')} …`)
  const itens = []
  for (const bucket of buckets) itens.push(...(await listarBucket(supabase, bucket)))
  console.log(`${itens.length} arquivo(s) encontrado(s).`)

  if (!opcoes.executar) {
    mostrarDryRun(itens, opcoes)
    return 0
  }

  await mkdir(opcoes.pasta, { recursive: true })
  const arquivoDeEstado = path.join(opcoes.pasta, 'estado.json')
  const estado = await lerEstado(arquivoDeEstado)
  const contexto = {
    pasta: opcoes.pasta,
    soBackup: opcoes.soBackup,
    estado,
    salvarEstado: criarGravadorDeEstado(arquivoDeEstado, estado),
  }

  let parar = false
  process.on('SIGINT', () => {
    parar = true
    console.log('\nCtrl+C recebido: termino o lote atual e paro. Rode de novo para retomar.')
  })

  const pendentes = itens.filter(precisaRegravar).slice(0, opcoes.limite)
  const relatorio = []
  for (const item of itens) {
    if (!precisaRegravar(item)) {
      const jaFeito = estado[`${item.bucket}/${item.caminho}`]?.reenvio === 'ok'
      relatorio.push({
        ...item,
        cacheDepois: item.cacheAntes,
        status: jaFeito ? 'regravado-em-rodada-anterior' : 'ja-estava-ok',
        erro: '',
      })
    }
  }

  console.log(
    `${opcoes.soBackup ? 'Backup' : 'Regravação'} de ${pendentes.length} arquivo(s), lotes de ${opcoes.lote}.\n`,
  )
  let feitos = 0
  for (let inicio = 0; inicio < pendentes.length && !parar; inicio += opcoes.lote) {
    const lote = pendentes.slice(inicio, inicio + opcoes.lote)
    const resultados = await emParalelo(lote, CONCORRENCIA, (item) => processarArquivo(supabase, item, contexto))
    relatorio.push(...resultados)
    feitos += lote.length
    const falhas = resultados.filter((r) => r.status === 'falha')
    console.log(`  lote ${Math.floor(inicio / opcoes.lote) + 1}: ${feitos}/${pendentes.length} (falhas neste lote: ${falhas.length})`)
    for (const falha of falhas) console.log(`    FALHA ${falha.bucket}/${falha.caminho}: ${falha.erro}`)
    await dormir(PAUSA_ENTRE_LOTES_MS)
  }

  const processados = new Set(relatorio.map((l) => `${l.bucket}/${l.caminho}`))
  for (const item of itens) {
    if (!processados.has(`${item.bucket}/${item.caminho}`)) {
      relatorio.push({ ...item, cacheDepois: item.cacheAntes ?? '', status: 'nao-processado', erro: '' })
    }
  }

  const arquivoDoRelatorio = await gravarRelatorio(opcoes.pasta, relatorio)
  const contar = (status) => relatorio.filter((l) => l.status === status).length
  const falhas = contar('falha')
  console.log('\nResumo:')
  console.log(`  regravados agora:            ${contar('regravado')}`)
  console.log(`  backups feitos / já existiam: ${contar('backup-feito')} / ${contar('backup-ja-existia')}`)
  console.log(`  já estavam com cache de 1 ano: ${contar('ja-estava-ok') + contar('regravado-em-rodada-anterior')}`)
  console.log(`  falhas:                      ${falhas}`)
  console.log(`  não processados (limite/Ctrl+C): ${contar('nao-processado')}`)
  console.log(`  relatório: ${arquivoDoRelatorio}`)
  console.log(
    "\nConferir no SQL Editor do Supabase:\n  select metadata->>'cacheControl' as cache, count(*) from storage.objects where bucket_id in ('projetos-publico','biblioteca-exemplos') group by 1;",
  )
  return falhas > 0 ? 1 : 0
}

principal().then(
  (codigo) => {
    process.exitCode = codigo
  },
  (erro) => {
    console.error(`\nErro: ${erro.message}`)
    process.exitCode = 1
  },
)
