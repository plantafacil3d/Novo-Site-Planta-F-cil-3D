# Tokens

Valores extraídos da referência visual da home (preto-esverdeado, verde, verde-limão e branco). **Valores aproximados: confirme com o usuário/Figma e ajuste aqui**, no primitivo correspondente.

Fonte da verdade no código: `src/styles/tokens.css`. O bloco CSS abaixo é o modelo.

## Cores

### Primitivos

| Token | Valor | Uso de referência |
|---|---|---|
| `--black-900` | `#0b1410` | fundo do hero, rodapé, faixas escuras |
| `--green-900` | `#0f2a20` | header, seções escuras |
| `--green-700` | `#1f6b3f` | botões, selos, links de ação |
| `--green-600` | `#268a4f` | hover do verde de ação |
| `--green-100` | `#e6f2ea` | fundo de seções claras e chips |
| `--lime-400` | `#7ed957` | destaque em títulos sobre fundo escuro ("seu sonho") |
| `--white` | `#ffffff` | fundo de página e cards |
| `--gray-50` | `#f5f8f6` | fundo alternado |
| `--gray-200` | `#dfe6e2` | bordas |
| `--gray-500` | `#6b7a72` | texto secundário |
| `--gray-900` | `#14201a` | texto principal |
| `--red-600` | `#c62828` | erro |
| `--amber-500` | `#f5a524` | aviso |

Cinzas com leve tom esverdeado, para combinar com a marca.

### Semânticos

| Token | Aponta para | Propósito |
|---|---|---|
| `--color-bg-page` | `--white` | fundo padrão |
| `--color-bg-subtle` | `--gray-50` | seções alternadas |
| `--color-bg-tint` | `--green-100` | seções de destaque claras (ex.: "Por que escolher") |
| `--color-bg-inverse` | `--green-900` | header, faixas escuras |
| `--color-bg-inverse-strong` | `--black-900` | hero, rodapé |
| `--color-surface` | `--white` | cards, campos |
| `--color-text` | `--gray-900` | texto principal |
| `--color-text-muted` | `--gray-500` | texto secundário |
| `--color-text-inverse` | `--white` | texto sobre fundo escuro |
| `--color-accent` | `--lime-400` | destaque sobre fundo escuro |
| `--color-action-primary` | `--green-700` | botão principal |
| `--color-action-primary-hover` | `--green-600` | hover do botão principal |
| `--color-border` | `--gray-200` | bordas |
| `--color-focus-ring` | `--lime-400` | anel de foco |
| `--color-success` | `--green-700` | sucesso |
| `--color-warning` | `--amber-500` | aviso |
| `--color-danger` | `--red-600` | erro |

**Contraste a verificar (AA):** branco sobre `--green-700` (texto de botão), `--gray-500` sobre branco (texto secundário), `--lime-400` sobre `--black-900`. Se algum falhar, ajuste o primitivo, não o componente.

## Tipografia

* Família: sans-serif geométrica/humanista (ex.: Inter ou Poppins), carregada com `next/font`. **Fonte definitiva a confirmar.**
* Escala: `--text-xs` 12px, `--text-sm` 14px, `--text-base` 16px, `--text-lg` 18px, `--text-xl` 20px, `--text-2xl` 24px, `--text-3xl` 32px, `--text-4xl` 44px (título do hero).
* Pesos: 400 (texto), 500 (rótulos), 600 (subtítulos), 700 (títulos).
* Altura de linha: 1.2 em títulos, 1.5 em texto corrido.
* Rótulo em caixa alta com espaçamento entre letras (ex.: "PROJETOS ARQUITETÔNICOS PRONTOS"): `--text-xs`, peso 600, `letter-spacing: 0.12em`.

## Espaçamento (base 4px)

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 · `--space-9` 96

* Padding vertical de seção: `--space-8` (mobile `--space-7`).
* Largura máxima do conteúdo: `--container-max` 1200px, com gutter lateral de `--space-4`.

## Raios, sombras e movimento

* Raios: `--radius-sm` 6px (chips, tags) · `--radius-md` 10px (botões, campos) · `--radius-lg` 14px (cards) · `--radius-full` 999px.
* Sombras: `--shadow-sm` (card em repouso) · `--shadow-md` (card em hover, dropdown) · `--shadow-lg` (modal).
* Movimento: `--duration-fast` 150ms · `--duration-base` 250ms · `--ease-standard` `cubic-bezier(0.2, 0, 0, 1)`. Respeitar `prefers-reduced-motion`.

## Breakpoints

`--bp-sm` 640px · `--bp-md` 768px · `--bp-lg` 1024px · `--bp-xl` 1280px. Mobile-first (`min-width`).

## Estados

Todo componente interativo define: repouso, hover, foco (anel `--color-focus-ring`, 2px + offset 2px), ativo, disabled (opacidade 0.5, sem hover, `cursor: not-allowed`), loading.

## Modelo de `src/styles/tokens.css`

```css
:root {
  /* primitivos */
  --black-900: #0b1410;
  --green-900: #0f2a20;
  --green-700: #1f6b3f;
  --green-600: #268a4f;
  --green-100: #e6f2ea;
  --lime-400: #7ed957;
  --white: #ffffff;
  --gray-50: #f5f8f6;
  --gray-200: #dfe6e2;
  --gray-500: #6b7a72;
  --gray-900: #14201a;
  --red-600: #c62828;
  --amber-500: #f5a524;

  /* semânticos */
  --color-bg-page: var(--white);
  --color-bg-subtle: var(--gray-50);
  --color-bg-tint: var(--green-100);
  --color-bg-inverse: var(--green-900);
  --color-bg-inverse-strong: var(--black-900);
  --color-surface: var(--white);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-500);
  --color-text-inverse: var(--white);
  --color-accent: var(--lime-400);
  --color-action-primary: var(--green-700);
  --color-action-primary-hover: var(--green-600);
  --color-border: var(--gray-200);
  --color-focus-ring: var(--lime-400);
  --color-success: var(--green-700);
  --color-warning: var(--amber-500);
  --color-danger: var(--red-600);

  /* espaçamento */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px; --space-9: 96px;
  --container-max: 1200px;

  /* raios */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-full: 999px;

  /* sombras */
  --shadow-sm: 0 1px 3px rgb(11 20 16 / 0.08);
  --shadow-md: 0 6px 16px rgb(11 20 16 / 0.12);
  --shadow-lg: 0 16px 40px rgb(11 20 16 / 0.18);

  /* movimento */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* tipografia */
  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.125rem; --text-xl: 1.25rem;  --text-2xl: 1.5rem;
  --text-3xl: 2rem;    --text-4xl: 2.75rem;
}
```

Breakpoints não entram como variável CSS (não funcionam em media queries); ficam na configuração da estilização escolhida.
