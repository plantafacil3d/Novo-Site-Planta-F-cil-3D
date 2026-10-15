// Endereço do SITE para a foto original (a que as telas cheias mostram sem reprocessar).
//
// O `next.config.mjs` repassa `/fotos/<bucket>/<arquivo>` ao Storage dos buckets públicos. Quem entrega
// é o nosso domínio, então a Hostinger guarda a cópia e os próximos visitantes não gastam banda do
// Supabase. O arquivo sai idêntico ao original (nada de recompressão). Mudou o prefixo aqui, mude lá.

const PREFIXO_DO_STORAGE = '/storage/v1/object/public/'

/** URL pública do Storage vira `/fotos/...`; qualquer outro endereço (ou caminho relativo) segue como veio. */
export function enderecoDaFotoOriginal(src: string): string {
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return src
  }
  if (!url.pathname.startsWith(PREFIXO_DO_STORAGE)) return src
  return `/fotos/${url.pathname.slice(PREFIXO_DO_STORAGE.length)}`
}
