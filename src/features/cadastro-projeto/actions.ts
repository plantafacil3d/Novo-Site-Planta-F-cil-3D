'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { invalidarCatalogo } from '@/features/projetos'
import { executarComLimite } from '@/lib/executarComLimite'
import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'
import type { EnvioAutorizado } from '@/types/envio'

import { etapasDoCadastro } from './catalogo'
import {
  LIMITES,
  acessoDoPapel,
  arquivosQueFaltam,
  caminhoDaImagem,
  caminhoDoArquivo,
  ehImagem,
  ehImagemComNumero,
  erroDoArquivoDoPapel,
  extensaoDe,
  formatoConfere,
  gerarSlug,
  listarArquivosDoFormulario,
  listarEmTexto,
  montarCadastro,
  montarComplementares,
  montarPavimentos,
  nomeDaImagem,
  numeroDoCaminho,
  proximosNumerosLivres,
  sufixoDaImagem,
  tipoDeConteudoDaExtensao,
} from './rules'
import { lerPayload, validarEtapas } from './schemas'
import type {
  ArquivoGravado,
  CadastroGravavel,
  DadosDoNomeDaImagem,
  PayloadProjeto,
  ProjetoCriado,
  ResultadoCadastro,
  ResultadoDoItem,
} from './types'

// Server Actions são endpoints públicos (skill `seguranca` §9.1): cada uma confere o administrador
// aqui e valida tudo que recebe, sem confiar no formulário que a chamou. O banco (RLS) e o Storage
// (policies) conferem de novo. O caminho de cada arquivo é gerado aqui, nunca vem do navegador.

const naoAutorizado = {
  ok: false,
  mensagem: 'Sua sessão expirou. Entre novamente para continuar.',
} as const

const falha = (mensagem: string) => ({ ok: false, mensagem }) as const

async function rodarComoAdmin<T extends object>(
  agir: () => Promise<ResultadoCadastro<T>>,
): Promise<ResultadoCadastro<T>> {
  const usuario = await authService.usuarioAtual()
  if (!usuario?.ehAdmin) return naoAutorizado

  try {
    return await agir()
  } catch (erro) {
    // A mensagem para o navegador continua genérica (skill `seguranca` §8); isto é só o log do
    // servidor, sem o qual uma falha aqui não deixa nenhum rastro para diagnosticar.
    console.error(erro)
    const mensagem =
      erro instanceof AppError ? erro.message : 'Não foi possível concluir a operação.'
    return falha(mensagem)
  }
}

const schemaId = z.uuid()
const schemaModo = z.enum(['rascunho', 'completo'])

const schemaArquivo = z
  .object({
    id: z.uuid(),
    papel: z.enum(['principal', 'galeria', 'planta', 'entrega', 'complementar_pdf']),
    nomeArquivo: z.string().min(1).max(255),
    tamanho: z.number().int().positive(),
    tipo: z.string().max(100),
    complementarId: z.uuid().nullable(),
    pavimentoId: z.uuid().nullable(),
    ordem: z.number().int().min(0).max(1000),
    // Só a confirmação usa: o número que o servidor deu à imagem no preparo (`-01` no nome). O
    // caminho inteiro continua sendo montado aqui; do navegador só vem este inteiro.
    numero: z.number().int().min(1).max(9999).nullable().optional(),
  })
  .refine((arquivo) => (arquivo.papel === 'complementar_pdf') === (arquivo.complementarId !== null))
  .refine((arquivo) => (arquivo.papel === 'planta') === (arquivo.pavimentoId !== null))

type DadosDoArquivo = z.infer<typeof schemaArquivo>

const lerId = (entrada: unknown) => {
  const lido = schemaId.safeParse(entrada)
  if (!lido.success) throw new AppError('dados_invalidos', 'Projeto inválido.')
  return lido.data
}

const schemaLoteDeArquivos = z.array(schemaArquivo).min(1).max(LIMITES.loteDeArquivosMax)

const lerLote = (entrada: unknown): DadosDoArquivo[] => {
  const lido = schemaLoteDeArquivos.safeParse(entrada)
  if (!lido.success) throw new AppError('dados_invalidos', 'Os dados dos arquivos são inválidos.')
  return lido.data
}

