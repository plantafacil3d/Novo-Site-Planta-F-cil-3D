import type { EstiloArquitetonico, Projeto, SeloProjeto, TipoProjeto } from '@/features/projetos'

// TEMPORÁRIO: fotos de exemplo do Unsplash. Trocar por arquivos em public/ (ex.: '/images/...')
// e remover `images.remotePatterns` do next.config.ts.
export const foto = (id: string, largura = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${largura}&q=75`

// TEMPORÁRIO: projetos gerados só para a listagem ter volume (o suficiente para paginar).
// Somem quando o catálogo real vier do banco.

type Foto = { id: string; alt: string }

const fotosComPiscina: readonly [Foto, ...Foto[]] = [
  { id: '1512917774080-9991f1c4c750', alt: 'Casa térrea moderna com grandes vidros e piscina' },
  { id: '1600596542815-ffad4c1539a9', alt: 'Sobrado moderno branco com piscina em primeiro plano' },
  { id: '1564013799919-ab600027ffc6', alt: 'Casa branca com varanda, palmeiras e piscina' },
  { id: '1613490493576-7fde63acd811', alt: 'Casa moderna branca com piscina' },
  { id: '1416331108676-a22ccb276e35', alt: 'Casa com jardim e piscina iluminados à noite' },
]

const fotosSemPiscina: readonly [Foto, ...Foto[]] = [
  {
    id: '1600047509807-ba8f99d2cdde',
    alt: 'Sobrado moderno com fachada de madeira e vidro e jardim na frente',
  },
  {
    id: '1583608205776-bfd35f0d9f83',
    alt: 'Casa térrea com varanda e telhado inclinado cercada por jardim',
  },
  { id: '1600566753190-17f0baa2a6c3', alt: 'Fachada com painel de madeira, vidro e muro escuro' },
  { id: '1600585154526-990dced4db0d', alt: 'Fachada moderna iluminada ao anoitecer' },
  {
    id: '1600585154340-be6161a56a0c',
    alt: 'Casa moderna de dois pavimentos com vidros e madeira, iluminada ao entardecer',
  },
]

const pavimentosDoTipo: Record<TipoProjeto, number> = {
  sobrado: 2,
  'casa-terrea': 1,
  'casa-de-campo': 1,
}

const nomeDoTipo: Record<TipoProjeto, string> = {
  sobrado: 'Sobrado',
  'casa-terrea': 'Casa Térrea',
  'casa-de-campo': 'Casa de Campo',
}

const adjetivoDoEstilo: Record<EstiloArquitetonico, { masculino: string; feminino: string }> = {
  moderno: { masculino: 'Moderno', feminino: 'Moderna' },
  contemporaneo: { masculino: 'Contemporâneo', feminino: 'Contemporânea' },
  minimalista: { masculino: 'Minimalista', feminino: 'Minimalista' },
  classico: { masculino: 'Clássico', feminino: 'Clássica' },
  rustico: { masculino: 'Rústico', feminino: 'Rústica' },
}

type Linha = readonly [
  tipo: TipoProjeto,
  estilo: EstiloArquitetonico,
  larguraM: number,
  profundidadeM: number,
  suites: number,
  quartos: number,
  vagas: number,
  piscina: boolean,
  areaGourmet: boolean,
  selo?: SeloProjeto,
]

// Todo projeto tem piscina ou área gourmet: o card sempre mostra um diferencial.
const linhas: readonly Linha[] = [
  ['sobrado', 'moderno', 8, 20, 2, 1, 2, false, true, 'Lançamento'],
  ['sobrado', 'contemporaneo', 10, 25, 3, 1, 3, true, true, 'Mais vendido'],
  ['sobrado', 'minimalista', 6, 15, 1, 2, 1, false, true],
  ['sobrado', 'classico', 12, 30, 4, 1, 4, true, true],
  ['sobrado', 'moderno', 9, 18, 2, 2, 2, true, false],
  ['sobrado', 'rustico', 10, 20, 2, 1, 2, false, true],
  ['sobrado', 'contemporaneo', 7, 25, 3, 0, 2, false, true, 'Lançamento'],
  ['sobrado', 'minimalista', 8, 22, 2, 1, 2, true, false],
  ['casa-terrea', 'moderno', 12, 25, 3, 0, 2, true, true, 'Mais vendido'],
  ['casa-terrea', 'minimalista', 8, 15, 1, 2, 1, false, true],
  ['casa-terrea', 'contemporaneo', 10, 20, 2, 1, 2, false, true],
  ['casa-terrea', 'classico', 11, 22, 2, 2, 2, false, true],
  ['casa-terrea', 'rustico', 9, 18, 1, 2, 2, false, true],
  ['casa-terrea', 'moderno', 6, 12, 1, 1, 1, false, true],
  ['casa-terrea', 'minimalista', 7, 18, 1, 2, 1, false, true, 'Lançamento'],
  ['casa-terrea', 'contemporaneo', 15, 30, 4, 0, 3, true, true],
  ['casa-terrea', 'moderno', 10, 30, 3, 1, 2, true, false],
  ['casa-terrea', 'classico', 13, 25, 3, 0, 2, false, true],
  ['casa-de-campo', 'rustico', 15, 30, 3, 1, 3, true, true, 'Mais vendido'],
  ['casa-de-campo', 'rustico', 12, 25, 2, 2, 2, false, true],
  ['casa-de-campo', 'classico', 20, 40, 4, 1, 4, true, true],
  ['casa-de-campo', 'contemporaneo', 14, 28, 3, 0, 2, true, true, 'Lançamento'],
  ['casa-de-campo', 'moderno', 10, 20, 2, 1, 2, true, false],
  ['casa-de-campo', 'minimalista', 9, 20, 2, 0, 2, false, true],
  ['casa-de-campo', 'rustico', 8, 16, 1, 2, 1, false, true],
  ['sobrado', 'moderno', 12, 25, 3, 2, 3, true, true],
  ['sobrado', 'contemporaneo', 8, 25, 2, 2, 2, false, true],
  ['casa-terrea', 'moderno', 9, 20, 2, 1, 2, true, false],
  ['casa-de-campo', 'rustico', 18, 35, 4, 0, 4, true, true],
  ['casa-terrea', 'minimalista', 12, 20, 2, 1, 2, false, true],
]

/** Os cinco projetos escritos à mão ocupam PF-001 a PF-005. */
const PRIMEIRO_NUMERO_GERADO = 6

const slugDe = (titulo: string) =>
  titulo
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function gerarProjeto(linha: Linha, indice: number): Projeto {
  const [
    tipo,
    estilo,
    larguraM,
    profundidadeM,
    suites,
    quartos,
    vagas,
    piscina,
    areaGourmet,
    selo,
  ] = linha
  const pavimentos = pavimentosDoTipo[tipo]
  const areaConstruidaM2 = Math.round(larguraM * profundidadeM * pavimentos * 0.55)
  // Estimativas simples a partir das suítes: casas maiores ganham suíte master e lavabo.
  const suiteMaster = suites >= 3 ? 1 : 0
  const banheiros = suites + 1
  const lavabo = areaGourmet ? 1 : 0
  const adjetivos = adjetivoDoEstilo[estilo]
  const adjetivo = tipo === 'sobrado' ? adjetivos.masculino : adjetivos.feminino
  const complemento = piscina ? ' com Piscina' : areaGourmet ? ' com Área Gourmet' : ''
  const titulo = `${nomeDoTipo[tipo]} ${adjetivo} ${larguraM}x${profundidadeM}${complemento}`
  const fotos = piscina ? fotosComPiscina : fotosSemPiscina
  const imagem = fotos[indice % fotos.length] ?? fotos[0]
  const slug = slugDe(titulo)

  return {
    id: slug,
    codigo: `PF-${String(indice + PRIMEIRO_NUMERO_GERADO).padStart(3, '0')}`,
    slug,
    titulo,
    selo,
    imagem: { src: foto(imagem.id), alt: imagem.alt },
    tipo,
    estilo,
    larguraM,
    profundidadeM,
    areaConstruidaM2,
    suites,
    suiteMaster,
    quartos,
    banheiros,
    lavabo,
    vagas,
    pavimentos,
    piscina,
    areaGourmet,
    diferencial: piscina
      ? { tipo: 'piscina', rotulo: 'Piscina' }
      : { tipo: 'varanda-gourmet', rotulo: 'Varanda Gourmet' },
    // Preço proporcional à área, terminado em ,00 (ex.: 154 m² → R$ 389,00).
    precoCentavos: Math.round((areaConstruidaM2 * 170 + 12000) / 1000) * 1000 - 100,
  }
}

export const projetosGerados: Projeto[] = linhas.map(gerarProjeto)
