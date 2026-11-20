-- Ícone de cada projeto complementar (aba "Complementares" do cadastro), mostrado no cartão da página
-- do projeto. Guarda só o nome do ícone; a lista de ícones aceitos fica no app (`iconesDeComplementar`),
-- então acrescentar um ícone não pede migration. Sem valor = ícone padrão (documento).
--
-- A leitura pública desta tabela é por coluna (`complementares_leitura_publica`): sem o grant abaixo, o
-- site não leria o ícone. `entrega` e `link` continuam fechados.

alter table public.projeto_complementares
  add column icone text check (char_length(icone) <= 40);

grant select (icone) on public.projeto_complementares to anon;
