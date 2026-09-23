/** Converte um link do YouTube ou do Vimeo no endereço de embed (para usar em `<iframe>`). */
export function embedDeVideo(url: string): string {
  try {
    const alvo = new URL(url)
    const host = alvo.hostname.toLowerCase().replace(/^www\.|^m\.|^player\./, '')

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${alvo.pathname.slice(1)}?autoplay=1`
    }
    if (host === 'youtube.com') {
      const id = alvo.searchParams.get('v') ?? alvo.pathname.split('/').pop()
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (host === 'vimeo.com') {
      return `https://player.vimeo.com/video/${alvo.pathname.split('/').pop()}?autoplay=1`
    }
    return url
  } catch {
    return url
  }
}
