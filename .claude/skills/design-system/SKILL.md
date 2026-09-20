---
name: design-system
description: Define design tokens (cores, tipografia, espaçamento, raios, sombras), regras de UX e o catálogo de componentes de UI do site. Use antes de criar ou alterar qualquer tela, componente, estilo, cor ou layout, e quando surgir um valor visual que ainda não existe como token.
---

# Design System

Define **como o site deve parecer e se comportar**. A estrutura de pastas e as camadas ficam na skill `arquitetura` (§4 Componentes de UI); aqui ficam os valores visuais, as regras de UX e o catálogo.

Objetivo: interface consistente, acessível e **evolutiva**: o sistema cresce a partir do uso real, não de suposição.

**Princípio central:** nenhum valor visual solto. Cor, espaçamento, raio, sombra e fonte vêm de token. Componente novo só nasce se nenhum existente atender.

## Arquivos de referência

Leia só o que a tarefa exige:

* `references/tokens.md`: paleta, tipografia, espaçamento, raios, sombras, estados e como usar os tokens no Tailwind (os valores ficam em `src/styles/tokens.css`).
* `references/ux-rules.md`: hierarquia, padrões de tela, estados, acessibilidade e responsivo.
* `references/components.md`: catálogo de componentes (propósito, variantes, estados, tokens usados).
* `changelog.md`: histórico de decisões e mudanças.

## 1. Tokens em três níveis

```text
Primitivo   → valor bruto            green-500: #22c55e
Semântico   → propósito              color-accent: var(--green-500)
Componente  → só quando necessário   button-primary-bg: var(--color-primary)
```

* **Componentes usam só tokens semânticos.** Nunca hex, px ou sombra soltos.
* Primitivos só são referenciados pelos semânticos.
* Trocar a marca = mudar os primitivos/semânticos em um único arquivo (`src/styles/tokens.css`).
* Token de componente só se cria quando um componente precisa variar do semântico; não crie por antecipação.

## 2. Como a skill evolui

Antes de criar ou alterar UI:

1. **Leia os tokens e o catálogo** (`components.md`).
2. **Já existe componente?** Reutilize; estenda com prop/variante em vez de duplicar.
3. **Faltou um valor?** Proponha um **novo token semântico** (nome, valor, motivo) em vez de usar hex solto. Novo primitivo só se a paleta realmente precisar dele.
4. **Componente novo?** Crie em `components/ui/` (ou `shared/`) e registre em `components.md`: propósito, variantes, estados e tokens usados.
5. **Registre no `changelog.md`** toda decisão que muda token ou regra, ou que tenha um "porquê" a lembrar (data, o quê, por quê). Componente ou variante novos só precisam da entrada em `components.md`.

* Adicionar token ou componente dentro do sistema: registre e prossiga.
* **Alterar ou remover** token/componente existente: mostre o impacto (onde é usado) e **aguarde confirmação**.
* Pergunte ao usuário quando a decisão é de marca (nova cor, nova fonte); não invente.

### Por que componentes de UI e variantes

O projeto é escalável: à medida que cresce, surgem variações (novo tamanho, novo fundo, novo estado). Sem organização, cada tela reinventa o seu botão e o sistema perde consistência. Por isso toda variação vive no componente, num só lugar, e é registrada no catálogo.

* **Não crie variantes por antecipação.** Não conhecemos o futuro: a variante nasce quando uma tela real pede, não "para o caso de".
* **Ao surgir a necessidade, salve no lugar certo:** a variante entra no `cva` do próprio componente (`variants`), nunca como `className` avulso na tela; o componente novo entra em `ui/` ou `shared/`.
* **Registre na hora:** variante nova na entrada do componente em `components.md`. O `changelog.md` fica para mudança de token, regra ou decisão que tenha um "porquê" a lembrar.
* Uma variante que só uma tela usa e que não se repete ainda pode ficar como `className` pontual; ao repetir na segunda tela, promova a variante.

## 3. Regras de UX

Resumo; o detalhe está em `references/ux-rules.md`.

* Uma ação principal por tela, visualmente dominante (preto sólido; verde vivo sobre fundo escuro).
* Toda tela de dados tem estados de **loading, vazio e erro**, usando os componentes padrão.
* Foco visível, contraste AA e alvos de toque ≥ 44px são obrigatórios.
* Mobile-first: projete do celular para o desktop.
* Texto e microcopy em português do Brasil, direto e sem jargão.

## 4. Integração com a arquitetura

* Tokens vivem em `src/styles/`; primitivos de UI em `src/components/ui/`.
* Estilização: **Tailwind v4**. Os tokens vivem em `src/styles/tokens.css` (`@theme`) e viram utilitários (`bg-primary`); variantes com `cva`, junção de classes com `cn`. Não há `tailwind.config`.
* Componentes de `ui/` são de apresentação: props entram, callbacks saem.

## Checklist

* Li os tokens e o catálogo antes de criar?
* Reutilizei um componente existente?
* Há algum hex, px ou sombra solto no código?
* O valor novo virou token semântico e foi registrado?
* Cobri loading, vazio, erro, hover, foco e disabled?
* Contraste AA e alvo de toque ≥ 44px?
* Atualizei `components.md` (e o `changelog.md`, se houve decisão de token ou regra)?

**Consistência hoje, biblioteca completa só quando o uso pedir.**
