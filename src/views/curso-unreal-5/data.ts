import type { IconName } from '@/components/ui/Icon'

/**
 * Conteúdo do curso de Unreal Engine 5.6 para Archviz, do parceiro DVIZ (Denis Gandra).
 * Textos transcritos da página de vendas original enviada pelo parceiro. Onde o conteúdo
 * aparecia fechado (accordion/FAQ) na imagem de referência e não há a resposta em nenhuma
 * outra parte da página, o texto fica sinalizado com TODO para confirmação com o parceiro.
 */

// Link de checkout Hotmart do curso de Unreal Engine 5.6 (parceiro DVIZ).
export const linkDeCompra = 'https://pay.hotmart.com/X70575954S?off=zyoif61m&ref=L97295592K&bid=1790609860755'

// TODO: colar o link do YouTube do vídeo "NOVO Curso de Unreal Engine 5.6".
export const linkVideoHero = 'https://www.youtube.com/watch?v=AhjhjsUPkVU'
export const linkVideoAlunos = 'https://www.youtube.com/watch?v=vKhaK1cpPpo'

export const heroCopy = {
  quote: 'O mercado já mudou. A pergunta é: você vai mudar junto ou ficar pra trás?',
  headline: 'Domine a Unreal Engine 5.6 e leve suas visualizações ao extraordinário',
  description:
    'Curso completo e 100% atualizado para artistas 3D e arquitetos que querem criar cenas ultrarrealistas, interativas e em tempo real com Unreal Engine.',
  ctaLabel: 'Garantir Minha Vaga Agora',
  softwareLabel: 'Compatível com os principais softwares da área:',
}

export type SoftwareCompativel = { nome: string; logo: string }

/**
 * Logos oficiais em `public/images/curso-unreal-5/logos/`, baixados do Wikimedia Commons
 * (licença de uso da marca para fins de identificação/compatibilidade, não redistribuição).
 */
export const softwaresCompativeis: SoftwareCompativel[] = [
  { nome: '3ds Max', logo: '/images/curso-unreal-5/logos/3ds-max.svg' },
  { nome: 'SketchUp', logo: '/images/curso-unreal-5/logos/sketchup.svg' },
  { nome: 'Autodesk', logo: '/images/curso-unreal-5/logos/autodesk.svg' },
  { nome: 'Revit', logo: '/images/curso-unreal-5/logos/revit.svg' },
  { nome: 'Blender', logo: '/images/curso-unreal-5/logos/blender.svg' },
  { nome: 'Cinema 4D', logo: '/images/curso-unreal-5/logos/cinema-4d.webp' },
]

export const selosDeConfiancaHero: { icon: IconName; label: string }[] = [
  { icon: 'users', label: 'Comunidade Exclusiva' },
  { icon: 'lock-open', label: 'Acesso Imediato' },
  { icon: 'shield-check', label: 'Pagamento Seguro' },
  { icon: 'languages', label: 'Áudio Inglês, Português e Espanhol' },
]

export const cartoesDeDestaque: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'move-horizontal',
    title: 'Crie interações nos seus projetos.',
    description:
      'Torne cada apresentação uma experiência memorável com conceitos avançados de Blueprint aplicados ao Archviz.',
  },
  {
    icon: 'sparkles',
    title: 'Um curso 100% aprimorado',
    description:
      'O novo Curso de Unreal Engine 5.6 para Archviz foi totalmente reformulado e está repleto de aprimoramentos projetados para ajudá-lo a trabalhar de forma mais rápida e inteligente.',
  },
]

