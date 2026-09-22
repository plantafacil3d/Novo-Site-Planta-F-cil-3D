'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
  caminhoDoArquivo,
  erroDoArquivoDoPapel,
  extensaoDe,
  formatoConfere,
  listarArquivosDoFormulario,
  listarEmTexto,
  montarCadastro,
  montarComplementares,
  slugsCandidatos,
  tipoDeConteudoDaExtensao,
} from './rules'
import { lerPayload, validarEtapas } from './schemas'
import type { CadastroGravavel, PayloadProjeto, ProjetoCriado, ResultadoCadastro } from './types'

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
    rotulo: z.string().trim().max(LIMITES.plantaNomeMax).nullable(),
    ordem: z.number().int().min(0).max(1000),
  })
  .refine((arquivo) => (arquivo.papel === 'complementar_pdf') === (arquivo.complementarId !== null))

type DadosDoArquivo = z.infer<typeof schemaArquivo>

const lerId = (entrada: unknown) => {
  const lido = schemaId.safeParse(entrada)
  if (!lido.success) throw new AppError('dados_invalidos', 'Projeto inválido.')
  return lido.data
}

const lerArquivo = (entrada: unknown) => {
  const lido = schemaArquivo.safeParse(entrada)
  if (!lido.success) throw new AppError('dados_invalidos', 'Os dados do arquivo são inválidos.')
  return lido.data
}

/** Onde o arquivo vai ficar, já com a extensão e o tipo conferidos pelo papel dele. */
function resolverDestino(projetoId: string, arquivo: DadosDoArquivo) {
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
  return {
    extensao,
    tipoDoConteudo,
    destino: {
      acesso: acessoDoPapel(arquivo.papel),
      caminho: caminhoDoArquivo(projetoId, arquivo.papel, arquivo.id, extensao),
    },
  }
}

/** Os arquivos da entrega somam no máximo 20 MB, contando o que já está gravado. */
async function conferirSomaDaEntrega(projetoId: string, arquivo: DadosDoArquivo, tamanho: number) {
  if (arquivo.papel !== 'entrega') return
  const gravados = await projetoAdminRepository.listarArquivos(projetoId)
  const soma = gravados
    .filter((gravado) => gravado.papel === 'entrega' && gravado.id !== arquivo.id)
    .reduce((total, gravado) => total + gravado.tamanhoBytes, 0)
  if (soma + tamanho > LIMITES.anexoMaxBytes) {
    throw new AppError(
      'dados_invalidos',
      `${arquivo.nomeArquivo}: passa do limite de 20 MB no total dos arquivos da entrega.`,
    )
  }
}

// ── Salvar ───────────────────────────────────────────────────────────────────────────────────────

/** Tenta o slug do título e, se já existir, `-2`, `-3`... até achar um livre. */
async function criarComSlugLivre(cadastro: CadastroGravavel): Promise<ProjetoCriado> {
  for (const slug of slugsCandidatos(cadastro.titulo)) {
    try {
      return await projetoAdminRepository.criarCadastro(cadastro, slug)
    } catch (erro) {
      if (!(erro instanceof AppError && erro.code === 'conflito')) throw erro
    }
  }
  throw new AppError('conflito', 'Já existem projetos com esse título. Mude um pouco o título.')
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

  const sobrando = gravados.filter(
    (gravado) =>
      !mantidos.has(gravado.id) ||
      (gravado.complementarId !== null && !complementares.has(gravado.complementarId)),
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

  const idsGravados = new Set(gravados.map((gravado) => gravado.id))
  await projetoAdminRepository.atualizarRotulos(
    doFormulario
      .filter((item) => item.papel === 'planta' && idsGravados.has(item.arquivo.id))
      .map((item) => ({ id: item.arquivo.id, rotulo: item.rotulo?.trim() || null })),
  )
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

    await sincronizarArquivos(id, payload)
    await projetoAdminRepository.sincronizarComplementares(id, montarComplementares(payload))

    revalidatePath('/admin/projetos')
    return { ok: true, mensagem: 'Informações salvas.', projetoId: id }
  })
}

// ── Arquivos ─────────────────────────────────────────────────────────────────────────────────────

/** Confere o arquivo escolhido e autoriza o navegador a enviá-lo direto ao Storage. */
export async function prepararEnvio(
  projetoId: unknown,
  entrada: unknown,
): Promise<ResultadoCadastro<{ envio: EnvioAutorizado }>> {
  return rodarComoAdmin(async () => {
    const id = lerId(projetoId)
    const arquivo = lerArquivo(entrada)

    const { tipoDoConteudo, destino } = resolverDestino(id, arquivo)
    await conferirSomaDaEntrega(id, arquivo, arquivo.tamanho)

    const envio = await fileStorage.autorizarEnvio({ ...destino, tipoDoConteudo })
    return { ok: true, mensagem: 'Envio autorizado.', envio }
  })
}

/**
 * Depois do envio: o servidor olha o arquivo que chegou ao Storage (tamanho real e primeiros bytes),
 * e só então registra no banco. Arquivo que não confere é apagado.
 */
export async function confirmarEnvio(
  projetoId: unknown,
  entrada: unknown,
): Promise<ResultadoCadastro> {
  return rodarComoAdmin<object>(async () => {
    const id = lerId(projetoId)
    const arquivo = lerArquivo(entrada)
    const { extensao, tipoDoConteudo, destino } = resolverDestino(id, arquivo)

    const noStorage = await fileStorage.inspecionar(destino)
    if (!noStorage) {
      return falha(`${arquivo.nomeArquivo}: o arquivo não chegou ao armazenamento. Tente de novo.`)
    }

    const motivo =
      erroDoArquivoDoPapel(arquivo.papel, {
        nomeArquivo: arquivo.nomeArquivo,
        tamanho: noStorage.tamanho,
        tipo: tipoDoConteudo,
      }) ??
      (formatoConfere(extensao, noStorage.inicio) ? null : 'O conteúdo não é do formato indicado.')
    if (motivo) {
      await fileStorage.remover([destino])
      return falha(`${arquivo.nomeArquivo}: ${motivo}`)
    }

    try {
      await conferirSomaDaEntrega(id, arquivo, noStorage.tamanho)
      await projetoAdminRepository.registrarArquivo({
        id: arquivo.id,
        projetoId: id,
        papel: arquivo.papel,
        complementarId: arquivo.complementarId,
        caminho: destino.caminho,
        nomeOriginal: arquivo.nomeArquivo,
        rotulo: arquivo.rotulo || null,
        tamanhoBytes: noStorage.tamanho,
        tipoMime: tipoDoConteudo,
        ordem: arquivo.ordem,
      })
    } catch (erro) {
      // Já estava registrado (a resposta anterior se perdeu): vale como sucesso, e o arquivo fica.
      const gravados = await projetoAdminRepository.listarArquivos(id)
      if (
        gravados.some((gravado) => gravado.id === arquivo.id && gravado.caminho === destino.caminho)
      ) {
        return { ok: true, mensagem: 'Arquivo salvo.' }
      }
      await fileStorage.remover([destino]).catch(() => undefined)
      throw erro
    }

    return { ok: true, mensagem: 'Arquivo salvo.' }
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
    return { ok: true, mensagem: 'Projeto publicado.' }
  })
}
