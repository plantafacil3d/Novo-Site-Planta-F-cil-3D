'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { favoritoRepository } from '@/repositories/favoritos'
import { authService } from '@/services/auth'

import { schemaProjetoId } from './schemas'

export type ResultadoAlternarFavorito =
  | { ok: true }
  | { ok: false; motivo: 'nao_autenticado' | 'invalido' | 'erro' }

// Server Action é endpoint público (skill `seguranca` §9.1): id e sessão são validados aqui, nunca
// confiando no que o botão do cliente já "sabia" sobre estar logado.
export async function alternarFavorito(
  projetoIdBruto: string,
  proximoEstado: boolean,
): Promise<ResultadoAlternarFavorito> {
  const dados = schemaProjetoId.safeParse(projetoIdBruto)
  if (!dados.success) return { ok: false, motivo: 'invalido' }

  const usuario = await authService.usuarioAtual()
  if (!usuario) return { ok: false, motivo: 'nao_autenticado' }

  try {
    if (proximoEstado) await favoritoRepository.adicionar(dados.data)
    else await favoritoRepository.remover(dados.data)
  } catch {
    return { ok: false, motivo: 'erro' }
  }

  revalidatePath('/favoritos')
  return { ok: true }
}

export async function sairDoUsuario(): Promise<void> {
  await authService.sair()
  redirect('/')
}