export const destaqueMercado = {
  badge: 'Unreal Engine 5.6',
  // Peso misto no original: só o trecho do meio é negrito, o resto é regular.
  titleBefore: 'Destaque-se no mercado com as tecnologias ',
  titleStrong: 'mais avançadas da Unreal Engine 5.6',
  titleAfter: ' para o mercado Archviz!',
  paragraphs: [
    'O mundo da visualização arquitetônica mudou e a Unreal Engine 5.6 chegou para elevar ainda mais o padrão. Com novas ferramentas para criação procedural, animações mais inteligentes e melhorias no fluxo de trabalho, agora você pode produzir visualizações e experiências interativas com rapidez, precisão e um realismo sem precedentes.',
    'E o melhor: não importa se você está começando agora ou já tem experiência, nosso método foi atualizado para ser prático, acessível e compatível com os principais softwares do mercado, para que qualquer artista 3D possa dominar a Unreal e transformar seu trabalho em algo valioso e vendável no mercado 3d para arquitetura.',
    'Estamos vivendo o maior avanço da história da visualização em tempo real.',
    'É a hora de se destacar, dominar as novas possibilidades e conquistar seu espaço com cenas cada vez mais impressionantes, inteligentes e dinâmicas.',
  ],
  closing:
    'Não perca mais tempo: seja pioneiro nessa nova era da Unreal Engine 5.6 e leve seus projetos a um novo nível!',
  cardTitle: 'Unreal Engine',
  cardDescription:
    'O motor que te leva além do comum e acompanha o ritmo dos profissionais mais ambiciosos.',
}

export const destaqueAccordion: { title: string; content: string }[] = [
  {
    title: 'Sem tempo?',
    content:
      'Com as ferramentas certas e um método comprovado por mais de 5 mil alunos do mundo todo, o que antes levava anos para aprender em Archviz agora pode ser dominado em semanas, ou até dias.',
  },
  {
    // TODO: confirmar texto real com o parceiro (DVIZ) — conteúdo fechado na imagem de referência.
    title: 'Vantagens de ser um mestre em 3D Archviz!',
    content:
      'Profissionais que dominam a Unreal Engine para Archviz se destacam com entregas mais rápidas, projetos mais realistas e maior valor cobrado pelo trabalho.',
  },
  {
    title: 'Desbloqueie sua criatividade',
    content:
      'Com o fluxo de trabalho em tempo real, você testa ideias, luzes e materiais na hora, sem esperar renderização para ver o resultado.',
  },
  {
    title: 'Mais liberdade que trabalhar na praia',
    content:
      'Todo o curso é online e fica disponível na plataforma, então você estuda e trabalha de onde quiser, no seu ritmo.',
  },
  {
    title: 'A cereja do bolo',
    content:
      'Além das aulas, você recebe cenas e materiais prontos para estudar e reaproveitar nos seus próprios projetos.',
  },
  {
    title: 'O único erro é não começar',
    content:
      'O curso foi pensado para quem nunca abriu a Unreal Engine: começamos do zero, passo a passo, até as técnicas mais avançadas.',
  },
  {
    title: 'E o software? Gratuito.',
    content:
      'A Unreal Engine é gratuita para uso em visualização arquitetônica — você não precisa pagar licença nenhuma para usar o que vai aprender no curso.',
  },
]

export type ModuloDoCurso = {
  numero: string
  titulo: string
  /** Duração total do módulo (ex.: "1h 20m"), mostrada ao lado de "Conteúdo programático". */
  duracao?: string
  /**
   * Aulas do módulo, na ordem. Opcional: enquanto não vier do parceiro (DVIZ), o módulo abre
   * mostrando "Conteúdo em breve" em vez de quebrar com uma lista vazia.
   */
  conteudoProgramatico?: string[]
}

