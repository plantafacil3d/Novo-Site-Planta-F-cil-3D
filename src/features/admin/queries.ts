import 'server-only'

import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'

import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'

import { PROJETOS_ADMIN_POR_PAGINA } from './rules'
import { schemaId } from './schemas'
import type { ParametrosAdminProjetos } from './types'

// Loaders para Server Components do painel. Toda leitura confere o administrador no servidor
// (skill `seguranca` §5): o layout sozinho não basta, porque ele não roda de novo ao navegar.

/** Uma verificação por requisição, compartilhada entre layout, página e loaders. */
const usuarioAtual = cache(() => authService.usuarioAtual())

/** Sem login vai para a tela de entrada; logado mas sem ser administrador, a página "não existe". */
export async function exigirAdmin() {
  const usuario = await usuarioAtual()
  if (!usuario) redirect('/admin/entrar')
  if (!usuario.ehAdmin) notFound()
  return usuario
}

/** Projeto para o formulário de edição; id inválido ou inexistente = página "não existe". */
export async function carregarProjetoAdmin(id: string) {
  await exigirAdmin()
  if (!schemaId.safeParse(id).success) notFound()
  const projeto = await projetoAdminRepository.buscarCompleto(id)
  if (!projeto) notFound()
  return projeto
}

export async function listarProjetosAdmin(params: ParametrosAdminProjetos) {
  await exigirAdmin()
  return projetoAdminRepository.listar({
    busca: params.q,
    pagina: params.pagina,
    porPagina: PROJETOS_ADMIN_POR_PAGINA,
  })
}
