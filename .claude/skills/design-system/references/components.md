# Catálogo de componentes

Começa com o que a home já exige. Cresce a cada componente novo (regra em `../SKILL.md` §2). Localização segue `arquitetura` §4.

Formato de cada entrada: propósito, variantes, estados, tokens usados, onde vive.

## Primitivos (`components/ui/`)

### Button
* **Propósito:** disparar ação ou navegar (com `href` vira `<Link>`, ou `<a target="_blank">` se o destino for externo).
* **Variantes:** `primary` (preto sólido, para fundo claro), `secondary` (contorno), `secondary-inverse` (contorno claro, para fundo escuro), `ghost` (texto), `accent` (verde vivo com texto preto, para fundo escuro, onde o preto sumiria), `whatsapp` (mesmo estilo do `accent` + ícone do WhatsApp automático, para faixas escuras). Tamanhos: `md` (padrão), `lg`. Ícone à esquerda (`iconLeft`) e à direita (`iconRight`).
* **Estados:** repouso, hover, foco, ativo, disabled, loading (`loading` desabilita, mostra spinner e `aria-busy`).
* **Tokens:** `--color-primary(-hover)`, `--color-accent(-hover)`, `--color-fg`, `--color-fg-inverse`, `--color-border`, `--radius-md`, `min-h-11 px-4 py-3`, `--color-ring`.
* **Nota:** para "card inteiro clicável", passe `after:absolute after:inset-0` no `className` (o card precisa ser `relative`).
* **Link externo:** abre em nova aba (`noopener noreferrer`) e ganha um texto só para leitor de tela: "(abre em uma nova aba)".

### IconButton
* **Propósito:** botão redondo só com ícone (setas de galeria e carrossel, fechar, play). `label` é obrigatório: vira o `aria-label`.
* **Variantes:** `tone` `surface` (branco com sombra, padrão) e `inverse` (escuro translúcido, para cima de fotos); `size` `md` (44px) e `lg` (64px, play do banner de vídeo).
* **Estados:** repouso, hover, foco, disabled.
* **Tokens:** `--color-surface`, `--color-inverse`, `--color-fg`, `--color-fg-inverse`, `--shadow-md`.

### Modal
* **Propósito:** janela por cima da página (fotos em tela cheia, vídeo). `'use client'`, feita com `<dialog>` nativo: foco preso, Esc e clique no fundo fecham, botão "Fechar" embutido. O conteúdo só existe enquanto aberto (o vídeo para de tocar) e a página de trás não rola.
* **Props:** `open`, `onClose`, `label` (nome acessível), `className` (moldura interna).
* **Tokens:** `--color-overlay` (fundo), `--color-inverse-strong`, `--radius-lg`.

### Accordion
* **Propósito:** perguntas que abrem e fecham (FAQ). `<details>` nativo: funciona sem JavaScript, teclado de graça e o texto já vem no HTML (SEO). Recebe `items: { title, content }[]`.
* **Estados:** fechado (ícone `+`), aberto (ícone `−`), foco.
* **Tokens:** `--color-border`, `--color-surface`, `--color-fg-muted`, `--radius-md`.

### Icon
* **Propósito:** único ponto que conhece a biblioteca de ícones (`lucide-react`). `<Icon name="search" />`, decorativo (`aria-hidden`), 20px por padrão (`className="size-6"` para mudar).
* **Marcas** (WhatsApp, Instagram, YouTube, Facebook) não existem no Lucide: SVG próprio em `ui/icons/brand.tsx`, mesmo formato de traço.
* **Novo ícone:** adicione ao registro em `Icon.tsx`; o tipo `IconName` se atualiza sozinho.

### Badge
* **Propósito:** selo sobre a imagem (Mais vendido, Lançamento).
* **Variantes:** `solid` (preto), `accent` (verde vivo, texto preto).
* **Tokens:** `--color-primary`, `--color-accent`, `--radius-sm`, `--text-xs`.