export const modulosDoCurso: ModuloDoCurso[] = [
  {
    numero: '01',
    titulo: 'Bem Vindo',
    duracao: '1h 20m',
    conteudoProgramatico: [
      'Boas-vindas à nova era da Unreal Engine 5.6',
      'Como aproveitar 100% da nossa metodologia e plataforma',
      'Acesso à Comunidade Exclusiva DVIZ e canais de suporte',
      'Requisitos de hardware e configurações recomendadas',
    ],
  },
  {
    numero: '02',
    titulo: 'Preparação dos arquivos',
    conteudoProgramatico: [
      'Unit Setup / Pivot',
      'Exportação Rápida/Data Smith',
      'Exportação Controlada – Intro',
      'Exportação Controlada – Layer e Mapeamento',
      'Exportação Controlada – Pivot',
      'Exportação FBX',
    ],
  },
  {
    numero: '03',
    titulo: 'Unreal / Importação de Arquivos (Download)',
    conteudoProgramatico: [
      'Download/Instalação Unreal',
      'Unreal Interface',
      'Configurando Unreal / Ray tracing',
    ],
  },
  {
    numero: '04',
    titulo: 'Primeiros Passos para o ser o Mestre do realismo',
    conteudoProgramatico: [
      'Ajustes de Qualidade Viewport',
      'Importando seu projeto de qualquer Software (Datasmith)',
      'Atores da Cena e Organização',
      'Atores Sun Light',
      'Atores HDRI Backdrop',
      'Atores Sky Light',
      'Luzes Artificiais e Direcional',
      'Post Process',
    ],
  },
  {
    numero: '05',
    titulo: 'Diversos',
    conteudoProgramatico: [
      'Introdução ao Sketchup para Unreal',
      'Exportando do Sketchup Parte 1',
      'Exportando do Sketchup Parte 2',
      'Finalização do Módulo',
    ],
  },
  {
    numero: '06',
    titulo: 'Importação e Distribuição',
    conteudoProgramatico: [
      'Bem-vindo',
      'Distribuição na Cena',
      'Modeling Tools – Overview',
      'Modeling Tools – Pivot',
      'Modeling Tools – Ajustes de Mesh',
      'Modeling Tools – UVW Mapping',
      'Modeling Tools – ID Materials',
      'Conclusão de módulo / Boas Práticas',
    ],
  },
  {
    numero: '07',
    titulo: 'Materiais Realistas (de verdade)',
    conteudoProgramatico: [
      'Materiais – Introdução',
      'Overview e Base Color',
      'Reflexos, Roughness, Specular',
      'Aplicando Texturas',
      'Brilho, Contraste, Saturação',
      'Vidro Realista',
      'Material com Máscara',
      'Controles UV',
      'Normal/Bump – Canais',
      'Material Matriz (serve para quase tudo)',
      'Grupos',
      'Tecido Realista',
      'Paredes Realistas',
      'Diversos',
      'Encerramento',
    ],
  },
  {
    numero: '08',
    titulo: 'Migração de Arquivos/ Biblioteca/ Packs',
    conteudoProgramatico: [
      'Introdução',
      'Organização',
      'Migrate Parte 1',
      'Migrando Parte 2',
      'Packs e Recursos',
      'Fluxo de trabalho – Parte 1',
      'Fluxo de trabalho – Parte 2',
      'Quixel Bridge / FAB',
      'Fluxo de trabalho – Parte 3',
      'Conclusão de Módulo',
    ],
  },
  {
    numero: '09',
    titulo: 'Otimização',
    conteudoProgramatico: [
      'Introdução',
      'Luzes retangulares (Quando usar)',
      'Luzes – Spot',
      'IES',
      'Conclusão',
    ],
  },
  {
    numero: '10',
    titulo: 'Luzes Artificiais (A Mágica da sensação)',
    conteudoProgramatico: [
      'Post Process – Conceitos',
      'Post Process – Color Grading',
      'Qualidade Máxima com Lumen – Parte 1',
      'Qualidade Máxima com Lumen – Parte 2',
    ],
  },
  {
    numero: '11',
    titulo: 'A Importância dos Levels',
    conteudoProgramatico: ['Levels, Layers e Organização'],
  },
  {
    numero: '12',
    titulo: 'Vegetações Realistas',
    conteudoProgramatico: [
      'Foliage Parte 1 – Grama Realista',
      'Foliage Parte 2 – Arbustos Realistas',
      'Foliage Parte 3 – Árvores Realistas',
      'Colocando em prática todos os conceitos do curso',
      'Conclusão de módulo (Arquivo Final)',
    ],
  },
  {
    numero: '13',
    titulo: 'Conceitos de fotografia/ Câmeras incríveis',
    conteudoProgramatico: [
      'Câmeras',
      'Settings e Fotografia',
      'Criando as Câmeras Incríveis',
      'Render Max Quality – Método 1 + CMD',
      'Render – Método 2 (MRQ)',
    ],
  },
  {
    numero: '14',
    titulo: 'Anime como um profissional',
    conteudoProgramatico: [
      'Introdução',
      'Sequence – Conceitos e animação',
      'Sequence – Animação e Renderização',
      'Sequence – Animação de Objetos e Luzes',
      'Animação – Qualidade Render Animação em alta Lumen',
    ],
  },
  {
    numero: '15',
    titulo: 'Raytracing',
    conteudoProgramatico: [
      'Ray Tracing – Introdução',
      'Lumen + Raytracing',
      'Path Tracer + MRQ',
      'Conclusão de Módulo',
    ],
  },
  {
    numero: '16',
    titulo: 'Blueprints - A mágica da interatividade',
    conteudoProgramatico: [
      'Apresentação do módulo',
      'Introdução',
      'Navegação e Colisão',
      'First Person',
      'Inputs',
      'Simple Door',
      'Sliding Door',
      'Animação Cortina',
      'Primeira Pessoa Interativa',
      'TV Interativa',
      'Acender e apagar luzes',
      'Água caindo da torneira',
      'Mudar cor de paredes',
      'Mudar Mobiliários (irmãos à obra)',
      'Interface do usuário',
      'Crosshair',
      'Menu Inicial do projeto',
      'Menu Lateral',
      'Animando Botões',
      'Tela de Loading',
      'Funções dos botões',
      'Pause',
      'Mudar Iluminação do Cenário',
    ],
  },
  {
    numero: '17',
    titulo: 'Otimização de projeto (Rode em qualquer Máquina)',
    conteudoProgramatico: [
      'Bem-vindo',
      'Introdução',
      'Otimização – Geometrias',
      'Otimização – Texturas',
      'Otimização – Lights',
      'Otimização – Screen Percentage',
      'Otimização – Conclusão',
    ],
  },
  { numero: '18', titulo: 'Inteligencia Artificial' },
  {
    numero: '19',
    titulo: 'Bônus',
    conteudoProgramatico: ['Estúdio de produtos', 'Piano House', 'R2 House finalizada'],
  },
]

