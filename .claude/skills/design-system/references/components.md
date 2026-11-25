# Catálogo de componentes

Começa com o que a home já exige. Cresce a cada componente novo (regra em `../SKILL.md` §2). Localização segue `arquitetura` §4.

Formato de cada entrada: propósito, variantes, estados, tokens usados, onde vive.

## Primitivos (`components/ui/`)

### Button

- **Propósito:** disparar ação ou navegar (com `href` vira `<Link>`, ou `<a target="_blank">` se o destino for externo).
- **Variantes:** `primary` (preto sólido, para fundo claro), `secondary` (contorno), `secondary-inverse` (contorno claro, para fundo escuro), `ghost` (texto), `accent` (verde vivo com texto preto, para fundo escuro, onde o preto sumiria), `whatsapp` (mesmo estilo do `accent` + ícone do WhatsApp automático, para faixas escuras), `danger` (vermelho sólido com texto claro). Tamanhos: `sm` (33px de altura, 13px semibold), `md` (padrão), `lg`. **O `sm` fica abaixo dos 44px de toque:** só use quando o alvo real for maior, como no card inteiro clicável (`after:absolute after:inset-0`); nasceu no "Ver detalhes" do card da variação do projeto. Ícone à esquerda (`iconLeft`) e à direita (`iconRight`).
- **Quando usar `danger`:** só para **confirmar** o que não tem volta, dentro do `DialogoDeConfirmacao`. O botão que _abre_ a confirmação fica `ghost` ou `secondary` — se cada linha de uma tabela fosse vermelha, o vermelho perderia o sentido.
- **Estados:** repouso, hover, foco, ativo, disabled, loading (`loading` desabilita, mostra spinner e `aria-busy`).
- **Tokens:** `--color-primary(-hover)`, `--color-accent(-hover)`, `--color-danger-solid`, `--color-danger-hover`, `--color-fg`, `--color-fg-inverse`, `--color-border`, `--radius-md`, `min-h-11 px-4 py-3`, `--color-ring`.
- **Nota:** para "card inteiro clicável", passe `after:absolute after:inset-0` no `className` (o card precisa ser `relative`).
- **Link externo:** abre em nova aba (`noopener noreferrer`) e ganha um texto só para leitor de tela: "(abre em uma nova aba)".
- **Nova aba para endereço do próprio site:** com `target="_blank"`, também vira `<a>` simples (sem o pré-carregamento do `next/link`), e um `rel` passado substitui o padrão. Nasceu no "Ver oferta" dos produtos, que passa por `/ir/produto/...` para anotar o clique: o pré-carregamento contaria cliques que não aconteceram.

### IconButton

- **Propósito:** botão redondo só com ícone (setas de galeria e carrossel, fechar, play). `label` é obrigatório: vira o `aria-label`.
- **Variantes:** `tone` `surface` (branco com sombra, padrão) e `inverse` (escuro translúcido, para cima de fotos) e `quiet` (sem fundo nem sombra, cinza; ação discreta de apoio em tabela, ex.: copiar mensagem de venda; ícone de 16px, área de toque continua 44px) e `outline` (mesmo visual do `Button` `secondary`: borda `--color-border`, fundo `--color-surface`, hover `--color-subtle` — para ação isolada sobre fundo claro que não pode parecer "chapada", ex.: compartilhar; ícone de 16px como no `quiet`); `size` `md` (44px) e `lg` (64px, play do banner de vídeo).
- **Estados:** repouso, hover, foco, disabled.
- **Tokens:** `--color-surface`, `--color-inverse`, `--color-fg`, `--color-fg-muted`, `--color-subtle`, `--color-fg-inverse`, `--shadow-md`.

### DropdownMenu

- **Propósito:** menu de contexto por trás de um botão ⋮ (ações de uma linha de tabela, ex.: Editar, Publicar/Rascunho, Excluir).
- **Props:** `label` (nome acessível do botão e do painel, ex.: "Ações de Sobrado com Piscina"), `items: { key, label, icon?, href?, onSelect?, tone?, disabled? }[]` (item com `href` vira link; sem ele, vira botão e chama `onSelect`), `disabled?` (desabilita o botão inteiro, ex.: enquanto uma ação está pendente).
- **Como funciona:** o painel usa o `popover` nativo do navegador (mesma família do `<dialog>` do `Modal`): aparece por cima de tudo, não é cortado pela rolagem de uma `Table`, e fecha sozinho com Esc ou clique fora, sem código de posicionamento manual para isso. A posição (perto do botão que abriu) é calculada em JS a partir do retângulo do botão.
- **`tone: 'danger'`** só muda a cor do texto do item (`--color-danger-fg`), nunca vira vermelho sólido — isso continua exclusivo do `Button` `danger` dentro do `DialogoDeConfirmacao` (regra do `Button` acima). Usado no item "Excluir".
- **Estados:** repouso, hover (`--color-subtle`), foco (anel padrão), disabled (item ou botão inteiro).
- **Tokens:** `--color-border`, `--color-surface`, `--color-subtle`, `--color-danger-fg`, `--radius-md`, `--shadow-md`.

### Modal

- **Propósito:** janela por cima da página (fotos em tela cheia, vídeo, diálogos). `'use client'`, feita com `<dialog>` nativo: foco preso, Esc e clique no fundo fecham, botão "Fechar" embutido. O conteúdo só existe enquanto aberto (o vídeo para de tocar) e a página de trás não rola.
- **Props:** `open`, `onClose`, `label` (nome acessível), `tone`, `immersive`, `className` (moldura interna).
- **`tone`:** `inverse` (padrão) é a moldura escura de foto e vídeo; `surface` é a clara, para diálogo de texto (nasceu com o `DialogoDeConfirmacao`). O botão "Fechar" acompanha o tom.
- **`immersive`:** tela cheia sem moldura nem limite de largura; a página de trás fica escurecida e desfocada (`backdrop-blur-md`) e o conteúdo decide o próprio tamanho. Nasceu com o `Lightbox`. O clique no escuro em volta do conteúdo deve ser tratado por quem usa (a moldura cobre a tela toda).
- **Tokens:** `--color-overlay` (fundo), `--color-overlay-strong` (fundo do `immersive`), `--color-inverse-strong`, `--color-surface`, `--radius-lg`.

