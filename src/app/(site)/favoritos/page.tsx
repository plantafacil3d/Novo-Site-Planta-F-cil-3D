import type { Metadata } from 'next'

import { usuarioLogado } from '@/features/conta'
import { listarFavoritosPagina, listarSugestoes } from '@/features/favoritos'
import { PainelFavoritosView } from '@/views/favoritos/PainelFavoritosView'

// Página privada, por usuário: fora do índice do Google (skill `seguranca` §9.1).
export const metadata: Metadata = { title: 'Meus favoritos', robots: { index: false, follow: false } }

type FavoritosPageProps = {
  searchParams: Promise<{ pagina?: string }>
}

export default async function FavoritosPage({ searchParams }: FavoritosPageProps) {
  const { pagina: paginaBruta } = await searchParams
  const pagina = Math.max(1, Math.floor(Number(paginaBruta)) || 1)

  const [usuarioCompleto, favoritos, sugestoes] = await Promise.all([
    usuarioLogado(),
    listarFavoritosPagina(pagina),
    listarSugestoes(),
  ])
  // Só o que a tela mostra: nunca o id nem se é administrador (skill `seguranca` §9.1).
  const usuario = usuarioCompleto && { nome: usuarioCompleto.nome, email: usuarioCompleto.email }

  return <PainelFavoritosView usuario={usuario} favoritos={favoritos} sugestoes={sugestoes} />
}