export const curriculoIntro = {
  badge: 'Conteúdo do curso 🔥',
  // Peso misto igual ao de destaqueMercado: só o trecho do meio é negrito, o resto é regular.
  titleBefore: 'Veja por que este curso é ',
  titleStrong: 'o mais completo e atualizado',
  titleAfter: ' para quem quer dominar a Unreal Engine 5.6 no mercado de arquitetura.',
  paragraphs: [
    'Com mais de 60 horas de conteúdo, você vai aprender de forma dinâmica, prática e detalhada, unindo teoria e técnica para transformar sua maneira de trabalhar.',
    'E o melhor: não importa se você nunca abriu o Unreal antes, começamos do absoluto zero, desde a instalação e configuração inicial, até as técnicas mais avançadas com a versão 5.6.',
    'Seja bem-vindo a uma experiência prática, imersiva e atualizada para transformar você em um profissional requisitado no Archviz.',
  ],
  highlight: 'Com a Unreal Engine 5.6, o limite agora é só a sua imaginação.',
}

export const entrarNaTurmaCta = {
  titleBefore: 'As aulas da DVIZ por si só já transformaram a ',
  titleStrong: 'carreira de milhares de artistas 3D.',
  description:
    'Mas eu quero que a sua experiência vá além do esperado, por isso, preparei bônus exclusivos para levar seu aprendizado ainda mais longe.',
  ctaLabel: 'Entrar agora na turma UE5.6',
}

export type BlocoAprendizado = { icon: IconName; title: string; description: string; image: string }

