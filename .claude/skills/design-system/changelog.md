# Changelog do design system

Registre toda decisão que muda token, regra de UX ou catálogo. Mais recente primeiro.

Formato: `AAAA-MM-DD · o quê · por quê`

## 2026-09-20 (paleta preto + verde vivo)

* Marca é preto e branco e minimalista; o verde entra só para dar vida. `--color-primary` passa de verde-floresta para `--black-900` (hover `--gray-700`): botões, `Badge solid`, preços, ícones, "Ver todos" e logo sobre fundo claro ficam pretos.
* `--color-accent` passa de `--lime-400` para `--green-500` (`#22c55e`, verde vivo); novo `--color-accent-hover` (`--green-600`, `#16a34a`). `--color-ring` passa a `--green-600`: o anel lima dava 1,8:1 sobre branco, o novo dá 3,3:1 e passa também sobre preto.
* `--color-inverse` (banners) passa de `--green-900` para `--gray-900`: quase preto, para o site ler como preto e branco com uma única cor. `--green-100` (tint) clareado e refrescado para `#e7f8ec`.
* Primitivos removidos: `--green-900`, `--green-700`, `--lime-400`. Novo: `--green-500`, `--gray-700`; `--green-600` mudou de valor. `--success-600` fica verde-escuro de propósito (texto de sucesso precisa de AA).
* Verde vivo sobre branco dá 2,3:1: só como preenchimento (selo, sublinhado), nunca como texto. Por isso preços e ícones em fundo claro ficam pretos.
* `Button`: nova variante `accent` (verde vivo, texto preto) para fundo escuro, onde o preto sumiria; `whatsapp` reutiliza o mesmo estilo e perde a borda clara. `CTABanner inverse` passa a usar `accent` por padrão. Caixa do canto do hero passa a `bg-accent`.
* Ajuste no mesmo dia: `--color-inverse` passa de `--gray-900` para o novo primitivo `--black-800` (`#141d20`, preto com leve tom azul-petróleo, escolhido pelo usuário testando no navegador; o neutro `#141414` foi testado e descartado). `--gray-900` continua só como cor do texto (`#14201a`). Primitivo separado porque texto e fundo de banner evoluem de forma independente: mexer em um não pode repintar o outro. Só o `CTABanner` usa `--color-inverse`; o hero (`--color-inverse-strong`, `--black-900`) não mudou.
* Header, rodapé, `MobileMenu` e `MainNav` passaram de fundo escuro (`--color-inverse`/`--color-inverse-strong`) para claro (`--color-page` + borda `--color-border`), e o `Logo` ganhou a prop `tone` (`inverse` padrão, `default` para fundo claro). Feito antes desta rodada e registrado aqui depois. Por quê: a marca é preto e branco minimalista; o escuro fica só no hero e nos banners.
* Contraste: `--gray-500` (texto secundário) falhava AA sobre `--green-100` (4,1:1) e `--gray-50` (4,2:1) e passava por pouco sobre branco (4,5:1); afetava subtítulo e descrições da seção "Por que escolher". Escurecido de `#6b7a72` para `#627068` (aprovado pelo usuário): 5,2:1 no branco, 4,9:1 no `--gray-50`, 4,7:1 no `--green-100`. Impacto: todo `text-fg-muted` (links do rodapé e do menu, subtítulos, especificações do card, slogan do logo, placeholder) fica um pouco mais escuro.
* Paleta aprovada pelo usuário na home no mesmo dia (visual profissional, sem cansar). Sem validação do cliente/Figma ainda. Para deixar o verde mais suave ou mais forte, ajustar `--green-500` em `tokens.css`.

## 2026-09-20

* `SKILL.md` §2: explicitado por que existem componentes de UI e variantes (projeto escalável) e a regra de crescimento: variante só quando uma tela pede, dentro do `cva` do componente, registrada em `components.md` e neste changelog. Sem mudança de token, componente ou código.

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
