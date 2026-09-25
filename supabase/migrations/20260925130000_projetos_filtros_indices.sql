-- Os filtros "N ou mais" da listagem pública já buscam (`gte`) e agora também ordenam (`buscarLimites`,
-- pra achar o maior valor real de cada campo) por estas colunas. Quartos (`quartos_total`), área e
-- preço já tinham índice; faltavam as demais.
create index projetos_suites_idx on public.projetos (suites);
create index projetos_suite_master_idx on public.projetos (suite_master);
create index projetos_banheiros_idx on public.projetos (banheiros);
create index projetos_lavabo_idx on public.projetos (lavabo);
create index projetos_vagas_idx on public.projetos (vagas);
create index projetos_pavimentos_idx on public.projetos (pavimentos);