export const blocosDeAprendizado: BlocoAprendizado[] = [
  {
    icon: 'monitor-play',
    title: 'Introdução',
    description:
      'Vamos Começar?! E é exatamente aqui que vamos dar o pontapé inicial. Nesta etapa, você vai aprender onde baixar, como instalar o software, plugins que iremos utilizar, configurar... Além disso, vai compreender como criar um projeto dentro do Unreal, importar projetos em 3dsmax, em Revit, Sketchup, explorando sua interface, comandos de navegação, estrutura de arquivos e muito mais!!! Nesse módulo, vou te mostrar como é fácil, intuitivo e incrível usar a Unreal.',
    image: '/images/curso-unreal-5/aprender/introducao.webp',
  },
  {
    icon: 'sparkles',
    title: 'Iluminação',
    description:
      '"A luz é o caminho"! É crucial dominar a arte de criar, configurar e ajustar a iluminação corretamente em nossas cenas 3D. Ajustar a Luz natural, luz artificial, rebatimentos... Vamos aprender juntos a como dominar O Lumen, que desenvolvida pela Epic Games e presente no Unreal Engine, essa tecnologia está revolucionando como fazemos 3d para arquitetura. O lumen irá surpreender você com resultados incríveis, realista e em tempo real, sem render! Sabe o mais legal? Vou te mostrar como fazer e dominar essa tecnologia!',
    image: '/images/curso-unreal-5/aprender/iluminacao.webp',
  },
  {
    icon: 'layout-grid',
    title: 'Materiais',
    description:
      'Descubra o segredo da renderização realista no Unreal! Aprenda a representar texturas da vida real em tempo real, sem renderização, com resultados incrivelmente realistas. Domine a criação de materiais do zero. Esse novo projeto é baseado na icônica House 02, totalmente regravado com as funcionalidades atuais.',
    image: '/images/curso-unreal-5/aprender/materiais.webp',
  },
  {
    icon: 'house',
    title: 'Cena Interna e externa',
    description:
      'Você irá aprender na prática a iluminar e configurar a luz em uma cena que abrange tanto o ambiente externo com luz natural (Clear Day, Morning, Golden Hour, Blue Hour), quanto o interno com luzes artificiais, tudo em um único projeto. Esteja preparado para criar uma atmosfera magnífica e envolvente em qualquer projeto, independentemente da luz e ambiente.',
    image: '/images/curso-unreal-5/aprender/cena-interna-externa.webp',
  },
  {
    icon: 'video',
    title: 'Animações',
    description:
      'Prepare-se para uma experiência realmente disruptiva com a Unreal Engine 5.6, muito além das renderizações estáticas. Aqui, você vai dominar animações completas em tempo real, aproveitando os novos recursos do Movie Render Graph, que agora está ainda mais poderoso e personalizável. Você aprenderá a criar movimentos de câmera, transições fluidas, elementos animados, efeitos de luz dinâmicos e muito mais, tudo com qualidade cinematográfica e sem precisar perder horas renderizando.',
    image: '/images/curso-unreal-5/aprender/animacoes.webp',
  },
  {
    icon: 'chart',
    title: 'Otimização',
    description:
      'Você também vai descobrir como otimizar suas cenas para que rodem com o máximo de desempenho, sem travar ou comprometer a qualidade visual. Com as técnicas certas, como: LODs, Nanite aprimorado, PCG para elementos procedurais e texturas otimizadas, você garantirá cenas rápidas, estáveis e impressionantes, mesmo nos projetos mais exigentes.',
    image: '/images/curso-unreal-5/aprender/otimizacao.webp',
  },
  {
    icon: 'layers',
    title: 'Tour Virtual',
    description:
      'Transporte seus clientes para ambientes imersivos e interativos, onde eles podem controlar a iluminação, alterar móveis e revestimentos, tudo em tempo real! No curso Unreal Engine for Archviz, você aprenderá a criar Tours Virtuais Interativos, realistas e envolventes. Encante seus clientes, impulsione seus lucros e destaque-se no mercado como referência em Tours Virtuais. Ensinaremos a criar menus interativos, trocar revestimentos, controlar luzes, alterar cores, abrir portas, interagir com objetos e muito mais!',
    image: '/images/curso-unreal-5/aprender/tour-virtual.webp',
  },
  {
    icon: 'rocket',
    title: '100% Atualizado para a versão 5.6 em diante',
    description:
      'Tenha acesso a tudo o que há de mais novo no Unreal Engine: Mega Lights (iluminação avançada para cenas hiper-realistas), United Sofisticado (mais performance e otimização), Patrick Melhorado (render com qualidade ainda maior) e Interface Renovada (já adaptada às mudanças da versão 5.6).',
    image: '/images/curso-unreal-5/aprender/atualizado-5-6.webp',
  },
]

