-- Produtos recomendados: página "Loja", seção "Decore como no projeto", menu "Produtos" do painel e
-- aba "Decoração" do cadastro de projeto.
--
-- Cada produto é cadastrado uma vez só e pode aparecer em vários projetos. O produto guarda só um
-- link de oferta genérico (de qualquer loja): o sistema não conhece nem guarda o nome de loja
-- nenhuma. Não há preço.
--
-- Os cliques em "Ver oferta" passam pelo site (`/ir/produto/<id>`), que anota o clique aqui e
-- redireciona para o link exatamente como cadastrado.
--
-- Só acrescenta: nenhuma tabela, coluna ou policy existente muda.

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 120),
  -- Caminho da foto no Storage (bucket público dos projetos, pasta `produtos/`). O adapter monta a URL.
  foto_caminho text not null check (foto_caminho ~ '^produtos/[0-9a-f-]{36}\.(webp|jpg|png)$'),
  -- Link da oferta, gravado exatamente como foi cadastrado (sem espaços nas pontas).
  link text not null check (char_length(link) <= 2000 and link ~ '^https?://[^\s]+$'),
  -- Identificadores neutros (ex.: `iluminacao`, `area-gourmet`); a lista válida fica no código.
  categoria text not null check (categoria ~ '^[a-z0-9-]{1,40}$'),
  ambientes text[] not null default '{}' check (cardinality(ambientes) <= 20),
  origem text not null default 'afiliado' check (origem in ('afiliado', 'proprio')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- O mesmo link não entra duas vezes (o cadastro avisa antes; o índice garante).
create unique index produtos_link_idx on public.produtos (link);
-- A Loja filtra por ativo + categoria e por ambiente, e ordena pelos mais novos.
create index produtos_ativo_categoria_idx on public.produtos (ativo, categoria);
create index produtos_ambientes_idx on public.produtos using gin (ambientes);
create index produtos_criado_em_idx on public.produtos (criado_em desc, id desc);

-- Produto ↔ projeto. `ordem` é a posição do produto na seção daquele projeto (aba Decoração).
create table public.produto_projetos (
  produto_id uuid not null references public.produtos (id) on delete cascade,
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  ordem integer not null default 0 check (ordem between 0 and 10000),
  criado_em timestamptz not null default now(),
  primary key (produto_id, projeto_id)
);

create index produto_projetos_projeto_idx on public.produto_projetos (projeto_id, ordem);

-- Um registro por clique em "Ver oferta". `pagina`: de onde veio o clique.
create table public.produto_cliques (
  id bigint generated always as identity primary key,
  produto_id uuid not null references public.produtos (id) on delete cascade,
  pagina text not null check (pagina in ('loja', 'projeto')),
  projeto_id uuid references public.projetos (id) on delete set null,
  criado_em timestamptz not null default now(),
  -- Clique da Loja não tem projeto.
  check (pagina = 'projeto' or projeto_id is null)
);

create index produto_cliques_produto_idx on public.produto_cliques (produto_id, criado_em desc);
create index produto_cliques_projeto_idx on public.produto_cliques (projeto_id)
  where projeto_id is not null;

-- ── Permissões ──────────────────────────────────────────────────────────────────────────────────

alter table public.produtos enable row level security;
alter table public.produto_projetos enable row level security;
alter table public.produto_cliques enable row level security;

revoke all on public.produtos, public.produto_projetos, public.produto_cliques
  from anon, authenticated;

grant select, insert, update, delete on public.produtos to authenticated;
grant select, insert, update, delete on public.produto_projetos to authenticated;
grant select, delete on public.produto_cliques to authenticated;

grant select on public.produtos, public.produto_projetos to anon;
-- O visitante só ANOTA cliques; nunca lê a tabela.
grant insert on public.produto_cliques to anon;

create policy "administrador gerencia produtos" on public.produtos
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

create policy "administrador gerencia produtos dos projetos" on public.produto_projetos
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

create policy "administrador le cliques" on public.produto_cliques
  for select to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

create policy "administrador apaga cliques" on public.produto_cliques
  for delete to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- Site (sem sessão): só produtos ativos. Como nas outras tabelas, vale só para `anon`.
create policy "publico le produtos ativos" on public.produtos
  for select to anon
  using (ativo);

-- Ligações só de produto ativo com projeto publicado (rascunho ligado não vaza).
create policy "publico le produtos de projetos publicados" on public.produto_projetos
  for select to anon
  using (
    exists (select 1 from public.produtos p where p.id = produto_projetos.produto_id and p.ativo)
    and exists (
      select 1 from public.projetos
      where projetos.id = produto_projetos.projeto_id and projetos.status = 'publicado'
    )
  );

-- Clique só de produto ativo; vindo de um projeto, o projeto precisa estar publicado.
create policy "publico anota cliques" on public.produto_cliques
  for insert to anon
  with check (
    exists (select 1 from public.produtos p where p.id = produto_cliques.produto_id and p.ativo)
    and (
      (pagina = 'loja' and projeto_id is null)
      or (
        pagina = 'projeto'
        and exists (
          select 1 from public.projetos
          where projetos.id = produto_cliques.projeto_id and projetos.status = 'publicado'
        )
      )
    )
  );
