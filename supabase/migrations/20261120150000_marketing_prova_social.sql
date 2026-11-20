-- Aba "Marketing" do cadastro: faixa "★★★★★ 4,9 · 128 clientes já compraram este projeto", no topo da
-- página do projeto. Duas colunas opcionais no próprio projeto; sem a quantidade de clientes, a faixa
-- não aparece. A leitura pública já vale para a linha inteira de projetos publicados.
--
-- Só acrescenta: nenhuma coluna existente muda. Os limites são os mesmos do app (`PROVA_SOCIAL`).

alter table public.projetos
  add column prova_social_clientes integer,
  add column prova_social_nota numeric(2, 1);

alter table public.projetos
  add constraint projetos_prova_social_clientes_check
    check (prova_social_clientes between 1 and 999999),
  add constraint projetos_prova_social_nota_check
    check (prova_social_nota between 1 and 5);
