-- Leitura pública (site): só os projetos publicados, e só os arquivos que aparecem no site
-- (principal/galeria/planta) desses projetos. Entrega e PDFs de complementares continuam
-- restritos a "authenticated" (conteúdo pago, entregue por outro caminho).

grant select on public.projetos to anon, authenticated;

create policy "publico le projetos publicados" on public.projetos
  for select to anon, authenticated
  using (status = 'publicado');

grant select on public.projeto_arquivos to anon, authenticated;

create policy "publico le arquivos publicos de projetos publicados" on public.projeto_arquivos
  for select to anon, authenticated
  using (
    papel in ('principal', 'galeria', 'planta')
    and exists (
      select 1 from public.projetos
      where projetos.id = projeto_arquivos.projeto_id
        and projetos.status = 'publicado'
    )
  );
