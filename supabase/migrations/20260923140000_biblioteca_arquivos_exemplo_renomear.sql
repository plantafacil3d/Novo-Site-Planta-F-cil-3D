-- Permite renomear o nome de exibição de um arquivo da biblioteca. A migration anterior
-- (`biblioteca_arquivos_exemplo`) só concedia select/insert/delete de propósito ("renomear é
-- apagar e subir de novo"); na prática o administrador precisa corrigir o nome sem reenviar o
-- arquivo (o caminho no Storage é baseado no id, não no nome, então nada physically move).
-- A policy "administrador gerencia a biblioteca" já é `for all`, então só falta o grant.

grant update on public.arquivos_exemplo to authenticated;
