-- Favoritos do cliente final: qualquer conta Google autenticada pode favoritar um projeto.
-- Favorito é binário (existe ou não) e é sempre lido/escrito só pelo próprio dono (RLS).

create table public.favoritos (
  user_id uuid not null references auth.users (id) on delete cascade,
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (user_id, projeto_id)
);

alter table public.favoritos enable row level security;

revoke all on public.favoritos from anon;
grant select, insert, delete on public.favoritos to authenticated;

create policy "favoritos_select_own" on public.favoritos
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "favoritos_insert_own" on public.favoritos
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "favoritos_delete_own" on public.favoritos
  for delete to authenticated
  using (user_id = (select auth.uid()));
