-- Biblioteca central de arquivos de exemplo: o administrador sobe cada arquivo uma vez só (num
-- "acervo" próprio) e depois só VINCULA arquivos já existentes a quantos projetos quiser — nunca
-- reenvia o mesmo arquivo. Duas tabelas resolvem sozinhas, via cascade, as duas regras de negócio:
--
--   - apagar um arquivo da biblioteca precisa sumir de TODOS os projetos que o usavam:
--     `projeto_arquivos_exemplo.arquivo_id` tem `on delete cascade` para `arquivos_exemplo`.
--   - apagar um projeto NÃO pode apagar os arquivos da biblioteca, só o vínculo dele:
--     `arquivos_exemplo` não tem nenhuma referência a `projetos`; só a linha de vínculo (que tem
--     `projeto_id on delete cascade`) desaparece.

-- ── 1. Biblioteca ───────────────────────────────────────────────────────────────────────────────

create table public.arquivos_exemplo (
  id uuid primary key default gen_random_uuid(),
  caminho text not null unique check (char_length(caminho) <= 300),
  nome_original text not null check (char_length(nome_original) between 1 and 255),
  tipo_mime text not null check (char_length(tipo_mime) <= 100),
  tamanho_bytes integer not null check (tamanho_bytes > 0 and tamanho_bytes <= 20971520),
  criado_em timestamptz not null default now()
);
create index arquivos_exemplo_criado_idx on public.arquivos_exemplo (criado_em desc);

create table public.projeto_arquivos_exemplo (
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  arquivo_id uuid not null references public.arquivos_exemplo (id) on delete cascade,
  ordem smallint not null default 0,
  criado_em timestamptz not null default now(),
  primary key (projeto_id, arquivo_id)
);
create index projeto_arquivos_exemplo_arquivo_idx on public.projeto_arquivos_exemplo (arquivo_id);

alter table public.arquivos_exemplo enable row level security;
alter table public.projeto_arquivos_exemplo enable row level security;
revoke all on public.arquivos_exemplo from anon, authenticated;
revoke all on public.projeto_arquivos_exemplo from anon, authenticated;
-- Sem `update`: renomear é apagar e subir de novo, não editar a linha.
grant select, insert, delete on public.arquivos_exemplo to authenticated;
grant select, insert, delete on public.projeto_arquivos_exemplo to authenticated;

create policy "administrador gerencia a biblioteca" on public.arquivos_exemplo
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
create policy "administrador gerencia vinculos de exemplo" on public.projeto_arquivos_exemplo
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- ── 2. Storage ──────────────────────────────────────────────────────────────────────────────────

-- Público de propósito (skill `seguranca` §6, regra de negócio do produto): o arquivo de exemplo é
-- preview, qualquer visitante pode ver sem comprar — diferente do arquivo de entrega (pago), que
-- fica no bucket privado. Aceita imagem, PDF e DWG; a extensão DWG não tem um MIME padronizado entre
-- navegadores, então o app confere o conteúdo de verdade depois do envio (`formatoConfere`) — a
-- lista abaixo é só a primeira barreira, não a autorização final.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('biblioteca-exemplos', 'biblioteca-exemplos', true, 20971520,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/octet-stream'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Só administrador envia, lê e apaga. A leitura pública dos arquivos vem do próprio bucket público.
create policy "administrador envia arquivos da biblioteca" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'biblioteca-exemplos'
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
create policy "administrador le arquivos da biblioteca" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'biblioteca-exemplos'
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
create policy "administrador apaga arquivos da biblioteca" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'biblioteca-exemplos'
    and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
  );
