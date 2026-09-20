# Changelog do design system

Registre toda decisão que muda token, regra de UX ou catálogo. Mais recente primeiro.

Formato: `AAAA-MM-DD · o quê · por quê`

## 2026-09-19 (home)

* Primeira leva de componentes para a home: `Button`, `Icon`, `Badge`, `Eyebrow`, `Input` (ui); `Header`, `Footer`, `Section`, `MainNav`, `MobileMenu`, `SkipLink`; `Logo`, `SearchBar`, `ProjectCard`, `MediaCard`, `FavoriteButton`, `CategoryTile`, `FeatureItem`, `CTABanner` (shared). Registrados em `components.md`.
* Biblioteca de ícones: `lucide-react`, encapsulada em `ui/Icon.tsx`. Marcas (WhatsApp, Instagram, YouTube, Facebook) como SVG próprio em `ui/icons/brand.tsx`.
* Novos: `Button` variante `secondary-inverse` (contorno claro para fundo escuro) e `MediaCard` (não estava no catálogo; a home tem cards de complementares só com imagem, título e preço) e `Eyebrow` (o rótulo em caixa alta se repete 3×, então virou componente, como manda `tokens.md`).
* `CategoryTile` não usa `Chip`: é só um link, sem estado de seleção. `Chip` volta ao backlog.
* Variante `whatsapp` do `Button` usa `--color-primary` + borda clara. Branco sobre `--green-600` dá ~4,3:1 (falha AA em texto pequeno), então o verde-claro não vira fundo em repouso. Se faltar destaque sobre a faixa escura, propor token `--color-whatsapp` (decisão de marca: confirmar).
* Sem novos tokens de cor, raio, sombra ou tipografia. Fotos de exemplo (Unsplash) são temporárias.

## 2026-09-19

* Criação da skill `design-system`: tokens (3 níveis), regras de UX e catálogo inicial. Baseada na referência visual da home (preto-esverdeado, verde, verde-limão, branco).
* Valores de cor, fonte e escala são **aproximados**; pendente confirmação do usuário/Figma.
* Estilização (Tailwind, CSS Modules...) ainda não definida; tokens em CSS variables para funcionar com qualquer uma.

## 2026-09-19 (Tailwind)

* Estilização definida: **Tailwind v4** (config em CSS). Tokens em `src/styles/tokens.css`; primitivos em `:root`, semânticos em `@theme`.
* Paleta padrão do Tailwind desligada; só existem as cores do design system.
* Tokens semânticos renomeados para virarem classes limpas: `color-bg-*` → `color-page/subtle/tint/inverse`, `color-text*` → `color-fg*`, `color-action-primary*` → `color-primary*`, `color-focus-ring` → `color-ring`. Sem impacto: ainda não havia código consumidor.
* `--color-success` separado do verde dos botões (novo primitivo `--success-600`).
* Espaçamento: adotada a escala padrão do Tailwind (removidos os `--space-*`).
* Fontes definidas: Poppins (títulos) + Inter (texto).