export type Depoimento = { quote: string; name: string; role: string }

export const depoimentos: Depoimento[] = [
  {
    quote:
      'I think you are the pioneers of proffessional archviz education in Unreal. Now my company makes a lot of 3dsmax/corona static rendering but future is the interactivity. After Dviz training we are ready to make it and first opinions about new media are entusiasthic. In scope of future 1 hour of UE education is more valuable than 10 hours of static rendering training.',
    name: 'Luciano D.',
    role: 'Aluno',
  },
  {
    quote:
      'Dviz ajudou bastante na minha visão de 3D, aprender Unreal foi como transcender os meus projetos. Consegui um grande trabalho com o Standard Bank graças a estes conhecimentos. De momento estou focado em fazer projetos de amostra para infestar e dominar o mercado. Como sempre digo "Dviz é qualidade" e nunca decepciona.',
    name: 'Mindows S.',
    role: 'Aluno',
  },
  {
    quote:
      'Hey denis, I just wanted to thank you so much for that course, it’s incredible it’s worth much more you’re an awesome teacher and artist, surely I’m already on class 13, won’t get your graphic result, as I only have gtx1060 but I learned a lot and will surely recommend it for my friends!',
    name: 'Amira C.',
    role: 'Aluna',
  },
  {
    quote:
      'Cara tenho um testemunho incrível !! Comprei seu curso mais ou menos na época que vc lançou, mudou o jogo pra mim cara hj trabalho em um escritório de arquitetura aqui do Brasil, como especialista em unreal tem sido um tempo maravilhoso!!',
    name: 'Lucas F.',
    role: 'Aluno',
  },
]

export const secaoVideoAlunos = {
  badge: 'Resultados comprovados🎊',
  title: 'Veja alguns projetos feito por alunos do curso Unreal Engine 5',
}

export const secaoProjetosAprender = {
  title: 'Projetos que você vai aprender em nosso treinamento!',
  description:
    'Não é foto, é 3D! Vamos juntos buscar o realismo em tempo real tão desejado pelo mercado de Archviz',
  overlay: {
    title: 'Sem render e de graça!',
    description: 'Crie animações infinitas com qualidade cinematográfica.',
  },
}

/** Nomes de arquivo em `public/images/curso-unreal-5/mosaico/` (upload manual). */
export const imagensMosaico = Array.from(
  { length: 9 },
  (_, i) => `/images/curso-unreal-5/mosaico/${i + 1}.webp`,
)

/** Nomes de arquivo em `public/images/curso-unreal-5/tira/` (upload manual). */
export const imagensTira = Array.from(
  { length: 8 },
  (_, i) => `/images/curso-unreal-5/tira/${i + 1}.webp`,
)

export const secaoReferencia = {
  title: 'Aprenda com quem é referência no mercado em projetos realistas!',
  description: 'A DVIZ é responsável por inúmeros projetos desenvolvidos em todo o mundo!',
}

export const publicoAlvo = {
  badge: 'O curso é para você? 👇',
  titleStrong: 'Para quem é',
  titleAfter: ' o curso?',
  paragraphs: [
    'O treinamento foi criado para ser prático e entregar resultados reais, independentemente do seu nível de experiência. Com uma metodologia única e um passo a passo didático, qualquer pessoa pode aprender do zero e dominar as técnicas aplicadas para criar imagens e animações impressionantes em tempo real no UE 5.6.',
    'Os módulos do curso são projetados de forma inclusiva, garantindo que artistas 3D possam elevar a qualidade de seus renders e criar imagens realistas, enquanto arquitetos e designers de interiores poderão aprimorar a apresentação de seus projetos para conquistar clientes de alto nível. Foque no que realmente faz a diferença para prender a atenção do seu público-alvo.',
  ],
}

