# Tokens

A marca é preto e branco, minimalista; o verde vivo é a única cor de destaque, para dar vida. **Paleta aprovada pelo usuário na home em 2026-09-20; ainda sem validação do cliente/Figma. Ajuste em `src/styles/tokens.css`**, no primitivo correspondente.

**Fonte da verdade dos valores: `src/styles/tokens.css`.** Este documento explica os tokens e seu propósito; não duplique os valores em outros lugares.

## Implementação (Tailwind v4)

- Primitivos ficam em `:root` e **não geram classes**. Só os semânticos, declarados em `@theme`, viram utilitários: `bg-primary`, `text-fg-muted`, `border-border`, `ring-ring`, `rounded-md`, `shadow-md`.
- Nome da classe = nome do token sem `--color-`: `--color-primary` → `bg-primary`.
- A paleta padrão do Tailwind está desligada (`--color-*: initial`): `bg-blue-500` não existe.
- Espaçamento, breakpoints e larguras usam a escala padrão do Tailwind. Sem valor arbitrário (`p-[13px]`) sem antes propor token.
- Variantes de componente com `cva`; junção de classes com `cn` (`components/ui/cn.ts`).
- Trocar a cor dos botões: aponte `--color-primary` (e `--color-primary-hover`) para outro primitivo.

## Cores

### Primitivos

| Token                                             | Uso de referência                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `--black-900`                                     | botão principal, hero, ícones e preços sobre fundo claro                                      |
| `--black-800`                                     | faixas escuras (banners): preto com leve tom azul-petróleo (`#141d20`)                        |
| `--green-700`                                     | só o selo de desconto (`Badge discount`): fundo sólido para texto branco, onde o verde vivo não tem contraste suficiente |
| `--green-600`                                     | hover do verde vivo e anel de foco                                                            |
| `--green-500`                                     | verde vivo: destaques sobre fundo escuro, botão sobre fundo escuro, selos, sublinhado do menu |
| `--green-100`                                     | fundo de seções claras e chips                                                                |
| `--white`                                         | fundo de página e cards                                                                       |
| `--gray-50`                                       | fundo alternado                                                                               |
| `--gray-200`                                      | bordas                                                                                        |
| `--gray-500`                                      | texto secundário                                                                              |
| `--gray-700`                                      | hover do botão preto                                                                          |
| `--gray-900`                                      | texto principal                                                                               |
| `--gray-100` / `--gray-300` / `--gray-400`        | fundo desabilitado / borda de campo / texto desabilitado                                      |
| `--success-*`, `--red-*`, `--amber-*`, `--blue-*` | escalas de estado: 50 (fundo), 200 (borda), 500/600 (cor viva), 800/900 (texto)               |

Cinzas e pretos com leve tom esverdeado, para combinar com a marca. Exceção intencional: `--black-800`, que puxa para azul-petróleo (escolha do usuário, 2026-09-20).

### Semânticos

