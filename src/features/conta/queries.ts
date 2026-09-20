import 'server-only'

import { redirect } from 'next/navigation'

import { authService } from '@/services/auth'

import { destinoAposEntrar } from './rules'

/** Nas telas de entrada: quem já está logado segue direto para o destino, sem ver o formulário. */
export async function levarLogadoParaDestino() {
  const usuario = await authService.usuarioAtual()
  if (usuario) redirect(destinoAposEntrar(usuario.ehAdmin))
}
