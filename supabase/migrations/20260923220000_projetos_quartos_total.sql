-- Soma quartos + suítes numa coluna só, para o filtro "N quartos ou mais" da listagem pública
-- rodar como `where` no banco (skill `arquitetura` §3.1), sem baixar tudo para somar no navegador.
alter table public.projetos
  add column quartos_total integer generated always as (coalesce(quartos, 0) + coalesce(suites, 0)) stored;

create index projetos_quartos_total_idx on public.projetos (quartos_total);
