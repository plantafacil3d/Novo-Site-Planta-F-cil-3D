# Tokens

Valores extraídos da referência visual da home (preto-esverdeado, verde, verde-limão e branco). **Valores aproximados: confirme com o usuário/Figma e ajuste em `src/styles/tokens.css`**, no primitivo correspondente.

**Fonte da verdade dos valores: `src/styles/tokens.css`.** Este documento explica os tokens e seu propósito; não duplique os valores em outros lugares.

## Implementação (Tailwind v4)

* Primitivos ficam em `:root` e **não geram classes**. Só os semânticos, declarados em `@theme`, viram utilitários: `bg-primary`, `text-fg-muted`, `border-border`, `ring-ring`, `rounded-md`, `shadow-md`.
* Nome da classe = nome do token sem `--color-`: `--color-primary` → `bg-primary`.
* A paleta padrão do Tailwind está desligada (`--color-*: initial`): `bg-blue-500` não existe.
* Espaçamento, breakpoints e larguras usam a escala padrão do Tailwind. Sem valor arbitrário (`p-[13px]`) sem antes propor token.
* Variantes de componente com `cva`; junção de classes com `cn` (`components/ui/cn.ts`).
* Trocar a cor dos botões: aponte `--color-primary` (e `--color-primary-hover`) para outro primitivo.

## Cores

### Primitivos

| Token | Uso de referência |
|---|---|
| `--black-900` | fundo do hero, rodapé, faixas escuras |
| `--green-900` | header, seções escuras |
| `--green-700` | botões, selos, links de ação |
| `--green-600` | hover do verde de ação |
| `--green-100` | fundo de seções claras e chips |
| `--lime-400` | destaque em títulos sobre fundo escuro ("seu sonho") e anel de foco |
| `--white` | fundo de página e cards |
| `--gray-50` | fundo alternado |
| `--gray-200` | bordas |
| `--gray-500` | texto secundário |
| `--gray-900` | texto principal |
| `--success-600` | mensagens de sucesso |
| `--red-600` | erro |
| `--amber-500` | aviso |

Cinzas com leve tom esverdeado, para combinar com a marca.

### Semânticos

| Token | Aponta para | Propósito |
|---|---|---|
| `--color-page` | `--white` | fundo padrão |
| `--color-subtle` | `--gray-50` | seções alternadas |
| `--color-tint` | `--green-100` | seções de destaque claras (ex.: "Por que escolher") |
| `--color-inverse` | `--green-900` | header, faixas escuras |
| `--color-inverse-strong` | `--black-900` | hero, rodapé |
| `--color-surface` | `--white` | cards, campos |
| `--color-fg` | `--gray-900` | texto principal |
| `--color-fg-muted` | `--gray-500` | texto secundário |
| `--color-fg-inverse` | `--white` | texto sobre fundo escuro |
| `--color-accent` | `--lime-400` | destaque sobre fundo escuro |
| `--color-primary` | `--green-700` | botão principal |
| `--color-primary-hover` | `--green-600` | hover do botão principal |
| `--color-border` | `--gray-200` | bordas |
| `--color-ring` | `--lime-400` | anel de foco |
| `--color-success` | `--success-600` | sucesso (independente do verde dos botões) |
| `--color-warning` | `--amber-500` | aviso |
| `--color-danger` | `--red-600` | erro |

**Contraste a verificar (AA):** branco sobre `--green-700` (texto de botão), `--gray-500` sobre branco (texto secundário), `--lime-400` sobre `--black-900`. Se algum falhar, ajuste o primitivo, não o componente.

## Tipografia

* Títulos: **Poppins** 600/700 (`font-heading`, aplicada em `h1`–`h4`). Texto, botões e rótulos: **Inter** 400/500/600 (`font-body`, padrão do `body`). Carregadas com `next/font` em `app/layout.tsx`.
* Escala: `text-xs` 12px, `text-sm` 14px, `text-base` 16px, `text-lg` 18px, `text-xl` 20px, `text-2xl` 24px, `text-3xl` 32px, `text-4xl` 44px (título do hero).
* Pesos: 400 (texto), 500 (rótulos), 600 (subtítulos), 700 (títulos).
* Altura de linha: 1.2 em títulos, 1.5 em texto corrido.
* Rótulo em caixa alta ("PROJETOS ARQUITETÔNICOS PRONTOS"): `text-xs font-semibold uppercase tracking-[0.12em]`. Se se repetir, vira componente.

## Espaçamento

Escala padrão do Tailwind (base 4px): `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px, `24`=96px.

* Padding vertical de seção: `py-16` (mobile `py-12`).
* Conteúdo: `max-w-content` (1200px) com gutter lateral `px-4`.

## Raios, sombras e movimento

* Raios: `rounded-sm` 6px (chips, tags) · `rounded-md` 10px (botões, campos) · `rounded-lg` 14px (cards) · `rounded-full`.
* Sombras: `shadow-sm` (card em repouso) · `shadow-md` (card em hover, dropdown) · `shadow-lg` (modal).
* Movimento: `duration-150` (rápido) e `duration-250` (base) com `ease-standard`. Respeitar `prefers-reduced-motion` (já tratado em `globals.css`).

## Breakpoints

Padrão do Tailwind, mobile-first: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px.

## Estados

Todo componente interativo define: repouso, hover, foco (anel `ring`, 2px + offset 2px; base global em `:focus-visible`), ativo, disabled (opacidade 0.5, sem hover, `cursor-not-allowed`), loading.
