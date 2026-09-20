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
* **Variantes:** `solid` (preto), `accent` (verde vivo, texto preto), `success` (verde suave, para status como Publicado) e `draft` (cinza com borda, para Rascunho). As duas últimas nasceram no painel do administrador.
* **Tokens:** `--color-primary`, `--color-accent`, `--color-badge-success-*`, `--color-badge-draft-*`, `--color-draft-border`, `--radius-sm`, `--text-xs`.

### Eyebrow
* **Propósito:** rótulo em caixa alta acima de títulos (hero e banners). Cor `--color-accent`, só para fundo escuro.
* **Tokens:** `--color-accent`, `--text-xs`; `tracking-[0.12em]` (definido em `tokens.md`).

### Chip
* **Propósito:** filtro aplicado em forma de etiqueta removível ("Com piscina ×"). É um `<Link>`: o clique leva ao mesmo endereço sem aquele filtro, então funciona sem JavaScript. Props: `href`, `label`, `removeLabel` (texto só para leitor de tela, ex.: "Remover filtro").
* **Estados:** repouso, hover, foco. Altura mínima de 44px.
* **Tokens:** `--color-tint`, `--color-border`, `--color-subtle` (hover), `--radius-lg`.
* **Ainda não existe:** chip selecionável (liga/desliga); nasce quando uma tela pedir.

### Input
* **Propósito:** campo de texto. Sempre com `<label>` (visível ou `sr-only`).
* **Estados:** repouso, foco, erro (`invalid`), disabled.
* **Tokens:** `--color-surface`, `--color-border`, `--radius-md`, `--color-danger`.

### Select
* **Propósito:** lista de opções nativa (`<select>`): funciona sem JavaScript, o celular abre o seletor do sistema e o teclado já vem pronto. Sempre com `<label>`. Ícone de seta (`chevron-down`) sobreposto; o resto igual ao `Input`.
* **Estados:** repouso, foco, erro (`invalid`), disabled.
* **Tokens:** `--color-surface`, `--color-border`, `--color-fg-muted`, `--radius-md`, `--color-danger`.

### Checkbox
* **Propósito:** caixa de marcação com rótulo (`label`); a linha inteira é clicável e tem 44px de altura. Usa `accent-primary` (a caixa nativa, com a cor da marca).
* **Estados:** repouso, foco, marcado, disabled.
* **`hideLabel`:** esconde o texto (fica só para leitor de tela); a caixa mantém 44px de toque. Usado nas caixas de seleção das tabelas.

