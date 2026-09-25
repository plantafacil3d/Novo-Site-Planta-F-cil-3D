-- Índice da chave estrangeira `projeto_id`: acelera o cascade delete quando um projeto é excluído
-- e qualquer consulta futura por projeto (advisor de performance apontou a FK sem índice).
create index favoritos_projeto_id_idx on public.favoritos (projeto_id);
