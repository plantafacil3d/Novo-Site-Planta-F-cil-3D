-- Categorias e ambientes dos produtos passam a ser cadastrados pelo administrador (antes eram uma
-- lista fixa no código). O produto guarda o NOME da opção (`produtos.categoria` e cada item de
-- `produtos.ambientes`), então o site mostra o texto direto, sem consultar esta tabela.
--
-- Regras garantidas aqui:
-- - Categoria em uso por algum produto não pode ser apagada (o produto precisa de uma).
-- - Ambiente apagado sai sozinho de todos os produtos (ambiente é opcional).
-- - A mesma opção não entra duas vezes (sem diferenciar maiúsculas).

create table public.produto_opcoes (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('categoria', 'ambiente')),
  nome text not null check (
    char_length(nome) between 1 and 40 and nome = btrim(nome) and nome !~ '[<>]'
  ),
  criado_em timestamptz not null default now()
);

create unique index produto_opcoes_nome_idx on public.produto_opcoes (tipo, lower(nome));

-- Os produtos agora guardam o nome (não mais um identificador `a-z0-9-`). Ainda não há produtos.
alter table public.produtos drop constraint produtos_categoria_check;
alter table public.produtos
  add constraint produtos_categoria_check check (char_length(categoria) between 1 and 40);

-- ── Ao apagar uma opção ─────────────────────────────────────────────────────────────────────────

create function public.produto_opcoes_ao_apagar()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.tipo = 'categoria' then
    if exists (select 1 from public.produtos p where p.categoria = old.nome) then
      raise exception 'categoria em uso' using errcode = '23503';
    end if;
  else
    update public.produtos
      set ambientes = array_remove(ambientes, old.nome), atualizado_em = now()
      where old.nome = any (ambientes);
  end if;
  return old;
end;
$$;

revoke all on function public.produto_opcoes_ao_apagar() from public, anon, authenticated;

create trigger produto_opcoes_ao_apagar
  before delete on public.produto_opcoes
  for each row execute function public.produto_opcoes_ao_apagar();

-- ── Permissões ──────────────────────────────────────────────────────────────────────────────────
-- Só o administrador lê e grava. O site não precisa desta tabela (o produto já tem o nome).

alter table public.produto_opcoes enable row level security;
revoke all on public.produto_opcoes from anon, authenticated;
grant select, insert, delete on public.produto_opcoes to authenticated;

create policy "administrador gerencia opcoes de produto" on public.produto_opcoes
  for all to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));

-- As opções que já existiam no código, para começar igual.
insert into public.produto_opcoes (tipo, nome) values
  ('categoria', 'Iluminação'),
  ('categoria', 'Móveis'),
  ('categoria', 'Decoração'),
  ('categoria', 'Metais e louças'),
  ('categoria', 'Revestimentos'),
  ('categoria', 'Construção'),
  ('categoria', 'Ferramentas'),
  ('ambiente', 'Sala'),
  ('ambiente', 'Cozinha'),
  ('ambiente', 'Jantar'),
  ('ambiente', 'Suíte'),
  ('ambiente', 'Quarto'),
  ('ambiente', 'Banheiro'),
  ('ambiente', 'Área gourmet'),
  ('ambiente', 'Externo');
