import { SupabaseFavoritoRepository } from './SupabaseFavoritoRepository'
import type { FavoritoRepository } from './FavoritoRepository'

export type { FavoritoRepository } from './FavoritoRepository'
export const favoritoRepository: FavoritoRepository = new SupabaseFavoritoRepository()
