# Regras de UX

Específicas do site de venda de projetos arquitetônicos prontos (plantas, fachadas, 3D). Cresça este arquivo com regras validadas no uso, não com suposições.

## Hierarquia e ação principal

* Uma ação principal por tela, em verde sólido (`--color-action-primary`). Ações secundárias usam contorno ou texto.
* Home: a **busca** é a ação principal do hero. Em seguida: categorias, destaques, confiança, complementares, CTA final.
* Página de projeto: preço e botão de compra visíveis sem rolar em desktop; fixos na base no mobile.
* Títulos de seção seguidos de subtítulo curto e link "Ver todos" à direita.
* Fundo escuro: título branco e uma palavra-chave em `--color-accent` (verde-limão), no máximo uma por título.

## Card de projeto

Sempre exibe, nesta ordem: imagem, selo (Mais vendido, Lançamento), título, metragem, quartos/suítes, vagas, preço e botão "Ver detalhes". Favoritar no canto da imagem. O card inteiro é clicável, com um único destino.

## Confiança e conversão

* Reforce compra segura, entrega imediata e suporte perto de busca e checkout.
* Preço sempre em `R$ 0.000,00`, sem surpresa: o que está incluso aparece antes de comprar.
* Contato por WhatsApp visível como alternativa a qualquer etapa de compra.

## Estados (obrigatórios)

* **Loading:** skeleton com a forma do conteúdo (não spinner solto em listas).
* **Vazio:** mensagem clara + próxima ação (ex.: "Nenhum projeto encontrado. Limpar filtros").
* **Erro:** o que aconteceu, em linguagem simples, + tentar de novo. Nunca mostrar erro técnico.
* **Sucesso:** confirmação discreta e específica.
* Use os componentes padrão (Skeleton, EmptyState, ErrorState); não improvise por tela.

## Formulários e busca

* Rótulo sempre visível (placeholder não substitui rótulo).
* Erro ao lado do campo, ligado por `aria-describedby`; valide ao sair do campo, não a cada tecla.
* Busca: aceite tipo, metragem e nº de quartos; mostre quantidade de resultados; filtros aplicados visíveis e removíveis.

## Acessibilidade (obrigatório)

* Contraste AA: 4.5:1 para texto normal, 3:1 para texto grande e componentes.
* Foco visível em tudo que é interativo; ordem de tab lógica.
* Alvos de toque ≥ 44 × 44px.
* HTML semântico; um `<h1>` por página; sem pular níveis de título.
* `alt` descritivo nas imagens de projeto; decorativas com `alt=""`.
* Nunca só cor para transmitir informação (selo e preço têm texto).
* Respeitar `prefers-reduced-motion`.

## Responsivo

* Mobile-first: projete o celular primeiro, amplie com `min-width`.
* Grades de cards: 1 coluna (mobile), 2 (≥ 640px), 3–4 (≥ 1024px).
* Navegação principal vira menu recolhível no mobile; busca continua acessível.
* Sem rolagem horizontal da página.

## Imagens e desempenho

* `next/image` sempre, com dimensões definidas (evita CLS).
* Imagem do hero com prioridade; demais com carregamento tardio.
* Proporção consistente nas imagens de card (ex.: 4:3).

## Microcopy

Português do Brasil, direto, verbo no imperativo nos botões ("Ver detalhes", "Buscar", "Falar no WhatsApp"). Sem jargão técnico com o cliente.
