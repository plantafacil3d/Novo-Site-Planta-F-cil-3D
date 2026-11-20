-- Aba "Marketing" do cadastro: seção "O que nossos clientes dizem" da página do projeto.
--
-- 1) Prints de clientes (WhatsApp, SketchUp, Instagram): mesma tabela e mesmo bucket público das demais
--    imagens do projeto, com um papel novo: `depoimento`.
-- 2) Comentários escritos pelo admin (estrelas, texto, nome, cidade): uma lista em jsonb no próprio
--    projeto. São poucos, sempre lidos e gravados juntos com o projeto, e não têm arquivo nem vínculo
--    com outra tabela. A leitura pública já vale para a linha inteira de projetos publicados.
--
-- Só acrescenta: nenhum papel nem coluna existente muda. `entrega` e `complementar_pdf` seguem restritos.

alter table public.projeto_arquivos drop constraint projeto_arquivos_papel_check;

alter table public.projeto_arquivos
  add constraint projeto_arquivos_papel_check
  check (papel in ('principal', 'galeria', 'planta', 'previa', 'depoimento', 'entrega', 'complementar_pdf'));

-- A policy de leitura pública lista os papéis que aparecem no site; sem `depoimento` aqui, a página
-- leria zero prints em silêncio.
drop policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos;

create policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos
  for select to anon, authenticated
  using (
    papel in ('principal', 'galeria', 'planta', 'previa', 'depoimento')
    and exists (
      select 1 from public.projetos
      where projetos.id = projeto_arquivos.projeto_id
        and projetos.status = 'publicado'
    )
  );

-- Lista de { nota, texto, nome, cidade }. O app confere cada campo antes de gravar (`schemas.ts`);
-- aqui fica a garantia mínima: é uma lista e não passa de 30 itens (o mesmo teto da tela).
alter table public.projetos
  add column comentarios_clientes jsonb not null default '[]'::jsonb;

alter table public.projetos
  add constraint projetos_comentarios_clientes_check
  check (
    -- `case` garante a ordem: `jsonb_array_length` dá erro se o valor não for uma lista.
    case
      when jsonb_typeof(comentarios_clientes) = 'array'
        then jsonb_array_length(comentarios_clientes) <= 30
      else false
    end
  );
