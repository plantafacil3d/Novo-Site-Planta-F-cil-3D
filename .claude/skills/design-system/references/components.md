# Catálogo de componentes

Começa com o que a home já exige. Cresce a cada componente novo (regra em `../SKILL.md` §2). Localização segue `arquitetura` §4.

Formato de cada entrada: propósito, variantes, estados, tokens usados, onde vive.

## Primitivos (`components/ui/`)

### Button

- **Propósito:** disparar ação ou navegar (com `href` vira `<Link>`, ou `<a target="_blank">` se o destino for externo).
- **Variantes:** `primary` (preto sólido, para fundo claro), `secondary` (contorno), `secondary-inverse` (contorno claro, para fundo escuro), `ghost` (texto), `accent` (verde vivo com texto preto, para fundo escuro, onde o preto sumiria), `whatsapp` (mesmo estilo do `accent` + ícone do WhatsApp automático, para faixas escuras), `danger` (vermelho sólido com texto claro). Tamanhos: `md` (padrão), `lg`. Ícone à esquerda (`iconLeft`) e à direita (`iconRight`).
- **Quando usar `danger`:** só para **confirmar** o que não tem volta, dentro do `DialogoDeConfirmacao`. O botão que _abre_ a confirmação fica `ghost` ou `secondary` — se cada linha de uma tabela fosse vermelha, o vermelho perderia o sentido.
- **Estados:** repouso, hover, foco, ativo, disabled, loading (`loading` desabilita, mostra spinner e `aria-busy`).
- **Tokens:** `--color-primary(-hover)`, `--color-accent(-hover)`, `--color-danger-solid`, `--color-danger-hover`, `--color-fg`, `--color-fg-inverse`, `--color-border`, `--radius-md`, `min-h-11 px-4 py-3`, `--color-ring`.
- **Nota:** para "card inteiro clicável", passe `after:absolute after:inset-0` no `className` (o card precisa ser `relative`).
- **Link externo:** abre em nova aba (`noopener noreferrer`) e ganha um texto só para leitor de tela: "(abre em uma nova aba)".

### IconButton

- **Propósito:** botão redondo só com ícone (setas de galeria e carrossel, fechar, play). `label` é obrigatório: vira o `aria-label`.
- **Variantes:** `tone` `surface` (branco com sombra, padrão) e `inverse` (escuro translúcido, para cima de fotos); `size` `md` (44px) e `lg` (64px, play do banner de vídeo).
- **Estados:** repouso, hover, foco, disabled.
- **Tokens:** `--color-surface`, `--color-inverse`, `--color-fg`, `--color-fg-inverse`, `--shadow-md`.

### DropdownMenu

- **Propósito:** menu de contexto por trás de um botão ⋮ (ações de uma linha de tabela, ex.: Editar, Publicar/Rascunho, Excluir).
- **Props:** `label` (nome acessível do botão e do painel, ex.: "Ações de Sobrado com Piscina"), `items: { key, label, icon?, href?, onSelect?, tone?, disabled? }[]` (item com `href` vira link; sem ele, vira botão e chama `onSelect`), `disabled?` (desabilita o botão inteiro, ex.: enquanto uma ação está pendente).
- **Como funciona:** o painel usa o `popover` nativo do navegador (mesma família do `<dialog>` do `Modal`): aparece por cima de tudo, não é cortado pela rolagem de uma `Table`, e fecha sozinho com Esc ou clique fora, sem código de posicionamento manual para isso. A posição (perto do botão que abriu) é calculada em JS a partir do retângulo do botão.
- **`tone: 'danger'`** só muda a cor do texto do item (`--color-danger-fg`), nunca vira vermelho sólido — isso continua exclusivo do `Button` `danger` dentro do `DialogoDeConfirmacao` (regra do `Button` acima). Usado no item "Excluir".
- **Estados:** repouso, hover (`--color-subtle`), foco (anel padrão), disabled (item ou botão inteiro).
- **Tokens:** `--color-border`, `--color-surface`, `--color-subtle`, `--color-danger-fg`, `--radius-md`, `--shadow-md`.

### Modal

- **Propósito:** janela por cima da página (fotos em tela cheia, vídeo, diálogos). `'use client'`, feita com `<dialog>` nativo: foco preso, Esc e clique no fundo fecham, botão "Fechar" embutido. O conteúdo só existe enquanto aberto (o vídeo para de tocar) e a página de trás não rola.
- **Props:** `open`, `onClose`, `label` (nome acessível), `tone`, `className` (moldura interna).
- **`tone`:** `inverse` (padrão) é a moldura escura de foto e vídeo; `surface` é a clara, para diálogo de texto (nasceu com o `DialogoDeConfirmacao`). O botão "Fechar" acompanha o tom.
- **Tokens:** `--color-overlay` (fundo), `--color-inverse-strong`, `--color-surface`, `--radius-lg`.

### Accordion

- **Propósito:** perguntas que abrem e fecham (FAQ). `<details>` nativo: funciona sem JavaScript, teclado de graça e o texto já vem no HTML (SEO). Recebe `items: { title, content }[]`.
- **Estados:** fechado (ícone `+`), aberto (ícone `−`), hover (`bg-tint`, mesmo verdinho do botão `ghost`), foco.
- **Tokens:** `--color-border`, `--color-surface`, `--color-fg-muted`, `--color-tint`, `--radius-md`.

