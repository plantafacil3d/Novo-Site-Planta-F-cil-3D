-- "Em todos os projetos": o produto entra em todos os projetos de hoje e nos que forem cadastrados
-- depois. Os de hoje são ligados aqui (trigger, quando a opção é ligada); os novos já nascem com o
-- produto na aba Produtos do cadastro (o formulário de projeto novo vem preenchido).
-- Continua dando para tirar o produto de um projeto específico pela aba Produtos daquele projeto.

alter table public.produtos
  add column em_todos_projetos boolean not null default false;

create index produtos_em_todos_projetos_idx
  on public.produtos (em_todos_projetos)
  where em_todos_projetos;

-- Roda com a permissão de quem salvou (o administrador): as policies de `produto_projetos` valem.
create or replace function public.produto_ligar_a_todos_os_projetos()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  insert into public.produto_projetos (produto_id, projeto_id, ordem)
  select new.id, p.id, 10000
  from public.projetos p
  on conflict (produto_id, projeto_id) do nothing;
  return null;
end;
$$;

-- Só quando a opção é LIGADA (criar já ligado, ou passar de desligado para ligado). Salvar de novo
-- com ela ligada não devolve o produto aos projetos de onde ele foi tirado de propósito.
create trigger produtos_ligar_a_todos_ao_criar
  after insert on public.produtos
  for each row
  when (new.em_todos_projetos)
  execute function public.produto_ligar_a_todos_os_projetos();

create trigger produtos_ligar_a_todos_ao_mudar
  after update of em_todos_projetos on public.produtos
  for each row
  when (new.em_todos_projetos and not old.em_todos_projetos)
  execute function public.produto_ligar_a_todos_os_projetos();

revoke execute on function public.produto_ligar_a_todos_os_projetos() from public, anon, authenticated;
