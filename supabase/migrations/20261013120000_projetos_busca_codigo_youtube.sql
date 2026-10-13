-- A busca (nome + código automático) ignorava o código que o administrador digita no cadastro
-- (`codigo_youtube`, ex.: "P-16"), então buscar por ele não achava nada, no site e no painel.
-- Agora a coluna inclui esse código, e também a versão sem hífen, para "P16" achar "P-16".
-- Coluna gerada não pode ser alterada: recria a coluna e o índice (é só dado derivado, nada se perde).
drop index public.projetos_busca_trgm_idx;
alter table public.projetos drop column busca;

alter table public.projetos
  add column busca text generated always as (
    lower(
      titulo || ' ' || codigo || ' ' ||
      coalesce(codigo_youtube, '') || ' ' || replace(coalesce(codigo_youtube, ''), '-', '')
    )
  ) stored;

create index projetos_busca_trgm_idx on public.projetos using gin (busca extensions.gin_trgm_ops);
