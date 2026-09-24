-- Índice para o filtro "área de X a Y m²" e a ordenação por área (skill `arquitetura` §3.1).
create index projetos_area_construida_idx on public.projetos (area_construida_m2);