/** Mensagem para UM item do lote: `AppError` vira a mensagem dela; qualquer outro erro é logado (como
 *  o catch de `rodarComoAdmin`), sem derrubar os outros itens do lote junto. */
function mensagemDoItem(erro: unknown): string {
  if (erro instanceof AppError) return erro.message
  console.error(erro)
  return 'Não foi possível concluir a operação com este arquivo.'
}

/**
 * Onde o arquivo vai ficar, já com a extensão e o tipo conferidos pelo papel dele. Imagens ganham um
 * nome descritivo montado com o cadastro (SEO), o número (galeria e plantas) e o código curto do
 * arquivo, que torna o endereço único; os demais arquivos (entrega e PDFs, privados) continuam com
 * o id no nome.
 */
function resolverDestino(
  projetoId: string,
  arquivo: DadosDoArquivo,
  dadosDoNome: DadosDoNomeDaImagem | null,
  numero: number | null,
) {
  const extensao = extensaoDe(arquivo.nomeArquivo)
  const tipoDoConteudo = tipoDeConteudoDaExtensao(extensao)
  const motivo = erroDoArquivoDoPapel(arquivo.papel, {
    nomeArquivo: arquivo.nomeArquivo,
    tamanho: arquivo.tamanho,
    tipo: arquivo.tipo,
  })
  if (!tipoDoConteudo || motivo) {
    throw new AppError(
      'dados_invalidos',
      `${arquivo.nomeArquivo}: ${motivo ?? 'formato não aceito.'}`,
    )
  }

  let caminho: string
  if (ehImagem(arquivo.papel)) {
    if (!dadosDoNome) throw new AppError('falha_inesperada', 'Não foi possível nomear a imagem.')
    if (ehImagemComNumero(arquivo.papel) && numero === null) {
      throw new AppError('dados_invalidos', `${arquivo.nomeArquivo}: falta o número da imagem.`)
    }
    const nome = nomeDaImagem(arquivo.papel, dadosDoNome, numero, sufixoDaImagem(arquivo.id))
    caminho = caminhoDaImagem(projetoId, arquivo.papel, nome, extensao)
  } else {
    caminho = caminhoDoArquivo(projetoId, arquivo.papel, arquivo.id, extensao)
  }

  return {
    extensao,
    tipoDoConteudo,
    destino: { acesso: acessoDoPapel(arquivo.papel), caminho },
  }
}

/** O que o servidor precisa saber do projeto para nomear as imagens de um lote. */
type ContextoDeNomes = { dados: DadosDoNomeDaImagem; gravados: ArquivoGravado[] }

/** `null` se o lote não tem imagens (entrega e PDFs não dependem do cadastro para o nome). */
async function lerContextoDeNomes(
  projetoId: string,
  arquivos: DadosDoArquivo[],
): Promise<ContextoDeNomes | null> {
  if (!arquivos.some((arquivo) => ehImagem(arquivo.papel))) return null
  const [cadastro, gravados] = await Promise.all([
    projetoAdminRepository.buscarCadastroCompleto(projetoId),
    projetoAdminRepository.listarArquivos(projetoId),
  ])
  if (!cadastro) throw new AppError('dados_invalidos', 'Projeto não encontrado.')
  return { dados: cadastro, gravados }
}

/**
 * Dá a cada imagem nova da galeria e das plantas o próximo número livre do projeto (cada papel conta
 * à parte). Quem já está gravado (o envio se repete quando a resposta anterior se perde) mantém o
 * número que já tinha. Devolve o número por id de arquivo.
 */
