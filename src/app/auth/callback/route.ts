import { NextResponse, type NextRequest } from 'next/server'

import { concluirLoginGoogle } from '@/features/conta'
import { siteUrl } from '@/features/site'

// Route Handler é endpoint público (skill `seguranca` §9.1). `favoritar` só é usado como um id
// validado (favorita o projeto no servidor); nunca vira URL de redirecionamento — o destino é
// sempre um dos endereços internos fixos que a feature decide (sem redirecionamento aberto).
// A base é o domínio público (`siteUrl`), não `request.url`: atrás do proxy da hospedagem o app
// enxerga o próprio endereço interno (`localhost:3000`) e mandaria o usuário para lá.
export async function GET(request: NextRequest) {
  const destino = await concluirLoginGoogle(
    request.nextUrl.searchParams.get('code'),
    request.nextUrl.searchParams.get('favoritar'),
  )
  return NextResponse.redirect(new URL(destino, siteUrl))
}
