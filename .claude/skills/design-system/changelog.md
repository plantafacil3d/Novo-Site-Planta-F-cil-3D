# Changelog do design system

Registre toda decisão que muda token, regra de UX ou catálogo. Mais recente primeiro.

Formato: `AAAA-MM-DD · o quê · por quê`

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