### Icon

- **Propósito:** único ponto que conhece a biblioteca de ícones (`lucide-react`). `<Icon name="search" />`, decorativo (`aria-hidden`), 20px por padrão (`className="size-6"` para mudar).
- **Marcas** (WhatsApp, Instagram, YouTube, Facebook) não existem no Lucide: SVG próprio em `ui/icons/brand.tsx`, mesmo formato de traço.
- **Novo ícone:** adicione ao registro em `Icon.tsx`; o tipo `IconName` se atualiza sozinho.

### Badge

- **Propósito:** selo sobre a imagem (Mais vendido, Lançamento).
- **Variantes:** `solid` (preto), `accent` (verde vivo, texto preto), `success` (verde suave, para status como Publicado), `draft` (cinza com borda, para Rascunho), `discount` (verde escuro sólido `--green-700` com texto branco — nasceu porque o verde vivo do `accent` só dá 2,3:1 com texto branco, abaixo do mínimo de acessibilidade; usado só no selo de desconto do `PriceTag`, ex.: "40% OFF") e `neutral` (cinza claro com borda, texto `fg-muted` — tag informativa sem peso promocional, ex.: categoria/estilo no `ProjetoHero`; distinto do `draft`, que é só para o status "Rascunho"). `success` e `draft` nasceram no painel do administrador.
- **Tokens:** `--color-primary`, `--color-accent`, `--color-badge-success-*`, `--color-badge-draft-*`, `--color-badge-discount-*`, `--color-draft-border`, `--color-border`, `--color-subtle`, `--color-fg-muted`, `--radius-sm`, `--text-xs`.

### Eyebrow

- **Propósito:** rótulo em caixa alta acima de títulos (hero e banners). Cor `--color-accent`, só para fundo escuro.
- **Tokens:** `--color-accent`, `--text-xs`; `tracking-[0.12em]` (definido em `tokens.md`).

### Chip

- **Propósito:** filtro aplicado em forma de etiqueta removível ("Com piscina ×"). É um `<Link>`: o clique leva ao mesmo endereço sem aquele filtro, então funciona sem JavaScript. Props: `href`, `label`, `removeLabel` (texto só para leitor de tela, ex.: "Remover filtro").
- **Estados:** repouso, hover, foco. Altura mínima de 44px.
- **Tokens:** `--color-tint`, `--color-border`, `--color-subtle` (hover), `--radius-lg`.
- **Ainda não existe:** chip selecionável (liga/desliga); nasce quando uma tela pedir.

### Input

- **Propósito:** campo de texto. Sempre com `<label>` (visível ou `sr-only`).
- **Estados:** repouso, foco, erro (`invalid`), disabled.
- **Tokens:** `--color-surface`, `--color-border`, `--radius-md`, `--color-danger`.

### Textarea

- **Propósito:** campo de texto longo (resumo, descrição). Mesma aparência do `Input` (borda, raio, erro), com altura mínima e redimensionável na vertical. Sempre com `<label>` (use o `Field`).
- **Estados:** repouso, foco, erro (`invalid`), disabled.
- **Tokens:** os mesmos do `Input`.

### Field

- **Propósito:** rótulo + campo + dica ou erro, para formulários. Envolve `Input`, `Select` ou `Textarea`; o `htmlFor` liga o rótulo ao campo. Com `error`, a mensagem substitui a dica e ganha o id `<htmlFor>-erro` (o campo aponta para ela com `aria-describedby`).
- **Props:** `label`, `htmlFor`, `hint?`, `error?`, `counter?` (contador de caracteres à direita, ex.: "35/120"), `icon?` (`IconName`, ao lado do rótulo, para identificar o campo de relance), `hideLabel?` (rótulo só para leitor de tela — lista compacta tipo tabela, com o rótulo real aparecendo uma vez só, como cabeçalho de coluna; ex.: `ItemDaPlantaLinha`), `className?`.
- **Tokens:** `--color-fg-muted` (dica e contador), `--color-danger-fg` (erro, AA sobre o fundo claro).

### FileInput

- **Propósito:** área tracejada para escolher arquivos (imagens, PDF, ZIP). O `<input type="file">` fica invisível por cima de tudo, então clicar, o teclado e arrastar arquivos para dentro funcionam nativamente. Não valida nada: entrega os arquivos escolhidos em `onFiles(arquivos)` e quem usa confere tipo e tamanho. Depois de escolher, limpa a seleção (dá para enviar de novo o mesmo arquivo).
- **Props:** `label` (texto principal e nome acessível), `hint?`, `invalid?`, `onFiles`, mais as do `<input>` (`accept`, `multiple`, `id`, `disabled`, `aria-describedby`).
- **Estados:** repouso, hover, foco (anel no contorno, via `has-[:focus-visible]`), erro (`invalid`), disabled.
- **Tokens:** `--color-border-strong` (borda tracejada), `--color-danger`, `--color-surface`, `--color-subtle` (hover), `--color-ring`, `--radius-lg`.

### Alert

