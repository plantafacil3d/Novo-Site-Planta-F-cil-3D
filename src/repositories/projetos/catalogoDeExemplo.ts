import type { Categoria, Complementar } from '@/features/projetos'

// TEMPORÁRIO: fotos de exemplo do Unsplash. Trocar por arquivos em public/ (ex.: '/images/...')
// e remover `images.remotePatterns` do next.config.ts.
export const foto = (id: string, largura = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${largura}&q=75`

// TEMPORÁRIO: complementares ainda não têm tabela própria no banco (fica para outra etapa).
export const complementares: Complementar[] = [
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

/** Navegação fixa da home ("Explore por categoria"): um subconjunto curado, com ícone. */
export const categorias: Categoria[] = [
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
