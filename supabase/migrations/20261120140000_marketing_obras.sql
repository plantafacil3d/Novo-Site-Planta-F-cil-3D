-- Aba "Marketing" do cadastro: seção "Do projeto à obra" (obras de clientes) da página do projeto.
--
-- 1) Fotos de obras de clientes: mesma tabela e mesmo bucket público das demais imagens do projeto,
--    com um papel novo: `obra`.
-- 2) A legenda de cada foto (situação da obra e cidade): uma lista em jsonb no próprio projeto, ligada
--    à foto pelo id do arquivo. São no máximo 5, sempre lidas e gravadas junto com o projeto. A leitura
--    pública já vale para a linha inteira de projetos publicados.
--
-- Só acrescenta: nenhum papel nem coluna existente muda. `entrega` e `complementar_pdf` seguem restritos.

alter table public.projeto_arquivos drop constraint projeto_arquivos_papel_check;

alter table public.projeto_arquivos
  add constraint projeto_arquivos_papel_check
  check (papel in ('principal', 'galeria', 'planta', 'previa', 'depoimento', 'obra', 'entrega', 'complementar_pdf'));

-- A policy de leitura pública lista os papéis que aparecem no site; sem `obra` aqui, a página leria
-- zero fotos em silêncio.
drop policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos;

create policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos
  for select to anon, authenticated
  using (
    papel in ('principal', 'galeria', 'planta', 'previa', 'depoimento', 'obra')
    and exists (
      select 1 from public.projetos
      where projetos.id = projeto_arquivos.projeto_id
        and projetos.status = 'publicado'
    )
  );

-- Lista de { arquivoId, etapa, cidade }. O app confere cada campo antes de gravar (`schemas.ts`);
-- aqui fica a garantia mínima: é uma lista e não passa de 5 itens (o mesmo teto da tela).
alter table public.projetos
  add column obras_clientes jsonb not null default '[]'::jsonb;

alter table public.projetos
  add constraint projetos_obras_clientes_check
  check (
    -- `case` garante a ordem: `jsonb_array_length` dá erro se o valor não for uma lista.
    case
      when jsonb_typeof(obras_clientes) = 'array'
        then jsonb_array_length(obras_clientes) <= 5
      else false
    end
  );