### Accordion

- **Propósito:** perguntas que abrem e fecham (FAQ). `<details>` nativo: funciona sem JavaScript, teclado de graça e o texto já vem no HTML (SEO). Recebe `items: { title, content, defaultOpen? }[]` — `defaultOpen` deixa aquele item já expandido ao carregar (`open` nativo do `<details>`).
- **Variante `tone`:** `default` (padrão, claro) e `inverse` (fundo `bg-inverse`, texto `fg-inverse`, para landing com tema escuro próprio, ex.: FAQ e "Destaque-se no mercado" do curso Unreal 5.6).
- **Prop `icon`:** `plus-minus` (padrão) ou `chevron` (uma seta que gira 90° ao abrir) — nasceu no curso Unreal 5.6, cuja referência visual usa seta em vez de +/−.
- **Prop `className`:** aplicada na lista (`<ul>`); junto de seletores `[&_details]:`, sobrescreve cor/borda de cada item quando `tone` não é específico o bastante (ex.: o cinza-chumbo do accordion "Destaque-se no mercado", diferente do `bg-inverse` padrão).
- **Estados:** fechado (ícone `+` ou seta parada), aberto (ícone `−` ou seta girada), hover (`bg-tint`, mesmo verdinho do botão `ghost`; no `inverse`, `fg-inverse/10`), foco.
- **Tokens:** `--color-border`, `--color-surface`, `--color-fg-muted`, `--color-tint`, `--color-inverse`, `--color-fg-inverse`, `--radius-md`.

### Icon

- **Propósito:** único ponto que conhece a biblioteca de ícones (`lucide-react`). `<Icon name="search" />`, decorativo (`aria-hidden`), 20px por padrão (`className="size-6"` para mudar).
- **Marcas** (WhatsApp, Instagram, YouTube, Facebook) não existem no Lucide: SVG próprio em `ui/icons/brand.tsx`, mesmo formato de traço.
- **Bandeiras** (`flag-us`, `flag-br`, `flag-es`, `flag-fr`, `flag-it`, `flag-de`, `flag-ru`, `flag-jp`, `flag-cn`) também são SVG próprio, em `ui/icons/flags.tsx`: cor própria (não `currentColor`), como o "G" do Google — emoji de bandeira não renderiza como cor no Chrome/Windows, some e vira sigla (ex.: "US").
- **Novo ícone:** adicione ao registro em `Icon.tsx`; o tipo `IconName` se atualiza sozinho. `star` (estrela, do Lucide) nasceu nos comentários dos depoimentos: cheia com `fill-current` na classe, vazia sem ela. `arrow-up-right` (↗) nasceu no "Ver oferta" dos produtos: link que abre outro site em nova aba.

### Avatar

- **Propósito:** círculo com as iniciais de uma pessoa (autor dos comentários nos depoimentos). Decorativo (`aria-hidden`): o nome sempre aparece em texto ao lado.
- **Props:** `iniciais` (até 2 letras), `tone`, `size`, `className`.
- **Variantes:** `tone` `green` (padrão), `blue`, `amber` e `instagram` (degradê laranja → rosa → roxo, de baixo-esquerda a cima-direita); `size` `sm` (30px, texto `text-xs`) e `md` (36px, `text-sm`). Texto branco em negrito.
- **Quem escolhe o tom:** `tonsDosAvatares` (`features/projetos/avatares.ts`) alterna verde, azul e âmbar na ordem da lista; nome que começa com "@" é perfil do Instagram e ganha o degradê sem gastar um tom da alternância. As iniciais saem de `iniciaisDoNome` ("Marcos A." → "MA", "@perfil" → "IG").
- **Tokens:** `--color-avatar-green`, `--color-avatar-blue`, `--color-avatar-amber`, `--color-avatar-instagram-from/via/to`, `--color-fg-inverse`.

### Badge

- **Propósito:** selo sobre a imagem (Mais vendido, Lançamento).
- **Variantes:** `solid` (preto), `accent` (verde vivo, texto preto), `success` (verde suave, para status como Publicado), `draft` (cinza com borda, para Rascunho), `discount` (verde escuro sólido `--green-700` com texto branco — nasceu porque o verde vivo do `accent` só dá 2,3:1 com texto branco, abaixo do mínimo de acessibilidade; usado só no selo de desconto do `PriceTag`, ex.: "40% OFF") e `neutral` (cinza claro com borda, texto `fg-muted` — tag informativa sem peso promocional, ex.: categoria/estilo no `ProjetoHero`; distinto do `draft`, que é só para o status "Rascunho"). `success` e `draft` nasceram no painel do administrador. `surface` (pílula branca com texto escuro sobre foto, `--radius-md` e entrelinha 1,5, um pouco mais alta que os outros selos, como no layout — "Você está vendo" no card da variação do projeto).
- **Tamanhos (`size`):** `sm` (padrão, 12px semibold) e `md` (14px negrito, entrelinha justa: mesma altura do `sm` com texto maior — medida do terreno "12×30m" no card da variação do projeto).
- **Tokens:** `--color-surface`, `--color-primary`, `--color-accent`, `--color-badge-success-*`, `--color-badge-draft-*`, `--color-badge-discount-*`, `--color-draft-border`, `--color-border`, `--color-subtle`, `--color-fg-muted`, `--radius-sm`, `--text-xs`.

### Dica

