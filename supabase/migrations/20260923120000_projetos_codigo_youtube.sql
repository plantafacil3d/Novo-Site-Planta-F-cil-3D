-- Código manual que o administrador digita para ligar o projeto a um vídeo específico do YouTube.
-- Sempre maiúsculo: o app já envia maiúsculo (filtro no campo + schema), e o banco também impõe,
-- para o caso de o dado ser gravado fora do app. Opcional, como o resto do cadastro básico: o
-- rascunho pode ficar sem ele.

alter table public.projetos
  add column codigo_youtube text
    check (codigo_youtube is null or codigo_youtube ~ '^[A-Z0-9-]{1,30}$');
