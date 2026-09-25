import 'server-only'

import type { SupabaseClient, User } from '@supabase/supabase-js'

import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'

import type { AuthService, UsuarioLogado } from './AuthService'

async function paraUsuarioLogado(supabase: SupabaseClient, usuario: User): Promise<UsuarioLogado> {
  // A policy deixa cada um ler só o próprio registro: se a linha vier, é administrador.
  const { data, error } = await supabase
    .from('administradores')
    .select('user_id')
    .eq('user_id', usuario.id)
    .maybeSingle()
  if (error) throw new AppError('falha_inesperada', 'Não foi possível verificar o acesso.')

  const nome = usuario.user_metadata?.full_name ?? usuario.user_metadata?.name
  return {
    id: usuario.id,
    email: usuario.email ?? '',
    nome: typeof nome === 'string' && nome.length > 0 ? nome : (usuario.email ?? ''),
    ehAdmin: data !== null,
  }
}

export class SupabaseAuthService implements AuthService {
  async entrar(email: string, senha: string): Promise<UsuarioLogado> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error || !data.user) {
      // Mensagem única: não revela se o e-mail existe.
      throw new AppError('credenciais_invalidas', 'E-mail ou senha incorretos.')
    }
    return paraUsuarioLogado(supabase, data.user)
  }

  async iniciarLoginGoogle(retornoUrl: string): Promise<string> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: retornoUrl },
    })
    if (error || !data.url) {
      throw new AppError('falha_inesperada', 'Não foi possível entrar com o Google.')
    }
    return data.url
  }

  async concluirLoginGoogle(code: string): Promise<UsuarioLogado> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user) {
      throw new AppError('credenciais_invalidas', 'Não foi possível entrar com o Google.')
    }
    return paraUsuarioLogado(supabase, data.user)
  }

  async sair(): Promise<void> {
    const supabase = await criarClienteServidor()
    await supabase.auth.signOut()
  }

  async usuarioAtual(): Promise<UsuarioLogado | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return paraUsuarioLogado(supabase, data.user)
  }
}
