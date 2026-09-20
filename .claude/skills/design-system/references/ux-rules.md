# Regras de UX

Específicas do site de venda de projetos arquitetônicos prontos (plantas, fachadas, 3D). Cresça este arquivo com regras validadas no uso, não com suposições.

## Hierarquia e ação principal

* Uma ação principal por tela, em preto sólido (`--color-primary`); sobre fundo escuro, em verde vivo (`Button accent`). Ações secundárias usam contorno ou texto.
* Home: a **busca** é a ação principal do hero. Em seguida: categorias, destaques, confiança, complementares, CTA final.
* Página de projeto: preço e botão de compra visíveis sem rolar em desktop; fixos na base no mobile.
* Títulos de seção seguidos de subtítulo curto e link "Ver todos" à direita.
* Fundo escuro: título branco e uma palavra-chave em `--color-accent` (verde vivo), no máximo uma por título.
* Verde vivo (`--color-accent`) sobre fundo claro só como preenchimento (selo, sublinhado do menu, caixa), nunca como texto ou ícone isolado (2,3:1 sobre branco). Texto e ícones sobre claro usam `--color-fg` ou `--color-primary`.

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

## Listas e paginação

Regra de dados em `arquitetura` §3.1. Nenhuma lista que pode crescer aparece inteira.

* **Catálogo (projetos, complementares, interiores):** páginas numeradas, com o número na URL (`?pagina=2`). 12 cards por página em grade, que fecha certo em 1, 2, 3 e 4 colunas.
* **Barra de paginação:** "Anterior", números com reticências (1 … 4 5 6 … 40) e "Próxima". Fica em `<nav aria-label="Paginação">`, a página atual com `aria-current="page"`, e alvos ≥ 44px. Botões sem destino ficam desabilitados.
* **Contagem visível:** "Mostrando 13–24 de 480 projetos", junto da busca e dos filtros.
* **Ao trocar de página**, volte ao topo da lista e mova o foco para o título dela.
* **Loading:** skeleton com a mesma quantidade de cards da página, para o layout não pular. **Vazio e erro:** componentes padrão (Estados).
* **"Carregar mais"** só em listas privadas e curtas (ex.: favoritos), nunca no catálogo público (não é indexável e quebra o botão "voltar").
* **Tabelas do admin:** 20 linhas por página, mesma barra de paginação.
* **Busca ao vivo:** espere o usuário parar de digitar (debounce), mostre um indicador discreto de "buscando" e a contagem de resultados. Mudar busca ou filtro volta para a página 1.

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
