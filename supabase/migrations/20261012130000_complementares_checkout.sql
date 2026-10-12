-- Link de checkout (Hotmart ou outra plataforma) de cada projeto complementar: para onde o botão
-- "Comprar" da página do projeto leva o cliente. É o link de VENDA, público como o `checkout_url`
-- do projeto; o `link` (entrega, depois do pagamento) continua fechado.

alter table public.projeto_complementares
  add column checkout_url text
    check (char_length(checkout_url) <= 500 and checkout_url ~ '^https://');

grant select (checkout_url) on public.projeto_complementares to anon;
