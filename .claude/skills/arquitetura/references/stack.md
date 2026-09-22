# Stack atual

- Front-end: Next.js (App Router) + React + TypeScript, Zod
- Backend: Supabase (Database Postgres, Storage; Auth se for usado)
- Hospedagem: Hostinger (Web app Node.js, deploy automático via GitHub)

Nada disso pode vazar além da camada de infraestrutura (`SKILL.md` §1 e §3). Para trocar qualquer item, só o adapter/config correspondente muda.

## Next.js

Motivo da escolha: o site precisa ser encontrado no Google. O conteúdo público é renderizado no servidor (estático ou ISR), então o HTML chega pronto para os buscadores.

- **Roteamento só em `src/app/`** (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`). Esses arquivos são finos: leem params, chamam a feature e renderizam uma `view`. Sem regra de negócio.
- **Não existe pasta `src/pages/`**: o Next a interpreta como Pages Router. As composições de tela ficam em `src/views/`.
- **Server Components por padrão.** `'use client'` só onde há estado, efeito ou evento do navegador, e o mais fundo possível na árvore.
- **Conteúdo público e indexável** (home, projetos, páginas de serviço): buscado no servidor pelo repository e renderizado no servidor. Prefira geração estática, com ISR (`revalidate`) quando o conteúdo mudar. Nunca depender de `useEffect` para conteúdo que o Google precisa ver.
- **Áreas interativas** (formulários, painel logado): componentes cliente com TanStack Query chamando o repository.
- Rotas privadas e dinâmicas por usuário não são indexáveis: `noindex` e sem cache compartilhado.

### SEO (parte da definição de pronto de toda página pública)

- `generateMetadata` (ou `metadata`) por página: `title` e `description` únicos, `alternates.canonical`, Open Graph.
- `src/app/sitemap.ts` e `src/app/robots.ts` gerados pelo código; o sitemap lista as páginas públicas, inclusive as vindas do banco.
- Dados estruturados JSON-LD quando fizer sentido (organização, produto/serviço).
- Um único `<h1>` por página, HTML semântico, `alt` nas imagens, `next/image` para imagens e `next/font` para fontes.
- URLs limpas e estáveis; se mudar uma, redirecionar (`redirects` no `next.config`).
- Conferir Core Web Vitals (LCP, CLS, INP) antes de publicar.
- Validar após o deploy no Google Search Console (enviar o sitemap).

## Supabase

- `@supabase/supabase-js` e `@supabase/ssr` só são importados em `lib/` (criação dos clients) e nos adapters `Supabase*`.
- Dois clients em `lib/supabase/`: `server.ts` (Server Components, Route Handlers, Server Actions; importa `server-only`) e `client.ts` (navegador).
- Tipos gerados do banco (`supabase gen types`) ficam na infraestrutura. O adapter mapeia para os tipos do domínio.
- Adapter traduz `PostgrestError` / `StorageError` para `AppError`.
- **RLS ligado em toda tabela exposta**, com policies por operação. Schema e policies versionados em `supabase/migrations/` (SQL). O banco é Postgres: manter as migrations no repositório o deixa reproduzível e portável.
- Chave pública (`anon`/publishable) no navegador. `service_role` só no servidor, em variável **sem** prefixo `NEXT_PUBLIC_`, e somente onde for indispensável.
- Prefira lógica no código da feature. RPC, function ou trigger só para integridade ou atomicidade, e documente o motivo.

### Listas grandes

Regra geral em `SKILL.md` §3.1. No adapter Supabase:

- Pagine com `.range(de, ate)` e peça o total com `{ count: 'exact' }` na mesma consulta.
- Selecione só as colunas do resumo (`.select('id, slug, titulo, ...')`), nunca `select('*')`.
- Ordene sempre por um campo estável **mais o `id`**; sem isso, itens podem repetir ou sumir entre uma página e outra.
- Busca de texto com `ilike '%termo%'` fica lenta em tabela grande: crie índice (`pg_trgm`) ou use busca de texto do Postgres (`to_tsvector`), na migration.
- Por ora, paginação por página (offset). Se uma lista passar de algumas dezenas de milhares e as páginas finais ficarem lentas, migrar essa lista para paginação por cursor (o contrato `Pagina<T>` permite trocar sem mexer nas telas).

### Storage

- Contrato `FileStorage` em `services/storage/` (enviar, remover, resolver URL) + adapter `SupabaseFileStorage`.
- O banco guarda o **path/key** do arquivo, nunca a URL completa do Supabase. Assim, trocar de storage não exige reescrever dados.
- Conteúdo restrito: bucket privado + signed URL, com policies no bucket.
- Imagens do Supabase exibidas com `next/image` exigem o domínio em `images.remotePatterns` no `next.config`.

### Auth (se usado)

- Contrato em `services/auth/` + adapter Supabase. UI e features só conhecem o contrato e o tipo de usuário do domínio.
- Sessão por cookies via `@supabase/ssr`. Autorização de verdade é RLS; verificar o usuário no servidor, não só no `middleware`.

## Hostinger (Web app Node.js)

O deploy roda o Next.js como servidor Node. Cada push na branch de produção dispara o deploy.

- Fluxo: push → a Hostinger clona, roda `npm install` e `npm run build` → sobe com `npm start`.
- `package.json`: `"build": "next build"`, `"start": "next start"`. O servidor deve escutar na porta fornecida pela Hostinger (`PORT`). Confirme no painel como ela é repassada e ajuste o `start` se necessário (`next start -p $PORT`).
- Versão do Node no painel igual à usada localmente (atende ao mínimo do Next).
- Confirme no painel os nomes exatos dos campos (branch, comando de build, comando de start, diretório); eles podem mudar.
- Nenhum código do app depende da hospedagem: trocar de host = rodar o mesmo `next build` / `next start` em outro lugar.
- Não usar `output: 'export'`: o app precisa de servidor para SSR/ISR.
- **Variáveis de ambiente** cadastradas no painel **antes do build**:
  - `NEXT_PUBLIC_*` entra no bundle e é **público**: só URL do Supabase e chave pública.
  - Variável sem o prefixo fica só no servidor e pode guardar segredo.
  - `.env*` fora do git; versione `.env.example`.
- `.next/` e `node_modules/` fora do git.
- **Cabeçalhos de segurança** em `headers()` do `next.config.ts` (modelo):

```ts
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // CSP: definir liberando só o que o app usa (Supabase, fontes, analytics...).
]

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
export default nextConfig
```

## Lint (configurar no início do projeto)

As regras de dependência (SDK só na infraestrutura, features só via `index.ts`, `components/` e `views/` sem infraestrutura, `app/` fino) são impostas por `no-restricted-imports` em `eslint.config.mjs`, que é a fonte da verdade. Ao criar uma camada nova, atualize o config.

O que o config não cobre:

- Código que só roda no servidor (`lib/supabase/server.ts`, repositories usados no servidor) importa `server-only`, para o build falhar se vazar para o cliente.
- Biblioteca de UI de terceiros (se houver) só é importada em `src/components/ui/**`.

Estilização: **Tailwind v4** (config em CSS, tokens em `src/styles/tokens.css`), variantes com `class-variance-authority` e junção de classes com `clsx` + `tailwind-merge`. Prettier com `prettier-plugin-tailwindcss` ordena as classes.

Dentro de uma feature, use imports relativos.
