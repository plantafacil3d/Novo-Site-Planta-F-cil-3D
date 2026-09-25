import { NextResponse } from 'next/server'

import { usuarioLogado } from '@/features/conta'
import { listarTodosIdsFavoritados } from '@/features/favoritos'

// Route Handler é endpoint público (skill `seguranca` §9.1): sem sessão, devolve `null`, nunca erro
// nem dado de outro usuário. Usado só para pintar o coração; a Action que favorita confere sessão
// e RLS de novo, sempre.
export async function GET() {
  const usuario = await usuarioLogado()
  if (!usuario) return NextResponse.json({ ids: null })

  const ids = await listarTodosIdsFavoritados()
  return NextResponse.json({ ids })
}
