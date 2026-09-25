import type { NextRequest } from 'next/server'

import { renovarSessao } from '@/lib/supabase/sessao'

export async function proxy(request: NextRequest) {
  return renovarSessao(request)
}

// Antes, só o painel logava (matcher restrito a `/admin`). Agora qualquer conta Google pode
// manter sessão e navegar o site inteiro (favoritos), então a sessão precisa se renovar em toda
// rota — exceto arquivos estáticos, que não leem cookie nenhum.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)'],
}
