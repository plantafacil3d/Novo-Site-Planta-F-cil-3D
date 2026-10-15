import type { NextRequest } from 'next/server'

import { lerFotoOriginal } from '@/features/projetos'

// Foto original pelo nosso domínio: o arquivo sai do Storage uma vez, fica guardado no servidor e é
// entregue idêntico, sem cookies do Storage (que impediam a CDN da hospedagem de guardar a cópia).
// Route Handler é endpoint público (skill `seguranca` §9.1): a feature valida bucket e caminho.
// Cache de 1 ano é seguro porque cada foto nova tem nome único (trocar a foto muda o endereço).
const CACHE_LONGO = 'public, max-age=31536000'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bucket: string; caminho: string[] }> },
) {
  const { bucket, caminho } = await params
  const foto = await lerFotoOriginal(bucket, caminho)
  if (!foto) {
    return new Response('Não encontrado', {
      status: 404,
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
  return new Response(foto.conteudo, {
    headers: {
      'Content-Type': foto.tipo,
      'Content-Length': String(foto.conteudo.byteLength),
      'Cache-Control': CACHE_LONGO,
    },
  })
}