- **Propósito:** ícone "i" com uma explicação num balão, no lugar de um parágrafo sempre à vista (pedido do usuário: tela com muito texto fica poluída). Nasceu na aba Marketing do cadastro (`PainelDaEtapa.dica` e títulos dos grupos).
- **Props:** `texto` (uma ou duas frases), `className`.
- **Comportamento:** abre ao passar o mouse, ao focar pelo teclado e ao tocar; fecha ao sair, com Esc ou tocando fora. Balão no `popover` nativo em modo `manual` (fica por cima de tudo, posição calculada perto do ícone, sem sair da tela), `role="tooltip"` ligado ao botão por `aria-describedby`. Área de toque de 44px com margem negativa (não empurra o título).
- **Regra:** erro de campo nunca vai para a `Dica`; erro fica sempre visível.
- **Tokens:** `--color-surface`, `--color-border`, `--color-fg`, `--color-fg-muted`, `--shadow-md`, `--radius-md`, `--text-sm`.

### Eyebrow

- **Propósito:** rótulo em caixa alta acima de títulos.
- **Tons (`tone`):** `onDark` (padrão: verde vivo `--color-accent`, semibold, `tracking-eyebrow`; hero e banners) e `onLight` (verde discreto `--color-accent-muted`, negrito, `tracking-eyebrow-light`; títulos de seção sobre fundo claro, via `Section eyebrow`).
- **Tokens:** `--color-accent`, `--color-accent-muted`, `--text-xs`, `--tracking-eyebrow`, `--tracking-eyebrow-light`.

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

Logo, navegação principal, ícones de busca/favoritos (links com `aria-label`), botão "Entrar / Cadastrar". Fundo `--color-page` com borda inferior `--color-border`. Recebe tudo por props. Abaixo de `lg` a navegação e o botão vão para o `MobileMenu`; o botão some abaixo de `sm`.

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

- **Prop `eyebrow`:** rótulo em caixa alta acima do título: `Eyebrow` `onLight` nos fundos claros e `onDark` no `inverse`. Nasceu em "Mesmo projeto, outros terrenos".
- **Prop `contentSpacing`:** distância entre o cabeçalho e o conteúdo: `default` (32px) ou `tight` (24px, conteúdo mais perto do subtítulo; "Mesmo projeto, outros terrenos").

### SecaoDestacada (`layout/`)

Seção dentro de uma moldura tracejada violeta (`border-2 border-dashed border-highlight`, `rounded-highlight`) com um selo sobre a borda, no canto esquerdo (fundo `--color-highlight`, texto `--color-highlight-fg`, Poppins 12px negrito em caixa alta, centrado na linha da borda). Mesma ideia do `Section` (título h2, subtítulo, conteúdo), mas a moldura envolve também o título, então é um componente à parte. Props: `selo`, `title`, `subtitle?`, `children`. Fundo `--color-page`, mesmo respiro vertical do `Section`. Nasceu em `PreviasDoProjeto` e passou para cá quando `DepoimentosDeClientes` pediu o mesmo. Server Component (só `useId`). Não decide se aparece: quem usa devolve `null` antes, quando não há conteúdo.

## Compartilhados (`components/shared/`)

### Logo

Prop `tone`: `default` (fundo claro, usado no Header e no Footer) mostra o logotipo oficial, sem `tagline` — já vem no arquivo. Duas imagens, trocadas por breakpoint (`sm`): `Logo_03.png` abaixo de `sm` (celular, mais compacta na largura) e `logo_02.png` a partir de `sm` (faixa horizontal). `inverse` (padrão, fundo escuro, só o painel admin) usa a versão clara do logotipo oficial (`images/sobre/logo-fundo-escuro.png`), com `tagline` como linha extra abaixo (some abaixo de `sm`). `next/image` nos dois casos; testando variantes, ver `changelog.md`.

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

### IconeEmBloco (`ui/`)

Ícone branco num quadrado arredondado colorido, decorativo (`aria-hidden`; o texto ao lado diz o que é). `tone`: amber, blue, green, violet, slate, red, orange, pink, cyan, teal (`--color-tile-*`). `size`: `md` (42px, `rounded-md`, ícone 20px) ou `lg` (64px, `rounded-lg`, `shadow-soft`, ícone 28px). Usado no `FeatureItem` `card`, nos cartões de `ComplementaresDoProjeto` e na escolha de ícone do cadastro.

### FeatureItem

Ícone + título + descrição curta. `tone`: `default`, `inverse` (fundo escuro, hero) ou `card` (cartão `bg-tint` `rounded-lg` `p-3`, ícone e texto com `gap-2.5`, ícone num `IconeEmBloco` `md` verde, título `text-base` semibold e descrição `text-sm` `text-fg-muted`; ignora `layout`; selos de confiança da página do projeto). `layout`: `row` (ícone ao lado, padrão) ou `stack` (ícone em cima; grades de características, entregáveis e perfil). `titleAs="h3"` quando estiver dentro de seção com h2.

### CollapsiblePanel

`'use client'`. No celular, o conteúdo fica atrás de um botão `secondary` com ícone de filtro e contador (`count`, ex.: "Filtros (2)"), com `aria-expanded`/`aria-controls`. A partir de `lg` o conteúdo aparece sempre e o botão some. O conteúdo (`children`) é renderizado no servidor; só o abrir/fechar é estado do navegador. Quem usa dá uma `key` que mude a cada consulta, para o painel fechar depois de aplicar um filtro.

### TextoExpansivel

`'use client'`. Texto longo cortado em `limite` caracteres (padrão 280, corta na última palavra inteira, sem quebrar no meio); abaixo, um botão "Ver mais"/"Ver menos" com `aria-expanded`/`aria-controls` alterna o texto completo. Some sozinho (renderiza só o `<p>`) quando o texto já cabe no limite. Usado no resumo curto do `ProjetoHero`. **Tokens:** `text-primary` no botão.