export const publicoAlvoItens: { icon: IconName; label: string }[] = [
  { icon: 'search', label: 'Começando' },
  { icon: 'house', label: 'Arquitetos' },
  { icon: 'wrench', label: 'Engenheiros' },
  { icon: 'user', label: 'Freelancer 3D' },
  { icon: 'box', label: '3D artistas' },
]

export const areaDeMembros = {
  title: 'Nova área de membros',
  description:
    'Seu acesso será feito por uma nova e incrível área de membros. Criada para que você tenha uma experiencia de aprendizado completa e imersiva.',
  ctaLabel: 'Entrar agora na turma UE5',
  mockupImage: '/images/curso-unreal-5/membros/mockup.png',
}

type BeneficioDoCurso = {
  icon: IconName
  title: string
  description: string
  /** Bandeirinhas ao lado do título (ex.: idiomas disponíveis). */
  flags?: IconName[]
}

export const beneficiosDoCurso = {
  badge: 'Benefícios do curso 🚀',
  titleBefore: 'O que está ',
  titleStrong: 'incluso no curso?',
  itens: [
    {
      icon: 'video' as IconName,
      title: 'Mais de 60 horas de aulas gravadas 🎬',
      description:
        'Para você se tornar um artista de destaque neste mercado Fantástico do 3D para archviz',
    },
    {
      icon: 'lock-open' as IconName,
      title: 'Acesso 🔓',
      description: 'As aulas ficam disponíveis na plataforma, dentro do período de um ano.',
    },
    {
      icon: 'users' as IconName,
      title: 'Fará parte da Comunidade DVIZ 💎',
      description: 'Um espaço para você fazer networking, tirar suas dúvidas e trocar experiências.',
    },
    {
      icon: 'languages' as IconName,
      title: 'Inglês • Português • Espanhol',
      flags: ['flag-us', 'flag-br', 'flag-es'],
      description:
        'Áudios em inglês, português e espanhol disponíveis para todas as aulas (legendas com tradução automática para outros idiomas).',
    },
    {
      icon: 'globe' as IconName,
      title: '100% on-line 🌐',
      description:
        'Você pode visualizar e treinar as aulas quantas vezes quiser, de onde preferir e em qualquer dispositivo.',
    },
    {
      icon: 'trophy' as IconName,
      title: 'Suporte exclusivos 🏆',
      description:
        'Você terá um canal de suporte exclusivo para entrar em contato conosco, tirar dúvidas e ser ajudado durante o curso.',
    },
    {
      icon: 'gift' as IconName,
      title: 'Bônus Exclusivos 🎁',
      description:
        'Além do curso, você garante bônus exclusivos: Duas cenas Realistas: Piano House e House G2 + Studio Car/Produtos com + Assets Exclusivos prontos para uso.',
    },
  ] satisfies BeneficioDoCurso[],
}

export const instrutor = {
  greeting: 'Olá meu amigo, aqui é o Denis Gandra sou Fundador da DVIZ.',
  paragraphs: [
    'Primeiramente quero que saiba que estou muito feliz em compartilhar com você todo o meu conhecimento adquirido no 3D durante 20 anos.',
    'Comecei a usar o Unreal há alguns anos e estou cada vez mais impressionado com essa ferramenta fantástica, e posso te falar, este curso de Unreal Engine 5 para Archviz vai te surpreender! Ele esta muito especial.',
    'Nessa jornada vou te provar que saber 3D não é o suficiente! Você irá se tornar um expert no Unreal Engine para Archviz e ser um membro de destaque deste mercado futurístico, promissor e bem remunerado que é o 3D e se preparar para o Metaverso.',
    'Sabemos que neste mercado do Metaverso não bastará saber apenas 3D, você vai precisar mostrar que sabe o que está fazendo de verdade!',
    'E uma das melhores formas de entregar isso, é na experiência que você traz na entrega dos seus projetos.',
    'Eu te garanto, se você fizer tudo o que eu vou te ensinar neste curso, meus conhecimentos serão complementares aos seus e seus projetos ganharão destaque de forma extraordinária!',
    'Seja bem vindo, te vejo lá no grupo dos alunos!',
  ],
  name: 'Denis Gandra',
  role: 'Fundador da DVIZ',
  badge: '20 anos de conhecimento 🧠',
  photo: '/images/curso-unreal-5/instrutor/denis-gandra.webp',
}

