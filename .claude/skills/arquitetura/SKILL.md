---
name: arquitetura
description: Define camadas, pastas, regras de dependência e a troca de infraestrutura (backend, storage, hospedagem) em projetos web. Use antes de criar, mover, alterar ou refatorar features, páginas, componentes, hooks, repositories, services, schemas, rotas ou qualquer mudança estrutural.
---

# Arquitetura

Define **como construir**, não o que o produto faz. Vale para qualquer projeto web.

Objetivo: sistema modular, desacoplado, seguro, simples e **com infraestrutura trocável** (banco, storage, auth, hospedagem).

**Princípio central:** a solução mais simples que respeite as regras. Nada de código antecipado. Antes de criar, procure o que já existe e reutilize.

## Stack atual

- Front-end: Next.js (App Router) + React + TypeScript, Zod (validação), TanStack Query (dados do backend nos componentes cliente). O site precisa ser encontrado no Google, então o conteúdo público é renderizado no servidor. Detalhes e regras de SEO em `references/stack.md`.
- Backend: Supabase (Database e Storage). RLS ligado em toda tabela exposta; schema e policies versionados em migrations SQL. No front, só a chave pública (`anon`), nunca `service_role`.
- Hospedagem: Hostinger (Web app Node.js, deploy automático via GitHub), rodando `next build` e `next start`.

Nada disso pode vazar além da infraestrutura. Cada item deve poder ser trocado mudando só o adapter ou a configuração correspondente.

## 1. Dependências

```text
app (rota) / View / Component
      ↓
Feature (hooks + rules)
      ↓
Contrato: Repository / Service   ← interface, em termos do domínio
      ↓
Adapter de infraestrutura        ← Supabase, API, SDK
```

- Dependências só apontam para baixo.
- UI nunca importa SDK, API ou infraestrutura; só usa features/hooks.
- Regra de negócio nunca fica na UI.
- Feature não importa arquivos internos de outra; use o `index.ts` dela.
- Tipos do domínio sobem. Tipos crus de SDK/banco nunca saem do adapter.
- Cada regra existe em um único lugar.

## 2. Estrutura

Modelo, não lista obrigatória: crie só o necessário.

```text
src/
├── app/                  # Next App Router: page/layout/metadata/sitemap; finos, só chamam views e features
├── providers/            # providers de cliente (ex.: TanStack Query)
├── views/                # composição de telas; chamam os loaders da feature, sem regra de negócio (não use "pages/": o Next reserva o nome)
├── features/<dominio>/
│   ├── components/       # UI do domínio; subcomponentes ficam ao lado do pai
│   ├── hooks/            # estado, loading, erro e acesso a dados
│   ├── rules.ts          # regras de negócio puras (sem React/infra)
│   ├── schemas.ts        # validação
│   ├── types.ts          # tipos do domínio
│   └── index.ts          # API pública
├── repositories/<dominio>/   # dados persistentes do domínio
├── services/<capacidade>/    # integrações que não são dado de domínio (auth, storage, e-mail, pagamento)
├── components/
│   ├── ui/               # primitivos genéricos (Button, Input, Modal), sem regra
│   ├── layout/           # estrutura das telas
│   ├── navigation/       # menus, tabs, breadcrumbs
│   └── shared/           # composições reutilizáveis sem domínio
├── hooks/                # hooks genéricos
├── lib/                  # configuração e clientes de infraestrutura
├── types/                # tipos realmente globais (ex.: AppError)
└── styles/               # tokens e estilos globais
```

- Código de uma feature fica nela. Só promova para camada compartilhada quando houver reuso real.
- Subcomponente usado só pelo pai fica com ele. Sobe para `ui/` ou `shared/` quando outro componente passar a usá-lo.
- Dados vindos do backend: conteúdo público e indexável é buscado no servidor (Server Component chamando a feature/repository, estático ou ISR). Dados interativos usam TanStack Query dentro dos hooks da feature, chamando o repository. Estado local de tela usa `useState`. Componentes de apresentação nunca buscam dados direto.
- Server Components por padrão; `'use client'` só onde houver estado, efeito ou evento, o mais fundo possível. Código só de servidor importa `server-only`.
- Toda página pública define metadata (title, description, canonical), entra no sitemap e segue as regras de SEO de `references/stack.md`.
- Não divida arquivos só para reduzir linhas.

## 3. Trocar infraestrutura sem reescrever o app

Todo dado de domínio passa por um **Repository**. Toda integração externa (auth, storage, e-mail...) passa por um **Service**. Mesma estrutura:

```text
repositories/<dominio>/
├── <Dominio>Repository.ts           # contrato (interface)
├── Supabase<Dominio>Repository.ts   # adapter
└── index.ts                         # único ponto que escolhe a implementação
```

```ts
// index.ts
export type { <Dominio>Repository } from './<Dominio>Repository'
export const <dominio>Repository: <Dominio>Repository = new Supabase<Dominio>Repository()
```

- O contrato usa tipos do domínio e só tem os métodos realmente necessários.
- O adapter mapeia banco → domínio e traduz erros do fornecedor para `AppError` (`code` + `message`, em `types/`). UI e hooks só conhecem `AppError`.
- Consumidores importam só do `index.ts`.
- **Trocar de backend = escrever novo adapter + mudar uma linha no `index.ts`.** Pages, hooks e components não mudam.
- Sem factory, container ou DI framework.
- Não grave no banco identificadores presos ao fornecedor (URL do Supabase, ID proprietário). Grave chaves neutras, como o path do arquivo. O adapter resolve a URL.
- Regra de negócio fica no código da feature, não em funções proprietárias do backend.

