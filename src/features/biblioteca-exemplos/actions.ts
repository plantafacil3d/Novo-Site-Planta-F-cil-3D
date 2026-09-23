'use server'

import { revalidatePath } from 'next/cache'

import { executarComLimite } from '@/lib/executarComLimite'
import { bibliotecaExemplosRepository } from '@/repositories/biblioteca-exemplos'
import { authService } from '@/services/auth'
import { fileStorage } from '@/services/storage'
import { extensaoDe } from '@/services/upload/arquivos'
import { formatoConfere } from '@/services/upload/assinaturas'
import { AppError } from '@/types/erro'
import type { EnvioAutorizado } from '@/types/envio'

import { caminhoDaBiblioteca, erroDoArquivoDaBiblioteca, tipoDeConteudoDaExtensao } from './rules'
import { schemaIds, schemaLoteDeArquivos, schemaRenomear, type DadosDoArquivo } from './schemas'
import type { ResultadoDaBiblioteca, ResultadoDoItem, ResultadoOperacao } from './types'

// Server Actions são endpoints públicos (skill `seguranca` §9.1): cada uma confere o administrador
// aqui e valida tudo que recebe, sem confiar em quem chamou. O banco (RLS) e o Storage (policies)
// conferem de novo. O caminho de cada arquivo é gerado aqui, nunca vem do navegador.

const naoAutorizado = {
  ok: false,
  mensagem: 'Sua sessão expirou. Entre novamente para continuar.',
} as const

const falha = (mensagem: string) => ({ ok: false, mensagem }) as const

