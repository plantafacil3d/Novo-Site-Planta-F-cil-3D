import type { ProjectSpec } from '@/components/shared/ProjectCard'

export type ItemComparacao = { rotulo: string; valor: string }

/**
 * Um favorito já pronto para o componente de apresentação: tudo formatado no servidor
 * (`PainelFavoritosView`), para o card e a tabela de comparação nunca precisarem importar a
 * feature `projetos` (evita bundlar código `server-only` no client — ver `GradeFavoritos`).
 */
export type CardFavorito = {
  id: string
  titulo: string
  href: string
  code?: string
  image: { src: string; alt: string }
  specs: ProjectSpec[]
  price: string
  priceOriginal?: string
  priceDiscount?: string
  /** Login com Google já amarrado a este projeto (ver `features/conta`). */
  entrarComGoogleAction: () => Promise<void>
  comparacao: ItemComparacao[]
}
