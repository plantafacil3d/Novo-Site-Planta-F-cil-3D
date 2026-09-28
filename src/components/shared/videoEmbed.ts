/** Converte um link do YouTube ou do Vimeo no endereço de embed (para usar em `<iframe>`). */
export type EmbedOptions = {
  hideControls?: boolean
}

/**
 * Além de ocultar a barra de controles, tira o "cartão" de marca do YouTube (título, avatar do
 * canal, compartilhar, assistir mais tarde, vídeo sugerido e logo do YouTube) que aparece quando o
 * autoplay não pega por causa do som — navegadores só deixam autoplay tocar sem interação do
 * usuário se o vídeo começar mudo.
 */
function aplicarModoLimpo(params: URLSearchParams): void {
  params.set('controls', '0')
  params.set('mute', '1')
  params.set('modestbranding', '1')
  params.set('rel', '0')
  params.set('iv_load_policy', '3')
  params.set('disablekb', '1')
  params.set('playsinline', '1')
}

export function embedDeVideo(url: string, options?: EmbedOptions): string {
  try {
    const alvo = new URL(url)
    const host = alvo.hostname.toLowerCase().replace(/^www\.|^m\.|^player\./, '')
    const hideControls = options?.hideControls

    if (host === 'youtu.be') {
      const id = alvo.pathname.slice(1)
      const params = new URLSearchParams()
      params.set('autoplay', '1')
      if (hideControls) aplicarModoLimpo(params)
      return `https://www.youtube.com/embed/${id}?${params.toString()}`
    }
    if (host === 'youtube.com') {
      const id = alvo.searchParams.get('v') ?? alvo.pathname.split('/').pop()
      const params = new URLSearchParams()
      params.set('autoplay', '1')
      if (hideControls) aplicarModoLimpo(params)
      return `https://www.youtube.com/embed/${id}?${params.toString()}`
    }
    if (host === 'vimeo.com') {
      const id = alvo.pathname.split('/').pop()
      const params = new URLSearchParams()
      params.set('autoplay', '1')
      if (hideControls) params.set('controls', '0')
      return `https://player.vimeo.com/video/${id}?${params.toString()}`
    }
    return url
  } catch {
    return url
  }
}

