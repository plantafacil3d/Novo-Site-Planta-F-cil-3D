import type {
  Categoria,
  Complementar,
  ConsultaProjetos,
  ItemGaleria,
  Projeto,
  ProjetoDetalhe,
  TipoProjeto,
} from '@/features/projetos'

import { foto, projetosGerados } from './catalogoDeExemplo'
import { consultarEmMemoria } from './consultaEmMemoria'
import type { ProjetoRepository } from './ProjetoRepository'

// `prefixo` só evita colisão de id entre fotos repetidas (a mesma foto de exemplo usada em mais de
// um lugar da galeria); não é mais uma categoria tipada, já que a galeria pública não filtra por ela.
function itemGaleria(prefixo: string, fotoId: string, alt: string, largura = 1400): ItemGaleria {
  return { id: `${prefixo}-${fotoId}`, imagem: { src: foto(fotoId, largura), alt } }
}

const destaques: Projeto[] = [
  {
    id: 'sobrado-pequeno-moderno-inteligente',
    codigo: 'PF-001',
    slug: 'sobrado-pequeno-moderno-e-inteligente',
    titulo: 'Sobrado Pequeno, Moderno e Inteligente',
    selo: 'Mais vendido',
    imagem: {
      src: foto('1600047509807-ba8f99d2cdde'),
      alt: 'Sobrado moderno com fachada de madeira e vidro e jardim na frente',
    },
    tipo: 'sobrado',
    estilo: 'moderno',
    larguraM: 7,
    profundidadeM: 20,
    areaConstruidaM2: 154,
    suites: 2,
    suiteMaster: 1,
    quartos: 1,
    banheiros: 3,
    lavabo: 1,
    vagas: 2,
    pavimentos: 2,
    piscina: true,
    areaGourmet: false,
    diferencial: { tipo: 'piscina', rotulo: 'Piscina opcional' },
    precoCentavos: 39900,
  },
  {
    id: 'casa-terrea-moderna',
    codigo: 'PF-002',
    slug: 'casa-terrea-moderna',
    titulo: 'Casa Térrea Moderna',
    selo: 'Lançamento',
    imagem: {
      src: foto('1512917774080-9991f1c4c750'),
      alt: 'Casa térrea moderna com grandes vidros e piscina',
    },
    tipo: 'casa-terrea',
    estilo: 'moderno',
    larguraM: 10,
    profundidadeM: 25,
    areaConstruidaM2: 138,
    suites: 1,
    suiteMaster: 0,
    quartos: 3,
    banheiros: 2,
    lavabo: 0,
    vagas: 2,
    pavimentos: 1,
    piscina: false,
    areaGourmet: true,
    diferencial: { tipo: 'varanda-gourmet', rotulo: 'Varanda Gourmet' },
    precoCentavos: 34900,
  },
  {
    id: 'sobrado-com-piscina',
    codigo: 'PF-003',
    slug: 'sobrado-com-piscina',
    titulo: 'Sobrado com Piscina',
    selo: 'Mais vendido',
    imagem: {
      src: foto('1600596542815-ffad4c1539a9'),
      alt: 'Sobrado moderno branco com piscina em primeiro plano',
    },
    tipo: 'sobrado',
    estilo: 'contemporaneo',
    larguraM: 8,
    profundidadeM: 18,
    areaConstruidaM2: 158,
    suites: 3,
    suiteMaster: 1,
    quartos: 1,
    banheiros: 4,
    lavabo: 1,
    vagas: 2,
    pavimentos: 2,
    piscina: true,
    areaGourmet: false,
    diferencial: { tipo: 'piscina', rotulo: 'Piscina' },
    precoCentavos: 49900,
  },
  {
    id: 'casa-terrea-com-2-suites',
    codigo: 'PF-004',
    slug: 'casa-terrea-com-2-suites',
    titulo: 'Casa Térrea com 2 Suítes',
    selo: 'Lançamento',
    imagem: {
      src: foto('1583608205776-bfd35f0d9f83'),
      alt: 'Casa térrea com varanda e telhado inclinado cercada por jardim',
    },
    tipo: 'casa-terrea',
    estilo: 'classico',
    larguraM: 12,
    profundidadeM: 20,
    areaConstruidaM2: 132,
    suites: 2,
    suiteMaster: 1,
    quartos: 1,
    banheiros: 3,
    lavabo: 0,
    vagas: 2,
    pavimentos: 1,
    piscina: false,
    areaGourmet: true,
    diferencial: { tipo: 'varanda-gourmet', rotulo: 'Varanda Gourmet' },
    precoCentavos: 39900,
  },
]

