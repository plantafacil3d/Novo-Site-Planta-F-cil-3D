-- Preço que vale de verdade (promocional quando existe, senão o normal), numa coluna só, para
-- ordenar "menor/maior preço" no banco (skill `arquitetura` §3.1: ordenação sempre roda no banco).
alter table public.projetos
  add column preco_efetivo_centavos integer generated always as (
    coalesce(preco_promocional_centavos, preco_centavos, 0)
  ) stored;

create index projetos_preco_efetivo_idx on public.projetos (preco_efetivo_centavos);
