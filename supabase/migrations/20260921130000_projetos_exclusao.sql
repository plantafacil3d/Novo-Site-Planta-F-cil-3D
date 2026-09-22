-- Exclusão definitiva de projetos no painel do administrador.
--
-- As filhas (`projeto_complementares` e `projeto_arquivos`) saem por cascade: integridade
-- referencial não passa por RLS, então basta liberar o pai. Os objetos no Storage são apagados
-- pelo app, em `excluirProjetos`: o cascade não alcança o Storage.
--
-- Só `delete` (não `all`): a migration do cadastro revogou de propósito TRUNCATE, REFERENCES e
-- TRIGGER de `authenticated`, e `all` devolveria tudo isso.

grant delete on public.projetos to authenticated;

-- Mesma condição das policies de select/insert/update: ser administrador é existir a linha em
-- `public.administradores`. `for delete` não aceita `with check`.
create policy "administrador apaga projetos" on public.projetos for delete to authenticated
  using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
