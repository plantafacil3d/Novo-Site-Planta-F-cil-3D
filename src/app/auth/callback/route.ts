import { NextResponse, type NextRequest } from 'next/server'

import { concluirLoginGoogle } from '@/features/conta'

// Route Handler é endpoint público (skill `seguranca` §9.1). `favoritar` só é usado como um id
// validado (favorita o projeto no servidor); nunca vira URL de redirecionamento — o destino é
// sempre um dos endereços internos fixos que a feature decide (sem redirecionamento aberto).
export async function GET(request: NextRequest) {
  const destino = await concluirLoginGoogle(
    request.nextUrl.searchParams.get('code'),
    request.nextUrl.searchParams.get('favoritar'),
  )
  return NextResponse.redirect(new URL(destino, request.url))
}
