import { NextResponse } from 'next/server'

import { sessaoResumida } from '@/features/conta'

// Endpoint público, sem entrada: devolve só se há sessão e se é administrador (nunca e-mail ou id).
export async function GET() {
  return NextResponse.json(await sessaoResumida(), { headers: { 'Cache-Control': 'no-store' } })
}
