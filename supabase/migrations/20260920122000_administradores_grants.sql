-- A policy libera só a própria linha; o grant é o que permite a consulta existir.
revoke all on public.administradores from anon;
grant select on public.administradores to authenticated;