### TextoFormatado

Server Component. Exibe texto digitado num campo de várias linhas respeitando as quebras de linha e os parágrafos (linha em branco), e aceita negrito com `*texto*` (como no WhatsApp). Só texto puro, sem HTML. Usado na descrição de "Sobre o projeto". **Tokens:** herda a cor de quem usa (`className`).

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
- **Prop `markerClassName`:** sobrescreve a cor do círculo (padrão `bg-accent`) — nasceu na landing do curso Unreal 5.6, cujo tema próprio usa magenta em vez do verde do site.

### Carousel

`'use client'`. Faixa horizontal rolável com encaixe item a item. No celular rola com o dedo; a partir de `md` aparecem setas Anterior/Próximo (`IconButton`) só quando há mais itens para aquele lado. Respeita `prefers-reduced-motion`. Props: `label`, `itemClassName` (largura de cada item, ex.: `w-72`; use `grid` para itens de mesma altura) e os itens como `children`.

- **Prop `dragToScroll`:** no computador, clicar e arrastar com o mouse rola a faixa (cursor de "mãozinha"); ao soltar, desliza até o card mais próximo, e soltar depois de arrastar não abre o link do card. Abaixo de 5px de movimento ainda é clique. Nasceu em "Mesmo projeto, outros terrenos" (`VariacoesDoProjeto`); "Projetos relacionados" ainda não usa.
- **Prop `desktopColumns`:** a partir de `lg`, quantos itens cabem inteiros lado a lado (`4` ou `6`; o `6` nasceu na seção "Decore como no projeto"). A conta da largura (descontando os vãos de 16px) fica dentro do `Carousel`, porque depende do vão dele; no celular vale a largura de `itemClassName`.

### Card de variação do projeto (`features/projetos/components/VariacoesDoProjeto.tsx`)

Card exclusivo da seção "Mesmo projeto, outros terrenos"; fica na feature, não em `shared/`, porque só ela usa. Foto 4:3 com `Badge` `md` (medida do terreno), título Inter 16px médio ("P18 · Terreno 12×30m"), `text-label` `fg-muted` (quartos · vagas · área), preço 18px negrito e `Button` `sm` "Ver detalhes" (card inteiro clicável). Projeto aberto: borda `--color-primary`, `Badge` `surface` "Você está vendo" e "Projeto atual" no lugar do botão; os outros: borda `--color-border`, `shadow-sm` e `shadow-md` no hover. Raio `--radius-lg`. Não usa o `ProjectCard`: o layout pedido é outro (sem favoritar, sem lista de ícones).

### AreaComZoom

`'use client'`. Área de gestos usada pelo `Lightbox` e pelo `VisualizadorPlantaFullscreen` (a lógica existe só aqui). Ocupa o espaço do pai (`absolute inset-0`) e centraliza o conteúdo dentro de um recuo.

- **Props:** `children`, `recuo` (classes de padding que reservam a faixa de contador e botões), `aoDeslizar(passo)` (`1` próxima, `-1` anterior; omita com uma foto só), `aoClicarNoFundo`, `entrada` (`1`/`-1`/`null`: de que lado a foto nova entra), `girarNoCelular`.
- **Efeito de slide:** sem zoom, a foto acompanha o dedo; soltando além do limiar ela desliza para fora (200 ms) e só então troca, e a nova entra deslizando pelo lado oposto (animações `--animate-entrar-pela-direita/esquerda`); soltando antes, volta ao lugar. Quem usa guarda a direção da última troca e passa em `entrada` (zera ao fechar). Respeita `prefers-reduced-motion` (regra global).
- **Gestos:** zoom de 1x a 4x por pinça (celular) ou scroll do mouse/pinça do trackpad, ancorado no ponteiro; com zoom, arrastar move a foto (sem deixá-la sair da tela); sem zoom, arrastar para o lado (≥ 50px) chama `aoDeslizar`. Usa Pointer Events, então mouse e dedo seguem o mesmo caminho. Botões dentro da área (setas, fechar) ficam de fora dos gestos.
- **Regras:** use `key` para zerar o zoom a cada foto. Clicar na foto, ou terminar um arraste, não chama `aoClicarNoFundo`. Com `girarNoCelular`, até `lg` o conteúdo gira 90° numa caixa de `100dvh × 100dvw`, e o arraste/zoom acompanham o giro.

### SetasDoVisualizador

Setas Anterior/Próxima dos visualizadores em tela cheia (`Lightbox`, `VisualizadorPlantaFullscreen`), com `IconButton`. No celular ficam juntas num lugar fixo, na base da tela, como o contador e o "Fechar" no topo: não cobrem a foto nem se mexem com o zoom. A partir de `lg` vão para as laterais, no meio da altura. Props: `aoAnterior`, `aoProxima`, `labelAnterior`, `labelProxima`. Posiciona-se em relação ao pai (`relative`, tela cheia); o conteúdo precisa de recuo na base (`pb-24`) para não ficar sob as setas.

### Lightbox

`'use client'`. Visualizador de fotos em tela cheia dentro de um `Modal` `immersive`: setas Anterior/Próxima, teclas ← →, contador "3 de 21" no topo. Controlado por `index` (`null` = fechado). Zoom, arrastar e deslizar o dedo para trocar de foto vêm da `AreaComZoom`. Cantos arredondados na foto. Sem caixa de proporção fixa: cada foto cresce até encostar na altura ou na largura da tela, mantendo a proporção (foto em pé não fica mais espremida entre faixas pretas). Clicar no escuro em volta da foto fecha.

### VisualizadorDeVideo

