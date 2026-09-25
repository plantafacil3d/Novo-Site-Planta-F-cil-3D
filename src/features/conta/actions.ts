'use server'

import { redirect } from 'next/navigation'

import type { EstadoFormularioLogin } from '@/components/shared/FormularioLogin'
import { siteUrl } from '@/features/site'
import { authService } from '@/services/auth'
import { AppError } from '@/types/erro'

import { destinoAposEntrar } from './rules'
import { schemaLogin, schemaProjetoIdOpcional } from './schemas'

// Server Actions são endpoints públicos (skill `seguranca` §9.1): a entrada é validada aqui.
// O destino é escolhido pelo servidor, nunca por um endereço vindo do navegador (sem redirecionamento aberto).

export async function entrarNaConta(
  _: EstadoFormularioLogin,
  formData: FormData,
): Promise<EstadoFormularioLogin> {
  const dados = schemaLogin.safeParse({
    email: formData.get('email'),
    senha: formData.get('senha'),
  })
  if (!dados.success) return { erro: 'Informe um e-mail válido e a senha.' }

  let ehAdmin: boolean
  try {
    ehAdmin = (await authService.entrar(dados.data.email, dados.data.senha)).ehAdmin
  } catch (erro) {
    if (erro instanceof AppError && erro.code === 'credenciais_invalidas') {
      return { erro: 'E-mail ou senha incorretos.' }
    }
    return { erro: 'Não foi possível entrar agora. Tente novamente em instantes.' }
  }

  redirect(destinoAposEntrar(ehAdmin))
}

/**
 * Começa o login com Google. Quando vem de um coração de favoritar (`projetoId`, validado como
 * uuid), o projeto é favoritado assim que o login terminar — ver `concluirLoginGoogle`.
 */
export async function entrarComGoogle(projetoId?: string): Promise<void> {
  const favoritar = projetoId ? schemaProjetoIdOpcional.safeParse(projetoId) : undefined
  const base = `${siteUrl}/auth/callback`
  const retornoUrl = favoritar?.success ? `${base}?favoritar=${favoritar.data}` : base

  let urlGoogle: string
  try {
    urlGoogle = await authService.iniciarLoginGoogle(retornoUrl)
  } catch {
    redirect('/admin/entrar?erro=falha_login')
  }
  redirect(urlGoogle)
}
