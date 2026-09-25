import 'server-only'

import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { FavoritoRepository } from './FavoritoRepository'

/** Teto defensivo do conjunto completo de ids (`listarTodosIds`): ninguém baixa "tudo" sem limite. */
const TODOS_IDS_MAXIMO = 500

export class SupabaseFavoritoRepository implements FavoritoRepository {
  async listarIdsPagina(pagina: number, porPagina: number): Promise<Pagina<string>> {
    const tamanho = Math.max(1, Math.floor(porPagina))
    const de = (Math.max(1, Math.floor(pagina)) - 1) * tamanho
    const supabase = await criarClienteServidor()

    const { data, count, error } = await supabase
      .from('favoritos')
      .select('projeto_id', { count: 'exact' })
      .order('criado_em', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<{ projeto_id: string }[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os favoritos.')

    return {
      itens: data.map((linha) => linha.projeto_id),
      total: count ?? 0,
      pagina,
      porPagina: tamanho,
    }
  }

  async listarTodosIds(): Promise<string[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('favoritos')
      .select('projeto_id')
      .order('criado_em', { ascending: false })
      .limit(TODOS_IDS_MAXIMO)
      .overrideTypes<{ projeto_id: string }[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os favoritos.')
    return data.map((linha) => linha.projeto_id)
  }

  async adicionar(projetoId: string): Promise<void> {
    const supabase = await criarClienteServidor()
    const { data: usuario } = await supabase.auth.getUser()
    if (!usuario.user) throw new AppError('nao_autenticado', 'É preciso entrar para favoritar.')

    const { error } = await supabase
      .from('favoritos')
      .upsert({ user_id: usuario.user.id, projeto_id: projetoId }, { onConflict: 'user_id,projeto_id' })
    if (error) throw new AppError('falha_inesperada', 'Não foi possível favoritar o projeto.')
  }

  async remover(projetoId: string): Promise<void> {
    const supabase = await criarClienteServidor()
    const { error } = await supabase.from('favoritos').delete().eq('projeto_id', projetoId)
    if (error) throw new AppError('falha_inesperada', 'Não foi possível remover o favorito.')
  }
}