`'use client'`. Vídeo (YouTube/Vimeo) em tela cheia dentro de um `Modal` `immersive`, no mesmo visual do `Lightbox`: fundo escurecido e desfocado, player centralizado (16:9, até `max-w-5xl`, cantos arredondados) e botão de fechar no canto da tela, fora de cima do vídeo. Clicar no escuro em volta fecha. Props: `src`, `open`, `onClose`, `label`. O player entra "limpo" (`embedDeVideo` com `hideControls`: sem barra de controles, sem sugestões e com a marca reduzida) e **com som**, porque só nasce depois do clique em "Assistir vídeo" (`mute: false`). Usado por `MediaGallery` e `VideoBanner`.

### MediaGallery

`'use client'`. Galeria do topo da página: foto grande com setas, ícone de tela cheia no canto (`IconButton`, sem texto; abre o `Lightbox`), botão "Assistir vídeo" (abre o `VisualizadorDeVideo`, só se houver vídeo), até 6 miniaturas e um bloco "+N" que abre o visualizador na primeira foto escondida. A foto inicial carrega com `priority`.

### VisualizadorPlantaFullscreen

- **Propósito:** planta humanizada em tela cheia, dentro de um `Modal` `immersive` (mesmo visual do `Lightbox`: tela cheia, fundo escurecido e desfocado, contador "X de Y" no topo com 2+ pavimentos, setas Anterior/Próxima). Não usa o `Lightbox` em si porque a planta precisa de zoom e de giro no celular, que fotos não precisam. Até `lg`, gira 90° (`rotate-90`, sem depender da Screen Orientation API, inconsistente no Safari) numa caixa com largura e altura trocadas (`100dvh × 100dvw`) para ocupar a tela em pé; a partir de `lg`, sem giro.
- **Zoom e gestos:** vêm da `AreaComZoom` (pinça no celular, scroll do mouse no desktop, arraste com zoom, deslizar o dedo sem zoom troca de pavimento). Entre 1x e 4x, reinicia ao trocar de pavimento. A planta tem cantos arredondados (`rounded-lg`), como as fotos.
- **Props:** `images`, `index` (`null` = fechado), `onIndexChange`, `onClose`, `label`.
- **Usado em:** `GaleriaPlantaHumanizada` (feature `projetos`), acionado por um `IconButton` (ícone `maximize`, canto superior esquerdo da imagem) — não o `Button` com texto do `MediaGallery`: sobre a planta (fundo claro, poucos elementos), o botão preto sólido chamava mais atenção que a própria planta; o círculo branco discreto, no mesmo estilo das setas que já ficam sobre essa imagem, resolveu.
- **Tokens:** `--color-inverse-strong`, `--color-inverse`, `--color-fg-inverse`.

### VideoBanner

`'use client'`. Bloco escuro arredondado com imagem ao fundo, título, texto e um grande play (`IconButton` `lg`) que abre o vídeo no `VisualizadorDeVideo`. Selo de duração opcional (`Badge`). Hover: imagem de fundo dá zoom leve (`scale-105`), mesmo padrão dos cards de projeto.

### JsonLd

Injeta dados estruturados (schema.org) para o Google. Escapa o `<` para o conteúdo nunca fechar a tag `<script>`. É o único uso permitido de `dangerouslySetInnerHTML` no projeto.

### ShareButton

`'use client'`. Botão redondo só com ícone de compartilhar (`IconButton` `outline`, círculo de 32px com ícone de 16px, como o coração do card; a área de toque continua 44px, esticada por um `after:-inset-1.5` invisível). Props: `url` (endereço completo), `title`, `label` (nome acessível, ex.: "Compartilhar Casa Térrea Moderna"), `className` (posição, ex.: `ml-auto`). Com menu de compartilhar do aparelho (celular), abre o menu nativo (`navigator.share`); sem ele (computador), copia o link e, por 2 segundos: o ícone vira check, o botão ganha fundo `--color-tint` e ícone `--color-primary`, e um balão escuro "Link copiado!" (`--color-inverse`, `--shadow-md`) aparece logo abaixo; leitores de tela ouvem o mesmo aviso (`role="status"`). Usado na linha do código e das tags do `ProjetoHero`, no canto direito. **Variante `visualizador`:** para dentro do `Lightbox` e do `VisualizadorPlantaFullscreen`, no canto inferior direito (`right-4 bottom-4`, posição de quem usa): `IconButton` `inverse` de 44px, igual aos outros controles de lá, e o balão "Link copiado!" abre **acima** do botão (abaixo sairia da tela). O tipo `DadosDeCompartilhamento` (`url`, `title`, `label`) é montado uma vez pela página e passado ao botão do topo e aos visualizadores (prop opcional `compartilhar`; sem ela, sem botão — caso do mosaico do curso Unreal). Sem token novo (o balão é só deste botão; um toast global continua no backlog).

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
- `PreviasDoProjeto`: `'use client'`. Logo depois de `IncluidoNoProjeto`. Fotos de prévia (plantas, detalhamentos) dentro de uma moldura de destaque: contorno tracejado violeta (`border-2 border-dashed border-highlight`, `rounded-highlight`) com o selo "PRÉVIAS DO PROJETO" sobre a borda (centrado na linha), título, subtítulo e os cartões. Layout igual ao da referência enviada pelo usuário (2026-11-20). A moldura, o selo, o título e o subtítulo vêm de `SecaoDestacada` (`layout/`).
  - **Props:** `previas: ItemGaleria[]` (vem de `ProjetoDetalhe.previas`, montada pelo repositório a partir das fotos de papel `previa` cadastradas na aba "Prévias do Projeto"), `compartilhar` (como a `GaleriaCompleta`). **Opcional:** devolve `null` sem prévias, e a seção some da página.
  - **Cartão:** proporção 33:20 (a da referência), `rounded-lg`, borda `--color-border`, fundo `--color-surface`, foto inteira (`object-contain`, sem cortar), sem marca d'água (tirada a pedido do usuário).
  - **Responsivo:** a partir de `md`, grade de 2 colunas (as fotos que passam de 2 formam novas linhas); no celular, uma coluna com todas as fotos à mostra, a foto centralizada no cartão (pedido do usuário, 2026-11-20).
  - **Clique:** abre o `Lightbox` só com as prévias.
  - **Ainda não existe:** o quadro vazio "Sua foto aqui" da referência (entendido como espaço reservado do layout, não algo que o visitante veja).
