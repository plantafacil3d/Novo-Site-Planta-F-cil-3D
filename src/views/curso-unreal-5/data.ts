import type { IconName } from '@/components/ui/Icon'

// TEMPORÁRIO: fotos de exemplo (mesmo padrão da home). Trocar pelas imagens reais do curso em public/.
const fotoAmbiente = {
  src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75',
  alt: 'Ambiente interno renderizado em 3D com iluminação realista',
}
const fotoTela = {
  src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=75',
  alt: 'Pessoa de costas diante de um monitor exibindo um ambiente em 3D',
}

export const hotmartCheckoutUrl = 'https://go.hotmart.com/L97295592K'

export const cursoPreco = {
  original: 'R$ 2.597,00',
  atual: 'R$ 1.297,00',
  /** Só dígitos, para o schema.org (`JsonLd`). */
  atualNumero: '1297.00',
  desconto: '50% OFF',
}

/**
 * "3ds Max" fica sem `icon`: a biblioteca de logos (`simple-icons`) tem marca própria para os
 * outros quatro, mas não para o 3ds Max especificamente (só a genérica da Autodesk, que já
 * aparece dedicada no Revit — usar a mesma aqui confundiria as duas). Aparece como texto na
 * faixa; se o usuário tiver o logo oficial, é só adicionar em `ui/icons/software.tsx`.
 */
export const softwaresCompativeis: { nome: string; icon?: IconName }[] = [
  { nome: 'Blender', icon: 'blender' },
  { nome: '3ds Max' },
  { nome: 'Cinema 4D', icon: 'cinema-4d' },
  { nome: 'Revit', icon: 'revit' },
  { nome: 'SketchUp', icon: 'sketchup' },
]

export const badgesConfianca: { icon: IconName; title: string; description: string }[] = [
  { icon: 'users', title: 'Comunidade exclusiva', description: 'Grupo só de alunos do curso' },
  { icon: 'lock-open', title: 'Acesso imediato', description: 'Comece a estudar na hora' },
  { icon: 'shield-check', title: 'Pagamento seguro', description: 'Ambiente 100% criptografado' },
  { icon: 'languages', title: 'PT, EN e ES', description: 'Legendas em três idiomas' },
]

export type CourseModule = { titulo: string; topicos: string[] }

export const modulosDoCurso: CourseModule[] = [
  {
    titulo: '01. Bem-vindo',
    topicos: ['Unit Setup', 'Exportação Rapid/DataSmith, controlada e FBX'],
  },
  {
    titulo: '02. Preparação',
    topicos: ['Organização do projeto antes de exportar', 'Padrões de exportação'],
  },
  {
    titulo: '03. Importação',
    topicos: ['Download e instalação da Unreal Engine', 'Interface e configurações iniciais'],
  },
  {
    titulo: '04. Primeiros passos',
    topicos: ['Qualidade de viewport', 'Atores: Sunlight, HDRI, Skylight'],
  },
  { titulo: '05. SketchUp', topicos: ['Exportação parte 1', 'Exportação parte 2'] },
  { titulo: '06. Distribuição', topicos: ['Modeling Tools: Pivot, Mesh, UVW, ID de materiais'] },
  {
    titulo: '07. Materiais',
    topicos: ['Base Color, reflexos e roughness', 'Vidro, tecido e paredes realistas'],
  },
  { titulo: '08. Migração', topicos: ['Organização e Migrate', 'Quixel Bridge / FAB'] },
  { titulo: '09. Otimização de luz', topicos: ['Luzes retangulares, spot e IES'] },
  { titulo: '10. Luzes artificiais', topicos: ['Post Process e Color Grading', 'Lumen'] },
  { titulo: '11. Levels', topicos: ['Levels, layers e organização do projeto'] },
  { titulo: '12. Vegetação', topicos: ['Foliage: grama, arbustos e árvores'] },
  {
    titulo: '13. Fotografia',
    topicos: ['Câmeras e settings', 'Render: método CMD e Movie Render Queue'],
  },
  { titulo: '14. Animações', topicos: ['Sequencer e renderização', 'Animação de objetos e luzes'] },
  { titulo: '15. Raytracing', topicos: ['Ray Tracing, Lumen e Path Tracer'] },
  {
    titulo: '16. Blueprints',
    topicos: ['Navegação e colisão', 'Portas, luzes, UI e menu interativo'],
  },
  {
    titulo: '17. Otimização do projeto',
    topicos: ['Geometrias, texturas e luzes', 'Screen Percentage'],
  },
  {
    titulo: '18. Inteligência artificial',
    topicos: ['Ferramentas de IA aplicadas ao fluxo de trabalho'],
  },
  { titulo: '19. Bônus', topicos: ['Studio de produtos', 'Piano House', 'R2 House'] },
]

export const cenasBonus: {
  title: string
  description: string
  image: { src: string; alt: string }
}[] = [
  {
    title: 'Piano House',
    description: 'Cena inspirada em projeto da LINE Architects, pronta para estudo.',
    image: fotoAmbiente,
  },
  {
    title: 'House 02',
    description: 'Cena inspirada na T-House, com materiais e iluminação prontos.',
    image: fotoTela,
  },
  {
    title: 'Studio Car / Produtos',
    description: 'Cena de still com Path Tracer, ideal para portfólio de produto.',
    image: fotoAmbiente,
  },
]

