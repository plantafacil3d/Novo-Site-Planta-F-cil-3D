-- Leitura pública (site) dos projetos complementares, só dos projetos publicados, e só das colunas
-- que a página mostra (título, valor e descrição). `entrega` e `link` são conteúdo pago: continuam
-- fechados para o público (o grant é por coluna, então `select *` do anônimo também é negado).
--
-- A policy vale só para `anon`: o site lê sem sessão. Quem está logado como administrador continua
-- pela policy "administrador gerencia complementares", e um usuário comum logado não ganha leitura
-- nenhuma (o grant dele é da tabela inteira, por isso a policy não pode incluí-lo).

grant select (id, projeto_id, titulo, valor_centavos, descricao, ordem)
  on public.projeto_complementares to anon;

create policy "publico le complementares de projetos publicados" on public.projeto_complementares
  for select to anon
  using (
    exists (
      select 1 from public.projetos
      where projetos.id = projeto_complementares.projeto_id
        and projetos.status = 'publicado'
    )
  );