- `ComplementaresDoProjeto`: Server Component, logo depois de `ObrasDeClientes`. Dentro da `SecaoDestacada` (selo e título "Projetos complementares"): um cartão por complementar (`rounded-lg`, borda, `p-4`): `IconeEmBloco` `lg` com o ícone escolhido no cadastro (padrão: documento ardósia), título (h3, `text-lg`), descrição em uma linha; acima de 70 caracteres, `<details>` com setinha que solta a linha (sem JavaScript). À direita, preço (`font-heading`, `text-xl`, negrito) e `Button` primário "Comprar" (só com checkout). No celular, preço e botão descem para baixo do texto. Layout igual a `referencias/padrão projetos complementares.png`.
- `ProvaSocial`: Server Component, no `ProjetoHero` logo abaixo de "Adicionar aos favoritos". Faixa `bg-highlight-subtle` `rounded-md`: 3 `Avatar` `sm` sobrepostos (`-space-x-2`, `ring-2 ring-surface`; iniciais e ordem dos tons verde/azul/âmbar sorteadas por projeto a partir do slug, `avataresSorteados` em `avatares.ts`, sempre as mesmas) + `Avatar` `highlight` "+"; 5 estrelas `--color-rating` (cheias até a nota arredondada), nota com vírgula em negrito e "· N clientes já compraram este projeto" (1 → "1 cliente já comprou"). Dados da aba Marketing; sem quantidade de clientes devolve `null`; sem nota, some só a parte das estrelas.
- `ObrasDeClientes`: `'use client'`. Logo depois de `DepoimentosDeClientes`. Dentro da `SecaoDestacada` (selo "OBRAS DE CLIENTES", título "Do projeto à obra"): fotos de obras de clientes enviadas pelo admin (aba Marketing, até 5). Layout igual à referência enviada pelo usuário (2026-11-20).
  - **Props:** `obras: FotoDeObra[]` (`imagem`, `etapa` já em texto ou `null`, `cidade` ou `null`), `compartilhar`.
  - **Quando aparece:** sem nenhuma foto, a seção some.
  - **Mosaico (a partir de `md`):** 5 fotos = grade de 4 colunas, a 1ª ocupa 2 colunas × 2 linhas; 3 fotos = 3 colunas, a 1ª grande; 1 foto = larga (16:9); 2 ou 4 fotos = 2 colunas iguais. Fotos 4:3, `rounded-highlight`, `object-cover`, `gap-4`. No celular, 2 colunas com a 1ª foto na largura toda (e a última também, se sobrar sozinha); o selo pode quebrar em 2 linhas no celular e fica numa linha (corta com reticências) a partir de `md`.
  - **Selo da foto:** canto de baixo à esquerda, `bg-overlay-strong` + `backdrop-blur-sm`, `rounded-md`, `text-sm`; situação em `--color-accent-on-inverse` (semibold) + " · " + cidade em `--color-fg-inverse`. Só aparece com situação ou cidade; com um só, mostra só ele.
  - **Clique:** abre o `Lightbox` só com estas fotos.
- `DepoimentosDeClientes`: `'use client'`. Logo depois de `PreviasDoProjeto`. Dentro da `SecaoDestacada` (selo "DEPOIMENTOS", título "O que nossos clientes dizem"): uma fileira de **prints** de conversa (WhatsApp, SketchUp, Instagram...) enviados pelo admin e, abaixo, cartões de **comentário** escritos pelo admin. Layout igual ao da referência enviada pelo usuário (2026-11-20).
  - **Props:** `prints: PrintDeCliente[]` (só `id` e `imagem`: o cartão é a foto, sem nome nem origem), `comentarios: ComentarioDeCliente[]` (`nota` 1–5, `texto`, `nome`, `cidade`), `compartilhar`.
  - **Quando aparece:** sem nenhum print, a seção **inteira** some (mesmo com comentários); sem comentários, só a fileira de baixo some.
  - **Cartão de print:** é um botão só com a foto do print (sem cabeçalho, nome nem origem; o print de WhatsApp já traz isso dentro). `rounded-highlight`, borda `--color-border`, `shadow-soft`, `overflow-hidden`, proporção fixa 9:16 (tela de celular; ≈ 264×469px no computador), foto `object-cover object-top` enchendo o cartão até a borda: mostra o começo da conversa, e o print inteiro abre ao clicar. Grade de 2 colunas no celular e no tablet, 4 a partir de `lg` (os comentários, abaixo, continuam na faixa de deslizar no celular).
  - **Cartão de comentário:** mesma moldura, `p-5`. Estrelas (`Icon star`, 14px, `--color-rating`; cheia `fill-current`, vazia só contorno), texto entre aspas (`text-comment`), autor (`Avatar` `md` + nome + cidade) e "✓ Compra verificada" (sempre, em todos os cartões, por decisão do usuário) (`text-xs`, semibold, `--color-verified`).
  - **Responsivo:** prints em 4 colunas a partir de `lg` (2 em `md`) e comentários em 3 colunas a partir de `lg` (2 em `md`); abaixo de `md`, cada fileira vira uma faixa que desliza de lado com encaixe (cartões com 85% da largura, para o próximo aparecer um pouco). A faixa tem folga (`-mx-3 -mb-3 px-3 pb-3`) para a sombra não ser cortada pela rolagem.
  - **Clique no print:** abre o `Lightbox` só com os prints.
  - **Dados:** aba "Marketing" do cadastro (prints: papel `depoimento` em `projeto_arquivos`; comentários: coluna jsonb `comentarios_clientes` de `projetos`). A página só mostra comentário completo (nota 1–5, texto, nome e cidade).
  - **Tamanhos de texto novos** (`--text-caption` 11px, `--text-label` 13px, `--text-comment` 14,4px): o layout enviado usa uma escala 1px menor que a do site. Não substituem nenhum tamanho existente.
