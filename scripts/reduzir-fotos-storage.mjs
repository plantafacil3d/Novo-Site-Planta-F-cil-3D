#!/usr/bin/env node
/**
 * Fase 5 (fotos ANTIGAS): reduz as imagens já gravadas nos buckets PÚBLICOS do Supabase Storage que
 * passam do limite de tamanho, mantendo o MESMO caminho, o mesmo nome e o mesmo formato (por isso o
 * banco não muda), com cache de 1 ano. Roda SÓ NA SUA MÁQUINA, como `regravar-cache-storage.mjs`.
 *
 * Limites (os mesmos de `REDUCAO_DE_IMAGEM` em src/features/cadastro-projeto/rules.ts; mudou lá, mude aqui):
 *   fotos (principal, galeria, biblioteca): lado maior 1920 px, qualidade 85
 *   plantas (pasta /planta/):               lado maior 2400 px, qualidade 90
 * Nunca amplia: imagem que já cabe no limite não é tocada. A proporção é mantida.
 *
 * Formato: o mesmo do arquivo (WebP continua WebP, JPG continua JPG, PNG continua PNG). Trocar o formato
 * mudaria o tipo do arquivo sem mudar o banco. Se a versão reduzida NÃO ficar menor que a original
 * ("não compensa"), a original é mantida e o arquivo aparece no relatório.
 *
 * Buckets aceitos: projetos-publico e biblioteca-exemplos. O bucket privado e os PDFs são recusados.
 * O script NÃO apaga nada. A cópia local original (backup-storage/) nunca é alterada.
 *
 * Uso (a partir da raiz do projeto):
 *   node --env-file=.env.scripts scripts/reduzir-fotos-storage.mjs                 dry-run (padrão)
 *   node scripts/reduzir-fotos-storage.mjs                                         dry-run SEM chave, lendo só o backup local
 *   node --env-file=.env.scripts scripts/reduzir-fotos-storage.mjs --executar --limite=3
 *   node --env-file=.env.scripts scripts/reduzir-fotos-storage.mjs --executar
 *
 * Opções: --executar  --limite=<N arquivos a reduzir>  --bucket=<nome>  --lote=<1-50, padrão 10>
 *         --pasta=<backup, padrão backup-storage>  --detalhar (dry-run lista todos)  --ajuda
 *         --um-por-projeto  reduz no máximo uma foto por projeto (para amostras com --limite)
 *
 * Retomar: rode de novo o mesmo comando; o que já foi reduzido é pulado (estado em
 * <pasta>/estado-fase5.json).
 *
 * Chave (só para --executar ou para o dry-run listar o Storage de verdade): arquivo .env.scripts, que o
 * .gitignore já ignora. A chave nunca é mostrada.
 *   SUPABASE_URL=https://<projeto>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<chave secreta>
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const BUCKETS_PERMITIDOS = ['projetos-publico', 'biblioteca-exemplos']
const CACHE_EM_SEGUNDOS = '31536000'
const CACHE_ESPERADO = `max-age=${CACHE_EM_SEGUNDOS}`
const PASTA_PADRAO = 'backup-storage'
const CONCORRENCIA = 2
const PAUSA_ENTRE_LOTES_MS = 500
const LIMITES = {
  foto: { ladoMaximo: 1920, qualidade: 85 },
  planta: { ladoMaximo: 2400, qualidade: 90 },
}
const TIPO_POR_EXTENSAO = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

const AJUDA = `Reduz as fotos públicas antigas (1920 px; plantas 2400 px) no mesmo caminho e formato.
Sem --executar nada é enviado (dry-run). Opções: --executar --limite=<N> --bucket=<nome> --lote=<1-50>
--pasta=<dir> --detalhar`

// ── Argumentos e ambiente ────────────────────────────────────────────────────────────────────────

function lerArgumentos(argv) {
  const opcoes = {
    executar: false,
    detalhar: false,
    umPorProjeto: false,
    bucket: null,
    lote: 10,
    limite: Infinity,
    pasta: PASTA_PADRAO,
  }
  for (const arg of argv) {
    if (arg === '--executar') opcoes.executar = true
    else if (arg === '--detalhar') opcoes.detalhar = true
    else if (arg === '--um-por-projeto') opcoes.umPorProjeto = true
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

/** `null` se as variáveis não existem (dry-run segue só com o backup local). */
function criarClienteSeHouverChave() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !chave) return null
  if (chave.startsWith('sb_publishable_') || papelDoJwt(chave) === 'anon') {
    throw new Error('Essa é a chave pública. Use a chave secreta (service_role) do painel do Supabase.')
  }
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } })
}

