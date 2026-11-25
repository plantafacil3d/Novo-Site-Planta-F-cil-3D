import type { NextRequest } from 'next/server'

import { abrirOferta } from '@/features/produtos'

// "Ver oferta" dos produtos: anota o clique e leva a pessoa ao link cadastrado, EXATAMENTE como
// está gravado (de qualquer loja). Route Handler é endpoint público (skill `seguranca` §9.1): a
// feature valida o id e a origem. O destino vem só do banco (gravado pelo painel, sempre http/https),
// nunca da URL, então este endereço não serve para redirecionar a um site qualquer.

/** Redirecionamento sem cache e fora do Google. O `Location` vai como está (sem normalizar o link). */
function redirecionar(destino: string): Response {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Referrer-Policy': 'no-referrer-when-downgrade',
  })
  try {
    headers.set('Location', destino)
  } catch {
    // Só um link com caractere fora do ASCII cai aqui: vai na forma codificada, que o navegador
    // trata como o mesmo endereço.
    headers.set('Location', new URL(destino).href)
  }
  return new Response(null, { status: 302, headers })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const link = await abrirOferta(
    id,
    request.nextUrl.searchParams.get('de'),
    request.headers.get('user-agent'),
  ).catch((erro: unknown) => {
    console.error('Não foi possível abrir a oferta:', erro)
    return null
  })

  // Produto que saiu do ar (ou endereço inválido): volta para a Loja.
  return redirecionar(link ?? new URL('/loja', request.nextUrl).toString())
}
