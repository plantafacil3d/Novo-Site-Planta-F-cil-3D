# Catálogo de componentes

Começa com o que a home já exige. Cresce a cada componente novo (regra em `skill-design-system.md` §2). Localização segue `arquitetura` §4.

Formato de cada entrada: propósito, variantes, estados, tokens usados, onde vive.

## Primitivos (`components/ui/`)

### Button
* **Propósito:** disparar ação.
* **Variantes:** `primary` (verde sólido), `secondary` (contorno), `ghost` (texto), `whatsapp` (verde, com ícone). Tamanhos: `md` (padrão), `lg`. Aceita ícone à direita.
* **Estados:** repouso, hover, foco, ativo, disabled, loading.
* **Tokens:** `--color-primary(-hover)`, `--color-fg-inverse`, `--radius-md`, `px-4 py-3`, `--color-ring`.

### Badge
* **Propósito:** selo sobre a imagem (Mais vendido, Lançamento).
* **Variantes:** `solid` (verde), `accent` (lima).
* **Tokens:** `--color-primary`, `--color-accent`, `--radius-sm`, `--text-xs`.

### Chip
* **Propósito:** categoria ou filtro selecionável.
* **Estados:** repouso, hover, selecionado, foco.
* **Tokens:** `--color-tint`, `--color-border`, `--radius-lg`.

### Input / SearchBar
* **Propósito:** campo de texto; `SearchBar` compõe Input + Button `primary` + ícone.
* **Estados:** repouso, foco, erro, disabled.
* **Tokens:** `--color-surface`, `--color-border`, `--radius-md`, `--color-danger`.

### Skeleton, EmptyState, ErrorState
* **Propósito:** estados de loading, vazio e erro padronizados (ver `ux-rules.md`).

## Layout e navegação (`components/layout/`, `components/navigation/`)

### Header
Logo, navegação principal, busca/favoritos/carrinho, botão "Entrar / Cadastrar". Fundo `--color-inverse`. Recolhe em menu no mobile.

### Footer
Logo, links de navegação, redes sociais, direitos. Fundo `--color-inverse-strong`.

### Section
Container de seção: título, subtítulo, link "Ver todos" e conteúdo. Variantes de fundo: `page`, `subtle`, `tint`, `inverse`.

## Compartilhados (`components/shared/`)

### ProjectCard
Card de projeto (ver `ux-rules.md`). Compõe Badge, ícone de favorito, lista de atributos e Button. **Se ganhar regra de domínio, mova para `features/projetos/components/`.**

### CategoryTile
Ícone + rótulo em bloco clicável, fundo `--color-tint`. Usa Chip como base de estados.

### FeatureItem
Ícone + título + descrição curta (bloco "Por que escolher").

### CTABanner
Faixa com imagem, título, texto e botão. Variantes: `inverse` (escura) e `brand` (verde, com WhatsApp).

## Backlog (criar só quando uma tela pedir)

Modal, Tabs, Breadcrumb, Pagination, Toast, Select, Checkbox, Carrossel/Galeria de imagens.

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
