-- `closet` foi criada como NOT NULL, diferente de `piscina`/`area_gourmet` (nullable, mesmo padrão
-- Sim/Não/vazio do rascunho). Sem isso, salvar um rascunho antes de preencher a aba Características
-- falha: o formulário manda `null` enquanto o campo não foi respondido.

alter table public.projetos
  alter column closet drop not null;
