import { AppError } from '@/types/erro'

// Roda no NAVEGADOR (usa canvas), antes de a imagem ir ao Storage. Sem regra de negócio: quem chama
// diz o lado máximo e a qualidade (os valores de foto e de planta moram em `cadastro-projeto/rules.ts`).

type Opcoes = {
  /** Lado maior máximo, em pixels. Imagem menor que isto não é tocada. */
  ladoMaximo: number
  /** Qualidade do WebP, de 0 a 1. */
  qualidade: number
}

/**
 * Tamanho final mantendo a proporção. `reduzir` é falso quando a imagem já cabe no limite: nesse caso
 * as dimensões devolvidas são as originais (nunca amplia).
 */
export function dimensoesReduzidas(largura: number, altura: number, ladoMaximo: number) {
  const ladoMaior = Math.max(largura, altura)
  if (ladoMaior <= ladoMaximo) return { largura, altura, reduzir: false }
  const escala = ladoMaximo / ladoMaior
  return {
    largura: Math.max(1, Math.round(largura * escala)),
    altura: Math.max(1, Math.round(altura * escala)),
    reduzir: true,
  }
}

const nomeEmWebp = (nome: string) => `${nome.replace(/\.[^./]+$/, '') || 'imagem'}.webp`

/**
 * Reduz a imagem ao limite e converte para WebP. Se ela já cabe no limite, devolve o MESMO arquivo, sem
 * recomprimir (nada de perda de qualidade à toa). A orientação da foto (EXIF) é respeitada, e o WebP
 * sai sem metadados. Se a conversão falhar, lança `AppError` com a explicação: o arquivo original NUNCA
 * segue adiante no lugar do convertido.
 */
export async function reduzirImagem(arquivo: File, { ladoMaximo, qualidade }: Opcoes): Promise<File> {
  let imagem: ImageBitmap
  try {
    imagem = await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
  } catch {
    throw new AppError('dados_invalidos', 'Não foi possível abrir a imagem. O arquivo pode estar corrompido.')
  }

  try {
    const { largura, altura, reduzir } = dimensoesReduzidas(imagem.width, imagem.height, ladoMaximo)
    if (!reduzir) return arquivo

    const canvas = document.createElement('canvas')
    canvas.width = largura
    canvas.height = altura
    const contexto = canvas.getContext('2d')
    if (!contexto) {
      throw new AppError('falha_inesperada', 'Seu navegador não conseguiu preparar a imagem.')
    }
    contexto.imageSmoothingEnabled = true
    contexto.imageSmoothingQuality = 'high'
    contexto.drawImage(imagem, 0, 0, largura, altura)

    const webp = await new Promise<Blob | null>((resolver) =>
      canvas.toBlob(resolver, 'image/webp', qualidade),
    )
    // Alguns navegadores (o Safari, por exemplo) não gravam WebP e devolvem PNG sem avisar.
    if (!webp || webp.type !== 'image/webp') {
      throw new AppError(
        'falha_inesperada',
        'Seu navegador não conseguiu converter a imagem para WebP. Use o Chrome, o Edge ou o Firefox atualizado.',
      )
    }
    return new File([webp], nomeEmWebp(arquivo.name), {
      type: 'image/webp',
      lastModified: arquivo.lastModified,
    })
  } finally {
    imagem.close()
  }
}