// ── Utilidades ───────────────────────────────────────────────────────────────────────────────────

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')
const extensaoDe = (caminho) => path.posix.extname(caminho).slice(1).toLowerCase()

function formatarBytes(bytes) {
  if (Math.abs(bytes) < 1024) return `${bytes} B`
  if (Math.abs(bytes) < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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

/** Onde fica a cópia local de `<bucket>/<caminho>` dentro de `base`. Recusa caminho que escape dela. */
function caminhoLocal(base, bucket, caminho) {
  const raiz = path.resolve(base, bucket)
  const alvo = path.resolve(raiz, ...caminho.split('/'))
  if (!alvo.startsWith(raiz + path.sep)) throw new Error(`Caminho suspeito: ${caminho}`)
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

/** Planta tem limite maior (linhas finas, texto e zoom). Biblioteca e o resto seguem o das fotos. */
const limiteDe = (caminho) => (caminho.split('/').includes('planta') ? LIMITES.planta : LIMITES.foto)

// ── Listagem: do Storage (com chave) ou do backup local (sem chave, só dry-run) ─────────────────

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
      if (item.id === null) itens.push(...(await listarBucket(supabase, bucket, caminho)))
      else {
        itens.push({
          bucket,
          caminho,
          tamanho: item.metadata?.size ?? null,
          mimetype: item.metadata?.mimetype ?? null,
        })
      }
    }
    if (data.length < 100) break
  }
  return itens
}

async function listarPastaLocal(base, bucket, relativo = '') {
  const raiz = path.join(base, bucket, relativo)
  if (!existsSync(raiz)) return []
  const itens = []
  for (const entrada of await readdir(raiz, { withFileTypes: true })) {
    const caminho = relativo ? `${relativo}/${entrada.name}` : entrada.name
    if (entrada.isDirectory()) itens.push(...(await listarPastaLocal(base, bucket, caminho)))
    else if (!entrada.name.endsWith('.parcial')) {
      itens.push({
        bucket,
        caminho,
        tamanho: (await stat(path.join(raiz, entrada.name))).size,
        mimetype: TIPO_POR_EXTENSAO[extensaoDe(caminho)] ?? null,
      })
    }
  }
  return itens
}

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

// ── Análise e redução de UMA imagem ──────────────────────────────────────────────────────────────

/** Lê só o cabeçalho: dimensões COMO A FOTO APARECE (a orientação do EXIF já aplicada) e o formato. */
async function medir(buffer) {
  const meta = await sharp(buffer).metadata()
  const girada = (meta.orientation ?? 1) >= 5
  return {
    formato: meta.format,
    largura: girada ? meta.height : meta.width,
    altura: girada ? meta.width : meta.height,
  }
}

async function reduzir(buffer, formato, { ladoMaximo, qualidade }) {
  let imagem = sharp(buffer).rotate().resize({
    width: ladoMaximo,
    height: ladoMaximo,
    fit: 'inside',
    withoutEnlargement: true,
    kernel: 'lanczos3',
  })
  if (formato === 'webp') imagem = imagem.webp({ quality: qualidade, effort: 4 })
  else if (formato === 'jpeg') imagem = imagem.jpeg({ quality: qualidade })
  else imagem = imagem.png({ compressionLevel: 9, adaptiveFiltering: true })
  const { data, info } = await imagem.toBuffer({ resolveWithObject: true })
  return { buffer: data, largura: info.width, altura: info.height }
}