- **Propósito:** aviso em faixa dentro da tela (resultado de "Salvar", erro que exige atenção, dica de tela). Ícone + texto.
- **Variantes:** `success`, `error`, `warning`, `info` (padrão). `error` usa `role="alert"` (lido na hora); as outras, `role="status"`. Aceita `ref` e `tabIndex={-1}` para receber o foco quando aparece.
- **Tokens:** os de notificação, `--color-notification-{success|error|warning|info}-{bg|border|fg|icon}`.
- **Nota:** as cópias dessas mesmas classes que existiam na `TabelaProjetosAdmin` ainda não foram trocadas por este componente.

### Select

- **Propósito:** lista de opções nativa (`<select>`): funciona sem JavaScript, o celular abre o seletor do sistema e o teclado já vem pronto. Sempre com `<label>`. Ícone de seta (`chevron-down`) sobreposto; o resto igual ao `Input`.
- **Estados:** repouso, foco, erro (`invalid`), disabled.
- **Tokens:** `--color-surface`, `--color-border`, `--color-fg-muted`, `--radius-md`, `--color-danger`.

### Checkbox

- **Propósito:** caixa de marcação com rótulo (`label`); a linha inteira é clicável e tem 44px de altura. Usa `accent-primary` (a caixa nativa, com a cor da marca).
- **Estados:** repouso, foco, marcado, disabled.
- **`hideLabel`:** esconde o texto (fica só para leitor de tela); a caixa mantém 44px de toque. Usado nas caixas de seleção das tabelas.

### Table

