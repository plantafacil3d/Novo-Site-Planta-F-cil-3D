import 'server-only'

import { z } from 'zod'

import { siteUrl } from '@/features/site'
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
  jaTentouDeNovo: boolean,
): Promise<string> {
  const favoritar = schemaFavoritar.safeParse(favoritarBruto)

  // Às vezes o navegador volta do Google sem o cookie temporário do login (ou a troca do código
  // falha) e o usuário precisava clicar de novo. Como o Google já reconhece a conta, refazemos o
  // fluxo uma vez, sem o usuário perceber; na segunda falha mostramos o erro (sem laço infinito).
  async function falhar(): Promise<string> {
    if (jaTentouDeNovo) return '/admin/entrar?erro=falha_login'
    const base = `${siteUrl}/auth/callback?tentativa=2`
    const retornoUrl = favoritar.success ? `${base}&favoritar=${favoritar.data}` : base
    try {
      return await authService.iniciarLoginGoogle(retornoUrl)
    } catch {
      return '/admin/entrar?erro=falha_login'
    }
  }

  const dados = schemaCode.safeParse(code)
  if (!dados.success) return falhar()

  let usuario: { ehAdmin: boolean }
  try {
    usuario = await authService.concluirLoginGoogle(dados.data)
  } catch (erro) {
    console.error('[login-google] falha ao concluir o login', erro)
    return falhar()
  }

  if (favoritar.success) {
    // Melhor esforço: um id inválido/já excluído não pode derrubar um login que já deu certo.
    try {
      await favoritoRepository.adicionar(favoritar.data)
    } catch {}
    return '/favoritos'
  }

  return destinoAposEntrar(usuario.ehAdmin)
}