/**
 * Decide o que fazer com a imagem e, se for reduzir, já gera a versão reduzida (é o mesmo trabalho do
 * envio, então o dry-run mostra o tamanho REAL que ficaria).
 */
async function analisar(item, buffer) {
  const base = { ...item, bytesAntes: buffer.length }
  if (!TIPO_POR_EXTENSAO[extensaoDe(item.caminho)]) return { ...base, acao: 'ignorar', motivo: 'não é imagem' }

  let medida
  try {
    medida = await medir(buffer)
  } catch (erro) {
    return { ...base, acao: 'falha', motivo: `não consegui ler a imagem: ${erro.message}` }
  }
  const { formato, largura, altura } = medida
  if (!['webp', 'jpeg', 'png'].includes(formato)) {
    return { ...base, acao: 'ignorar', motivo: `formato ${formato}` }
  }
  const limite = limiteDe(item.caminho)
  const comDados = { ...base, formato, largura, altura, limite }
  if (Math.max(largura, altura) <= limite.ladoMaximo) return { ...comDados, acao: 'manter' }

  const nova = await reduzir(buffer, formato, limite)
  const completo = {
    ...comDados,
    novaLargura: nova.largura,
    novaAltura: nova.altura,
    bytesDepois: nova.buffer.length,
    buffer: nova.buffer,
  }
  if (nova.buffer.length >= buffer.length) {
    return { ...completo, acao: 'nao-compensa', motivo: 'a versão reduzida não fica menor' }
  }
  return { ...completo, acao: 'reduzir' }
}

// ── Dry-run ──────────────────────────────────────────────────────────────────────────────────────

const faixaDoLado = (lado) =>
  lado <= 1280 ? '≤ 1280' : lado <= 1920 ? '1281–1920' : lado <= 2400 ? '1921–2400' : lado <= 3000 ? '2401–3000' : '> 3000'

