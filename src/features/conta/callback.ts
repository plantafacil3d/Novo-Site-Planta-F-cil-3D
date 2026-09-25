import 'server-only'

import { z } from 'zod'

import { favoritoRepository } from '@/repositories/favoritos'
import { authService } from '@/services/auth'

import { destinoAposEntrar } from './rules'

// O `code` e o `favoritar` vêm da URL (não confiáveis): validados aqui. O destino é sempre
// escolhido pelo servidor, nunca uma URL vinda do cliente (sem redirecionamento aberto).
const schemaCode = z.string().min(1).max(512)
const schemaFavoritar = z.uuid()

/**
 * Termina o login com Google. Devolve para onde levar o navegador (só endereços internos fixos:
 * `/admin/projetos`, `/` ou `/favoritos`). Qualquer conta Google pode entrar e manter sessão;
 * autorização de `/admin` continua garantida à parte, no servidor, por `exigirAdmin()`.
 */
export async function concluirLoginGoogle(
  code: string | null,
  favoritarBruto: string | null,
): Promise<string> {
  const dados = schemaCode.safeParse(code)
  if (!dados.success) return '/admin/entrar?erro=falha_login'

  let usuario: { ehAdmin: boolean }
  try {
    usuario = await authService.concluirLoginGoogle(dados.data)
  } catch {
    return '/admin/entrar?erro=falha_login'
  }

  const favoritar = schemaFavoritar.safeParse(favoritarBruto)
  if (favoritar.success) {
    // Melhor esforço: um id inválido/já excluído não pode derrubar um login que já deu certo.
    try {
      await favoritoRepository.adicionar(favoritar.data)
    } catch {}
    return '/favoritos'
  }

  return destinoAposEntrar(usuario.ehAdmin)
}