| Token                                         | Aponta para                 | Propósito                                                                                                                       |
| --------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--color-page`                                | `--white`                   | fundo padrão                                                                                                                    |
| `--color-subtle`                              | `--gray-50`                 | seções alternadas                                                                                                               |
| `--color-tint`                                | `--green-100`               | seções de destaque claras (ex.: "Por que escolher")                                                                             |
| `--color-inverse`                             | `--black-800`               | faixas escuras (banners)                                                                                                        |
| `--color-inverse-strong`                      | `--black-900`               | hero                                                                                                                            |
| `--color-surface`                             | `--white`                   | cards, campos                                                                                                                   |
| `--color-fg`                                  | `--gray-900`                | texto principal                                                                                                                 |
| `--color-fg-muted`                            | `--gray-500`                | texto secundário                                                                                                                |
| `--color-fg-inverse`                          | `--white`                   | texto sobre fundo escuro                                                                                                        |
| `--color-accent`                              | `--green-500`               | verde vivo: destaque e botão sobre fundo escuro, selo, sublinhado do menu. Sobre branco só como preenchimento, nunca como texto |
| `--color-accent-hover`                        | `--green-600`               | hover do botão verde                                                                                                            |
| `--color-primary`                             | `--black-900`               | botão principal, preços, ícones e links de ação sobre fundo claro                                                               |
| `--color-primary-hover`                       | `--gray-700`                | hover do botão principal                                                                                                        |
| `--color-border`                              | `--gray-200`                | bordas                                                                                                                          |
| `--color-ring`                                | `--green-600`               | anel de foco (passa 3:1 sobre branco e sobre preto)                                                                             |
| `--color-border-strong`                       | `--gray-300`                | borda de campo de formulário                                                                                                    |
| `--color-link`                                | `--blue-600`                | links em texto corrido                                                                                                          |
| `--color-overlay`                             | preto 55%                   | fundo atrás de modais                                                                                                           |
| `--color-bg-disabled` / `--color-fg-disabled` | `--gray-100` / `--gray-400` | controles desabilitados (isento de AA)                                                                                          |

#### Estados (success, warning, danger, info)

Quatro tokens por família: `-solid` (ícone, borda de campo, botão), `-subtle` (fundo de alerta), `-border`, `-fg` (texto sobre o subtle, AA). Ex.: `--color-danger-subtle`, `--color-info-fg`. **Rascunho** é neutro: `--color-draft-subtle/-border/-fg`.

`--color-success`, `--color-warning` e `--color-danger` continuam como atalhos de `-solid` (o `Input` invalid usa `border-danger`).

`--color-warning-solid` (âmbar) dá só 2,0:1 sobre branco: use como preenchimento ou ícone, nunca como texto; texto de aviso é `--color-warning-fg`.

**Regra de acoplamento:** um componente de feedback (notificação, badge de status) não usa `danger`/`success` "porque a cor é a mesma". Ele usa o token próprio, que aponta para o semântico de estado, para variar sozinho sem mexer nos erros de formulário. Decisão do usuário (2026-09-20): esses tokens já existem, mesmo antes dos componentes, para ficarem documentados.

#### Tokens de componente (feedback)

| Token (classe: `bg-…`, `text-…`, `border-…`)              | Aponta para                                      |
| --------------------------------------------------------- | ------------------------------------------------ |
| `--color-notification-{success\|error\|warning\|info}-bg` | `-subtle` do estado (`error` usa `danger`)       |
| `--color-notification-{…}-border`                         | `-border` do estado                              |
| `--color-notification-{…}-fg`                             | `-fg` do estado                                  |
| `--color-notification-{…}-icon`                           | `-solid` do estado                               |
| `--color-badge-{draft\|success\|error\|warning\|info}-bg` | `-subtle` do estado (`draft` usa `draft-subtle`) |
| `--color-badge-{…}-fg`                                    | `-fg` do estado                                  |
| `--color-badge-discount-bg` / `-fg`                        | `--green-700` / `--white` — foge do padrão acima: fundo sólido (não `-subtle`) e texto branco (não `-fg` escuro), porque o verde vivo (`--green-500`) não dá contraste (2,3:1) para texto branco |

Ex.: `bg-notification-error-bg text-notification-error-fg border-notification-error-border`. Para trocar só a cor da notificação de erro, mude `--color-notification-error-*`; `danger-*` e o erro de formulário não mudam.

**Contraste (WCAG, calculado):** `--gray-900` (texto) sobre `--green-500` 7,4:1 e sobre `--green-600` 5,1:1 (botão e selo verdes, repouso e hover); `--green-500` sobre `--black-900` 8,2:1 e sobre `--black-800` 7,5:1; branco sobre `--black-800` 17,1:1; `--green-500` sobre branco 2,3:1 (só preenchimento, nunca texto); `--green-600` sobre branco 3,3:1 e sobre `--black-900` 5,7:1 (anel de foco); branco sobre `--black-900` 18,7:1 e sobre `--gray-700` 12:1; branco sobre `--green-700` 4,7:1 (selo de desconto — o único lugar com texto branco sobre verde; é o tom mais claro que ainda passa AA, pedido do usuário depois de ver o primeiro tom, mais escuro, testado). `--gray-500` (texto secundário, `#627068`) dá 5,2:1 sobre branco, 4,9:1 sobre `--gray-50` e 4,7:1 sobre `--green-100`: passa AA (4,5:1) em todos os fundos claros. Se algum contraste falhar, ajuste o primitivo, não o componente.

## Tipografia

- Títulos: **Poppins** 600/700 (`font-heading`, aplicada em `h1`–`h4`). Texto, botões e rótulos: **Inter** 400/500/600 (`font-body`, padrão do `body`). Carregadas com `next/font` em `app/layout.tsx`.
- Escala: `text-xs` 12px, `text-sm` 14px, `text-base` 16px, `text-lg` 18px, `text-xl` 20px, `text-2xl` 24px, `text-3xl` 32px, `text-4xl` 44px (título do hero).
- Pesos: 400 (texto), 500 (rótulos), 600 (subtítulos), 700 (títulos).
- Altura de linha: 1.2 em títulos, 1.5 em texto corrido.
- Rótulo em caixa alta ("PROJETOS ARQUITETÔNICOS PRONTOS"): `text-xs font-semibold uppercase tracking-[0.12em]`. Se se repetir, vira componente.

## Espaçamento

Escala padrão do Tailwind (base 4px): `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px, `24`=96px.

- Padding vertical de seção: `py-16` (mobile `py-12`).
- Conteúdo: `max-w-content` (1200px) com gutter lateral `px-4`.

## Raios, sombras e movimento

- Raios: `rounded-sm` 6px (chips, tags) · `rounded-md` 10px (botões, campos) · `rounded-lg` 14px (cards) · `rounded-full`.
- Sombras: `shadow-sm` (card em repouso) · `shadow-md` (card em hover, dropdown) · `shadow-lg` (modal).
- Movimento: `duration-150` (rápido) e `duration-250` (base) com `ease-standard`. Respeitar `prefers-reduced-motion` (já tratado em `globals.css`).

## Breakpoints

Padrão do Tailwind, mobile-first: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px.

## Estados

Todo componente interativo define: repouso, hover, foco (anel `ring`, 2px + offset 2px; base global em `:focus-visible`), ativo, disabled (opacidade 0.5, sem hover, `cursor-not-allowed`), loading.