function mostrarDryRun(analises, opcoes, origem, foraDoBackup) {
  const reduzir = analises.filter((a) => a.acao === 'reduzir')
  const por = (acao) => analises.filter((a) => a.acao === acao)
  const somar = (lista, campo) => lista.reduce((total, a) => total + (a[campo] ?? 0), 0)
  const antes = somar(reduzir, 'bytesAntes')
  const depois = somar(reduzir, 'bytesDepois')

  console.log('\nDRY-RUN: nada foi baixado do Storage, enviado, criado ou apagado.')
  console.log(`Origem dos arquivos: ${origem}`)
  if (foraDoBackup > 0) {
    console.log(`  ${foraDoBackup} arquivo(s) estão no Storage mas NÃO no backup local (medidos pelo download em memória).`)
  }

  console.log('\nResumo:')
  console.log(`  imagens analisadas:                ${analises.length}`)
  console.log(`  a REDUZIR:                         ${reduzir.length}`)
  console.log(`  já cabem no limite (não mexe):     ${por('manter').length}`)
  console.log(`  não compensa (reduzida ≥ original): ${por('nao-compensa').length}`)
  console.log(`  ignoradas (não são imagem):        ${por('ignorar').length}`)
  console.log(`  falha de leitura:                  ${por('falha').length}`)

  console.log('\nDistribuição do lado maior (todas as imagens lidas):')
  const faixas = new Map()
  for (const a of analises.filter((x) => x.largura)) {
    const faixa = faixaDoLado(Math.max(a.largura, a.altura))
    faixas.set(faixa, (faixas.get(faixa) ?? 0) + 1)
  }
  for (const faixa of ['≤ 1280', '1281–1920', '1921–2400', '2401–3000', '> 3000']) {
    console.log(`  ${faixa.padEnd(10)} ${String(faixas.get(faixa) ?? 0).padStart(4)} imagens`)
  }

  const porCategoria = (rotulo, filtro) => {
    const lista = reduzir.filter(filtro)
    console.log(
      `  ${rotulo.padEnd(34)} ${String(lista.length).padStart(4)} arquivos   ${formatarBytes(somar(lista, 'bytesAntes')).padStart(8)} → ${formatarBytes(somar(lista, 'bytesDepois')).padStart(8)}`,
    )
  }
  console.log('\nO que seria reduzido:')
  porCategoria('fotos (principal e galeria) → 1920', (a) => a.limite.ladoMaximo === LIMITES.foto.ladoMaximo && a.bucket === 'projetos-publico')
  porCategoria('plantas → 2400', (a) => a.limite.ladoMaximo === LIMITES.planta.ladoMaximo)
  porCategoria('biblioteca de exemplos → 1920', (a) => a.bucket === 'biblioteca-exemplos')
  for (const formato of ['webp', 'jpeg', 'png']) {
    porCategoria(`formato mantido: ${formato}`, (a) => a.formato === formato)
  }

  const economia = antes - depois
  console.log('\nEconomia total no Storage:')
  console.log(`  antes:    ${formatarBytes(antes)} (${reduzir.length} arquivos)`)
  console.log(`  depois:   ${formatarBytes(depois)}`)
  console.log(`  economia: ${formatarBytes(economia)}${antes > 0 ? ` (${((economia / antes) * 100).toFixed(0)}%)` : ''}`)
  const totalGeral = somar(analises, 'bytesAntes')
  console.log(`  (todo o conteúdo analisado hoje: ${formatarBytes(totalGeral)})`)

  const naoCompensa = por('nao-compensa')
  if (naoCompensa.length > 0) {
    console.log('\nNão compensa (ficam como estão):')
    for (const a of naoCompensa) {
      console.log(`  ${a.bucket}/${curto(a.caminho)}  ${a.largura}x${a.altura}  ${formatarBytes(a.bytesAntes)} → ${formatarBytes(a.bytesDepois)}`)
    }
  }

  const lista = [...reduzir].sort((x, y) => y.bytesAntes - y.bytesDepois - (x.bytesAntes - x.bytesDepois))
  const mostrar = opcoes.detalhar ? lista : lista.slice(0, 12)
  console.log(`\n${opcoes.detalhar ? 'Todos os arquivos a reduzir' : 'Os 12 que mais economizam (use --detalhar para ver todos)'}:`)
  for (const a of mostrar) {
    console.log(
      `  ${a.formato.padEnd(4)} ${curto(a.caminho).padEnd(52)} ${`${a.largura}x${a.altura}`.padStart(9)} → ${`${a.novaLargura}x${a.novaAltura}`.padEnd(9)}  ${formatarBytes(a.bytesAntes).padStart(7)} → ${formatarBytes(a.bytesDepois).padStart(7)}  (-${formatarBytes(a.bytesAntes - a.bytesDepois)})`,
    )
  }
  console.log('\nPara executar de verdade: --executar (comece com --limite=3).')
}

/** `12cb4f3e-…/galeria/sobrado-…-01.webp`: o id do projeto encurtado, para caber na tela. */
const curto = (caminho) => caminho.replace(/^([0-9a-f]{8})[0-9a-f-]{28}/, '$1…')

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
    fila = fila.then(async () => {
      const temporario = `${arquivo}.tmp`
      await writeFile(temporario, JSON.stringify(estado, null, 2))
      await rename(temporario, arquivo)
    })
    return fila
  }
}

// ── Execução ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Garante que existe cópia local ANTES de qualquer envio e devolve o conteúdo atual do Storage.
 * - cópia no backup com o mesmo tamanho do Storage: é ela;
 * - sem cópia: baixa para o backup;
 * - cópia com tamanho diferente (o arquivo mudou depois do backup): NÃO sobrescreve o backup; baixa a
 *   versão atual para <pasta>/_fase5-versao-atual/.
 */
