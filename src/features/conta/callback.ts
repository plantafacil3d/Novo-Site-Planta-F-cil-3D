import 'server-only'

import { z } from 'zod'

import { authService } from '@/services/auth'

import { destinoAposEntrar } from './rules'

// O `code` vem da URL (não confiável): é validado aqui. O destino é sempre escolhido pelo servidor.
const schemaCode = z.string().min(1).max(512)

/** Termina o login com Google. Devolve para onde levar o navegador (endereço interno fixo). */
export async function concluirLoginGoogle(code: string | null): Promise<string> {
  const dados = schemaCode.safeParse(code)
  if (!dados.success) return '/admin/entrar?erro=falha_login'

  let ehAdmin: boolean
  try {
    ehAdmin = (await authService.concluirLoginGoogle(dados.data)).ehAdmin
  } catch {
    return '/admin/entrar?erro=falha_login'
  }

  if (!ehAdmin) {
    // Qualquer conta Google consegue logar; só quem está em `administradores` entra no painel.
    await authService.sair()
    return '/admin/entrar?erro=acesso_negado'
  }
  return destinoAposEntrar(true)
}
