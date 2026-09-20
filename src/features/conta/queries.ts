import 'server-only'

import { redirect } from 'next/navigation'

import { authService } from '@/services/auth'

import { destinoAposEntrar } from './rules'

/** Nas telas de entrada: quem já está logado segue direto para o destino, sem ver o formulário. */
export async function levarLogadoParaDestino() {
  const usuario = await authService.usuarioAtual()
  if (usuario) redirect(destinoAposEntrar(usuario.ehAdmin))
}

/** Só o que o cabeçalho precisa saber: `null` sem sessão, senão se é administrador (nada de e-mail ou id). */
export async function sessaoResumida(): Promise<{ ehAdmin: boolean | null }> {
  try {
    const usuario = await authService.usuarioAtual()
    return { ehAdmin: usuario ? usuario.ehAdmin : null }
  } catch {
    return { ehAdmin: null }
  }
}
