-- Cadastro do projeto de verdade: grava tudo que o formulário coleta, no banco e no Storage.
--
-- Categoria e estilo são texto simples no banco. As listas de opções moram no front (catálogo do
-- cadastro) e o servidor confere o valor antes de gravar: sem tabela de categorias, sem chave
-- estrangeira e sem lista fixa aqui. O que é obrigatório para publicar é regra do app; o banco só
-- guarda formato e limites, e por isso quase tudo aceita nulo (o rascunho pode ficar incompleto).

-- ── 1. projetos ─────────────────────────────────────────────────────────────────────────────────

-- `tipo` (3 valores fixos) vira `categoria` (texto). Os projetos de exemplo passam para o novo vocabulário.
alter table public.projetos drop constraint projetos_tipo_check;
alter table public.projetos rename column tipo to categoria;
alter table public.projetos alter column categoria drop not null;
update public.projetos
  set categoria = case categoria
    when 'sobrado' then 'sobrados'
    when 'casa-terrea' then 'casas-terreas'
    when 'casa-de-campo' then 'casas-de-campo'
    else categoria
  end;
alter table public.projetos
  add constraint projetos_categoria_check check (char_length(categoria) between 1 and 60);

alter table public.projetos drop constraint projetos_estilo_check;
alter table public.projetos
  add constraint projetos_estilo_check check (char_length(estilo) between 1 and 60);

-- Rascunho só exige o título: preço, piscina e área gourmet podem ficar sem valor.
alter table public.projetos alter column preco_centavos drop not null;
alter table public.projetos
  alter column piscina drop not null,
  alter column piscina drop default,
  alter column area_gourmet drop not null,
  alter column area_gourmet drop default;

-- Limites do formulário: resumo 500, descrição 4000, terreno até 1000 m.
alter table public.projetos
  drop constraint projetos_resumo_check,
  drop constraint projetos_descricao_check,
  drop constraint projetos_largura_m_check,
  drop constraint projetos_profundidade_m_check;
alter table public.projetos
  alter column largura_m type numeric(6, 2),
  alter column profundidade_m type numeric(6, 2);
alter table public.projetos
  add constraint projetos_resumo_check check (char_length(resumo) <= 500),
  add constraint projetos_descricao_check check (char_length(descricao) <= 4000),
  add constraint projetos_largura_m_check check (largura_m > 0 and largura_m <= 1000),
  add constraint projetos_profundidade_m_check check (profundidade_m > 0 and profundidade_m <= 1000);

-- Campos que o formulário tem e a tabela ainda não tinha.
alter table public.projetos
  add column preco_promocional_centavos integer,
  add column tags text[] not null default '{}',
  add column video_url text,
  add column suite_master smallint,
  add column lavabo smallint,
  add column itens text[] not null default '{}',
  add column entrega_link text;
alter table public.projetos
  add constraint projetos_preco_promocional_check check (
    preco_promocional_centavos is null
    or (preco_promocional_centavos > 0
        and (preco_centavos is null or preco_promocional_centavos < preco_centavos))
  ),
  add constraint projetos_tags_check check (cardinality(tags) <= 10),
  add constraint projetos_video_url_check
    check (char_length(video_url) <= 500 and video_url ~ '^https://'),
  add constraint projetos_suite_master_check check (suite_master between 0 and 20),
  add constraint projetos_lavabo_check check (lavabo between 0 and 10),
  add constraint projetos_itens_check check (cardinality(itens) <= 100),
  add constraint projetos_entrega_link_check
    check (char_length(entrega_link) <= 500 and entrega_link ~ '^https://');

-- Colunas usadas nos filtros do site público (quando ele for ligado ao banco).
create index projetos_categoria_idx on public.projetos (categoria);
create index projetos_estilo_idx on public.projetos (estilo);

