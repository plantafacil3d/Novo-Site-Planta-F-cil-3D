'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'
import { AppError } from '@/types/erro'

import { contarProjetos, montarCopia } from './rules'
import { lerCadastroProjeto, schemaId, schemaIds } from './schemas'
import type { EstadoFormulario, ResultadoAcao, StatusProjeto } from './types'

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
 * Salva o formulário de cadastro. Sem `id` cria um rascunho e leva para a tela de edição;
 * com `id` grava no projeto existente. Chamada pelo formulário via `useActionState`.
 */
export async function salvarProjeto(
  id: string | null,
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const usuario = await authService.usuarioAtual()
  if (!usuario?.ehAdmin) return { ok: false, mensagem: naoAutorizado.mensagem }

  if (id !== null && !schemaId.safeParse(id).success) {
    return { ok: false, mensagem: 'Projeto não encontrado.' }
  }

  const lido = lerCadastroProjeto(formulario)
  if (!lido.ok) {
    return {
      ok: false,
      mensagem: 'Corrija os campos destacados e salve de novo.',
      erros: lido.erros,
    }
  }

  let idSalvo: string
  try {
    if (id === null) {
      idSalvo = await projetoAdminRepository.criarRascunho(lido.dados)
    } else {
      await projetoAdminRepository.atualizar(id, lido.dados)
      idSalvo = id
    }
  } catch (erro) {
    if (erro instanceof AppError && erro.code === 'conflito') {
      return {
        ok: false,
        mensagem: 'Corrija os campos destacados e salve de novo.',
        erros: { slug: 'Já existe um projeto com este endereço. Escolha outro.' },
      }
    }
    const mensagem = erro instanceof AppError ? erro.message : 'Não foi possível salvar o projeto.'
    return { ok: false, mensagem }
  }

  revalidatePath('/admin/projetos')
  // `redirect` lança um sinal interno do Next: fica fora do try/catch.
  if (id === null) redirect(`/admin/projetos/${idSalvo}/editar?criado=1`)
  return { ok: true, mensagem: 'Projeto salvo.' }
}

export async function sairDoPainel() {
  await authService.sair()
  redirect('/admin/entrar')
}
