-- "Família indicada" deixa de ser texto livre e vira número (capacidade de pessoas); o rótulo
-- "Até N pessoas" é gerado no app a partir do número. "Perfil do terreno" continua texto (a lista
-- fixa de opções mora só no front, mesmo padrão de categoria/estilo). Nenhuma gravação real usa o
-- texto livre anterior (coluna criada na mesma sessão de trabalho), então a troca é direta.

alter table public.projetos
  drop constraint projetos_familia_indicada_check;

alter table public.projetos
  drop column familia_indicada;

alter table public.projetos
  add column familia_capacidade smallint
    check (familia_capacidade between 1 and 20);
