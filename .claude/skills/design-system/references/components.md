# Catálogo de componentes

Começa com o que a home já exige. Cresce a cada componente novo (regra em `../SKILL.md` §2). Localização segue `arquitetura` §4.

Formato de cada entrada: propósito, variantes, estados, tokens usados, onde vive.

## Primitivos (`components/ui/`)

### Button
* **Propósito:** disparar ação ou navegar (com `href` vira `<Link>`, ou `<a target="_blank">` se o destino for externo).
* **Variantes:** `primary` (verde sólido), `secondary` (contorno), `secondary-inverse` (contorno claro, para fundo escuro), `ghost` (texto), `whatsapp` (verde com borda clara e ícone do WhatsApp automático, para faixas escuras). Tamanhos: `md` (padrão), `lg`. Ícone à esquerda (`iconLeft`) e à direita (`iconRight`).
* **Estados:** repouso, hover, foco, ativo, disabled, loading (`loading` desabilita, mostra spinner e `aria-busy`).
* **Tokens:** `--color-primary(-hover)`, `--color-fg-inverse`, `--color-border`, `--radius-md`, `min-h-11 px-4 py-3`, `--color-ring`.
* **Nota:** para "card inteiro clicável", passe `after:absolute after:inset-0` no `className` (o card precisa ser `relative`).

### Icon
* **Propósito:** único ponto que conhece a biblioteca de ícones (`lucide-react`). `<Icon name="search" />`, decorativo (`aria-hidden`), 20px por padrão (`className="size-6"` para mudar).
* **Marcas** (WhatsApp, Instagram, YouTube, Facebook) não existem no Lucide: SVG próprio em `ui/icons/brand.tsx`, mesmo formato de traço.
* **Novo ícone:** adicione ao registro em `Icon.tsx`; o tipo `IconName` se atualiza sozinho.

### Badge
* **Propósito:** selo sobre a imagem (Mais vendido, Lançamento).
* **Variantes:** `solid` (verde), `accent` (lima).
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
Logo, navegação principal, ícones de busca/favoritos/carrinho (links com `aria-label`; carrinho com contador), botão "Entrar / Cadastrar". Fundo `--color-inverse`. Recebe tudo por props. Abaixo de `lg` a navegação e o botão vão para o `MobileMenu`; o botão some abaixo de `sm`.

### MainNav e MobileMenu (`navigation/`)
Ambos `'use client'`. `MainNav` renderiza os links e marca a página atual com `aria-current` (sublinhado `--color-accent` no horizontal). `MobileMenu` é o hambúrguer com painel (`aria-expanded`, fecha com Esc e ao navegar).

### SkipLink (`navigation/`)
Primeiro item da tab; leva ao conteúdo principal e só aparece com foco.

### Footer (`layout/`)
Logo, links de navegação, redes sociais, direitos autorais e localização. Fundo `--color-inverse-strong`.

### Section (`layout/`)
Container de seção: título (h2), subtítulo, link "Ver todos" e conteúdo. Variantes de fundo (`tone`): `page`, `subtle`, `tint`, `inverse`.

## Compartilhados (`components/shared/`)

### Logo
Ícone de casa + nome + tagline, para fundo escuro (Header e Footer). **Provisório** até existir o arquivo oficial do logotipo.

### SearchBar
`<form role="search" method="get">` com Input + Button `primary` + ícone; funciona sem JavaScript. Rótulo `sr-only` (a referência visual só mostra placeholder).

### ProjectCard
Card de projeto (ver `ux-rules.md`). Puramente visual: recebe textos e preço já formatados (a montagem fica em `features/projetos/components/ProjetosDestaque`). Compõe Badge, FavoriteButton, lista de especificações (ícone + texto) e Button. O card inteiro é um único link (botão "Ver detalhes" esticado); o coração fica acima. **Se ganhar regra de domínio, mova para `features/projetos/components/`.**

### MediaCard
Card compacto: imagem, título e preço. O card inteiro é um único link, pelo título. Usado nos projetos complementares.

### FavoriteButton
`'use client'`. Coração com `aria-pressed`. **Por ora só estado local**: a persistência depende de conta/favoritos.

### CategoryTile
Ícone + rótulo em bloco clicável, fundo `--color-tint`.

### FeatureItem
Ícone + título + descrição curta. `tone`: `default` ou `inverse` (fundo escuro, hero). `titleAs="h3"` quando estiver dentro de seção com h2.

### CTABanner
Faixa de chamada para ação. Variantes: `inverse` (imagem à esquerda + painel escuro com rótulo, título, texto e botão) e `brand` (faixa `--color-inverse` com ícone de casa e botão WhatsApp, sem imagem).

## Backlog (criar só quando uma tela pedir)

Modal, Tabs, Breadcrumb, Pagination, Toast, Select, Checkbox, Carrossel/Galeria de imagens, Chip, Skeleton/EmptyState/ErrorState.

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
