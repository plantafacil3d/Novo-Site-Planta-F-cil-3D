import type { NextRequest } from 'next/server'

import { renovarSessao } from '@/lib/supabase/sessao'

export async function proxy(request: NextRequest) {
  return renovarSessao(request)
}

export const config = { matcher: ['/admin/:path*', '/auth/sessao'] }
