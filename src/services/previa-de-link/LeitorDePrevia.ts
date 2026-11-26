/** Foto encontrada na página do link, já baixada. */
export type FotoDaPrevia = {
  /** Conteúdo em base64 (vai do servidor para a tela, que reduz e envia como as outras fotos). */
  base64: string
  /** `image/webp`, `image/jpeg` ou `image/png`. */
  tipo: string
}

/** O que a página de um link diz sobre si mesma (as "prévias" usadas por apps de mensagem). */
export type PreviaDoLink = {
  titulo: string | null
  foto: FotoDaPrevia | null
}

/**
 * Lê a prévia de um link externo (título e foto). Usado só no servidor. Devolve `null` quando a
 * página não pôde ser lida (fora do ar, bloqueou, endereço interno, tempo esgotado...).
 */
export interface LeitorDePrevia {
  ler(link: string): Promise<PreviaDoLink | null>
}