- `EspecificacoesTecnicas`, `SobreProjeto`, `IncluidoNoProjeto`, `GaleriaCompleta` (grade com só as 8 primeiras fotos, 2 colunas no celular e 4 a partir de `lg`; o `Lightbox` percorre todas), `CaracteristicasAmbientes`, `PerfilProjeto`, `PerguntasFrequentes`, `ProjetosRelacionados` (reaproveita o `ProjectCard` da home, com selo "Similar").
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

- `FormularioProjeto`: `'use client'`. 10 abas num `Tabs` vertical (menu ao lado, só o painel da aba escolhida aparece, marcador de completa/pendente/opcional em cada uma). Rodapé com **Anterior**, **Próxima etapa**, **Salvar rascunho** (`secondary`) e **Salvar** (`primary`, a ação principal). O mesmo formulário serve para criar e editar: com `projetoInicial` + `projetoId`, "Salvar" atualiza o projeto existente (mesmo código/slug) em vez de criar um novo. Salvar rascunho exige só o título; Salvar confere tudo, abre a primeira aba com pendência e foca o primeiro campo com erro. Erro de campo aparece ao sair do campo (não a cada tecla) e, depois de "Salvar", em todos. O estado e as ações moram em `hooks/useFormularioProjeto.ts`; a conferência, em `schemas.ts`; a conversão banco → formulário (edição), em `rules.ts` (`paraDadosProjeto`).
- Abas: `EtapaInformacoesGerais` (com `CampoTags`: tags com Enter, máx. 10), `EtapaImagens` (com `GradeDeImagens`: miniaturas com remover e, nas plantas, nome editável; nas imagens do projeto, também reordenam: alça de arrastar (ou setas do teclado) e, para muitas de uma vez, uma bolinha numerada para marcar na ordem desejada + barra "Mover para o início"), `EtapaCaracteristicas`, `EtapaItensIncluidos`, `EtapaArquivosExemplo` (marca por `Checkbox` quais arquivos da biblioteca — `id` + `nome` + `tipoMime` + `tamanhoBytes` — ficam disponíveis no projeto; biblioteca vazia mostra `Alert` com link "Enviar arquivos", biblioteca com itens ganha um link "Gerenciar biblioteca" abaixo da lista; os dois levam a `/admin/biblioteca`), `EtapaPrevias` (aba "Prévias do Projeto", logo depois de "Arquivos de Exemplo", **opcional**: `FileInput` com `multiple` + `MensagensDeArquivo` + `GradeDeImagens` com reordenar e "Mover para o início", sem limite de fotos; cada foto é reduzida a 2400 px e convertida para WebP ao escolher, como a planta humanizada, e vira a seção "Prévias do projeto" da página pública; sem foto, a seção não aparece), `EtapaMarketing` (aba "Marketing", logo depois de "Prévias do Projeto", **opcional**: pouco texto à vista: as explicações do painel e dos grupos ficam na `Dica` (ícone "i"), só os erros aparecem em texto. Grupo "Prints de clientes" (`FileInput` sem dica, prints reduzidos a 800 px de LARGURA e WebP 80%, perfil `REDUCAO_DE_IMAGEM.print`, papel `depoimento`) e grupo "Comentários", lista compacta de cartões com `NotaEmEstrelas` (1 a 5, rádios escondidos desenhados como estrelas, `--color-rating`) + remover, `Textarea` do comentário (2 linhas, até 300 caracteres, sem contador) e `Input` de nome e de cidade-UF lado a lado, com rótulos só para leitor de tela (o placeholder diz o que é); botão "Adicionar comentário" (nasce com 5 estrelas), teto de 30; alimenta `DepoimentosDeClientes`; e grupo "Obras de clientes": `FileInput` (até 5 fotos, reduzidas como as fotos do projeto, papel `obra`; ao chegar a 5 o campo desativa) + `GradeDeImagens` com reordenar e, sob cada miniatura, `Select` de situação (Em obra, Acabamento, Concluída) e `Input` de cidade-UF lado a lado, os dois opcionais e sem rótulo visível; alimenta `ObrasDeClientes`), `EtapaComplementares` (com `CartaoComplementar`: `<details>` que abre e fecha, com o botão de remover; o resumo mostra o ícone escolhido; dentro, a escolha de "Ícone" é uma fileira de `IconeEmBloco` `md` como rádios escondidos, com anel no escolhido e `Dica`) e `EtapaEntrega` (com `ListaDeAnexos`: nome, tamanho e remover).
- Auxiliar: `PainelDaEtapa` (cartão com título de cada aba).
- Regras visuais: `<` e `>` são removidos ao digitar em todo campo de texto; imagens JPG/PNG/WEBP até 2 MB; PDF, ZIP e RAR até 20 MB (no total, na entrega do projeto). Campos começam vazios; placeholders são só dicas.
- Ícones novos no registro: `upload`, `trash`, `circle-check`, `circle-alert`.
- Em "Informações Gerais", depois de "Descrição detalhada": três campos opcionais que espelham a seção "Sobre o projeto" da página pública (`SobreProjeto.tsx`, ainda mockada) — Ambientes (ícone `layout-grid`), Indicado para (`users`) e Aplicações (`building2`), usando a prop `icon` do `Field`.

## Tradução do site (`features/idioma/components/`)