async function garantirBackup(supabase, item, pasta) {
  const principal = caminhoLocal(pasta, item.bucket, item.caminho)
  const existente = await tamanhoLocal(principal)
  if (existente !== null && existente === item.tamanho) return { buffer: await readFile(principal), arquivo: principal }

  const destino =
    existente === null ? principal : caminhoLocal(path.join(pasta, '_fase5-versao-atual'), item.bucket, item.caminho)
  const baixado = await comTentativas('download', async () => {
    const { data, error } = await supabase.storage.from(item.bucket).download(item.caminho)
    if (error) throw new Error(error.message)
    return Buffer.from(await data.arrayBuffer())
  })
  if (item.tamanho !== null && baixado.length !== item.tamanho) {
    throw new Error(`baixou ${baixado.length} bytes, o Storage informa ${item.tamanho}`)
  }
  await mkdir(path.dirname(destino), { recursive: true })
  await writeFile(`${destino}.parcial`, baixado)
  await rename(`${destino}.parcial`, destino)
  return { buffer: baixado, arquivo: destino }
}

async function processarArquivo(supabase, item, contexto) {
  const chave = `${item.bucket}/${item.caminho}`
  const registro = (contexto.estado[chave] ??= {})
  try {
    const { buffer, arquivo } = await garantirBackup(supabase, item, contexto.pasta)
    registro.backup = path.relative(contexto.pasta, arquivo)
    registro.sha256Antes = sha256(buffer)

    const analise = await analisar(item, buffer)
    if (analise.acao !== 'reduzir') return { ...analise, status: analise.acao, erro: '' }

    // Conferência antes de enviar: dimensões dentro do limite, mesmo formato, menor que a original.
    const conferida = await medir(analise.buffer)
    const { ladoMaximo } = analise.limite
    if (conferida.formato !== analise.formato || Math.max(conferida.largura, conferida.altura) > ladoMaximo) {
      throw new Error('a versão reduzida não passou na conferência (formato ou dimensões); nada foi enviado')
    }

    const tipo = item.mimetype ?? TIPO_POR_EXTENSAO[extensaoDe(item.caminho)]
    if (!tipo) throw new Error('sem tipo de conteúdo; não vou adivinhar')
    const corpo = new Blob([analise.buffer], { type: tipo })
    await comTentativas('upload', async () => {
      const { error } = await supabase.storage.from(item.bucket).upload(item.caminho, corpo, {
        upsert: true,
        cacheControl: CACHE_EM_SEGUNDOS,
        contentType: tipo,
      })
      if (error) throw new Error(error.message)
    })

    const depois = await comTentativas('conferir', () => lerMetadados(supabase, item.bucket, item.caminho))
    if (!depois) throw new Error('o arquivo não aparece no Storage depois do reenvio')
    if (depois.tamanho !== analise.bytesDepois) {
      throw new Error(`tamanho depois do envio: ${depois.tamanho}, esperado ${analise.bytesDepois}. Restaure pela cópia local.`)
    }
    if (depois.mimetype !== tipo || depois.cache !== CACHE_ESPERADO) {
      throw new Error(`tipo/cache depois do envio: ${depois.mimetype} / ${depois.cache}. Restaure pela cópia local.`)
    }

    registro.reducao = 'ok'
    registro.bytesAntes = analise.bytesAntes
    registro.bytesDepois = analise.bytesDepois
    delete registro.erro
    registro.atualizadoEm = new Date().toISOString()
    await contexto.salvarEstado()
    return { ...analise, buffer: undefined, status: 'reduzido', erro: '' }
  } catch (erro) {
    registro.erro = erro.message
    registro.atualizadoEm = new Date().toISOString()
    await contexto.salvarEstado()
    return { ...item, bytesAntes: item.tamanho ?? 0, acao: 'falha', status: 'falha', erro: erro.message }
  }
}

async function emParalelo(itens, limite, tarefa) {
  const resultados = new Array(itens.length)
  let proximo = 0
  await Promise.all(
    Array.from({ length: Math.min(limite, itens.length) }, async () => {
      while (proximo < itens.length) {
        const indice = proximo++
        resultados[indice] = await tarefa(itens[indice])
      }
    }),
  )
  return resultados
}

