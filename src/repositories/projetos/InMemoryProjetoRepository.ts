import type { Categoria, Complementar, Projeto } from '@/features/projetos'

import type { ProjetoRepository } from './ProjetoRepository'

// TEMPORÁRIO: fotos de exemplo do Unsplash. Trocar por arquivos em public/ (ex.: '/images/...')
// e remover `images.remotePatterns` do next.config.ts.
const foto = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`

const destaques: Projeto[] = [
  {
    id: 'sobrado-pequeno-moderno-inteligente',
    slug: 'sobrado-pequeno-moderno-e-inteligente',
    titulo: 'Sobrado Pequeno, Moderno e Inteligente',
    selo: 'Mais vendido',
    imagem: {
      src: foto('1600047509807-ba8f99d2cdde'),
      alt: 'Sobrado moderno com fachada de madeira e vidro e jardim na frente',
    },
    larguraM: 7,
    profundidadeM: 20,
    suites: 2,
    quartos: 1,
    vagas: 2,
    pavimentos: 2,
    diferencial: { tipo: 'piscina', rotulo: 'Piscina opcional' },
    precoCentavos: 39900,
  },
  {
    id: 'casa-terrea-moderna',
    slug: 'casa-terrea-moderna',
    titulo: 'Casa Térrea Moderna',
    selo: 'Lançamento',
    imagem: {
      src: foto('1512917774080-9991f1c4c750'),
      alt: 'Casa térrea moderna com grandes vidros e piscina',
    },
    larguraM: 10,
    profundidadeM: 25,
    suites: 1,
    quartos: 3,
    vagas: 2,
    pavimentos: 1,
    diferencial: { tipo: 'varanda-gourmet', rotulo: 'Varanda Gourmet' },
    precoCentavos: 34900,
  },
  {
    id: 'sobrado-com-piscina',
    slug: 'sobrado-com-piscina',
    titulo: 'Sobrado com Piscina',
    selo: 'Mais vendido',
    imagem: {
      src: foto('1600596542815-ffad4c1539a9'),
      alt: 'Sobrado moderno branco com piscina em primeiro plano',
    },
    larguraM: 8,
    profundidadeM: 18,
    suites: 3,
    quartos: 1,
    vagas: 2,
    pavimentos: 2,
    diferencial: { tipo: 'piscina', rotulo: 'Piscina' },
    precoCentavos: 49900,
  },
  {
    id: 'casa-terrea-com-2-suites',
    slug: 'casa-terrea-com-2-suites',
    titulo: 'Casa Térrea com 2 Suítes',
    selo: 'Lançamento',
    imagem: {
      src: foto('1583608205776-bfd35f0d9f83'),
      alt: 'Casa térrea com varanda e telhado inclinado cercada por jardim',
    },
    larguraM: 12,
    profundidadeM: 20,
    suites: 2,
    quartos: 1,
    vagas: 2,
    pavimentos: 1,
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
  { slug: 'modernas', rotulo: 'Modernas' },
  { slug: 'com-1-suite', rotulo: 'Com 1 Suíte' },
  { slug: 'com-2-suites', rotulo: 'Com 2 Suítes' },
  { slug: 'com-piscina', rotulo: 'Com Piscina' },
  { slug: 'mais', rotulo: 'E muito mais' },
]

/** Adapter com dados fixos. Trocar por um adapter Supabase = mudar só o index.ts. */
export class InMemoryProjetoRepository implements ProjetoRepository {
  async listarDestaques() {
    return destaques
  }

  async listarComplementares() {
    return complementares
  }

  async listarCategorias() {
    return categorias
  }
}