### Eyebrow
* **Propósito:** rótulo em caixa alta acima de títulos (hero e banners). Cor `--color-accent`, só para fundo escuro.
* **Tokens:** `--color-accent`, `--text-xs`; `tracking-[0.12em]` (definido em `tokens.md`).

### Chip
* **Propósito:** categoria ou filtro selecionável. *(Ainda não criado: entra quando uma tela pedir seleção/filtro.)*
* **Estados:** repouso, hover, selecionado, foco.
* **Tokens:** `--color-tint`, `--color-border`, `--radius-lg`.

### Input
* **Propósito:** campo de texto. Sempre com `<label>` (visível ou `sr-only`).
* **Estados:** repouso, foco, erro (`invalid`), disabled.
* **Tokens:** `--color-surface`, `--color-border`, `--radius-md`, `--color-danger`.

### Skeleton, EmptyState, ErrorState
* **Propósito:** estados de loading, vazio e erro padronizados (ver `ux-rules.md`). *(Ainda não criados: a home usa dados em memória e não tem estados assíncronos.)*

## Layout e navegação (`components/layout/`, `components/navigation/`)

### Header (`layout/`)
Logo, navegação principal, ícones de busca/favoritos/carrinho (links com `aria-label`; carrinho com contador), botão "Entrar / Cadastrar". Fundo `--color-page` com borda inferior `--color-border`. Recebe tudo por props. Abaixo de `lg` a navegação e o botão vão para o `MobileMenu`; o botão some abaixo de `sm`.

### MainNav e MobileMenu (`navigation/`)
Ambos `'use client'`. `MainNav` renderiza os links e marca a página atual com `aria-current` (sublinhado `--color-accent` no horizontal). `MobileMenu` é o hambúrguer com painel (`aria-expanded`, fecha com Esc e ao navegar).

### SkipLink (`navigation/`)
Primeiro item da tab; leva ao conteúdo principal e só aparece com foco.

### Breadcrumb (`navigation/`)
Trilha "Início › Projetos › Sobrados › Projeto" (`<nav aria-label>` + `<ol>`). Item sem `href` é a página atual (`aria-current="page"`). Links com altura mínima de 44px.

### Tabs (`navigation/`)
`'use client'`. Abas acessíveis (`role="tablist"`/`tab`/`tabpanel`): setas, Home e End trocam de aba e movem o foco. Recebe `items: { id, label, content }[]`; todos os painéis ficam no HTML, só escondidos. Aba ativa em `--color-primary` com texto `--color-fg-inverse`; as outras com hover `--color-subtle`. No celular a lista rola na horizontal.

### Footer (`layout/`)
Logo, links de navegação, redes sociais, direitos autorais e localização. Fundo `--color-page` com borda superior `--color-border`.

### Section (`layout/`)
Container de seção: título (h2), subtítulo, link "Ver todos" e conteúdo. Variantes de fundo (`tone`): `page`, `subtle`, `tint`, `inverse`.

## Compartilhados (`components/shared/`)

### Logo
Ícone de casa + nome + tagline. Prop `tone`: `inverse` (padrão, para fundo escuro) ou `default` (fundo claro, usado no Header e no Footer). **Provisório** até existir o arquivo oficial do logotipo.

### SearchBar
`<form role="search" method="get">` com Input + Button `primary` + ícone; funciona sem JavaScript. Rótulo `sr-only` (a referência visual só mostra placeholder).

### ProjectCard
Card de projeto (ver `ux-rules.md`). Puramente visual: recebe textos e preço já formatados (a montagem fica em `features/projetos/components/ProjetosDestaque`). Compõe Badge, FavoriteButton, lista de especificações (ícone + texto) e Button. O card inteiro é um único link (botão "Ver detalhes" esticado); o coração fica acima. **Se ganhar regra de domínio, mova para `features/projetos/components/`.**

### MediaCard
Card compacto: imagem, título e preço. O card inteiro é um único link, pelo título. Usado nos projetos complementares.

### FavoriteButton
`'use client'`. Coração com `aria-pressed`. `variant`: `icon` (redondo, sobre a imagem do card) ou `button` (botão largo `secondary` com o texto "Adicionar aos favoritos"; o coração enche quando ativo). **Por ora só estado local**: a persistência depende de conta/favoritos.

