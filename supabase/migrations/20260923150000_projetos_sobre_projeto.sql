-- Três textos de apoio da seção "Sobre o projeto" (página pública): ambientes, indicado para,
-- aplicações. Mesmo padrão de "descricao": opcional, sem tabela própria.

alter table public.projetos
  add column ambientes text,
  add column indicado_para text,
  add column aplicacoes text;

alter table public.projetos
  add constraint projetos_ambientes_check check (char_length(ambientes) <= 150),
  add constraint projetos_indicado_para_check check (char_length(indicado_para) <= 150),
  add constraint projetos_aplicacoes_check check (char_length(aplicacoes) <= 150);