export const oQueVaiAprender: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'monitor-play',
    title: 'Introdução',
    description: 'Instalação, plugins, interface e importação de 3ds Max, Revit e SketchUp.',
  },
  {
    icon: 'sparkles',
    title: 'Iluminação',
    description: 'Luz natural e artificial, Lumen e rebatimentos realistas.',
  },
  {
    icon: 'layout-grid',
    title: 'Materiais',
    description: 'Texturas realistas renderizadas em tempo real.',
  },
  {
    icon: 'house',
    title: 'Cena interna e externa',
    description: 'Dia claro, golden hour, blue hour e luzes artificiais.',
  },
  {
    icon: 'video',
    title: 'Animações',
    description: 'Movie Render Graph, câmera e transições com qualidade cinematográfica.',
  },
  {
    icon: 'chart',
    title: 'Otimização',
    description: 'LODs, Nanite, PCG e texturas otimizadas para performance.',
  },
  {
    icon: 'layers',
    title: 'Tour virtual',
    description: 'Tours interativos com troca de revestimentos, móveis e cores.',
  },
  {
    icon: 'rocket',
    title: '100% atualizado (5.6)',
    description: 'Mega Lights e interface renovada da versão mais recente.',
  },
]

export type Testimonial = { nome: string; texto: string; foto: { src: string; alt: string } }

export const depoimentos: Testimonial[] = [
  {
    nome: 'Luciano D.',
    texto:
      'Vocês são pioneiros do archviz profissional. O curso mudou completamente meu fluxo de trabalho.',
    foto: fotoTela,
  },
  {
    nome: 'Mindows S.',
    texto:
      'Ajudou bastante a desenvolver minha visão em 3D e a entregar projetos muito mais realistas.',
    foto: fotoAmbiente,
  },
  {
    nome: 'Amira C.',
    texto: 'Só queria agradecer: aprendi em semanas o que levaria meses tentando sozinha.',
    foto: fotoTela,
  },
  {
    nome: 'Lucas F.',
    texto:
      'Tenho um testemunho incrível! Consegui meus primeiros clientes de visualização logo após o curso.',
    foto: fotoAmbiente,
  },
]

export const projetosDeAlunos = Array.from({ length: 9 }, (_, indice) => ({
  src: indice % 2 === 0 ? fotoAmbiente.src : fotoTela.src,
  alt: `Projeto de aluno renderizado em Unreal Engine, exemplo ${indice + 1}`,
}))

export const projetosDviz = Array.from({ length: 8 }, (_, indice) => ({
  src: indice % 2 === 0 ? fotoTela.src : fotoAmbiente.src,
  alt: `Projeto profissional da DVIZ, exemplo ${indice + 1}`,
}))

export const publicoAlvo = [
  'Arquitetos e engenheiros que querem apresentar projetos com mais impacto',
  'Freelancers 3D que buscam se diferenciar no mercado',
  'Artistas 3D que já dominam modelagem e querem aprender renderização em tempo real',
  'Estudantes de arquitetura no início de carreira',
  'Quem já usa Blender, 3ds Max, Cinema 4D, Revit ou SketchUp',
  'Quem está começando do zero em visualização arquitetônica',
]

export const beneficiosDoCurso: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'video',
    title: '+60 horas de aulas',
    description: 'Conteúdo gravado, dinâmico e prático',
  },
  {
    icon: 'lock-open',
    title: 'Acesso por 1 ano',
    description: 'Estude no seu ritmo, quando quiser',
  },
  {
    icon: 'users',
    title: 'Comunidade DVIZ',
    description: 'Networking com outros alunos e profissionais',
  },
  { icon: 'languages', title: 'PT, EN e ES', description: 'Curso com legendas em três idiomas' },
  {
    icon: 'globe',
    title: '100% on-line',
    description: 'De qualquer lugar, em qualquer dispositivo',
  },
  { icon: 'gift', title: 'Bônus exclusivos', description: 'Cenas prontas, assets e Studio Car' },
]

export const perguntasFrequentesDoCurso: { pergunta: string; resposta: string }[] = [
  {
    pergunta: 'É uma atualização do antigo curso de Unreal Engine?',
    resposta:
      'Não. É um curso novo, 100% reformulado para a versão 5.6 da Unreal Engine, vendido separadamente do anterior.',
  },
  {
    pergunta: 'Meu computador suporta a Unreal Engine 5.6?',
    resposta:
      'Sem ray tracing, um processador e placa de vídeo intermediários já rodam o curso. Com ray tracing ligado, recomendamos uma placa de vídeo dedicada mais recente e ao menos 16 GB de RAM.',
  },
  {
    pergunta: 'Quais as formas de pagamento?',
    resposta:
      'Cartão de crédito, PayPal, Google Pay e outras formas disponíveis no checkout da Hotmart.',
  },
  {
    pergunta: 'Por quanto tempo tenho acesso ao curso?',
    resposta: '12 meses de acesso completo a partir da data da compra.',
  },
  {
    pergunta: 'Tem suporte durante o curso?',
    resposta: 'Sim, você tem acesso à comunidade exclusiva de alunos e suporte para tirar dúvidas.',
  },
  {
    pergunta: 'As aulas ficam disponíveis para download?',
    resposta: 'Não. Todas as aulas são gravadas e assistidas on-line, direto na plataforma.',
  },
]

export const instrutor = {
  nome: 'Denis Gandra',
  cargo: 'Fundador da DVIZ',
  bio: 'Mais de 20 anos de experiência em visualização arquitetônica. Depois de anos trabalhando com renderização tradicional, se especializou em Unreal Engine para criar experiências em tempo real que encantam clientes e aceleram a aprovação de projetos.',
  foto: fotoTela,
}