Site traduzido pelo widget gratuito do Google Translate (Website Translator), escondido, comandado por um seletor com a cara do site — sem API paga, sem reload de página, sem cookie `googtrans`. Serviço puro (leitura/gravação do `<select>` que o Google injeta) em `services/translate`; o estado do idioma ativo vem do hook `useIdioma` (`hooks/`), que usa `useSyncExternalStore` para ler o `localStorage` sem erro de hidratação (servidor sempre renderiza `pt`).

- `SeletorDeIdioma`: dropdown no `Header`, com bandeira + código do idioma ativo (ex.: 🇧🇷 PT) e um painel com os 9 idiomas (pt, en, es, fr, it, de, ru, ja, zh-CN). O idioma inicial vem do navegador (`idiomaPreferido`, em `services/translate`) quando a pessoa ainda não escolheu; a escolha manual sempre vence. Mesma técnica de posicionamento do `DropdownMenu` (`popover` nativo), com gatilho e itens próprios (bandeira, texto e um check no idioma atual, em vez de ícone/link/ação). `notranslate` no elemento inteiro, para o Google não tentar traduzir o próprio seletor.
- `GoogleTranslateWidget`: sem interface, monta a `<div id="google_translate_element">` escondida (fora da tela, não só `display:none`, porque o widget do Google pode falhar ao montar se o container nunca tiver layout) e os dois `<Script>` (a função de callback do Google e o `element.js` dele). A UI visual do widget (banner, balão, destaque de texto) é escondida globalmente em `styles/globals.css`, com `!important` (o Google usa estilo inline).
- `ReaplicarTraducaoNaRota`: sem interface. O Next troca de rota sem recarregar a página, então o Google só traduziu o HTML da rota anterior; a cada mudança de caminho ou busca (`usePathname`/`useSearchParams`), reaplica o idioma salvo ao conteúdo novo.
- Os três são montados uma vez no `SiteShell` (não no layout raiz): a tradução é só para as páginas públicas, o painel do administrador (layout próprio) não carrega o widget.
- **Sem token novo.** 6 bandeiras novas no registro do `Icon` (`flag-fr`, `flag-it`, `flag-de`, `flag-ru`, `flag-jp`, `flag-cn`), mesmo estilo SVG das 3 que já existiam — emoji de bandeira não renderiza como cor no Chrome/Windows (nota já registrada no `Icon` acima).

## Produtos (`features/produtos/components/` e `features/produtos-cadastro/components/`)

- `ProdutoCard`: card de produto da Loja e da seção "Decore como no projeto". Foto quadrada (`bg-subtle` enquanto carrega), rótulo `text-sm` `fg-muted` (o ambiente no projeto; "Categoria · Ambiente" na Loja), nome Inter 14px (16px do `sm`) médio em até 2 linhas, `Button` `primary` largura total "Ver oferta" com `arrow-up-right`, em nova aba. Superfície `--color-surface`, borda `--color-border`, `--radius-lg`, `shadow-sm`. **Sem preço e sem nome de loja.** Fica na feature (só produtos usam).
- `DecoreComoNoProjeto`: `Section` `tint` + filtros por ambiente (`Button` `primary` no ativo, `secondary` nos outros, `aria-pressed`; só aparecem com 2+ ambientes) + `Carousel` (`desktopColumns={6}`, ~2,5 cards no celular, 3,5 no `sm`, 4,5 no `md`) + aviso de afiliado `text-sm` `fg-muted`. Trocar o filtro remonta o carrossel (volta ao início).
- `FormularioDeFiltrosLoja`: o mesmo visual dos filtros de `/projetos` (cartão com borda, `Input`/`Select` com rótulo), mas **na horizontal** do `lg` em diante (grid `2fr 1fr 1fr auto`); no celular fica empilhado dentro do `CollapsiblePanel` "Filtros".
- `GradeDeProdutos`: grade 2/3/4/6 colunas (celular/`sm`/`md`/`lg`). 24 por página, que divide por todas, então as linhas ficam completas. `LojaSkeleton` tem o mesmo formato.
- `FormularioProduto` (painel): **página própria, sem janela flutuante** (padrão do cadastro de projetos): `/admin/produtos/novo` e `/admin/produtos/<id>/editar`, cartão branco com grupos (Dados do produto com foto quadrada `FileInput`/prévia, nome, link, categoria, origem e ativo; Ambientes em `Checkbox`; Aparece nos projetos com `SeletorDeProjetos`), `Dica` nos títulos e Cancelar/Salvar no rodapé. Na aba Decoração do cadastro de projeto, o mesmo formulário abre **dentro da aba**, no lugar da lista. Não é um `<form>` (fica dentro do formulário do projeto): salva pelo botão.
- `EditorDeOpcoes` (painel): "Editar categorias" / "Editar ambientes" (`Button` `ghost` com `pencil`) abaixo do campo, no próprio formulário de produto. Abre **no lugar, sem janela flutuante**, um bloco `bg-subtle` com `Input` + "Adicionar" (Enter também adiciona) e a lista (linhas `bg-surface`, "N produtos" em `text-xs` `fg-muted`, lixeira `IconButton` `quiet`). Apagar confirma com `DialogoDeConfirmacao`; categoria em uso fica com a lixeira desativada. O que é criado já vem marcado/escolhido no produto. Ambientes são opcionais.
- `TabelaProdutosAdmin` (ações no `DropdownMenu`, como a tabela de projetos) e `ProdutosDoProjeto` (lista da aba Decoração, com alça `grip` para arrastar): mesmos padrões da tabela de Projetos e da aba Variações (linhas com borda, `IconButton` `quiet`, `Badge` `neutral` para "Inativo").
- **Sem token novo.**

## Registro

Ao criar ou alterar um componente, adicione/atualize a entrada acima e anote em `../changelog.md`.
