import type { BibliotecaExemplosRepository } from './BibliotecaExemplosRepository'
import { SupabaseBibliotecaExemplosRepository } from './SupabaseBibliotecaExemplosRepository'

export type { BibliotecaExemplosRepository } from './BibliotecaExemplosRepository'
export const bibliotecaExemplosRepository: BibliotecaExemplosRepository =
  new SupabaseBibliotecaExemplosRepository()