function numerarImagens(
  arquivos: DadosDoArquivo[],
  contexto: ContextoDeNomes,
): Map<string, number> {
  const numeros = new Map<string, number>()
  for (const papel of ['galeria', 'planta'] as const) {
    const doPapel = arquivos.filter((arquivo) => arquivo.papel === papel)
    const novos = doPapel.filter((arquivo) => {
      const gravado = contexto.gravados.find((item) => item.id === arquivo.id)
      const numero = gravado ? numeroDoCaminho(gravado.caminho) : null
      if (numero !== null) numeros.set(arquivo.id, numero)
      return numero === null
    })
    if (novos.length === 0) continue

    // Só o número conta: as imagens antigas não têm sufixo e as novas têm, então o nome inteiro
    // nunca coincidiria, mas o `-02` de uma e o `-02` da outra ainda seriam confusos.
    const ocupados = new Set(
      contexto.gravados
        .filter((gravado) => gravado.papel === papel)
        .flatMap((gravado) => numeroDoCaminho(gravado.caminho) ?? []),
    )
    const livres = proximosNumerosLivres(novos.length, ocupados)
    if (livres.length < novos.length) {
      throw new AppError('dados_invalidos', 'O projeto chegou ao limite de imagens.')
    }
    novos.forEach((arquivo, indice) => numeros.set(arquivo.id, livres[indice] as number))
  }
  return numeros
}

/**
 * Soma dos arquivos `entrega` já gravados no banco, ignorando os ids que estão neste lote (evita
 * contar um arquivo duas vezes se ele já foi registrado numa tentativa anterior). Uma leitura só por
 * chamada, não uma por arquivo.
 */
async function somaGravadaDaEntrega(
  projetoId: string,
  arquivos: DadosDoArquivo[],
): Promise<number> {
  if (!arquivos.some((arquivo) => arquivo.papel === 'entrega')) return 0
  const gravados = await projetoAdminRepository.listarArquivos(projetoId)
  const idsDoLote = new Set(arquivos.map((arquivo) => arquivo.id))
  return gravados
    .filter((gravado) => gravado.papel === 'entrega' && !idsDoLote.has(gravado.id))
    .reduce((total, gravado) => total + gravado.tamanhoBytes, 0)
}

/**
 * Os arquivos da entrega somam no máximo 20 MB. Olha junto todos os arquivos `entrega` DESTE lote
 * (que são processados em paralelo, então nenhum vê o registro do outro no banco ainda) + o que já
 * estava gravado, em vez de cada um checar sozinho — senão dois anexos do mesmo lote poderiam passar
 * do limite juntos sem que nenhum, isoladamente, percebesse.
 */
function conferirSomaDoLote(
  arquivo: DadosDoArquivo,
  todosDoLote: DadosDoArquivo[],
  somaGravada: number,
  tamanho: number,
) {
  if (arquivo.papel !== 'entrega') return
  const somaDoLote = todosDoLote
    .filter((item) => item.papel === 'entrega')
    .reduce((total, item) => total + (item.id === arquivo.id ? tamanho : item.tamanho), 0)
  if (somaGravada + somaDoLote > LIMITES.anexoMaxBytes) {
    throw new AppError(
      'dados_invalidos',
      `${arquivo.nomeArquivo}: passa do limite de 20 MB no total dos arquivos da entrega.`,
    )
  }
}

// ── Salvar ───────────────────────────────────────────────────────────────────────────────────────

/**
 * Tenta o slug do título puro e, se já existir, `-2`, `-3`... sem limite de tentativas: título
 * repetido é normal (várias casas "Sobrado 10x20"), então isso nunca deve travar o cadastro nem
 * pedir pra mudar o título. Cada tentativa confere o banco de verdade, então um slug liberado por
 * uma exclusão é reaproveitado pelo próximo cadastro daquele título.
 */
async function criarComSlugLivre(cadastro: CadastroGravavel): Promise<ProjetoCriado> {
  const base = gerarSlug(cadastro.titulo) || 'projeto'
  for (let tentativa = 1; ; tentativa++) {
    const slug = tentativa === 1 ? base : `${base.slice(0, 96)}-${tentativa}`
    try {
      return await projetoAdminRepository.criarCadastro(cadastro, slug)
    } catch (erro) {
      if (!(erro instanceof AppError && erro.code === 'conflito')) throw erro
    }
  }
}

/**
 * Deixa os arquivos gravados iguais aos do formulário: o que o usuário tirou da tela sai do banco e
 * do Storage. O que o formulário ainda não enviou não conta aqui (só entra em `confirmarEnvio`).
 */
