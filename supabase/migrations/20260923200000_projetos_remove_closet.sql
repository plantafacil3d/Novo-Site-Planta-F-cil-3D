-- Suíte master implica closet, então o campo virou redundante: uma suíte master sem closet não
-- existe na prática. `closet` deixa de ser perguntado no Cadastro e some da página do projeto.

alter table public.projetos
  drop column closet;