export const ctaFinal = {
  description:
    'O mercado já mudou. E com o curso mais completo de Unreal Engine 5.6 para Archviz do mundo, você vai dominar passeios interativos, vídeos sem render e cenas que impressionam de verdade.',
  proof: '+ de 5 mil criadores já garantiram a vaga!',
}

export const precoDoCurso = {
  badgeTitle: 'ACESSO ANUAL',
  checklist: [
    '+60 horas de aulas gravadas',
    'Materiais complementares',
    'Bônus Inéditos',
    'Suporte exclusivo e personalizado',
    'Comunidade no Telegram e Facebook',
    'Certificado de conclusão',
  ],
  original: 'R$2597',
  atual: 'R$1297',
  ctaLabel: 'Garantir essa oferta',
  acessoLabel: 'ACESSO ANUAL',
  selos: [
    { icon: 'users' as IconName, label: 'Comunidade Exclusiva' },
    { icon: 'lock-open' as IconName, label: 'Acesso Imediato' },
    { icon: 'shield-check' as IconName, label: 'Pagamento Seguro' },
    { icon: 'languages' as IconName, label: 'Inglês, Português e Espanhol' },
  ],
}

export const faqBadge = 'O curso é para você! ✨'
export const faqTitle = 'Dúvidas Frequentes'
export const faqSubtitle =
  'Veja as dúvidas mais comuns sobre o NOVO Curso de Unreal Engine 5.6 para Archviz.'

export const faqItens: { title: string; content: string }[] = [
  {
    // TODO: confirmar texto real com o parceiro (DVIZ) — resposta fechada na imagem de referência.
    title: 'O antigo curso de Unreal Engine 5 será atualizado para quem já tem?',
    content:
      'Fale com o suporte pelo canal exclusivo de dúvidas para confirmar as condições de atualização para quem já é aluno do curso anterior.',
  },
  {
    // TODO: confirmar requisitos mínimos reais de hardware com o parceiro (DVIZ).
    title: 'Meu computador suporta?',
    content:
      'A Unreal Engine roda em máquinas com placa de vídeo dedicada. No módulo de otimização o curso ensina técnicas para o projeto rodar bem mesmo em computadores mais simples.',
  },
  {
    title: 'Quais são as formas de pagamento?',
    content:
      'Aceitamos Pix, boleto, cartão de crédito e PayPal, em ambiente de pagamento 100% seguro e criptografado.',
  },
  {
    title: 'Por quanto tempo tenho acesso ao curso?',
    content: 'As aulas ficam disponíveis na plataforma dentro do período de um ano (acesso anual).',
  },
  {
    title: 'Você tem suporte para dúvidas?',
    content:
      'Sim, você terá um canal de suporte exclusivo para tirar dúvidas e ser ajudado durante todo o curso.',
  },
  {
    title: 'Todas as aulas são online?',
    content:
      'Sim, o curso é 100% on-line: você assiste quantas vezes quiser, de onde preferir e em qualquer dispositivo.',
  },
  {
    // TODO: confirmar canal real de contato para dúvidas fora do FAQ.
    title: 'Você tem mais perguntas?',
    content: 'Fale com a nossa equipe pelo canal de suporte exclusivo da comunidade DVIZ.',
  },
]