async function sincronizarArquivos(projetoId: string, payload: PayloadProjeto) {
  const gravados = await projetoAdminRepository.listarArquivos(projetoId)
  if (gravados.length === 0) return

  const doFormulario = listarArquivosDoFormulario(payload)
  const mantidos = new Set(
    doFormulario.filter((item) => item.arquivo.salvo).map((item) => item.arquivo.id),
  )
  const complementares = new Set(payload.complementares.map((complementar) => complementar.id))
  const pavimentos = new Set(payload.plantaHumanizada.map((pavimento) => pavimento.id))

  const sobrando = gravados.filter(
    (gravado) =>
      !mantidos.has(gravado.id) ||
      (gravado.complementarId !== null && !complementares.has(gravado.complementarId)) ||
      (gravado.pavimentoId !== null && !pavimentos.has(gravado.pavimentoId)),
  )
  await projetoAdminRepository.removerArquivos(sobrando.map((gravado) => gravado.id))
  try {
    await fileStorage.remover(
      sobrando.map((gravado) => ({
        acesso: acessoDoPapel(gravado.papel),
        caminho: gravado.caminho,
      })),
    )
  } catch {
    // A linha já saiu do banco; se o arquivo ficar no Storage, é só espaço ocupado (limpeza futura).
  }
}

/**
 * Grava os dados do projeto (sem os arquivos) e devolve o id. Cria na primeira vez; com `projetoId`,
 * atualiza. O projeto fica sempre como rascunho: quem publica é `publicarProjeto`, depois que os
 * arquivos chegaram.
 */
export async function salvarProjeto(
  entrada: unknown,
  modo: unknown,
  projetoId: unknown,
): Promise<ResultadoCadastro<{ projetoId: string }>> {
  return rodarComoAdmin<{ projetoId: string }>(async () => {
    const modoLido = schemaModo.safeParse(modo)
    const idLido = schemaId.nullable().safeParse(projetoId)
    if (!modoLido.success || !idLido.success) return falha('Pedido inválido.')

    const lido = lerPayload(entrada)
    if (!lido.ok) return falha(lido.mensagem)
    const payload = lido.dados

    if (modoLido.data === 'completo') {
      const erros = validarEtapas(payload)
      const comPendencia = etapasDoCadastro.filter(
        (etapa) => Object.keys(erros[etapa.id]).length > 0,
      )
      if (comPendencia.length > 0) {
        return falha(
          `Faltam informações em: ${listarEmTexto(comPendencia.map((etapa) => etapa.rotulo))}.`,
        )
      }
    }

    const cadastro = montarCadastro(payload)
    let id = idLido.data
    if (id) {
      await projetoAdminRepository.atualizarCadastro(id, cadastro)
    } else {
      id = (await criarComSlugLivre(cadastro)).id
    }

    await projetoAdminRepository.sincronizarPavimentos(id, montarPavimentos(payload))
    await sincronizarArquivos(id, payload)
    await projetoAdminRepository.sincronizarComplementares(id, montarComplementares(payload))
    await projetoAdminRepository.sincronizarArquivosExemplo(id, payload.arquivosExemplo)

    revalidatePath('/admin/projetos')
    invalidarCatalogo()
    return { ok: true, mensagem: 'Informações salvas.', projetoId: id }
  })
}

// ── Arquivos ─────────────────────────────────────────────────────────────────────────────────────
//
// As duas ações abaixo recebem um LOTE de arquivos (não um por chamada): autenticam uma única vez
// para o lote inteiro (`rodarComoAdmin`), em vez de uma vez por arquivo, e processam os itens em
// paralelo por dentro, devolvendo um resultado por item — um arquivo inválido no meio do lote não
// derruba os outros. Importante: os LOTES em si (vindos do hook) rodam em sequência, um depois do
// outro; é isso que garante que `somaGravadaDaEntrega` de um lote já enxergue o que o lote anterior
// gravou. Nunca chame estas ações para o mesmo projeto em paralelo entre si.

/** Confere os arquivos escolhidos e autoriza o navegador a enviá-los direto ao Storage. */
export async function prepararEnvioEmLote(
  projetoId: unknown,
  entrada: unknown,
): Promise<
  ResultadoCadastro<{
    itens: ResultadoDoItem<{ envio: EnvioAutorizado; numero: number | null }>[]
  }>
