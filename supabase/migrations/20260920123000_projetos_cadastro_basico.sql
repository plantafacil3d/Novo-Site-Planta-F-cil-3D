-- Cadastro do projeto, etapas 1 (básico) e 2 (especificações).
-- Tudo é opcional no banco: o rascunho pode ficar incompleto. O que é obrigatório para
-- publicar é conferido pelo app (regra de negócio), não por constraint.
-- As policies e os grants da tabela já valem para as colunas novas.

alter table public.projetos
  -- Etapa 1: básico
  add column estilo text
    check (estilo in ('moderno', 'contemporaneo', 'minimalista', 'classico', 'rustico')),
  add column selo text
    check (selo in ('mais-vendido', 'lancamento')),
  add column checkout_url text
    check (char_length(checkout_url) <= 500 and checkout_url ~ '^https://'),
  add column resumo text
    check (char_length(resumo) <= 300),
  add column descricao text
    check (char_length(descricao) <= 1500),
  -- Etapa 2: especificações (medidas em metros, área em m² inteiros)
  add column largura_m numeric(5, 2)
    check (largura_m > 0 and largura_m <= 100),
  add column profundidade_m numeric(5, 2)
    check (profundidade_m > 0 and profundidade_m <= 100),
  add column area_construida_m2 integer
    check (area_construida_m2 > 0 and area_construida_m2 <= 5000),
  add column quartos smallint
    check (quartos between 0 and 20),
  add column suites smallint
    check (suites between 0 and 20),
  add column banheiros smallint
    check (banheiros between 0 and 30),
  add column vagas smallint
    check (vagas between 0 and 20),
  add column pavimentos smallint
    check (pavimentos between 1 and 5),
  add column piscina boolean not null default false,
  add column closet boolean not null default false,
  add column area_gourmet boolean not null default false,
  add column diferencial_tipo text
    check (diferencial_tipo in ('piscina', 'varanda-gourmet')),
  add column diferencial_rotulo text
    check (char_length(diferencial_rotulo) <= 80);