async function rodarComoAdmin<T extends object>(
  agir: () => Promise<ResultadoOperacao<T>>,
): Promise<ResultadoOperacao<T>> {
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

/** Mensagem para UM item do lote: `AppError` vira a mensagem dela; qualquer outro erro é logado (como
 *  o catch de `rodarComoAdmin`), sem derrubar os outros itens do lote junto. */
function mensagemDoItem(erro: unknown): string {
  if (erro instanceof AppError) return erro.message
  console.error(erro)
  return 'Não foi possível concluir a operação com este arquivo.'
}

function lerLote(entrada: unknown): DadosDoArquivo[] {
  const lido = schemaLoteDeArquivos.safeParse(entrada)
  if (!lido.success) throw new AppError('dados_invalidos', 'Os dados dos arquivos são inválidos.')
  return lido.data
}

/** Onde o arquivo vai ficar, já com a extensão e o tipo conferidos. */
function resolverDestino(arquivo: DadosDoArquivo) {
  const extensao = extensaoDe(arquivo.nomeArquivo)
  const tipoDoConteudo = tipoDeConteudoDaExtensao(extensao)
  const motivo = erroDoArquivoDaBiblioteca(arquivo)
  if (!tipoDoConteudo || motivo) {
    throw new AppError(
      'dados_invalidos',
      `${arquivo.nomeArquivo}: ${motivo ?? 'formato não aceito.'}`,
    )
  }
  return {
    extensao,
    tipoDoConteudo,
    destino: { acesso: 'biblioteca' as const, caminho: caminhoDaBiblioteca(arquivo.id, extensao) },
  }
}

// ── Envio ────────────────────────────────────────────────────────────────────────────────────────
//
// Duas fases, um LOTE inteiro por chamada (autentica uma vez para todos os arquivos, não uma vez por
// arquivo): 1) confere e autoriza o navegador a enviar direto ao Storage; 2) depois do envio, o
// servidor confere o conteúdo real (tamanho e assinatura binária) e só então grava no banco. Mesmo
// padrão de `cadastro-projeto/actions.ts` (`prepararEnvioEmLote`/`confirmarEnvioEmLote`).

/** Confere os arquivos escolhidos e autoriza o navegador a enviá-los direto ao Storage. */
export async function prepararEnvioBiblioteca(
  entrada: unknown,
): Promise<ResultadoOperacao<{ itens: ResultadoDoItem<{ envio: EnvioAutorizado }>[] }>> {
  return rodarComoAdmin(async () => {
    const arquivos = lerLote(entrada)
    const itens = await Promise.all(
      arquivos.map(async (arquivo): Promise<ResultadoDoItem<{ envio: EnvioAutorizado }>> => {
        try {
          const { tipoDoConteudo, destino } = resolverDestino(arquivo)
          const envio = await fileStorage.autorizarEnvio({ ...destino, tipoDoConteudo })
          return { id: arquivo.id, ok: true, mensagem: 'Envio autorizado.', envio }
        } catch (erro) {
          return { id: arquivo.id, ok: false, mensagem: mensagemDoItem(erro) }
        }
      }),
    )
    return { ok: true, mensagem: 'Envio autorizado.', itens }
  })
}

/** Quantas inspeções de Storage (as mais caras: leem os primeiros bytes do arquivo, com até 15s de
 *  timeout cada) rodam ao mesmo tempo dentro de um lote, independente do tamanho dele. Mesmo teto de
 *  `cadastro-projeto/actions.ts`: sem ele, um lote de 12 DWG/PDF grandes dispararia 12 leituras de
 *  Storage em paralelo, o mesmo tipo de gargalo que deixava o cadastro de projeto lento. */
const CONCORRENCIA_DE_INSPECAO = 6

/**
 * Depois do envio: o servidor olha cada arquivo que chegou ao Storage (tamanho real e primeiros
 * bytes), e só então registra na biblioteca. Arquivo que não confere é apagado.
 */
export async function confirmarEnvioBiblioteca(
  entrada: unknown,
): Promise<ResultadoOperacao<{ itens: ResultadoDoItem[] }>> {
  return rodarComoAdmin(async () => {
    const arquivos = lerLote(entrada)
    const itens = await executarComLimite(
      arquivos,
      CONCORRENCIA_DE_INSPECAO,
      async (arquivo): Promise<ResultadoDoItem> => {
        try {
          const { extensao, tipoDoConteudo, destino } = resolverDestino(arquivo)

          const noStorage = await fileStorage.inspecionar(destino)
          if (!noStorage) {
            return {
              id: arquivo.id,
              ok: false,
              mensagem: `${arquivo.nomeArquivo}: o arquivo não chegou ao armazenamento. Tente de novo.`,
            }
          }

          const motivo =
            erroDoArquivoDaBiblioteca({
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
            await bibliotecaExemplosRepository.registrar({
              id: arquivo.id,
              caminho: destino.caminho,
              nomeOriginal: arquivo.nomeArquivo,
              tamanhoBytes: noStorage.tamanho,
              tipoMime: tipoDoConteudo,
            })
          } catch (erro) {
            // Já estava registrado (a resposta anterior se perdeu): vale como sucesso, arquivo fica.
            const existentes = await bibliotecaExemplosRepository.buscarPorIds([arquivo.id])
            if (existentes.length > 0)
              return { id: arquivo.id, ok: true, mensagem: 'Arquivo salvo.' }
            await fileStorage.remover([destino]).catch(() => undefined)
            throw erro
          }

          return { id: arquivo.id, ok: true, mensagem: 'Arquivo salvo.' }
        } catch (erro) {
          return { id: arquivo.id, ok: false, mensagem: mensagemDoItem(erro) }
        }
      },
    )
    revalidatePath('/admin/biblioteca')
    return { ok: true, mensagem: 'Arquivos conferidos.', itens }
  })
}

// ── Renomear ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Troca só o nome de exibição. O caminho no Storage é baseado no id (`caminhoDaBiblioteca`), então
 * o arquivo físico não se move — e como a aba "Arquivos de Exemplo" do cadastro de projeto lê o
 * nome ao vivo (nunca guarda uma cópia), renomear aqui já propaga sozinho para todo lugar que usa.
 */
export async function renomearArquivoDaBiblioteca(
  entrada: unknown,
): Promise<ResultadoDaBiblioteca> {
  return rodarComoAdmin(async (): Promise<ResultadoOperacao<object>> => {
    const validos = schemaRenomear.safeParse(entrada)
    if (!validos.success) return falha('Dê um nome válido ao arquivo.')

    await bibliotecaExemplosRepository.renomear(validos.data.id, validos.data.nomeOriginal)

    revalidatePath('/admin/biblioteca')
    return { ok: true, mensagem: 'Arquivo renomeado.' }
  })
}

// ── Exclusão ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Apaga arquivos da biblioteca de vez: some do Storage e de todos os projetos que os usavam (o
 * vínculo sai por cascade no banco, junto com a linha do arquivo). Não há como desfazer; quem chama
 * já confirmou com o administrador antes, mostrando em quantos projetos cada um está em uso.
 */
export async function excluirArquivosDaBiblioteca(ids: unknown): Promise<ResultadoDaBiblioteca> {
  return rodarComoAdmin(async (): Promise<ResultadoOperacao<object>> => {
    const validos = schemaIds.safeParse(ids)
    if (!validos.success) return falha('Selecione de 1 a 50 arquivos.')

    const excluidos = await bibliotecaExemplosRepository.remover(validos.data)
    if (excluidos.length === 0) throw new AppError('dados_invalidos', 'Arquivos não encontrados.')

    try {
      await fileStorage.remover(
        excluidos.map((arquivo) => ({ acesso: 'biblioteca' as const, caminho: arquivo.caminho })),
      )
    } catch {
      // As linhas já saíram do banco (e dos projetos vinculados); sobra no Storage é limpeza futura.
    }

    revalidatePath('/admin/biblioteca')
    return {
      ok: true,
      mensagem: `${excluidos.length} arquivo${excluidos.length === 1 ? '' : 's'} excluído${excluidos.length === 1 ? '' : 's'}.`,
    }
  })
}
