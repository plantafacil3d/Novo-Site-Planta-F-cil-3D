import { NextResponse, type NextRequest } from 'next/server'

import { concluirLoginGoogle } from '@/features/conta'

// Route Handler é endpoint público (skill `seguranca` §9.1). Qualquer `next` ou `redirect_to`
// vindo da URL é ignorado: o destino é decidido pela feature (sem redirecionamento aberto).
export async function GET(request: NextRequest) {
  const destino = await concluirLoginGoogle(request.nextUrl.searchParams.get('code'))
  return NextResponse.redirect(new URL(destino, request.url))
}