- **Propósito:** tabela de dados (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`). `caption` obrigatório (nome para leitor de tela). Em tela estreita rola na horizontal dentro da moldura, nunca a página.
- **Estados:** `TableRow` com `data-selected="true"` ganha fundo `--color-tint`.
- **Tokens:** `--color-surface`, `--color-subtle`, `--color-border`, `--color-fg-muted`, `--radius-lg`.

### Skeleton

- **Propósito:** bloco pulsante no lugar do conteúdo enquanto carrega (`aria-hidden`; quem o usa avisa "Carregando…" para leitor de tela). Dê a forma com `className` (`h-5 w-3/4`, `aspect-4/3`). Respeita `prefers-reduced-motion`.
- **Tokens:** `--color-border` (cinza dos blocos), `--radius-md`.

## Layout e navegação (`components/layout/`, `components/navigation/`)

### Header (`layout/`)

Logo, navegação principal, ícones de busca/favoritos/carrinho (links com `aria-label`; carrinho com contador), botão "Entrar / Cadastrar". Fundo `--color-page` com borda inferior `--color-border`. Recebe tudo por props. Abaixo de `lg` a navegação e o botão vão para o `MobileMenu`; o botão some abaixo de `sm`.

### MainNav e MobileMenu (`navigation/`)

Ambos `'use client'`. `MainNav` renderiza os links e marca a página atual com `aria-current` (sublinhado `--color-accent` no horizontal). `MobileMenu` é o hambúrguer com painel (`aria-expanded`, fecha com Esc e ao navegar).

### SidebarNav (`navigation/`)

`'use client'`. Menu lateral para fundo escuro (painel do administrador). No celular é uma faixa horizontal rolável; a partir de `lg`, uma coluna. Recebe `items: { label, icon, href? }[]`: sem `href` o item é estático (`aria-disabled`, texto "Em breve"). Página atual com `aria-current` e fundo `--color-fg-inverse` a 15%. Tokens: `--color-fg-inverse`, `--radius-md`.

### SkipLink (`navigation/`)

Primeiro item da tab; leva ao conteúdo principal e só aparece com foco.

### Breadcrumb (`navigation/`)

Trilha "Início › Projetos › Sobrados › Projeto" (`<nav aria-label>` + `<ol>`). Item sem `href` é a página atual (`aria-current="page"`). Links com altura mínima de 44px.

### Tabs (`navigation/`)

`'use client'`. Abas acessíveis (`role="tablist"`/`tab`/`tabpanel`): setas, Home e End trocam de aba e movem o foco. Recebe `items: { id, label, content, status? }[]`; todos os painéis ficam no HTML, só escondidos. Aba ativa em `--color-primary` com texto `--color-fg-inverse`; as outras com hover `--color-subtle`. No celular a lista rola na horizontal.

- **Props opcionais** (nasceram no cadastro de projeto; sem elas o componente funciona como antes, como na galeria da página do projeto):
  - `orientation="vertical"`: a partir de `lg`, o menu vira uma coluna de 16rem ao lado do conteúdo (cartão com borda, fixo ao rolar); no celular continua faixa rolável. Setas dos dois eixos funcionam.
  - `value` + `onValueChange`: aba controlada por quem usa (botões Anterior/Próxima). Quando a troca vem de fora, o foco vai para o painel novo e a tela volta ao topo dele.
  - `items[].status`: marcador ao lado do nome. `complete` (círculo `--color-accent` com check `--color-fg`, mais "(completa)" para leitor de tela), `pending` (círculo vazio com borda `--color-border-strong`, "(pendente)") e `optional` (texto "Opcional").
  - `footer`: conteúdo abaixo dos painéis, na mesma coluna (botões de navegação e de salvar).

### Pagination (`navigation/`)

Paginação da listagem (regras em `ux-rules.md`, "Listas e paginação"). Props: `pagina` (atual, começa em 1), `totalPaginas`, `hrefPagina(n)` (quem usa monta o endereço; a página vive na URL). Mostra "Anterior 1 … 4 5 6 … 40 Próxima": primeira, última e vizinhas da atual, com "…" nos saltos. Cada número é um `Button` link (`primary` na página atual, com `aria-current="page"`; `secondary` nas demais); Anterior/Próxima ficam desabilitados nas pontas. Com uma página só, não renderiza nada. `<nav aria-label="Paginação">`, alvos de 44px.

### SeletorPorPagina (`navigation/`)

`'use client'`. "Itens por página" ao lado da paginação, para tabelas grandes do admin (§3.1 da skill `arquitetura`). Props: `porPagina` (valor atual) e `opcoes: { valor, href }[]` — quem usa (Server Component) já monta o endereço de cada opção e volta `pagina` para 1, porque função não cruza para um Client Component. Um `Select` nativo; ao trocar, navega direto com `router.push`, sem botão "aplicar".

### Footer (`layout/`)

Logo, links de navegação, redes sociais, direitos autorais e localização. Fundo `--color-page` com borda superior `--color-border`.

### Section (`layout/`)

Container de seção: título (h2), subtítulo, link "Ver todos" e conteúdo. Variantes de fundo (`tone`): `page`, `subtle`, `tint`, `inverse`.

## Compartilhados (`components/shared/`)

### Logo

Prop `tone`: `default` (fundo claro, usado no Header e no Footer) mostra o logotipo oficial, sem `tagline` — já vem no arquivo. Duas imagens, trocadas por breakpoint (`sm`): `Logo_03.png` abaixo de `sm` (celular, mais compacta na largura) e `logo_02.png` a partir de `sm` (faixa horizontal). `next/image`; testando variantes, ver `changelog.md`. `inverse` (padrão, fundo escuro, só o painel admin) continua **provisório**: ícone de casa + nome + tagline; falta uma versão clara do logotipo para fundo escuro.

### SearchBar

`<form role="search" method="get">` com Input + Button `primary` + ícone; funciona sem JavaScript. Rótulo `sr-only` (a referência visual só mostra placeholder). `defaultValue` opcional preenche o campo com a busca atual da URL (dê uma `key` que mude com ela).

### PriceTag

- **Propósito:** preço com desconto, no padrão "Mercado Livre": preço original riscado acima, preço atual em destaque e um selo verde do desconto (ex.: "40% OFF") ao lado. Sem preço original, mostra só o atual.
- **Props:** `price`, `originalPrice?`, `discountLabel?`, `priceClassName?` (tamanho do preço atual, na escala tipográfica de onde aparece: `text-lg` no card, `text-3xl` no topo da página), `originalPriceClassName?` (cor do riscado; `text-fg-inverse/70` sobre fundo escuro, como no `CTABanner`).
- **Tokens:** `--color-fg-muted` (riscado, padrão), `--color-badge-discount-bg`/`-fg` (selo, via `Badge` `discount`).
- **Usado em:** `ProjetoHero`, `BarraCompraMobile` e `CTABanner` (`variant="card"`) — nos três, o preço tem a linha só para si (o botão de compra fica abaixo ou numa coluna separada). A montagem do desconto (regra: preço original só existe quando é realmente maior que o atual) fica em `features/projetos/rules.ts` (`exibirPreco`).
- **Não usado no `ProjectCard`** (nas duas densidades, `default` e `compact`): o layout do preço pedido para o card (desconto alinhado à direita na linha do riscado, preço atual sozinho embaixo) não é o que o `PriceTag` produz (ele junta preço atual + selo na mesma linha). O card monta o preço à mão nas duas densidades — mesmos tokens do `PriceTag` (`--color-fg-muted`, `Badge discount`), layout diferente. Se um layout igual ao do `PriceTag` for necessário aqui de novo, considerar uma prop nele em vez de duplicar mais uma vez.

### ProjectCard

Card de projeto (ver `ux-rules.md`). Puramente visual: recebe textos e preço já formatados (a montagem fica em `features/projetos/components/ProjetosDestaque`). Compõe Badge, FavoriteButton, lista de especificações (ícone + texto) e Button. O card inteiro é um único link (botão "Ver detalhes" esticado); o coração fica acima. **Se ganhar regra de domínio, mova para `features/projetos/components/`.**

- **Prop `density`:** `compact` (padrão, em teste, reproduz uma foto de referência) ou `default` (card anterior, mantido no código sem uso — passe a prop explicitamente para voltar a ele). Em `compact`:
  - Corpo com menos espaçamento (`p-3`/`gap-3`, especificações em `text-xs`).
  - Canto superior esquerdo mostra `projectCode` (código real do projeto, ex.: "PF-05") em vez de `badge`; o selo (`badge`, "Mais vendido"/"Lançamento"/"Similar") não aparece nessa densidade. A linha de texto do `code` (código manual/YouTube) acima do título também some — só existe no `default`.
  - Especificações em duas listas lado a lado (pares/ímpares) dentro de `divide-x divide-border`, em vez do grid único do `default` — dá a linha vertical entre as colunas.
  - Rodapé: riscado + selo de desconto numa linha (`justify-between`, selo encostado à direita), preço atual sozinho embaixo, uma borda (`border-t border-border`) e por último um botão "Ver detalhes" de largura total.

### MediaCard

Card compacto: imagem, título e preço. O card inteiro é um único link, pelo título. Usado nos projetos complementares.

### FavoriteButton

`'use client'`. Coração com `aria-pressed`. `variant`: `icon` (redondo, sobre a imagem do card) ou `button` (botão largo `secondary` com o texto "Adicionar aos favoritos"; o coração enche quando ativo). **Por ora só estado local**: a persistência depende de conta/favoritos.

### CategoryTile

Ícone + rótulo em bloco clicável, fundo `--color-tint`.

### FeatureItem

Ícone + título + descrição curta. `tone`: `default` ou `inverse` (fundo escuro, hero). `layout`: `row` (ícone ao lado, padrão) ou `stack` (ícone em cima; grades de características, entregáveis e perfil). `titleAs="h3"` quando estiver dentro de seção com h2.

### CollapsiblePanel

`'use client'`. No celular, o conteúdo fica atrás de um botão `secondary` com ícone de filtro e contador (`count`, ex.: "Filtros (2)"), com `aria-expanded`/`aria-controls`. A partir de `lg` o conteúdo aparece sempre e o botão some. O conteúdo (`children`) é renderizado no servidor; só o abrir/fechar é estado do navegador. Quem usa dá uma `key` que mude a cada consulta, para o painel fechar depois de aplicar um filtro.

### TextoExpansivel

`'use client'`. Texto longo cortado em `limite` caracteres (padrão 280, corta na última palavra inteira, sem quebrar no meio); abaixo, um botão "Ver mais"/"Ver menos" com `aria-expanded`/`aria-controls` alterna o texto completo. Some sozinho (renderiza só o `<p>`) quando o texto já cabe no limite. Usado no resumo curto do `ProjetoHero`. **Tokens:** `text-primary` no botão.

### EmptyState

Lista sem resultado: ícone, título, texto e uma ação opcional (`action: { label, href }`, botão `secondary`). Fundo `--color-subtle`, borda `--color-border`, `--radius-lg`. Sempre oferece um caminho ("Limpar filtros"), nunca uma tela vazia.

### MensagensDeArquivo

- **Propósito:** erro do campo de arquivos + lista do que foi recusado na última escolha ("nome: motivo"), ligada por `aria-describedby`. Sem domínio: nasceu no cadastro de projeto e passou para cá quando a biblioteca de arquivos de exemplo também passou a precisar dela (2026-09-23).
- **Props:** `id` (o erro ganha `<id>-erro`), `erro?`, `recusas?: string[]`.
- **Tokens:** `--color-danger-fg`.

### DialogoDeConfirmacao

- **Propósito:** última parada antes de uma ação sem volta (excluir projetos). `'use client'`. Compõe o `Modal` (`tone="surface"`) com dois `Button`: pergunta, o que vai acontecer, a lista do que será afetado e os botões de sair ou seguir.
- **Props:** `aberto`, `titulo` (também o nome acessível), `descricao`, `itens?` (nomes do que será afetado; lista longa rola dentro da moldura), `rotuloConfirmar`, `carregando?`, `aoConfirmar`, `aoCancelar`.
- **Regras:** "Cancelar" (`secondary`) vem **antes** de "Confirmar" (`danger`) no HTML, então é ele que recebe o foco ao abrir — quem aperta Enter sai sem estragar nada. `carregando` desabilita cancelar e põe o spinner no confirmar. Foco preso, Esc e trava de rolagem vêm do `Modal`.
- **Tokens:** `--color-surface`, `--color-subtle` e `--color-border` (a lista), `--color-fg-muted` (a descrição), `--radius-md`; o vermelho vem do `Button` `danger`.

### ErrorState

Algo falhou: `role="alert"`, ícone, título, texto simples (nunca detalhe técnico) e "Tentar novamente" (`onRetry`, só aparece se passado). Usa os tokens de notificação de erro (`--color-notification-error-*`), como manda `tokens.md`. Usado em `app/projetos/error.tsx`.

### CTABanner

Faixa de chamada para ação. Variantes: `inverse` (imagem à esquerda + painel escuro com rótulo, título, texto e botão), `brand` (faixa `--color-inverse` com ícone de casa e botão WhatsApp, sem imagem) e `card` (cartão escuro arredondado dentro da largura da página, imagem ao fundo à direita, rótulo, título, texto, **preço** com condição e botão; usado no "Gostou deste projeto?"). O botão vem da prop `action.variant`: padrão `accent` no `inverse` e `card` e `whatsapp` no `brand` (o preto sumiria sobre o fundo escuro); aceita também `secondary-inverse`. No `card`, `action.iconLeft="cart"` põe o carrinho no botão.

### FormularioLogin

`'use client'`. E-mail e senha com botão Entrar. Recebe `action` (a ação do servidor que faz o login, passada por quem usa). Usado só em `/admin/entrar` — o login de cliente (`/entrar`, `/cadastro`) é exclusivamente Google, sem e-mail/senha. Erro único e genérico, ligado por `aria-describedby`.

### BotaoGoogle

`'use client'`. Botão "Entrar com Google" (`Button` `secondary` com ícone `google`, largura total). Recebe `action` (ação do servidor que inicia o login, passada por quem usa) e vira um formulário; mostra `loading` enquanto vai ao Google. Usado em `/admin/entrar` (acima do formulário de e-mail e senha) e sozinho em `/entrar`/`/cadastro` (`ContaEntradaView`), o login/cadastro de cliente.

### CheckList

Lista com marcador de check: círculo `--color-accent` (só preenchimento) com o check em `--color-fg`. Usada em "Valores" (`/sobre`) e em "O que está incluso" (página do projeto).

- **Prop `columns`:** `1` (padrão, coluna única) ou `2` (grade `sm:grid-cols-2`) — nasceu em "O que está incluso": a lista é cadastrada pelo admin com tamanho variável e, em coluna única, sobrava muito vazio à direita numa tela larga.

### Carousel

`'use client'`. Faixa horizontal rolável com encaixe item a item. No celular rola com o dedo; a partir de `md` aparecem setas Anterior/Próximo (`IconButton`) só quando há mais itens para aquele lado. Respeita `prefers-reduced-motion`. Props: `label`, `itemClassName` (largura de cada item, ex.: `w-72`; use `grid` para itens de mesma altura) e os itens como `children`.

### Lightbox

`'use client'`. Visualizador de fotos em tela cheia dentro de um `Modal`: setas Anterior/Próxima, teclas ← →, contador "3 de 21". Controlado por `index` (`null` = fechado).

### MediaGallery

`'use client'`. Galeria do topo da página: foto grande com setas, botão "Ver em tela cheia" (abre o `Lightbox`), botão "Assistir vídeo" (abre `Modal` com `<video>`, só se houver vídeo), até 6 miniaturas e um bloco "+N" que abre o visualizador na primeira foto escondida. A foto inicial carrega com `priority`.

### VisualizadorPlantaFullscreen

- **Propósito:** planta humanizada em tela cheia, dentro de um `Modal` (`tone="inverse"`, implícito): setas Anterior/Próxima e contador "X de Y" com 2+ pavimentos (mesmo padrão do `Lightbox`, mas plantas costumam ser paisagem — não cabem retas no `Lightbox`, que é feito para fotos). Até `lg`, gira 90° (`rotate-90`, sem depender da Screen Orientation API, inconsistente no Safari) para aproveitar a tela do celular na vertical; a partir de `lg`, sem giro (`lg:aspect-video`).
- **Zoom:** pinça no celular (arraste sem zoom troca de pavimento); no desktop, scroll do mouse, ancorado no ponteiro (o ponto sob o cursor fica fixo, o zoom cresce na direção do mouse). Sempre entre 1x e 4x, reinicia ao trocar de pavimento.
- **Props:** `images`, `index` (`null` = fechado), `onIndexChange`, `onClose`, `label`.
- **Usado em:** `GaleriaPlantaHumanizada` (feature `projetos`), acionado por um `IconButton` (ícone `maximize`, canto superior esquerdo da imagem) — não o `Button` com texto do `MediaGallery`: sobre a planta (fundo claro, poucos elementos), o botão preto sólido chamava mais atenção que a própria planta; o círculo branco discreto, no mesmo estilo das setas que já ficam sobre essa imagem, resolveu.
- **Tokens:** `--color-inverse-strong`, `--color-inverse`, `--color-fg-inverse`.

### VideoBanner

`'use client'`. Bloco escuro arredondado com imagem ao fundo, título, texto e um grande play (`IconButton` `lg`) que abre o vídeo num `Modal`. Selo de duração opcional (`Badge`). Hover: imagem de fundo dá zoom leve (`scale-105`), mesmo padrão dos cards de projeto.

### JsonLd

Injeta dados estruturados (schema.org) para o Google. Escapa o `<` para o conteúdo nunca fechar a tag `<script>`. É o único uso permitido de `dangerouslySetInnerHTML` no projeto.

## Backlog (criar só quando uma tela pedir)

Toast, chip selecionável (liga/desliga).

`Pagination`, `Select`, `Checkbox`, `Chip` (removível), `Skeleton`, `EmptyState` e `ErrorState` saíram do backlog com a listagem `/projetos` (2026-09-20).

## Componentes de domínio (`features/projetos/components/`)

Ficam na feature porque conhecem o `ProjetoDetalhe`; a tela é montada em `views/ProjetoView.tsx`. Reaproveitam os componentes acima; nenhum tem estilo próprio fora dos tokens.

- `ProjetoHero`: galeria + título, selo, resumo, especificações rápidas, preço, comprar, favoritar, selos de confiança e o resumo "O que está incluso". Sem checkout válido, o botão de compra aparece desabilitado.
- `BarraCompraMobile`: preço + comprar fixos na base, só no celular. Deve ser o último filho da página (`sticky` para no fim do conteúdo e não cobre o rodapé).
- `ProjetosDestaque`: grade de `ProjectCard` (1 coluna no celular, 2 no tablet, 4 no desktop). Aceita `className` para mudar as colunas quando divide a tela com outra coisa: a listagem usa `lg:grid-cols-2 xl:grid-cols-3` por causa da barra de filtros.
- `FormularioDeFiltros`: filtros da listagem em formulário GET (`next/form`): busca por nome ou código, ordenar, tipo, estilo arquitetônico, quartos, suítes, vagas ("N ou mais"), área, medidas do terreno (só entram projetos que cabem nele) e piscina / área gourmet. Os campos guardam o que veio da URL; quem usa dá uma `key` que muda a cada consulta. Sem JavaScript também funciona.
- `FiltrosAplicados`: os filtros ativos como `Chip` removível, mais "Limpar tudo"; some quando não há filtro.
- `ProjetosSkeleton`: uma página de cards em branco (12), para a tela não pular enquanto carrega.
- `ProjetoDetalheSkeleton`: "em branco" do topo da página de um projeto (galeria + dados), usado no `loading.tsx` de `/projetos/[slug]` — sem ele, essa rota herdava o `ProjetosSkeleton` da listagem (rota pai) e mostrava a grade errada ao abrir um projeto.
- `EspecificacoesTecnicas`, `SobreProjeto`, `IncluidoNoProjeto`, `GaleriaCompleta`, `CaracteristicasAmbientes`, `PerfilProjeto`, `PerguntasFrequentes`, `ProjetosRelacionados` (reaproveita o `ProjectCard` da home, com selo "Similar").
- `GlossarioEspecificacoes`: logo abaixo da `EspecificacoesTecnicas`. Reaproveita o `Accordion` (`ui/`) com um único item ("O que significa cada especificação?"), fechado por padrão — explica em linguagem simples cada item que aparece na faixa de especificações (o site vende para vários idiomas; termos como "suíte" não são óbvios fora do Brasil). Mesma lista de itens da `EspecificacoesTecnicas` (`listarChavesDeEspecificacao`, em `rules.ts`) e mesmos rótulos/explicações (`textosDeEspecificacao`, em `conteudo.ts`), então nunca sai de sincronia; some quando não há nenhuma especificação. Sem componente novo.

## Painel do administrador (`features/admin/components/`)

Painel em `/admin` (layout próprio, fora do `SiteShell`; a tela é montada em `views/admin/`). Reaproveita `Table`, `Badge`, `Checkbox`, `SearchBar`, `Pagination`, `SeletorPorPagina`, `EmptyState`, `ErrorState` e `Skeleton`.

- `TabelaProjetosAdmin`: `'use client'`. Tabela com seleção por linha e "selecionar todos" da página, barra de ações em massa (Duplicar, Mover para rascunho, Excluir) e aviso de sucesso/erro em `Alert`. Quem usa dá uma `key` que muda a cada busca/página.
  - **Coluna "Ações":** um `DropdownMenu` (botão ⋮) por linha, com **Editar projeto** (link para `/admin/projetos/[id]/editar`), **Salvar como rascunho** ou **Publicar projeto** (alterna conforme `linha.status`: publicado chama `moverParaRascunho([id])`, rascunho chama `publicarProjetos([id])` — wrapper em `admin/actions.ts` que reexporta o `publicarProjeto` de `cadastro-projeto` por dentro do servidor, para o componente cliente não importar o loader da edição pelo `index.ts` da outra feature) e **Excluir**.
  - **Excluir** (em massa ou de uma linha) passa pelo `DialogoDeConfirmacao`, que diz quantos e quais projetos saem; um só estado (`exclusao: string[] | null`) atende os dois casos.
  - **Pendente:** "Ver no site" (o site público lê da lista em memória, então o link daria 404). O título do projeto segue como texto, não link, pelo mesmo motivo.
- Depois de editar um projeto (redirect de `/admin/projetos/[id]/editar`), a listagem mostra `?salvo=1` na URL e a `ProjetosAdminView` exibe um `Alert` de sucesso acima da tabela — fora do schema de paginação/busca, para não "grudar" nos links.
- `ProjetosAdminSkeleton`: tabela em branco enquanto carrega.
- Menu do painel (`AdminShell`, em `views/admin/`): Dashboard, Projetos, Biblioteca, Vendas e Analytics; Projetos e Biblioteca são link. O botão "Cadastrar Projeto" é o `Button` primário e leva a `/admin/projetos/novo`.

## Biblioteca de arquivos de exemplo (`features/biblioteca-exemplos/components/`)

Acervo próprio do administrador: sobe cada arquivo uma vez (`/admin/biblioteca`), depois cada projeto só marca quais já enviados ficam disponíveis (aba "Arquivos de Exemplo" do cadastro, que consome `ArquivoDeExemplo[]` traduzido a partir daqui em `views/admin/ProjetoFormAdminView.tsx`). Tela montada em `views/admin/BibliotecaAdminView.tsx`. Reaproveita `Table`, `Badge`, `Checkbox`, `DropdownMenu`, `Modal`, `Field`, `Input`, `SearchBar`, `Pagination`, `EmptyState`, `ErrorState`, `Skeleton`, `FileInput`, `Alert` e `MensagensDeArquivo`. Sem token novo.

- `FormularioEnvioBiblioteca`: `'use client'`. Um `FileInput` com `multiple` (imagem JPG/PNG/WEBP, PDF ou DWG, até 20 MB cada); cada arquivo escolhido sobe direto, sem "Salvar" à parte. Estado e envio em 2 fases (autorizar → enviar → confirmar) moram em `hooks/useEnvioBiblioteca.ts`, mesmo padrão do `useFormularioProjeto`.
- `TabelaBibliotecaAdmin`: `'use client'`. Mesma base da `TabelaProjetosAdmin` (seleção por linha, "selecionar todos", `Alert` de sucesso/erro), mas sem ações de status. Seleção em massa só tem "Excluir"; cada linha tem 3 ações (`DropdownMenu`, como em `TabelaProjetosAdmin`): Baixar (`cloud-download`, abre a URL pública do arquivo em nova aba — o bucket é público), Renomear (`pencil`, abre o `DialogoDeRenomear`) e Excluir (`trash`, `tone="danger"`). Colunas: arquivo (ícone `image`/`file-text` + nome), tipo, tamanho, **Em uso** (`Badge` "N projetos" ou "Não usado") e data de envio.
  - **Excluir** passa pelo `DialogoDeConfirmacao`: se algum arquivo selecionado está em uso, a descrição avisa que ele vai sumir de todos os projetos vinculados (a exclusão desfaz o vínculo por cascade no banco, não código do app) antes de apagar de vez o arquivo.
- `DialogoDeRenomear`: `'use client'`. Compõe `Modal` (`tone="surface"`) com um `Field`/`Input` (nome de exibição, até 255 caracteres, contador) e os botões Cancelar/Salvar. Só troca o nome na tabela `arquivos_exemplo`; o caminho no Storage é baseado no id, então nada se move no bucket, e como o nome é sempre lido ao vivo (nunca duplicado em outra tabela), o novo nome já aparece em qualquer lugar que use o arquivo.
- `BibliotecaAdminSkeleton`: bloco de upload + tabela em branco enquanto carrega.
- Ícone do menu: `layers` (já existia no registro).

## Cadastro de projeto (`features/cadastro-projeto/components/`)

Grava e envia de verdade (Supabase + Storage). A tela de criar é montada em `views/admin/ProjetoFormAdminView.tsx` (`/admin/projetos/novo`); a mesma view serve à edição (`/admin/projetos/[id]/editar`), passando `projetoId` + `projetoInicial` já carregados do banco (`buscarProjetoParaEditar`, que resolve a URL de cada imagem gravada; PDFs e outros anexos, privados, só mostram nome e tamanho, sem precisar de URL) e `biblioteca` (arquivos de exemplo já enviados, de `features/biblioteca-exemplos`). Reaproveita `Tabs`, `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `Button`, `IconButton`, `Icon`, `EmptyState`, `FileInput`, `Alert` e `MensagensDeArquivo` (`components/shared/`). Sem token novo.

- `FormularioProjeto`: `'use client'`. 7 abas num `Tabs` vertical (menu ao lado, só o painel da aba escolhida aparece, marcador de completa/pendente/opcional em cada uma). Rodapé com **Anterior**, **Próxima etapa**, **Salvar rascunho** (`secondary`) e **Salvar** (`primary`, a ação principal). O mesmo formulário serve para criar e editar: com `projetoInicial` + `projetoId`, "Salvar" atualiza o projeto existente (mesmo código/slug) em vez de criar um novo. Salvar rascunho exige só o título; Salvar confere tudo, abre a primeira aba com pendência e foca o primeiro campo com erro. Erro de campo aparece ao sair do campo (não a cada tecla) e, depois de "Salvar", em todos. O estado e as ações moram em `hooks/useFormularioProjeto.ts`; a conferência, em `schemas.ts`; a conversão banco → formulário (edição), em `rules.ts` (`paraDadosProjeto`).
- Abas: `EtapaInformacoesGerais` (com `CampoTags`: tags com Enter, máx. 10), `EtapaImagens` (com `GradeDeImagens`: miniaturas com remover e, nas plantas, nome editável), `EtapaCaracteristicas`, `EtapaItensIncluidos`, `EtapaArquivosExemplo` (marca por `Checkbox` quais arquivos da biblioteca — `id` + `nome` + `tipoMime` + `tamanhoBytes` — ficam disponíveis no projeto; biblioteca vazia mostra `Alert` com link "Enviar arquivos", biblioteca com itens ganha um link "Gerenciar biblioteca" abaixo da lista; os dois levam a `/admin/biblioteca`), `EtapaComplementares` (com `CartaoComplementar`: `<details>` que abre e fecha, com o botão de remover) e `EtapaEntrega` (com `ListaDeAnexos`: nome, tamanho e remover).
- Auxiliar: `PainelDaEtapa` (cartão com título de cada aba).
- Regras visuais: `<` e `>` são removidos ao digitar em todo campo de texto; imagens JPG/PNG/WEBP até 2 MB; PDF, ZIP e RAR até 20 MB (no total, na entrega do projeto). Campos começam vazios; placeholders são só dicas.
- Ícones novos no registro: `upload`, `trash`, `circle-check`, `circle-alert`.
- Em "Informações Gerais", depois de "Descrição detalhada": três campos opcionais que espelham a seção "Sobre o projeto" da página pública (`SobreProjeto.tsx`, ainda mockada) — Ambientes (ícone `layout-grid`), Indicado para (`users`) e Aplicações (`building2`), usando a prop `icon` do `Field`.

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
