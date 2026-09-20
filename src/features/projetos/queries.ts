import 'server-only'

import { projetoRepository } from '@/repositories/projetos'

// Loaders para Server Components: o conteúdo público é renderizado no servidor (SEO).

export function listarProjetosEmDestaque() {
  return projetoRepository.listarDestaques()
}

export function listarComplementares() {
  return projetoRepository.listarComplementares()
}

export function listarCategorias() {
  return projetoRepository.listarCategorias()
}