### CategoryTile
Ícone + rótulo em bloco clicável, fundo `--color-tint`.

### FeatureItem
Ícone + título + descrição curta. `tone`: `default` ou `inverse` (fundo escuro, hero). `layout`: `row` (ícone ao lado, padrão) ou `stack` (ícone em cima; grades de características, entregáveis e perfil). `titleAs="h3"` quando estiver dentro de seção com h2.

### CTABanner
Faixa de chamada para ação. Variantes: `inverse` (imagem à esquerda + painel escuro com rótulo, título, texto e botão), `brand` (faixa `--color-inverse` com ícone de casa e botão WhatsApp, sem imagem) e `card` (cartão escuro arredondado dentro da largura da página, imagem ao fundo à direita, rótulo, título, texto, **preço** com condição e botão; usado no "Gostou deste projeto?"). O botão vem da prop `action.variant`: padrão `accent` no `inverse` e `card` e `whatsapp` no `brand` (o preto sumiria sobre o fundo escuro); aceita também `secondary-inverse`. No `card`, `action.iconLeft="cart"` põe o carrinho no botão.

### CheckList
Lista com marcador de check: círculo `--color-accent` (só preenchimento) com o check em `--color-fg`. Usada em "Sobre o projeto", "Importante saber" e no resumo do que está incluso.

### Carousel
`'use client'`. Faixa horizontal rolável com encaixe item a item. No celular rola com o dedo; a partir de `md` aparecem setas Anterior/Próximo (`IconButton`) só quando há mais itens para aquele lado. Respeita `prefers-reduced-motion`. Props: `label`, `itemClassName` (largura de cada item, ex.: `w-72`; use `grid` para itens de mesma altura) e os itens como `children`.

### Lightbox
`'use client'`. Visualizador de fotos em tela cheia dentro de um `Modal`: setas Anterior/Próxima, teclas ← →, contador "3 de 21". Controlado por `index` (`null` = fechado).

### MediaGallery
`'use client'`. Galeria do topo da página: foto grande com setas, botão "Ver em tela cheia" (abre o `Lightbox`), botão "Assistir vídeo" (abre `Modal` com `<video>`, só se houver vídeo), até 6 miniaturas e um bloco "+N" que abre o visualizador na primeira foto escondida. A foto inicial carrega com `priority`.

### VideoBanner
`'use client'`. Bloco escuro arredondado com imagem ao fundo, título, texto e um grande play (`IconButton` `lg`) que abre o vídeo num `Modal`. Selo de duração opcional (`Badge`).

### JsonLd
Injeta dados estruturados (schema.org) para o Google. Escapa o `<` para o conteúdo nunca fechar a tag `<script>`. É o único uso permitido de `dangerouslySetInnerHTML` no projeto.

## Backlog (criar só quando uma tela pedir)

Pagination, Toast, Select, Checkbox, Chip, Skeleton/EmptyState/ErrorState.

## Componentes de domínio (`features/projetos/components/`)

Ficam na feature porque conhecem o `ProjetoDetalhe`; a tela é montada em `views/ProjetoView.tsx`. Reaproveitam os componentes acima; nenhum tem estilo próprio fora dos tokens.

* `ProjetoHero`: galeria + título, selo, resumo, especificações rápidas, preço, comprar, favoritar, selos de confiança e o resumo "O que está incluso". Sem checkout válido, o botão de compra aparece desabilitado.
* `BarraCompraMobile`: preço + comprar fixos na base, só no celular. Deve ser o último filho da página (`sticky` para no fim do conteúdo e não cobre o rodapé).
* `EspecificacoesTecnicas`, `SobreProjeto`, `IncluidoNoProjeto`, `GaleriaCompleta`, `CaracteristicasAmbientes`, `PerfilProjeto`, `PerguntasFrequentes`, `ProjetosRelacionados` (reaproveita o `ProjectCard` da home, com selo "Similar").

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
