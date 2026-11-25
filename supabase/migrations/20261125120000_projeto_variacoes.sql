-- Aba "Variações do Projeto" do cadastro: a mesma casa em outros tamanhos de terreno.
--
-- Duas formas de ligar projetos:
-- 1) Automática: projetos com o mesmo "Código do projeto" (`codigo_youtube`). Não precisa de tabela;
--    só ganha um índice, porque o site passa a filtrar por essa coluna.
-- 2) Manual: o admin escolhe outros projetos na aba. Cada ligação é um par, guardado uma vez só e
--    sempre na mesma ordem (menor id primeiro): ligar A a B já liga B a A, e não existe par repetido.
--
-- Só acrescenta: nenhuma tabela, coluna ou policy existente muda.

create index projetos_codigo_youtube_idx
  on public.projetos (codigo_youtube)
  where codigo_youtube is not null;

create table public.projeto_variacoes (
  projeto_a_id uuid not null references public.projetos (id) on delete cascade,
  projeto_b_id uuid not null references public.projetos (id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (projeto_a_id, projeto_b_id),
  -- Par sempre ordenado: impede ligar um projeto a ele mesmo e o mesmo par gravado ao contrário.
  check (projeto_a_id < projeto_b_id)
);

-- A chave primária já cobre a busca por `projeto_a_id`; esta cobre o outro lado do par.
create index projeto_variacoes_projeto_b_idx on public.projeto_variacoes (projeto_b_id);

alter table public.projeto_variacoes enable row level security;

revoke all on public.projeto_variacoes from anon, authenticated;
-- Ligação não se edita: ou existe ou não existe. Por isso não há `update`.
grant select, insert, delete on public.projeto_variacoes to authenticated;
grant select on public.projeto_variacoes to anon;

create policy "administrador gerencia variacoes" on public.projeto_variacoes
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- Site (sem sessão): só os pares em que os DOIS projetos estão publicados. Um rascunho ligado a um
-- projeto publicado não aparece (nem o id dele vaza). Como nos complementares, a policy vale só
-- para `anon`: um usuário comum logado não ganha leitura nenhuma.
create policy "publico le variacoes de projetos publicados" on public.projeto_variacoes
  for select to anon
  using (
    exists (
      select 1 from public.projetos
      where projetos.id = projeto_variacoes.projeto_a_id and projetos.status = 'publicado'
    )
    and exists (
      select 1 from public.projetos
      where projetos.id = projeto_variacoes.projeto_b_id and projetos.status = 'publicado'
    )
  );
