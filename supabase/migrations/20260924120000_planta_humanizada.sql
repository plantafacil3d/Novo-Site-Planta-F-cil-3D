-- Nova aba "Planta humanizada": substitui a seção "Plantas" solta da aba Imagens. Cada pavimento
-- vira uma linha própria (nome + ordem) com uma lista opcional de informações (nome/metragem/
-- número da bolinha), e continua usando `papel = 'planta'` em `projeto_arquivos` para a imagem —
-- só que agora sempre ligada a um pavimento, nunca solta com um rótulo livre.

-- ── 1. projeto_pavimentos ───────────────────────────────────────────────────────────────────────

-- `nome` nulo = sem nome customizado: a tela mostra o padrão calculado pela posição ("Pavimento N").
create table public.projeto_pavimentos (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  nome text check (char_length(nome) <= 60),
  ordem smallint not null default 0,
  criado_em timestamptz not null default now(),
  unique (id, projeto_id)
);
create index projeto_pavimentos_projeto_idx on public.projeto_pavimentos (projeto_id, ordem);

-- ── 2. pavimento_itens ──────────────────────────────────────────────────────────────────────────

create table public.pavimento_itens (
  id uuid primary key default gen_random_uuid(),
  pavimento_id uuid not null references public.projeto_pavimentos (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 80),
  metragem_m2 numeric(6, 2) check (metragem_m2 is null or (metragem_m2 > 0 and metragem_m2 <= 9999)),
  numero_bolinha smallint check (numero_bolinha is null or numero_bolinha between 1 and 999),
  ordem smallint not null default 0,
  criado_em timestamptz not null default now()
);
create index pavimento_itens_pavimento_idx on public.pavimento_itens (pavimento_id, ordem);

-- ── 3. projeto_arquivos: vínculo com o pavimento ───────────────────────────────────────────────

-- As "plantas" antigas (papel solto, só com um rótulo livre) não têm como virar pavimento sozinhas
-- (não há imagem-para-nome a inferir): saem daqui. Os arquivos ficam no Storage (limpeza futura,
-- mesmo critério já usado pelo app quando um arquivo sai do banco antes de sair do Storage).
delete from public.projeto_arquivos where papel = 'planta';

alter table public.projeto_arquivos add column pavimento_id uuid;
alter table public.projeto_arquivos
  add constraint projeto_arquivos_pavimento_fk
  foreign key (pavimento_id, projeto_id) references public.projeto_pavimentos (id, projeto_id)
  on delete cascade;
-- Toda imagem de planta agora pertence a um pavimento; nenhum outro papel usa esta coluna.
alter table public.projeto_arquivos
  add constraint projeto_arquivos_pavimento_check check ((papel = 'planta') = (pavimento_id is not null));
-- No máximo uma imagem por pavimento.
create unique index projeto_arquivos_pavimento_idx on public.projeto_arquivos (pavimento_id) where papel = 'planta';

-- `rotulo` só servia ao nome livre das plantas antigas; o nome agora mora em projeto_pavimentos.
alter table public.projeto_arquivos drop column rotulo;

-- ── 4. RLS ──────────────────────────────────────────────────────────────────────────────────────

alter table public.projeto_pavimentos enable row level security;
alter table public.pavimento_itens enable row level security;
revoke all on public.projeto_pavimentos from anon, authenticated;
revoke all on public.pavimento_itens from anon, authenticated;
grant select, insert, update, delete on public.projeto_pavimentos to authenticated;
grant select, insert, update, delete on public.pavimento_itens to authenticated;

create policy "administrador gerencia pavimentos" on public.projeto_pavimentos
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

create policy "administrador gerencia itens de pavimento" on public.pavimento_itens
  for all to authenticated
  using (
    exists (
      select 1 from public.projeto_pavimentos p
      where p.id = pavimento_itens.pavimento_id
        and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.projeto_pavimentos p
      where p.id = pavimento_itens.pavimento_id
        and exists (select 1 from public.administradores a where a.user_id = (select auth.uid()))
    )
  );

-- Leitura pública: só pavimentos (e itens) de projetos publicados, mesmo padrão de
-- `20260923190000_projetos_leitura_publica.sql`.
grant select on public.projeto_pavimentos to anon, authenticated;
grant select on public.pavimento_itens to anon, authenticated;

create policy "publico le pavimentos de projetos publicados" on public.projeto_pavimentos
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.projetos
      where projetos.id = projeto_pavimentos.projeto_id and projetos.status = 'publicado'
    )
  );

create policy "publico le itens de pavimentos publicados" on public.pavimento_itens
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.projeto_pavimentos p
      join public.projetos on projetos.id = p.projeto_id
      where p.id = pavimento_itens.pavimento_id and projetos.status = 'publicado'
    )
  );