### Table
* **Propósito:** tabela de dados (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`). `caption` obrigatório (nome para leitor de tela). Em tela estreita rola na horizontal dentro da moldura, nunca a página.
* **Estados:** `TableRow` com `data-selected="true"` ganha fundo `--color-tint`.
* **Tokens:** `--color-surface`, `--color-subtle`, `--color-border`, `--color-fg-muted`, `--radius-lg`.

### Skeleton
* **Propósito:** bloco pulsante no lugar do conteúdo enquanto carrega (`aria-hidden`; quem o usa avisa "Carregando…" para leitor de tela). Dê a forma com `className` (`h-5 w-3/4`, `aspect-4/3`). Respeita `prefers-reduced-motion`.
* **Tokens:** `--color-border` (cinza dos blocos), `--radius-md`.

## Layout e navegação (`components/layout/`, `components/navigation/`)

### Header (`layout/`)
Logo, navegação principal, ícones de busca/favoritos/carrinho (links com `aria-label`; carrinho com contador), botão "Entrar / Cadastrar". Fundo `--color-page` com borda inferior `--color-border`. Recebe tudo por props. Abaixo de `lg` a navegação e o botão vão para o `MobileMenu`; o botão some abaixo de `sm`.

### MainNav e MobileMenu (`navigation/`)
Ambos `'use client'`. `MainNav` renderiza os links e marca a página atual com `aria-current` (sublinhado `--color-accent` no horizontal). `MobileMenu` é o hambúrguer com painel (`aria-expanded`, fecha com Esc e ao navegar).

### SidebarNav (`navigation/`)
`'use client'`. Menu lateral para fundo escuro (painel do administrador). No celular é uma faixa horizontal rolável; a partir de `lg`, uma coluna. Recebe `items: { label, icon, href? }[]`: sem `href` o item é estático (`aria-disabled`, texto "Em breve"). Página atual com `aria-current` e fundo `--color-fg-inverse` a 15%. Tokens: `--color-fg-inverse`, `--radius-md`.

### SkipLink (`navigation/`)
Primeiro item da tab; leva ao conteúdo principal e só aparece com foco.

### Breadcrumb (`navigation/`)
Trilha "Início › Projetos › Sobrados › Projeto" (`<nav aria-label>` + `<ol>`). Item sem `href` é a página atual (`aria-current="page"`). Links com altura mínima de 44px.

### Tabs (`navigation/`)
`'use client'`. Abas acessíveis (`role="tablist"`/`tab`/`tabpanel`): setas, Home e End trocam de aba e movem o foco. Recebe `items: { id, label, content }[]`; todos os painéis ficam no HTML, só escondidos. Aba ativa em `--color-primary` com texto `--color-fg-inverse`; as outras com hover `--color-subtle`. No celular a lista rola na horizontal.

### Pagination (`navigation/`)
Paginação da listagem (regras em `ux-rules.md`, "Listas e paginação"). Props: `pagina` (atual, começa em 1), `totalPaginas`, `hrefPagina(n)` (quem usa monta o endereço; a página vive na URL). Mostra "Anterior 1 … 4 5 6 … 40 Próxima": primeira, última e vizinhas da atual, com "…" nos saltos. Cada número é um `Button` link (`primary` na página atual, com `aria-current="page"`; `secondary` nas demais); Anterior/Próxima ficam desabilitados nas pontas. Com uma página só, não renderiza nada. `<nav aria-label="Paginação">`, alvos de 44px.

### Footer (`layout/`)
Logo, links de navegação, redes sociais, direitos autorais e localização. Fundo `--color-page` com borda superior `--color-border`.

### Section (`layout/`)
Container de seção: título (h2), subtítulo, link "Ver todos" e conteúdo. Variantes de fundo (`tone`): `page`, `subtle`, `tint`, `inverse`.

## Compartilhados (`components/shared/`)

### Logo
Ícone de casa + nome + tagline. Prop `tone`: `inverse` (padrão, para fundo escuro) ou `default` (fundo claro, usado no Header e no Footer). **Provisório** até existir o arquivo oficial do logotipo.

### SearchBar
`<form role="search" method="get">` com Input + Button `primary` + ícone; funciona sem JavaScript. Rótulo `sr-only` (a referência visual só mostra placeholder). `defaultValue` opcional preenche o campo com a busca atual da URL (dê uma `key` que mude com ela).

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

### CollapsiblePanel
`'use client'`. No celular, o conteúdo fica atrás de um botão `secondary` com ícone de filtro e contador (`count`, ex.: "Filtros (2)"), com `aria-expanded`/`aria-controls`. A partir de `lg` o conteúdo aparece sempre e o botão some. O conteúdo (`children`) é renderizado no servidor; só o abrir/fechar é estado do navegador. Quem usa dá uma `key` que mude a cada consulta, para o painel fechar depois de aplicar um filtro.

### EmptyState
Lista sem resultado: ícone, título, texto e uma ação opcional (`action: { label, href }`, botão `secondary`). Fundo `--color-subtle`, borda `--color-border`, `--radius-lg`. Sempre oferece um caminho ("Limpar filtros"), nunca uma tela vazia.

### ErrorState
Algo falhou: `role="alert"`, ícone, título, texto simples (nunca detalhe técnico) e "Tentar novamente" (`onRetry`, só aparece se passado). Usa os tokens de notificação de erro (`--color-notification-error-*`), como manda `tokens.md`. Usado em `app/projetos/error.tsx`.

### CTABanner
Faixa de chamada para ação. Variantes: `inverse` (imagem à esquerda + painel escuro com rótulo, título, texto e botão), `brand` (faixa `--color-inverse` com ícone de casa e botão WhatsApp, sem imagem) e `card` (cartão escuro arredondado dentro da largura da página, imagem ao fundo à direita, rótulo, título, texto, **preço** com condição e botão; usado no "Gostou deste projeto?"). O botão vem da prop `action.variant`: padrão `accent` no `inverse` e `card` e `whatsapp` no `brand` (o preto sumiria sobre o fundo escuro); aceita também `secondary-inverse`. No `card`, `action.iconLeft="cart"` põe o carrinho no botão.

### FormularioLogin
`'use client'`. E-mail e senha com botão Entrar. Recebe `action` (a ação do servidor que faz o login, passada por quem usa), então serve ao site (`/entrar`) e ao painel (`/admin/entrar`). Erro único e genérico, ligado por `aria-describedby`. `/entrar` o coloca dentro de `Tabs` (Entrar / Cadastrar).

### BotaoGoogle
`'use client'`. Botão "Entrar com Google" (`Button` `secondary` com ícone `google`, largura total). Recebe `action` (ação do servidor que inicia o login, passada por quem usa) e vira um formulário; mostra `loading` enquanto vai ao Google. Usado no `/admin/entrar`, acima do formulário de e-mail e senha.

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

Toast, chip selecionável (liga/desliga).

`Pagination`, `Select`, `Checkbox`, `Chip` (removível), `Skeleton`, `EmptyState` e `ErrorState` saíram do backlog com a listagem `/projetos` (2026-09-20).

## Componentes de domínio (`features/projetos/components/`)

Ficam na feature porque conhecem o `ProjetoDetalhe`; a tela é montada em `views/ProjetoView.tsx`. Reaproveitam os componentes acima; nenhum tem estilo próprio fora dos tokens.

* `ProjetoHero`: galeria + título, selo, resumo, especificações rápidas, preço, comprar, favoritar, selos de confiança e o resumo "O que está incluso". Sem checkout válido, o botão de compra aparece desabilitado.
* `BarraCompraMobile`: preço + comprar fixos na base, só no celular. Deve ser o último filho da página (`sticky` para no fim do conteúdo e não cobre o rodapé).
* `ProjetosDestaque`: grade de `ProjectCard` (1 coluna no celular, 2 no tablet, 4 no desktop). Aceita `className` para mudar as colunas quando divide a tela com outra coisa: a listagem usa `lg:grid-cols-2 xl:grid-cols-3` por causa da barra de filtros.
* `FormularioDeFiltros`: filtros da listagem em formulário GET (`next/form`): busca por nome ou código, ordenar, tipo, estilo arquitetônico, quartos, suítes, vagas ("N ou mais"), área, medidas do terreno (só entram projetos que cabem nele) e piscina / área gourmet. Os campos guardam o que veio da URL; quem usa dá uma `key` que muda a cada consulta. Sem JavaScript também funciona.
* `FiltrosAplicados`: os filtros ativos como `Chip` removível, mais "Limpar tudo"; some quando não há filtro.
* `ProjetosSkeleton`: uma página de cards em branco (12), para a tela não pular enquanto carrega.
* `EspecificacoesTecnicas`, `SobreProjeto`, `IncluidoNoProjeto`, `GaleriaCompleta`, `CaracteristicasAmbientes`, `PerfilProjeto`, `PerguntasFrequentes`, `ProjetosRelacionados` (reaproveita o `ProjectCard` da home, com selo "Similar").

## Painel do administrador (`features/admin/components/`)

Painel em `/admin` (layout próprio, fora do `SiteShell`; a tela é montada em `views/admin/`). Reaproveita `Table`, `Badge`, `Checkbox`, `SearchBar`, `Pagination`, `EmptyState`, `ErrorState` e `Skeleton`.

* `TabelaProjetosAdmin`: `'use client'`. Tabela com seleção por linha e "selecionar todos" da página, barra de ações em massa (Duplicar, Mover para rascunho) e aviso de sucesso/erro com os tokens `--color-notification-*`. Quem usa dá uma `key` que muda a cada busca/página.
* `ProjetosAdminSkeleton`: tabela em branco enquanto carrega.
* Menu do painel: Dashboard, Projetos, Vendas e Analytics; só Projetos é link. O botão "Cadastrar Projeto" é o `Button` primário, desabilitado (só visual).

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
