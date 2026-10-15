import 'server-only'

import { z } from 'zod'

import { fileStorage, type ArquivoPublico } from '@/services/storage'
import type { AcessoDoArquivo } from '@/types/envio'

// Entrega da foto ORIGINAL (a mesma que está no Storage, sem reprocessar) pelo nosso domínio. O
// endereço `/fotos/<bucket>/<caminho>` é entrada não confiável (skill `seguranca` §5 e §6): só os dois
// buckets públicos entram e o caminho precisa ter cara de arquivo de imagem, sem `..` nem nada estranho.

/** Nome do bucket na URL → acesso. Os buckets são os mesmos de `services/storage/buckets.ts`. */
const acessoDoBucket = {
  'projetos-publico': 'publico',
  'biblioteca-exemplos': 'biblioteca',
} as const satisfies Record<string, AcessoDoArquivo>

const SEGMENTOS_MAXIMOS = 6
const SEGMENTO_TAMANHO_MAXIMO = 160

/** Letras, números, `.`, `_` e `-`; nada de começar com ponto (barra `.` e `..`). */
const segmento = z
  .string()
  .max(SEGMENTO_TAMANHO_MAXIMO)
  .regex(/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/)

const schema = z.object({
  bucket: z
    .enum(['projetos-publico', 'biblioteca-exemplos'])
    .transform((nome) => acessoDoBucket[nome]),
  caminho: z.array(segmento).min(1).max(SEGMENTOS_MAXIMOS),
})

/** Só imagens passam por aqui: este endereço não serve PDF nem qualquer outro tipo de arquivo. */
const ehImagem = (tipo: string) => /^image\/(webp|jpeg|png|avif|gif)\s*(;|$)/i.test(tipo.trim())

/** A foto original, ou `null` se o endereço for inválido, o arquivo não existir ou não for imagem. */
export async function lerFotoOriginal(
  bucket: string,
  caminho: string[],
): Promise<ArquivoPublico | null> {
  const pedido = schema.safeParse({ bucket, caminho })
  if (!pedido.success) return null

  const arquivo = await fileStorage.lerPublico({
    acesso: pedido.data.bucket,
    caminho: pedido.data.caminho.join('/'),
  })
  if (!arquivo || !ehImagem(arquivo.tipo)) return null
  return arquivo
}
