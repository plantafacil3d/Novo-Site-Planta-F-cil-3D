-- Prévias do projeto: fotos de plantas e detalhamentos que a página do produto mostra antes da compra
-- (aba "Prévias do Projeto" do cadastro). Usam a mesma tabela e o mesmo bucket público das demais
-- imagens do projeto, com um papel novo: `previa`.
--
-- Só acrescenta: nenhum papel existente muda. A leitura pública (site) continua limitada a projetos
-- publicados; `entrega` e `complementar_pdf` seguem restritos (conteúdo pago).

alter table public.projeto_arquivos drop constraint projeto_arquivos_papel_check;

alter table public.projeto_arquivos
  add constraint projeto_arquivos_papel_check
  check (papel in ('principal', 'galeria', 'planta', 'previa', 'entrega', 'complementar_pdf'));

-- A policy de leitura pública lista os papéis que aparecem no site; sem `previa` aqui, a página
-- leria zero prévias em silêncio.
drop policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos;

create policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos
  for select to anon, authenticated
  using (
    papel in ('principal', 'galeria', 'planta', 'previa')
    and exists (
      select 1 from public.projetos
      where projetos.id = projeto_arquivos.projeto_id
        and projetos.status = 'publicado'
    )
  );
