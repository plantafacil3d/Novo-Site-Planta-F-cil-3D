-- Dois textos de apoio da seção "Para quem é este projeto?" (página pública): perfil do terreno e
-- família indicada. Mesmo padrão de "aplicacoes"/"indicado_para": opcional, sem tabela própria.
-- As policies e os grants da tabela `projetos` já valem para as colunas novas.

alter table public.projetos
  add column perfil_terreno text,
  add column familia_indicada text;

alter table public.projetos
  add constraint projetos_perfil_terreno_check check (char_length(perfil_terreno) <= 150),
  add constraint projetos_familia_indicada_check check (char_length(familia_indicada) <= 150);