const complementares: Complementar[] = [
  {
    id: 'projeto-estrutural',
    slug: 'projeto-estrutural',
    titulo: 'Projeto Estrutural',
    imagem: {
      src: foto('1541888946425-d81bb19240f5'),
      alt: 'Estrutura de concreto armado em obra com equipe de engenheiros',
    },
    precoCentavos: 24900,
  },
  {
    id: 'projeto-eletrico',
    slug: 'projeto-eletrico',
    titulo: 'Projeto Elétrico',
    imagem: {
      src: foto('1581092160562-40aa08e78837'),
      alt: 'Pessoa desenhando plantas técnicas sobre uma mesa',
    },
    precoCentavos: 19900,
  },
  {
    id: 'projeto-hidraulico',
    slug: 'projeto-hidraulico',
    titulo: 'Projeto Hidráulico',
    imagem: {
      src: foto('1503387762-592deb58ef4e'),
      alt: 'Mãos desenhando uma planta arquitetônica com régua',
    },
    precoCentavos: 19900,
  },
  {
    id: 'projeto-de-interiores',
    slug: 'projeto-de-interiores',
    titulo: 'Projeto de Interiores',
    imagem: {
      src: foto('1618221195710-dd6b41faaea6'),
      alt: 'Sala de estar decorada com sofá cinza e mesa de centro de madeira',
    },
    precoCentavos: 29900,
  },
  {
    id: 'maquete-3d-render',
    slug: 'maquete-3d-render',
    titulo: 'Maquete 3D / Render',
    imagem: {
      src: foto('1613490493576-7fde63acd811'),
      alt: 'Casa moderna branca com piscina, no estilo de uma imagem renderizada',
    },
    precoCentavos: 34900,
  },
  {
    id: 'projeto-de-paisagismo',
    slug: 'projeto-de-paisagismo',
    titulo: 'Projeto de Paisagismo',
    imagem: {
      src: foto('1416331108676-a22ccb276e35'),
      alt: 'Casa com jardim e piscina iluminados à noite',
    },
    precoCentavos: 19900,
  },
]

const categorias: Categoria[] = [
  { slug: 'sobrados', rotulo: 'Sobrados' },
  { slug: 'casas-terreas', rotulo: 'Casas Térreas' },
  { slug: 'casas-pequenas', rotulo: 'Casas Pequenas' },
  { slug: 'casas-de-campo', rotulo: 'Casas de Campo' },
  { slug: 'kitnets', rotulo: 'Kitnets' },
  { slug: 'casas-de-praia', rotulo: 'Casas de Praia' },
  { slug: 'casas-geminadas', rotulo: 'Casas Geminadas' },
  { slug: 'projetos-de-fachada', rotulo: 'Projetos de Fachada' },
  { slug: 'mais', rotulo: 'E muito mais' },
]

