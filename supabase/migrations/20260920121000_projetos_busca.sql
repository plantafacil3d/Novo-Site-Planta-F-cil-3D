-- Busca por nome ou código numa coluna só: o adapter filtra com ilike parametrizado,
-- sem montar .or() com o texto do usuário (skill `seguranca` §8.1).
drop index public.projetos_titulo_trgm_idx;
drop index public.projetos_codigo_trgm_idx;

alter table public.projetos
  add column busca text generated always as (lower(titulo || ' ' || codigo)) stored;

create index projetos_busca_trgm_idx on public.projetos using gin (busca extensions.gin_trgm_ops);