const celula = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`

async function gravarRelatorio(pasta, linhas) {
  const carimbo = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
  const arquivo = path.join(pasta, `relatorio-fase5-${carimbo}.csv`)
  const cabecalho =
    'bucket,caminho,formato,largura_antes,altura_antes,bytes_antes,largura_depois,altura_depois,bytes_depois,economia_bytes,status,erro'
  const corpo = linhas.map((l) =>
    [
      l.bucket,
      l.caminho,
      l.formato ?? '',
      l.largura ?? '',
      l.altura ?? '',
      l.bytesAntes ?? '',
      l.status === 'reduzido' ? l.novaLargura : '',
      l.status === 'reduzido' ? l.novaAltura : '',
      l.status === 'reduzido' ? l.bytesDepois : '',
      l.status === 'reduzido' ? l.bytesAntes - l.bytesDepois : '',
      l.status,
      l.erro ?? l.motivo ?? '',
    ]
      .map(celula)
      .join(','),
  )
  await writeFile(arquivo, `${[cabecalho, ...corpo].join('\n')}\n`)
  return arquivo
}

// ── Principal ────────────────────────────────────────────────────────────────────────────────────

async function principal() {
  const opcoes = lerArgumentos(process.argv.slice(2))
  const supabase = criarClienteSeHouverChave()
  const buckets = opcoes.bucket ? [opcoes.bucket] : BUCKETS_PERMITIDOS

  // ── Dry-run ──
  if (!opcoes.executar) {
    let itens = []
    let origem
    if (supabase) {
      for (const bucket of buckets) itens.push(...(await listarBucket(supabase, bucket)))
      origem = `Storage do Supabase (lista real; leitura dos arquivos pelo backup local quando existe)`
    } else {
      for (const bucket of buckets) itens.push(...(await listarPastaLocal(opcoes.pasta, bucket)))
      origem = `backup local em ${opcoes.pasta}/ (sem chave: não vê arquivos enviados depois do backup)`
      if (itens.length === 0) throw new Error(`Sem chave e sem backup em ${opcoes.pasta}/. Nada para analisar.`)
    }
    console.log(`${itens.length} arquivo(s) para analisar…`)
    let foraDoBackup = 0
    const analises = []
    for (const item of itens) {
      const local = caminhoLocal(opcoes.pasta, item.bucket, item.caminho)
      let buffer
      if ((await tamanhoLocal(local)) === item.tamanho) buffer = await readFile(local)
      else if (supabase) {
        foraDoBackup += 1
        const { data, error } = await supabase.storage.from(item.bucket).download(item.caminho)
        if (error) {
          analises.push({ ...item, bytesAntes: item.tamanho ?? 0, acao: 'falha', motivo: error.message })
          continue
        }
        buffer = Buffer.from(await data.arrayBuffer())
      } else continue
      analises.push(await analisar(item, buffer))
    }
    mostrarDryRun(analises, opcoes, origem, foraDoBackup)
    return 0
  }

  // ── Execução ──
  if (!supabase) {
    throw new Error('Faltam SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY. Crie o .env.scripts e rode com --env-file=.env.scripts.')
  }
  const pastaTemArquivos =
    existsSync(opcoes.pasta) && (await listarPastaLocal(opcoes.pasta, BUCKETS_PERMITIDOS[0])).length > 0
  if (!pastaTemArquivos) {
    throw new Error(
      `ABORTADO: não existe backup local em ${opcoes.pasta}/ (ou está vazio). Faça o backup antes de reduzir qualquer foto.`,
    )
  }

  await mkdir(opcoes.pasta, { recursive: true })
  const arquivoDeEstado = path.join(opcoes.pasta, 'estado-fase5.json')
  const estado = await lerEstado(arquivoDeEstado)
  const contexto = { pasta: opcoes.pasta, estado, salvarEstado: criarGravadorDeEstado(arquivoDeEstado, estado) }

  console.log(`Listando: ${buckets.join(', ')} …`)
  const itens = []
  for (const bucket of buckets) itens.push(...(await listarBucket(supabase, bucket)))
  console.log(`${itens.length} arquivo(s) encontrado(s).`)

  let parar = false
  process.on('SIGINT', () => {
    parar = true
    console.log('\nCtrl+C recebido: termino o lote atual e paro. Rode de novo para retomar.')
  })

  const relatorio = []
  const pendentes = []
  for (const item of itens) {
    const reg = estado[`${item.bucket}/${item.caminho}`]
    if (!TIPO_POR_EXTENSAO[extensaoDe(item.caminho)]) {
      relatorio.push({ ...item, bytesAntes: item.tamanho ?? 0, status: 'ignorar', motivo: 'não é imagem' })
    } else if (reg?.reducao === 'ok' && reg.bytesDepois === item.tamanho) {
      relatorio.push({ ...item, bytesAntes: reg.bytesAntes, status: 'ja-reduzido', erro: '' })
    } else pendentes.push(item)
  }

  // `--limite` conta ARQUIVOS A REDUZIR, não os mantidos: processa até reduzir N (ou acabar a lista).
  let reduzidos = 0
  let proximo = 0
  const projetosJaReduzidos = new Set()
  const projetoDe = (item) => `${item.bucket}/${item.caminho.split('/')[0]}`
  console.log(`Analisando e reduzindo (lotes de ${opcoes.lote}${Number.isFinite(opcoes.limite) ? `, até ${opcoes.limite} reduzidos` : ''}${opcoes.umPorProjeto ? ', um por projeto' : ''}).\n`)
  while (proximo < pendentes.length && !parar && reduzidos < opcoes.limite) {
    // O lote nunca passa do que falta para o limite: cada arquivo do lote pode ser reduzido.
    const tamanhoDoLote = Math.min(opcoes.lote, opcoes.limite - reduzidos)
    // Com --um-por-projeto, pula quem é de um projeto que já teve uma foto reduzida nesta execução.
    const lote = []
    while (proximo < pendentes.length && lote.length < tamanhoDoLote) {
      const item = pendentes[proximo++]
      if (opcoes.umPorProjeto && projetosJaReduzidos.has(projetoDe(item))) {
        relatorio.push({ ...item, bytesAntes: item.tamanho ?? 0, status: 'nao-processado', erro: '' })
      } else lote.push(item)
    }
    const resultados = await emParalelo(lote, CONCORRENCIA, (item) => processarArquivo(supabase, item, contexto))
    relatorio.push(...resultados.map((r) => ({ ...r, buffer: undefined })))
    for (const r of resultados) if (r.status === 'reduzido') projetosJaReduzidos.add(projetoDe(r))
    reduzidos += resultados.filter((r) => r.status === 'reduzido').length
    const falhas = resultados.filter((r) => r.status === 'falha')
    console.log(`  ${Math.min(proximo, pendentes.length)}/${pendentes.length} analisados; reduzidos até agora: ${reduzidos} (falhas neste lote: ${falhas.length})`)
    for (const falha of falhas) console.log(`    FALHA ${falha.bucket}/${curto(falha.caminho)}: ${falha.erro}`)
    await dormir(PAUSA_ENTRE_LOTES_MS)
  }
  for (const item of pendentes.slice(proximo)) {
    relatorio.push({ ...item, bytesAntes: item.tamanho ?? 0, status: 'nao-processado', erro: '' })
  }

  const arquivoDoRelatorio = await gravarRelatorio(opcoes.pasta, relatorio)
  const contar = (status) => relatorio.filter((l) => l.status === status)
  const economia = contar('reduzido').reduce((soma, l) => soma + (l.bytesAntes - l.bytesDepois), 0)
  console.log('\nResumo:')
  console.log(`  reduzidos agora:             ${contar('reduzido').length} (economia de ${formatarBytes(economia)})`)
  console.log(`  já reduzidos antes:          ${contar('ja-reduzido').length}`)
  console.log(`  já cabiam no limite:         ${contar('manter').length}`)
  console.log(`  não compensa (mantidos):     ${contar('nao-compensa').length}`)
  console.log(`  falhas:                      ${contar('falha').length}`)
  console.log(`  não processados (limite):    ${contar('nao-processado').length}`)
  console.log(`  relatório: ${arquivoDoRelatorio}`)
  return contar('falha').length > 0 ? 1 : 0
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