## 3.1 Listas e volume de dados

Pense no pior caso: 10 mil projetos no banco. Nenhuma tela pode depender de a lista ser pequena. Buscar mais dados do que a tela mostra (_overfetching_) sobrecarrega banco, rede e navegador.

- **Nunca busque "tudo".** Toda listagem que pode crescer (projetos, complementares, interiores, favoritos, pedidos, painel do admin) é **paginada no servidor**. O contrato do repository recebe página e tamanho e devolve `Pagina<T>` = `{ itens, total, pagina, porPagina }` (tipo global em `types/`, criado junto da primeira listagem paginada).
- **Busca, filtro e ordenação rodam no banco**, dentro do repository. Baixar a lista e filtrar no navegador é proibido.
- **Só o que a tela usa:** a lista devolve o resumo do item (o que o card mostra, ex.: `ProjetoResumo`); o detalhe completo só na página do item. Sem `select *`.
- **Tamanho da página** tem padrão (12 em grades de cards, 20 em tabelas do admin) e teto, definidos no repository. O teto e a validação dos parâmetros estão em `seguranca` §8.1.
- **Estado na URL** (`?pagina=2&q=casa&quartos=3`): o Server Component lê os `searchParams` e chama o loader da feature. Assim o botão "voltar" funciona, o link é compartilhável e o Google enxerga as páginas.
- **Busca ao vivo** (resultados enquanto digita, autocomplete): use _debounce_ (esperar ~300 ms depois da última tecla, mínimo de 2 letras) e coloque o texto na chave do TanStack Query, para descartar resposta antiga. Formulário com botão "Buscar" (`SearchBar`) não precisa.
- **Índices:** coluna usada para buscar, filtrar ou ordenar ganha índice na migration. Detalhes do Supabase em `references/stack.md`.
- **Exceção:** listas curtas e de tamanho fixo (selos, FAQ, relacionados, destaques) não têm paginação, mas o repository ainda define a quantidade máxima.

## 4. Componentes de UI

Do mais genérico ao mais específico: `components/ui/` (primitivos: Button, Input, Modal) → `layout/` e `navigation/` → `shared/` (composições sem domínio) → `features/<x>/components/` (UI do domínio).

- **Reutilize primeiro:** procure em `ui/` e `shared/` antes de criar. Estenda com props/variantes em vez de duplicar.
- **Só crie componente novo se nada existente atender**, e documente (propósito e variantes).
- **Proibido CSS solto e botão/input avulso** em pages e features: use os componentes de `ui/` e os tokens (em `styles/`).
- **Loading, vazio e erro:** use o componente padrão de `ui/` ou `shared/` (Spinner/Skeleton, EmptyState, ErrorState); se não existir, crie lá. O hook da feature expõe o estado e a feature ou page decide quando exibir. Nunca improvise por tela.
- Componentes de `components/` são de apresentação: props entram, callbacks saem. Sem dados nem regra de negócio.
- Biblioteca de UI de terceiros (se houver) fica encapsulada em `ui/`. Trocar de biblioteca muda só `ui/`.

## 5. Regras de negócio

Pertencem à feature, nunca à UI. Quando independentes de React e infraestrutura, ficam em `rules.ts` (ou `rules/` quando crescer). Devem ser reutilizáveis e testáveis sem backend real.

## 6. Segurança

- O front-end não é fronteira de segurança. Permissões e operações sensíveis são protegidas no backend.
- Segredos e chaves privadas nunca vão para o front-end; só chaves públicas.
- Valide entradas e dados externos com schema (`schemas.ts`).

## 7. Testes

Teste onde há lógica: `rules.ts`, hooks e repositories com mapeamento não trivial. Use um fake do contrato em vez do backend real.

## 8. Imposição por lint

Imponha as regras de dependência (§1) com lint desde o início. A fonte da verdade é `eslint.config.mjs`; o que ele não cobre está em `references/stack.md` (Lint). Lint barra a violação sem gastar tokens e dá erro concreto para corrigir.

## 9. Árvore antes de mudanças

Antes de implementar, **mostre a árvore** dos arquivos criados, alterados, movidos ou removidos, quando houver:

- nova feature, pasta ou camada;
- criação, remoção ou movimentação de 3+ arquivos;
- mudança que atravesse camadas.

Marque `# novo`, `# alterado` ou `# removido`, com a responsabilidade em poucas palavras:

```text
features/<dominio>/
├── hooks/useExample.ts   # novo: carrega e expõe os exemplos
└── types.ts              # alterado: adiciona tipo Example
```

- Adição dentro da arquitetura existente: mostre a árvore e prossiga.
- Mudança **na** arquitetura existente (mover/remover, nova camada, alterar contrato): mostre a árvore e **aguarde confirmação**.
- Surgiu mudança estrutural não prevista: mostre a árvore atualizada antes de continuar.
- Dispensa: texto, estilo ou correção pontual em um arquivo.
- Nunca altere a arquitetura silenciosamente.

## Checklist

- Está na camada certa e a dependência aponta para baixo?
- Já existe algo que resolva? Reutilizei?
- Usei os componentes de `ui/` em vez de criar CSS ou botão novo?
- A infraestrutura está atrás de um contrato?
- A listagem pode crescer? Está paginada no servidor, com busca e filtro no banco?
- A regra existe em um único lugar?
- Evitei nomes como `utils2`, `helpers-final`, `service-new`, `temp`, `mockFinal`?

**Construir corretamente hoje, sem prever o produto inteiro de amanhã.**