> {
  return rodarComoAdmin(async () => {
    const id = lerId(projetoId)
    const arquivos = lerLote(entrada)
    const somaGravada = await somaGravadaDaEntrega(id, arquivos)
    const contexto = await lerContextoDeNomes(id, arquivos)
    const numeros = contexto ? numerarImagens(arquivos, contexto) : new Map<string, number>()

    // Primeiro decide o destino de todos; só depois autoriza (precisa limpar os órfãos antes).
    const decididos = arquivos.map((arquivo) => {
      try {
        const numero = numeros.get(arquivo.id) ?? null
        const { tipoDoConteudo, destino } = resolverDestino(
          id,
          arquivo,
          contexto?.dados ?? null,
          numero,
        )
        conferirSomaDoLote(arquivo, arquivos, somaGravada, arquivo.tamanho)
        return { ok: true as const, arquivo, numero, tipoDoConteudo, destino }
      } catch (erro) {
        return { ok: false as const, arquivo, erro }
      }
    })

    // O caminho de uma imagem nova é sempre inédito (o código dele sai do id do arquivo), então a
    // troca de foto nunca cai aqui. Sobra o envio repetido: o arquivo chegou ao Storage, mas a
    // confirmação se perdeu e não há linha no banco. Esse arquivo sai antes do novo envio, porque o
    // Storage recusa gravar sobre um caminho que já existe.
    const orfaos = decididos.flatMap((item) =>
      item.ok &&
      ehImagem(item.arquivo.papel) &&
      !contexto?.gravados.some((gravado) => gravado.caminho === item.destino.caminho)
        ? [item.destino]
        : [],
    )
    if (orfaos.length > 0) await fileStorage.remover(orfaos).catch(() => undefined)

    const itens = await Promise.all(
      decididos.map(
        async (
          item,
        ): Promise<ResultadoDoItem<{ envio: EnvioAutorizado; numero: number | null }>> => {
          if (!item.ok)
            return { id: item.arquivo.id, ok: false, mensagem: mensagemDoItem(item.erro) }
          try {
            const envio = await fileStorage.autorizarEnvio({
              ...item.destino,
              tipoDoConteudo: item.tipoDoConteudo,
            })
            return {
              id: item.arquivo.id,
              ok: true,
              mensagem: 'Envio autorizado.',
              envio,
              numero: item.numero,
            }
          } catch (erro) {
            return { id: item.arquivo.id, ok: false, mensagem: mensagemDoItem(erro) }
          }
        },
      ),
    )
    return { ok: true, mensagem: 'Envio autorizado.', itens }
  })
}

/** Quantas inspeções de Storage (as mais caras: leem os primeiros bytes do arquivo, com até 15s de
 *  timeout cada) rodam ao mesmo tempo dentro de um lote, independente do tamanho dele. */
const CONCORRENCIA_DE_INSPECAO = 6

/**
 * Depois do envio: o servidor olha cada arquivo que chegou ao Storage (tamanho real e primeiros
 * bytes), e só então registra no banco. Arquivo que não confere é apagado.
 */
