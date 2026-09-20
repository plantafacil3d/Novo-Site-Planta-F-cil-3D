-- Painel do administrador: listagem de projetos.
-- Só as colunas que a tabela do painel usa; o cadastro completo do projeto vem depois.

create extension if not exists pg_trgm with schema extensions;

-- Quem é administrador. Só se cadastra por SQL ou service_role: nenhuma policy de escrita.
create table public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);
alter table public.administradores enable row level security;

create policy "administrador le o proprio registro"
  on public.administradores for select to authenticated
  using (user_id = (select auth.uid()));

-- Código do cliente (PF-1000, PF-1001...) gerado pelo banco: sem corrida ao duplicar em massa.
create sequence public.projetos_codigo_seq start 1000;

create table public.projetos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique
    default ('PF-' || lpad(nextval('public.projetos_codigo_seq')::text, 4, '0')),
  slug text not null unique,
  titulo text not null check (char_length(titulo) between 1 and 200),
  tipo text not null check (tipo in ('sobrado', 'casa-terrea', 'casa-de-campo')),
  preco_centavos integer not null check (preco_centavos >= 0),
  status text not null default 'rascunho' check (status in ('publicado', 'rascunho')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
alter sequence public.projetos_codigo_seq owned by public.projetos.codigo;

-- Ordem estável da listagem (data + id) e busca por trecho de nome ou código.
create index projetos_ordem_idx on public.projetos (criado_em desc, id desc);
create index projetos_titulo_trgm_idx on public.projetos using gin (titulo extensions.gin_trgm_ops);
create index projetos_codigo_trgm_idx on public.projetos using gin (codigo extensions.gin_trgm_ops);

alter table public.projetos enable row level security;
revoke all on public.projetos from anon;
grant select, insert, update on public.projetos to authenticated;
grant usage on sequence public.projetos_codigo_seq to authenticated;

create policy "administrador le projetos" on public.projetos for select to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
create policy "administrador cria projetos" on public.projetos for insert to authenticated
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
create policy "administrador altera projetos" on public.projetos for update to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- Dados de demonstração (os 4 projetos de exemplo da home).
insert into public.projetos (codigo, slug, titulo, tipo, preco_centavos, status) values
  ('PF-001', 'sobrado-pequeno-moderno-e-inteligente', 'Sobrado Pequeno, Moderno e Inteligente', 'sobrado', 39900, 'publicado'),
  ('PF-002', 'casa-terrea-moderna', 'Casa Térrea Moderna', 'casa-terrea', 34900, 'publicado'),
  ('PF-003', 'sobrado-com-piscina', 'Sobrado com Piscina', 'sobrado', 49900, 'publicado'),
  ('PF-004', 'casa-terrea-com-2-suites', 'Casa Térrea com 2 Suítes', 'casa-terrea', 39900, 'publicado');
