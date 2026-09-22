'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { acessoDoPapel } from '@/features/cadastro-projeto'
import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'

import { contarProjetos, montarCopia } from './rules'
import { schemaIds } from './schemas'
import type { ResultadoAcao, StatusProjeto } from './types'

// Server Actions são endpoints públicos (skill `seguranca` §9.1): cada uma valida a entrada e
// confere o administrador aqui, sem confiar no botão que a chamou. O banco (RLS) confere de novo.

const naoAutorizado: ResultadoAcao = {
  ok: false,
  mensagem: 'Sua sessão expirou. Entre novamente para continuar.',
}

async function rodarComoAdmin(
  ids: unknown,
  agir: (ids: string[]) => Promise<string>,
): Promise<ResultadoAcao> {
  const usuario = await authService.usuarioAtual()
  if (!usuario?.ehAdmin) return naoAutorizado

  const validos = schemaIds.safeParse(ids)
  if (!validos.success) return { ok: false, mensagem: 'Selecione de 1 a 50 projetos.' }

  try {
    const mensagem = await agir(validos.data)
    revalidatePath('/admin/projetos')
    return { ok: true, mensagem }
  } catch (erro) {
    const mensagem =
      erro instanceof AppError ? erro.message : 'Não foi possível concluir a operação.'
    return { ok: false, mensagem }
  }
}

/** Cria uma cópia em rascunho de cada projeto selecionado. */
export async function duplicarProjetos(ids: string[]): Promise<ResultadoAcao> {
  return rodarComoAdmin(ids, async (validos) => {
    const originais = await projetoAdminRepository.buscarPorIds(validos)
    if (originais.length === 0) throw new AppError('dados_invalidos', 'Projetos não encontrados.')

    const criados = await projetoAdminRepository.criar(
      originais.map((original) => montarCopia(original, crypto.randomUUID().slice(0, 6))),
    )
    return `${contarProjetos(criados)} duplicado${criados === 1 ? '' : 's'} como rascunho.`
  })
}

async function mudarStatus(ids: string[], status: StatusProjeto) {
  const alterados = await projetoAdminRepository.definirStatus(ids, status)
  if (alterados === 0) throw new AppError('dados_invalidos', 'Projetos não encontrados.')
  return `${contarProjetos(alterados)} movido${alterados === 1 ? '' : 's'} para rascunho.`
}

/** Passa os projetos selecionados para rascunho (saem do site público). */
export async function moverParaRascunho(ids: string[]): Promise<ResultadoAcao> {
  return rodarComoAdmin(ids, (validos) => mudarStatus(validos, 'rascunho'))
}

/**
 * Apaga os projetos selecionados de vez, com os arquivos. Não há como desfazer: quem chama confirma
 * com o usuário antes. Os complementares e os registros de arquivo saem por cascade no banco.
 */
export async function excluirProjetos(ids: string[]): Promise<ResultadoAcao> {
  return rodarComoAdmin(ids, async (validos) => {
    // Os caminhos precisam ser lidos antes: o cascade apaga `projeto_arquivos` junto com o projeto.
    const arquivos = await projetoAdminRepository.listarArquivosDeProjetos(validos)

    const excluidos = await projetoAdminRepository.remover(validos)
    if (excluidos.length === 0) throw new AppError('dados_invalidos', 'Projetos não encontrados.')

    // Só os arquivos de quem realmente saiu: se o banco tivesse apagado parte dos ids, limpar a
    // lista inteira destruiria arquivo de projeto que continua lá.
    const apagados = new Set(excluidos)
    try {
      await fileStorage.remover(
        arquivos
          .filter((arquivo) => apagados.has(arquivo.projetoId))
          .map((arquivo) => ({ acesso: acessoDoPapel(arquivo.papel), caminho: arquivo.caminho })),
      )
    } catch {
      // O projeto já saiu do banco; arquivo que fique no Storage é só espaço (limpeza futura).
    }

    return `${contarProjetos(excluidos.length)} excluído${excluidos.length === 1 ? '' : 's'}.`
  })
}

export async function sairDoPainel() {
  await authService.sair()
  redirect('/admin/entrar')
}