const sobradoModerno7x20: ProjetoDetalhe = {
  id: 'sobrado-moderno-7x20',
  codigo: 'PF-005',
  slug: 'sobrado-moderno-7x20',
  tipo: 'sobrado',
  estilo: 'moderno',
  titulo: 'Sobrado Moderno 7x20',
  selo: 'Mais vendido',
  imagem: {
    src: foto('1600047509807-ba8f99d2cdde'),
    alt: 'Fachada do Sobrado Moderno 7x20 com madeira, vidro e jardim na frente',
  },
  larguraM: 7,
  profundidadeM: 20,
  suites: 2,
  suiteMaster: 1,
  quartos: 1,
  banheiros: 3,
  lavabo: 1,
  vagas: 2,
  pavimentos: 2,
  diferencial: { tipo: 'varanda-gourmet', rotulo: 'Varanda Gourmet' },
  precoCentavos: 29990,
  categoriaRotulo: 'Sobrados',
  // TEMPORÁRIO: link de exemplo. Trocar pelo checkout real de cada projeto (Hotmart ou outro).
  checkoutUrl: 'https://pay.hotmart.com/',
  areaConstruidaM2: 158,
  piscina: false,
  closet: true,
  areaGourmet: true,
  resumo: 'Design moderno, funcional e perfeito para o seu terreno.',
  sobre: {
    descricao:
      'O Sobrado Moderno 7x20 foi desenvolvido para quem busca conforto, funcionalidade e um design atual. Com ambientes integrados, excelente ventilação e iluminação natural, o projeto proporciona uma experiência única de bem-estar para toda a família.',
    ambientes:
      'Sala de estar e jantar, cozinha, lavanderia, 2 suítes, 1 quarto, 3 banheiros e área gourmet (opcional).',
    indicadoPara: 'Famílias que buscam conforto, praticidade e um projeto moderno.',
    aplicacoes: 'Terrenos residenciais, condomínios, loteamentos e casas geminadas.',
  },
  galeria: [
    itemGaleria(
      'fachadas',
      '1600047509807-ba8f99d2cdde',
      'Fachada com madeira, vidro e jardim na frente',
    ),
    itemGaleria(
      'fachadas',
      '1600566753190-17f0baa2a6c3',
      'Fachada com painel de madeira, vidro e muro escuro',
    ),
    itemGaleria('fachadas', '1600585154526-990dced4db0d', 'Fachada moderna iluminada ao anoitecer'),
    itemGaleria(
      'fachadas',
      '1564013799919-ab600027ffc6',
      'Casa branca com varanda, palmeiras e piscina',
    ),
    itemGaleria(
      'fachadas',
      '1600596542815-ffad4c1539a9',
      'Sobrado branco com piscina em primeiro plano',
    ),
    itemGaleria(
      'ambientes',
      '1560448204-e02f11c3d0e2',
      'Sala de estar ampla com janelas grandes e sofás claros',
    ),
    itemGaleria(
      'ambientes',
      '1600607687920-4e2a09cf159d',
      'Sala de jantar integrada, com escada ao fundo',
    ),
    itemGaleria(
      'ambientes',
      '1600585152220-90363fe7e115',
      'Cozinha com ilha central e bancos altos',
    ),
    itemGaleria(
      'ambientes',
      '1540518614846-7eded433c457',
      'Suíte com cama de casal e banco aos pés',
    ),
    itemGaleria('ambientes', '1584622650111-993a426fbf0a', 'Banheiro com box de vidro e bancada'),
    itemGaleria('ambientes', '1600210492486-724fe5c67fb0', 'Sala com plantas e luz natural'),
    itemGaleria('plantas', '1581092160562-40aa08e78837', 'Planta baixa desenhada sobre a mesa'),
    itemGaleria('plantas', '1503387762-592deb58ef4e', 'Detalhe de planta arquitetônica com régua'),
    itemGaleria(
      'implantacao',
      '1416331108676-a22ccb276e35',
      'Casa com jardim e áreas externas iluminadas',
    ),
    itemGaleria(
      'implantacao',
      '1613490493576-7fde63acd811',
      'Casa moderna branca com piscina e áreas externas',
    ),
    itemGaleria(
      'detalhes',
      '1600573472550-8090b5e0745e',
      'Escada com corrimão de vidro e vista para a área externa',
    ),
    itemGaleria(
      'detalhes',
      '1484154218962-a197022b5858',
      'Cozinha com bancada, banquetas e eletrodomésticos de inox',
    ),
    itemGaleria('detalhes', '1600566752355-35792bedcfea', 'Banheiro com banheira e janela alta'),
    itemGaleria(
      'imagens-3d',
      '1613490493576-7fde63acd811',
      'Casa moderna branca com piscina, em estilo de imagem 3D',
    ),
    itemGaleria(
      'imagens-3d',
      '1542751371-adc38448a05e',
      'Pessoa diante de um monitor exibindo um ambiente em 3D',
    ),
    itemGaleria(
      'imagens-3d',
      '1600585154340-be6161a56a0c',
      'Casa moderna de dois pavimentos ao entardecer, em estilo de imagem 3D',
    ),
  ],
  // TEMPORÁRIO: vídeo de exemplo. Trocar pelo vídeo real do projeto (link do YouTube ou do Vimeo).
  video: { src: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
  itensInclusos: [
    'Plantas baixas humanizadas e técnicas',
    'Fachadas em alta resolução',
    'Cortes longitudinais e transversais',
    'Implantação do terreno e áreas externas',
    'Arquivos técnicos em PDF e DWG',
    'Imagens 3D realistas',
    'Outros formatos: JPG e PNG',
  ],
  perfil: {
    terrenoMinimo: '7x20 m',
    perfilDoTerreno: 'Plano',
    familia: 'Até 5 pessoas',
    estilo: 'Moderno',
    categoria: 'Sobrados',
  },
}

const rotuloDaCategoria: Record<TipoProjeto, string> = {
  sobrado: 'Sobrados',
  'casa-terrea': 'Casas Térreas',
  'casa-de-campo': 'Casas de Campo',
}

const plural = (quantidade: number, singular: string, plural: string) =>
  `${quantidade} ${quantidade === 1 ? singular : plural}`

/**
 * TEMPORÁRIO: enquanto não há banco, cada projeto em destaque ganha uma página montada com os
 * dados do próprio card (título, medidas, preço, foto) e o restante (galeria, vídeo, textos)
 * emprestado do Sobrado Moderno 7x20.
 */
function detalheDeExemplo(projeto: Projeto): ProjetoDetalhe {
  const base = sobradoModerno7x20

  return {
    ...base,
    ...projeto,
    categoriaRotulo: projeto.tipo ? rotuloDaCategoria[projeto.tipo] : base.categoriaRotulo,
    sobre: {
      ...base.sobre,
      descricao: `O projeto ${projeto.titulo} foi desenvolvido para quem busca conforto, funcionalidade e um design atual. Com ambientes integrados, excelente ventilação e iluminação natural, ele proporciona uma experiência única de bem-estar para toda a família.`,
      ambientes: `Sala de estar e jantar, cozinha, lavanderia, ${plural(projeto.suites, 'suíte', 'suítes')} e ${plural(projeto.quartos, 'quarto', 'quartos')}.`,
    },
    galeria: [{ id: 'fachadas-principal', imagem: projeto.imagem }, ...base.galeria.slice(1)],
    perfil: { ...base.perfil, terrenoMinimo: `${projeto.larguraM}x${projeto.profundidadeM} m` },
  }
}

const detalhes: ProjetoDetalhe[] = [
  sobradoModerno7x20,
  ...destaques.map(detalheDeExemplo),
  ...projetosGerados.map(detalheDeExemplo),
]

/** Só as colunas que a listagem usa, como um `select` de colunas no banco (nunca o detalhe todo). */
function selecionarResumo(projeto: Projeto): Projeto {
  return {
    id: projeto.id,
    codigo: projeto.codigo,
    slug: projeto.slug,
    titulo: projeto.titulo,
    selo: projeto.selo,
    imagem: projeto.imagem,
    tipo: projeto.tipo,
    estilo: projeto.estilo,
    larguraM: projeto.larguraM,
    profundidadeM: projeto.profundidadeM,
    areaConstruidaM2: projeto.areaConstruidaM2,
    suites: projeto.suites,
    suiteMaster: projeto.suiteMaster,
    quartos: projeto.quartos,
    banheiros: projeto.banheiros,
    lavabo: projeto.lavabo,
    vagas: projeto.vagas,
    pavimentos: projeto.pavimentos,
    piscina: projeto.piscina,
    areaGourmet: projeto.areaGourmet,
    diferencial: projeto.diferencial,
    precoCentavos: projeto.precoCentavos,
  }
}

const catalogo: Projeto[] = [...destaques, selecionarResumo(sobradoModerno7x20), ...projetosGerados]

/** Adapter com dados fixos. Trocar por um adapter Supabase = mudar só o index.ts. */
export class InMemoryProjetoRepository implements ProjetoRepository {
  async listarDestaques() {
    return destaques
  }

  async buscarProjetos(consulta: ConsultaProjetos) {
    return consultarEmMemoria(catalogo, consulta)
  }

  async buscarPorSlug(slug: string) {
    return detalhes.find((projeto) => projeto.slug === slug) ?? null
  }

  async listarSlugs() {
    return detalhes.map((projeto) => projeto.slug)
  }

  async listarRelacionados(slug: string) {
    return destaques.filter((projeto) => projeto.slug !== slug)
  }

  async listarComplementares() {
    return complementares
  }

  async listarCategorias() {
    return categorias
  }
}
