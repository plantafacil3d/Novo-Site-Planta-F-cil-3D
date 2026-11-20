// Regras do avatar dos depoimentos (iniciais e cor). Ficam num arquivo próprio, sem nenhuma importação,
// e não em `rules.ts`: o `DepoimentosDeClientes` roda no navegador, e `rules.ts` importa o índice de
// `cadastro-projeto` (que carrega código só de servidor), o que quebraria o carregamento da página.

const TONS_DOS_AVATARES = ['green', 'blue', 'amber'] as const

export type TomDoAvatar = (typeof TONS_DOS_AVATARES)[number] | 'instagram'

/** Perfil do Instagram: o nome começa com "@". O avatar dele usa o degradê da marca. */
export function ehPerfilDoInstagram(nome: string): boolean {
  return nome.trim().startsWith('@')
}

/**
 * Tom do avatar de cada nome, na ordem da lista: verde, azul e âmbar se alternam; o perfil do Instagram
 * sempre ganha o degradê da marca e não gasta um tom da alternância.
 */
export function tonsDosAvatares(nomes: string[]): TomDoAvatar[] {
  let proximo = 0
  return nomes.map((nome) => {
    if (ehPerfilDoInstagram(nome)) return 'instagram'
    const tom = TONS_DOS_AVATARES[proximo % TONS_DOS_AVATARES.length] ?? 'green'
    proximo += 1
    return tom
  })
}

/** Iniciais do avatar de um depoimento: "Marcos A." → "MA", "Ana" → "A", "@plantafacil3d" → "IG". */
export function iniciaisDoNome(nome: string): string {
  if (ehPerfilDoInstagram(nome)) return 'IG'
  return nome
    .trim()
    .split(/\s+/)
    .filter((palavra) => palavra !== '')
    .slice(0, 2)
    .map((palavra) => palavra.charAt(0).toUpperCase())
    .join('')
}

/** Iniciais de onde o sorteio da faixa de prova social tira as suas (pares comuns de nomes no Brasil). */
const INICIAIS_SORTEAVEIS = [
  'MA',
  'JS',
  'RO',
  'AC',
  'LF',
  'PH',
  'CS',
  'GM',
  'BR',
  'TL',
  'VN',
  'EF',
  'DM',
  'KS',
  'RA',
  'JP',
  'AL',
  'FS',
  'LM',
  'CR',
] as const

/** Número "aleatório" de 0 a 1 que depende só da semente: o mesmo projeto sorteia sempre igual. */
function sorteador(semente: string): () => number {
  let estado = 2166136261
  for (const letra of semente) estado = Math.imul(estado ^ letra.charCodeAt(0), 16777619)
  return () => {
    estado = Math.imul(estado ^ (estado >>> 15), 2246822507)
    estado = Math.imul(estado ^ (estado >>> 13), 3266489909)
    estado ^= estado >>> 16
    return (estado >>> 0) / 4294967296
  }
}

/**
 * Três avatares decorativos da faixa "N clientes já compraram este projeto": iniciais diferentes e os
 * três tons (verde, azul, âmbar) numa ordem sorteada. O sorteio sai da `semente` (o slug do projeto), e
 * não de `Math.random`: cada projeto tem o seu, mas ele não muda a cada visita (nem entre o servidor e
 * o navegador).
 */
export function avataresSorteados(
  semente: string,
): { iniciais: string; tom: (typeof TONS_DOS_AVATARES)[number] }[] {
  const aleatorio = sorteador(semente)
  const embaralhar = <T>(lista: readonly T[]) =>
    lista
      .map((item) => ({ item, ordem: aleatorio() }))
      .sort((a, b) => a.ordem - b.ordem)
      .map(({ item }) => item)
  const iniciais = embaralhar(INICIAIS_SORTEAVEIS).slice(0, 3)
  const tons = embaralhar(TONS_DOS_AVATARES)
  return iniciais.map((sigla, indice) => ({ iniciais: sigla, tom: tons[indice] ?? 'green' }))
}