-- O papel `authenticated` recebeu TRUNCATE, REFERENCES e TRIGGER por padrão, e o RLS não protege
-- TRUNCATE. Fica só o que o painel usa.
revoke all on public.projetos from authenticated;
grant select, insert, update on public.projetos to authenticated;
revoke all on public.administradores from authenticated;
grant select on public.administradores to authenticated;

-- ── 2. Complementares e arquivos ────────────────────────────────────────────────────────────────

-- O id é gerado pelo formulário (o PDF do complementar precisa dele antes de existir no banco).
create table public.projeto_complementares (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  titulo text check (char_length(titulo) between 1 and 80),
  valor_centavos integer check (valor_centavos > 0),
  descricao text check (char_length(descricao) <= 300),
  entrega text check (entrega in ('link', 'pdf')),
  link text check (char_length(link) <= 500 and link ~ '^https://'),
  ordem smallint not null default 0,
  criado_em timestamptz not null default now(),
  unique (id, projeto_id)
);
create index projeto_complementares_projeto_idx
  on public.projeto_complementares (projeto_id, ordem);

-- Um registro por arquivo enviado ao Storage. O banco guarda só o caminho dentro do bucket (nunca
-- a URL do Supabase); o bucket sai do papel: imagens e plantas no público, o resto no privado.
create table public.projeto_arquivos (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  papel text not null
    check (papel in ('principal', 'galeria', 'planta', 'entrega', 'complementar_pdf')),
  complementar_id uuid,
  caminho text not null unique check (char_length(caminho) <= 300),
  nome_original text not null check (char_length(nome_original) between 1 and 255),
  rotulo text check (char_length(rotulo) <= 60),
  tamanho_bytes integer not null check (tamanho_bytes > 0 and tamanho_bytes <= 20971520),
  tipo_mime text not null check (char_length(tipo_mime) <= 100),
  ordem smallint not null default 0,
  criado_em timestamptz not null default now(),
  -- O PDF só pode apontar para um complementar do mesmo projeto.
  foreign key (complementar_id, projeto_id)
    references public.projeto_complementares (id, projeto_id) on delete cascade,
  check ((papel = 'complementar_pdf') = (complementar_id is not null))
);
create index projeto_arquivos_projeto_idx on public.projeto_arquivos (projeto_id, papel, ordem);
create index projeto_arquivos_complementar_idx
  on public.projeto_arquivos (complementar_id, projeto_id);
create unique index projeto_arquivos_principal_idx
  on public.projeto_arquivos (projeto_id) where papel = 'principal';
create unique index projeto_arquivos_pdf_idx
  on public.projeto_arquivos (complementar_id) where papel = 'complementar_pdf';

alter table public.projeto_complementares enable row level security;
alter table public.projeto_arquivos enable row level security;
revoke all on public.projeto_complementares from anon, authenticated;
revoke all on public.projeto_arquivos from anon, authenticated;
grant select, insert, update, delete on public.projeto_complementares to authenticated;
grant select, insert, update, delete on public.projeto_arquivos to authenticated;

create policy "administrador gerencia complementares" on public.projeto_complementares
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
create policy "administrador gerencia arquivos" on public.projeto_arquivos
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- ── 3. Storage ──────────────────────────────────────────────────────────────────────────────────

-- Público: imagens do projeto, principal e plantas (aparecem no site). Até 2 MB, só imagem.
-- Privado: entrega do projeto e PDFs dos complementares (conteúdo pago). Até 20 MB por arquivo;
-- o limite de 20 MB no total da entrega é conferido pelo app.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('projetos-publico', 'projetos-publico', true, 2097152,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('projetos-privado', 'projetos-privado', false, 20971520,
    array['application/pdf', 'application/zip', 'application/vnd.rar'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Só administrador envia, lê e apaga. A leitura pública das imagens vem do próprio bucket público.
create policy "administrador envia arquivos de projeto" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('projetos-publico', 'projetos-privado')
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
create policy "administrador le arquivos de projeto" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('projetos-publico', 'projetos-privado')
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
create policy "administrador apaga arquivos de projeto" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('projetos-publico', 'projetos-privado')
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