export async function confirmarEnvioEmLote(
  projetoId: unknown,
  entrada: unknown,
): Promise<ResultadoCadastro<{ itens: ResultadoDoItem[] }>> {
  return rodarComoAdmin(async () => {
    const id = lerId(projetoId)
    const arquivos = lerLote(entrada)
    const somaGravada = await somaGravadaDaEntrega(id, arquivos)
    const contexto = await lerContextoDeNomes(id, arquivos)

    const itens = await executarComLimite(
      arquivos,
      CONCORRENCIA_DE_INSPECAO,
      async (arquivo): Promise<ResultadoDoItem> => {
        try {
          // O número vem do navegador (foi o servidor que o deu no preparo), mas o caminho é montado
          // aqui; um número que colide com outra imagem do projeto ou do lote é recusado.
          const numero = ehImagemComNumero(arquivo.papel) ? (arquivo.numero ?? null) : null
          const { extensao, tipoDoConteudo, destino } = resolverDestino(
            id,
            arquivo,
            contexto?.dados ?? null,
            numero,
          )
          const repetidoNoLote =
            numero !== null &&
            arquivos.some(
              (outro) =>
                outro.id !== arquivo.id && outro.papel === arquivo.papel && outro.numero === numero,
            )
          // Os caminhos de imagens nunca coincidem (cada um tem o seu código), então o que pode
          // colidir de fato é o número: outra imagem do mesmo papel já está com ele.
          const ocupadoPorOutro = contexto?.gravados.some(
            (gravado) =>
              gravado.id !== arquivo.id &&
              (gravado.caminho === destino.caminho ||
                (numero !== null &&
                  gravado.papel === arquivo.papel &&
                  numeroDoCaminho(gravado.caminho) === numero)),
          )
          if (repetidoNoLote || ocupadoPorOutro) {
            throw new AppError(
              'conflito',
              `${arquivo.nomeArquivo}: já existe uma imagem com esse nome no projeto. Salve de novo.`,
            )
          }

          const noStorage = await fileStorage.inspecionar(destino)
          if (!noStorage) {
            return {
              id: arquivo.id,
              ok: false,
              mensagem: `${arquivo.nomeArquivo}: o arquivo não chegou ao armazenamento. Tente de novo.`,
            }
          }

          const motivo =
            erroDoArquivoDoPapel(arquivo.papel, {
              nomeArquivo: arquivo.nomeArquivo,
              tamanho: noStorage.tamanho,
              tipo: tipoDoConteudo,
            }) ??
            (formatoConfere(extensao, noStorage.inicio)
              ? null
              : 'O conteúdo não é do formato indicado.')
          if (motivo) {
            await fileStorage.remover([destino])
            return { id: arquivo.id, ok: false, mensagem: `${arquivo.nomeArquivo}: ${motivo}` }
          }

          try {
            conferirSomaDoLote(arquivo, arquivos, somaGravada, noStorage.tamanho)
            await projetoAdminRepository.registrarArquivo({
              id: arquivo.id,
              projetoId: id,
              papel: arquivo.papel,
              complementarId: arquivo.complementarId,
              pavimentoId: arquivo.pavimentoId,
              caminho: destino.caminho,
              nomeOriginal: arquivo.nomeArquivo,
              tamanhoBytes: noStorage.tamanho,
              tipoMime: tipoDoConteudo,
              ordem: arquivo.ordem,
            })
          } catch (erro) {
            // Já estava registrado (a resposta anterior se perdeu): vale como sucesso, e o arquivo fica.
            const gravados = await projetoAdminRepository.listarArquivos(id)
            if (
              gravados.some(
                (gravado) => gravado.id === arquivo.id && gravado.caminho === destino.caminho,
              )
            ) {
              return { id: arquivo.id, ok: true, mensagem: 'Arquivo salvo.' }
            }
            await fileStorage.remover([destino]).catch(() => undefined)
            throw erro
          }

          return { id: arquivo.id, ok: true, mensagem: 'Arquivo salvo.' }
        } catch (erro) {
          return { id: arquivo.id, ok: false, mensagem: mensagemDoItem(erro) }
        }
      },
    )
    return { ok: true, mensagem: 'Arquivos conferidos.', itens }
  })
}

// ── Publicar ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Passa o projeto para "publicado" quando os arquivos obrigatórios já estão gravados. Os campos
 * obrigatórios foram conferidos em `salvarProjeto` (modo "completo").
 */
export async function publicarProjeto(projetoId: unknown): Promise<ResultadoCadastro> {
  return rodarComoAdmin<object>(async () => {
    const id = lerId(projetoId)

    const estado = await projetoAdminRepository.lerParaPublicar(id)
    if (!estado) return falha('Projeto não encontrado.')

    const faltas = arquivosQueFaltam(estado)
    if (faltas.length > 0) return falha(`Faltam enviar: ${listarEmTexto(faltas)}.`)

    await projetoAdminRepository.definirStatus([id], 'publicado')
    revalidatePath('/admin/projetos')
    invalidarCatalogo()
    return { ok: true, mensagem: 'Projeto publicado.' }
  })
}
