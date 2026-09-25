import type { Pagina } from '@/types/pagina'

export interface FavoritoRepository {
  /**
   * Uma página dos ids favoritados pelo usuário logado (RLS restringe a `auth.uid()`), mais
   * recentes primeiro. Paginado no servidor: quem tem muitos favoritos nunca baixa a lista inteira.
   */
  listarIdsPagina(pagina: number, porPagina: number): Promise<Pagina<string>>
  /**
   * Todos os ids favoritados pelo usuário logado, sem paginar: usado só para saber se um projeto
   * qualquer (exibido em qualquer página) já está favoritado, e para montar sugestões. Teto interno
   * defensivo (`seguranca` §8.1) — não é uma listagem de exibição, é um conjunto leve de ids.
   */
  listarTodosIds(): Promise<string[]>
  adicionar(projetoId: string): Promise<void>
  remover(projetoId: string): Promise<void>
}
