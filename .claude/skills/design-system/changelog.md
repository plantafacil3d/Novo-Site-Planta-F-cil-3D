# Changelog do design system

Registre toda decisão que muda token, regra de UX ou catálogo. Mais recente primeiro.

Formato: `AAAA-MM-DD · o quê · por quê`

## 2026-09-24 (selo de desconto com texto branco)

- Componente novo: `PriceTag` (shared) — preço com desconto (original riscado + preço atual + selo verde), usado no card da vitrine, no topo da página do projeto, na faixa de compra do celular e no banner "Gostou deste projeto?". Detalhes em `components.md`.
- Token novo: `--color-badge-discount-bg`/`-fg` (`--green-700`/`--white`), e o primitivo `--green-700` (`#15803d`) que o token aponta. Variante nova do `Badge`: `discount`.
- Por quê: o usuário pediu o selo de desconto com texto branco (como no Mercado Livre) sobre o verde vivo da marca (`--green-500`), testando direto no navegador. Esse par só dá 2,3:1 de contraste — falha o mínimo de acessibilidade do site (4,5:1). Em vez de aceitar o contraste baixo ou trocar para texto escuro (perdendo o efeito pedido), criamos um verde mais escuro só para esse selo: `--green-700` dá 5:1 com texto branco, passa AA e continua verde, só um tom mais fechado que o `accent` vivo usado nas outras tags (Mais vendido, Lançamento), que **não mudam**.
- Nota: `--green-700` **tinha sido removido** da paleta em 2026-09-20 (simplificação para preto + verde vivo, ver entrada "paleta preto + verde vivo"). Reintroduzido agora com um propósito único e documentado (não é o mesmo uso de antes), para não repetir a mistura de tons que motivou a remoção.
- Ajuste no mesmo dia: usuário achou o primeiro tom (`#15803d`, 5,0:1) escuro demais e pediu algo mais claro, "com mais vida". Clareado para `#15853f` (4,7:1) — o tom mais claro que ainda passa o mínimo de acessibilidade (4,5:1) com texto branco; não dá para clarear mais sem cair abaixo do mínimo. Valor final não é mais o Tailwind `green-700` padrão (`#15803d`); é um tom próprio, calculado para esse limite.
- Correção de layout no mesmo dia: no `ProjectCard`, o selo de desconto estava quebrando para uma terceira linha própria (riscado / selo sozinho / atual + botão), deixando o card mais alto do que devia. Causa: o preço divide a linha com o botão "Ver detalhes"; sobra só ~88px de largura ali, e riscado + selo juntos (~130px) não cabem. Corrigido montando o preço à mão no `ProjectCard` (sem passar pelo `PriceTag`): riscado + selo numa linha cheia (largura do card inteiro, sem disputar espaço com o botão), preço atual ao lado do botão embaixo, como já era antes do desconto existir. `PriceTag` continua igual (selo ao lado do preço atual) nos outros três lugares, onde há espaço de sobra.

## 2026-09-23 (loading da página de um projeto)

- Corrigido: ao clicar num projeto a partir da home, aparecia por um instante a grade de cards da listagem (`ProjetosSkeleton`) em vez de um "em branco" da própria página. Causa: `/projetos/[slug]` não tinha `loading.tsx` próprio, então herdava o da rota pai `/projetos` (regra do App Router: sem `loading.tsx` no segmento, usa o do ancestral mais próximo).
- Componente novo: `ProjetoDetalheSkeleton` (feature `projetos`), usado em `views/projetos/ProjetoCarregando.tsx` e no novo `app/(site)/projetos/[slug]/loading.tsx`. Sem token novo.

## 2026-09-23 (biblioteca central de arquivos de exemplo)

- Resolvida a rota `/admin/biblioteca`, pendente desde 2026-09-21: a aba "Arquivos de Exemplo" do cadastro de projeto agora recebe uma biblioteca de verdade (antes sempre vazia). Feature nova `features/biblioteca-exemplos/`, tela em `views/admin/BibliotecaAdminView.tsx`. Detalhes em `components.md`.
- Componentes novos: `FormularioEnvioBiblioteca` e `TabelaBibliotecaAdmin` (feature biblioteca-exemplos), `BibliotecaAdminSkeleton`.
- Componente **movido**: `MensagensDeArquivo` saiu de `features/cadastro-projeto/components/` para `components/shared/`. Por quê: passou a ser usado por duas features (cadastro de projeto e biblioteca) sem nenhuma regra de domínio — exatamente o critério de promoção da skill `arquitetura` §2 ("só promova para camada compartilhada quando houver reuso real"). Comportamento e aparência idênticos, só mudou de pasta; os 3 usos em `cadastro-projeto` foram atualizados para importar do novo caminho.
- Menu do painel (`AdminShell`) ganhou o item "Biblioteca" (ícone `layers`, já existia no registro — sem ícone novo).
- Decisão: a coluna "Ações" da `TabelaBibliotecaAdmin` usa `IconButton` (não `DropdownMenu`, como a `TabelaProjetosAdmin`). Por quê: um arquivo da biblioteca só tem uma ação possível (excluir) — não há "editar" nem "publicar/rascunho" para desambiguar; um menu de um item só é atrito a mais, sem ganho de acessibilidade.
- Decisão: o aviso de exclusão (`DialogoDeConfirmacao`) muda de texto quando algum arquivo selecionado está em uso — avisa em quantos projetos e que o vínculo some de todos ao confirmar, já que a exclusão da biblioteca é definitiva (regra de negócio do usuário: "avisar antes, se o arquivo estiver em uso"). Sem componente novo: é conteúdo dinâmico nas mesmas props (`descricao`, `itens`) que a `TabelaProjetosAdmin` já usa.
- Sem token novo: a tabela e o formulário de envio reaproveitam os tokens de `Table`, `Badge`, `FileInput` e `Alert` já documentados.
- Pendente (fora do escopo desta rodada, registrado no plano): o arquivo de exemplo é público por regra de negócio (bucket próprio, sem parede de autenticação), mas a página pública do projeto ainda não existe de verdade — o site público lê de uma lista em memória, sem ligação com os projetos reais do Supabase (mesma pendência já registrada em 2026-09-21/22 para "Ver no site"). Nenhuma seção de download foi criada lá ainda.

## 2026-09-22 (menu de ações e edição de projetos no painel)

- Componente novo: `DropdownMenu` (ui) — menu de contexto (botão ⋮) para as ações de uma linha da `TabelaProjetosAdmin`: Editar projeto, Salvar como rascunho ↔ Publicar projeto, Excluir. Detalhes em `components.md`.
- Decisão: o painel do `DropdownMenu` usa o `popover` nativo do navegador (mesma família do `<dialog>` já usado no `Modal`), em vez de um portal React com listeners manuais de clique-fora/Esc. Por quê: a `Table` tem `overflow-x-auto` (que também recorta a vertical), e um painel `absolute` comum seria cortado nas linhas perto da borda; o `popover` renderiza na _top layer_ do navegador e já fecha sozinho com Esc e clique fora, sem código extra — o mesmo raciocínio que já levou o `Modal` a usar `<dialog>` nativo.
- Ícones novos: `more-vertical` (botão ⋮; não confundir com `move-vertical`, ícone diferente já registrado) e `pencil` (Editar projeto).
- Resolvida a rota `/admin/projetos/[id]/editar`, citada como pendente em 2026-09-21: reaproveita o `FormularioProjeto` existente (já previsto para criar e editar), agora carregando o cadastro completo do banco (`buscarProjetoParaEditar`) e salvando como atualização (`projetoId` inicial no `useFormularioProjeto`, para o primeiro "Salvar" não duplicar o projeto).
- Resolvida a dívida da `TabelaProjetosAdmin`: o banner de aviso, que copiava as classes do `Alert` à mão, agora usa o componente `Alert` diretamente (citada como pendente em 2026-09-21).
- Confirmação de sucesso após editar: a listagem lê `?salvo=1` (fora do schema de paginação/busca, para não "grudar" nos links) e mostra um `Alert` de sucesso. Não é um sistema de toast novo (esse continua no backlog) — reaproveita o mesmo padrão de estado-na-URL que a busca e a paginação já usam.
- Sem token novo: o `DropdownMenu` reaproveita `--shadow-md` (já documentado em `tokens.md` como "sombra de card em hover, dropdown"), `--color-border`, `--color-surface`, `--color-subtle` e `--color-danger-fg` (o item "Excluir" só muda a cor do texto — vermelho sólido continua exclusivo do `Button danger` dentro do `DialogoDeConfirmacao`).
- Pendente: "Ver no site" na coluna Ações continua sem existir (mesmo motivo de 2026-09-21: o site público ainda lê a lista em memória).

## 2026-09-21 (exclusão de projetos no painel)

- Componente novo: `DialogoDeConfirmacao` (shared) — última parada antes de uma ação sem volta. Detalhes em `components.md`.
- Token novo: `--color-danger-hover: var(--red-800)`, o hover do botão destrutivo. Por quê: os tokens de perigo já existiam, mas faltava o tom de hover, e a paleta não tem `--red-700`. Reaproveitar o vermelho escuro que já está lá evita um primitivo novo só para isso. Branco sobre `#c62828` dá 5,6:1 e sobre `#8e1c1c` dá 9,0:1 — os dois passam AA.
- Variante nova: `Button` `danger` (vermelho sólido). Regra de uso: só para **confirmar** o que não tem volta, nunca para abrir o caminho até lá. Por quê: se cada linha da tabela tivesse um botão vermelho, vinte linhas virariam uma parede de alerta e o vermelho perderia o sentido — o botão de excluir na linha é `ghost`, e o vermelho aparece só dentro da confirmação.
- Extensão compatível: `Modal` ganhou `tone` (`inverse` padrão, `surface` nova). Por quê: o `Modal` nasceu para foto e vídeo em tela cheia e a moldura era sempre escura, fundo errado para um diálogo de texto. O padrão é `inverse`, então `Lightbox`, `MediaGallery` e `VideoBanner` seguem idênticos.
- Decisão: no diálogo, "Cancelar" vem antes de "Confirmar" no HTML. Por quê: o `showModal()` dá foco ao primeiro elemento focável, então quem abre e aperta Enter sai sem estragar nada.
- Sem ícone novo: o botão de excluir usa o `trash` que já existe.
- Pendente: a coluna "Ações" da `TabelaProjetosAdmin` ainda não tem "Editar" (a rota não existe) nem "Ver no site" (o site público ainda lê da lista em memória, então o link daria 404). A cópia das classes do `Alert` na mesma tabela também continua lá.

## 2026-09-21 (cadastro de projeto recriado, só interface)

- O `FormularioProjeto` da etapa anterior (2 seções numa página só, ligado ao Supabase) foi **apagado** e o cadastro foi recriado em `features/cadastro-projeto/`, com 7 abas e todas as regras do briefing. Por enquanto **nada é gravado nem enviado**: é para o usuário aprovar o visual antes da etapa do banco e do Storage. Detalhes em `components.md`.
- Componentes novos em `ui/`: `FileInput` (área tracejada para escolher arquivos) e `Alert` (aviso success/error/warning/info). Extensões compatíveis: `Tabs` ganhou `orientation="vertical"`, aba controlada (`value`/`onValueChange`), marcador por aba (`status`) e `footer`; `Field` ganhou `counter`. Ícones novos: `upload`, `trash`, `circle-check`, `circle-alert`.
- Sem token novo: borda tracejada em `--color-border-strong`, marcador "completa" em `--color-accent` com check `--color-fg` (só preenchimento, como manda `ux-rules.md`), avisos nos tokens `notification-*`.
- Decisão: menu de abas como `Tabs` vertical em vez de um componente novo (`Stepper`). Por quê: a necessidade é a de abas com marcador; estender o `Tabs` evita duplicar o que já existe. A galeria pública, que também usa `Tabs`, foi conferida e segue igual.
- Decisão: marcador "Opcional" nas abas 5 e 6 enquanto vazias, em vez de check. Por quê: um check numa aba que ninguém tocou passaria a impressão de que ela foi preenchida.
- Decisão: erros de campo só aparecem ao sair do campo (e, depois de "Salvar", em todos), como diz `ux-rules.md`; o aviso "Faltam informações em…" acompanha o estado atual e some sozinho quando não sobra pendência.
- Pendente: o link "Enviar arquivos" (aba 5) aponta para `/admin/biblioteca`, página que ainda não existe. A `TabelaProjetosAdmin` ainda tem uma cópia das classes do `Alert`.

## 2026-09-20 (cadastro de projeto no painel)

- Componentes novos: `Textarea` e `Field` (ui) e `FormularioProjeto` (feature admin), com as etapas 1 e 2 do cadastro. Detalhes em `components.md`. O botão "Cadastrar Projeto" deixou de ser só visual.
- Sem token novo. Erro de campo usa `--color-danger-fg` (como o `FormularioLogin`), não `--color-danger`, que é o tom sólido de borda e não garante contraste AA como texto.
- Decisão: sem ícone novo; o botão "Salvar rascunho" usa o `check` que já existe.
- Decisão: `Field` não clona nem injeta nada no campo; quem monta o formulário liga o campo ao erro com `aria-describedby`. Por quê: mantém o `Field` simples e o `Input`/`Select`/`Textarea` independentes dele.
- Pendente: `Stepper` (passo a passo) e o campo de vídeo do YouTube entram com as etapas seguintes; sem elas o formulário fica numa página só.

## 2026-09-20 (listagem `/projetos`)

- Primeira tela de listagem: filtros, paginação e estados de loading, vazio e erro. Componentes novos: `Select`, `Checkbox`, `Chip`, `Skeleton` (ui); `Pagination` (navigation); `CollapsiblePanel`, `EmptyState`, `ErrorState` (shared); `FormularioDeFiltros`, `FiltrosAplicados`, `ProjetosSkeleton` (feature). Todos saíram do backlog. Detalhes em `components.md`. Ícones novos: `chevron-down`, `sliders`.
- Variante: `ProjetosDestaque` ganhou `className` (colunas da grade). A listagem divide a tela com os filtros e usa 2 colunas em `lg` e 3 em `xl`.
- Sem token novo. `Skeleton` usa `--color-border` (o `--color-subtle` some sobre o branco); `ErrorState` usa os tokens de notificação de erro, não `danger` direto (regra de acoplamento de `tokens.md`).
- Decisão: `Select` é o `<select>` nativo em vez de lista personalizada. Por quê: no celular abre o seletor do sistema, o teclado e o leitor de tela já funcionam, e nada de JavaScript a manter.
- Decisão: filtros num formulário GET (`next/form`) que aplica com um botão ("Aplicar filtros"), em vez de filtrar a cada clique. Por quê: o estado fica na URL (link compartilhável, botão "voltar" certo, Google enxerga as páginas) e o servidor busca só uma página por vez. Como não filtra ao digitar, não precisa de _debounce_; ele passa a valer se um dia houver busca ao vivo.
- Decisão: no celular os filtros ficam recolhidos atrás do botão "Filtros (N)", e as etiquetas dos filtros ativos ficam sempre visíveis fora do painel. Por quê: os filtros ocupam uma tela inteira e empurrariam os projetos para baixo.
- Decisão: páginas com filtro ou ordem diferente da padrão saem do Google (`noindex, follow`); só a lista sem filtro e suas páginas numeradas são indexadas, cada uma com canonical próprio. Por quê: evitar milhares de combinações quase iguais.
- Pendente: o filtro "fachada" pedido pelo usuário ainda não existe. Falta definir se é um tipo de projeto (só a fachada, sem plantas) ou outra coisa; nasce como mais uma opção em `tiposDeProjeto` (`features/projetos/catalogo.ts`).

## 2026-09-20 (paginação e volume de dados)

- Regra nova em `ux-rules.md` (Listas e paginação): nenhuma lista que pode crescer aparece inteira; catálogo com páginas numeradas e número na URL, 12 cards por página em grade e 20 linhas em tabela do admin.
- `Pagination` continua no backlog, mas agora é obrigatório na primeira listagem (`/projetos`). Sem token novo.
- Por quê: o site é um marketplace e pode chegar a milhares de projetos. Buscar tudo de uma vez sobrecarregaria banco, rede e navegador, e o painel do admin sofre o mesmo. Melhor definir a regra antes de ligar o banco. As regras de dados estão em `arquitetura` §3.1 e os limites de segurança em `seguranca` §8.1.
- Decisão: "Carregar mais" só em listas privadas e curtas; no catálogo público, páginas numeradas, por serem melhores para o Google e para o botão "voltar".

## 2026-09-20 (página do projeto)

- Primeira leva de componentes para a página `/projetos/[slug]`: `IconButton`, `Modal`, `Accordion` (ui); `Breadcrumb`, `Tabs` (navigation); `MediaGallery`, `Lightbox`, `Carousel`, `VideoBanner`, `CheckList`, `JsonLd` (shared). Saem do backlog: Modal, Tabs, Breadcrumb e Carrossel/Galeria. Detalhes em `components.md`.
- Variantes novas: `FeatureItem layout="stack"`, `FavoriteButton variant="button"`, `CTABanner variant="card"` (com preço). O `Button` de link externo passou a incluir "(abre em uma nova aba)" para leitor de tela; vale também para o WhatsApp da home.
- Sem token novo. Verde vivo continua só como preenchimento (círculo do check, selo "Mais vendido", botão sobre fundo escuro); aba ativa e botão de compra em `--color-primary`.
- Decisão: `Modal` usa `<dialog>` nativo e `Accordion` usa `<details>` nativo, em vez de biblioteca ou JavaScript próprio. Por quê: foco, Esc e teclado já vêm prontos, e o texto do FAQ fica no HTML para o Google.
- Decisão: a referência mostra o botão flutuante do WhatsApp; o usuário decidiu **não incluir por enquanto**.
- Pendente (conteúdo, não de design): fotos, vídeo e link de checkout são de exemplo; os textos do FAQ e do "Importante saber" (`features/projetos/conteudo.ts`) são provisórios e precisam de revisão do cliente.

## 2026-09-20 (tokens de estado)

- Novas famílias de estado `-solid/-subtle/-border/-fg` para success, warning, danger e **info** (azul `--blue-600`), mais `draft-*` (rascunho, neutro) e gerais `border-strong`, `link`, `overlay`, `bg-disabled`, `fg-disabled`. Por quê: só havia uma cor sólida por estado, sem fundo suave nem texto AA.
- `--color-success/warning/danger` mantidos como atalhos de `-solid`; único uso hoje: `Input` invalid. Sem quebra.
- Decisão: componentes de feedback terão token próprio (`notification-*`, `badge-*`) apontando para os semânticos, criados junto com o componente. Por quê: trocar o vermelho do erro de formulário não pode mudar a notificação.
- Criados já os tokens de componente `--color-notification-{success|error|warning|info}-{bg|border|fg|icon}` e `--color-badge-{draft|success|error|warning|info}-{bg|fg}`, apontando para os semânticos de estado. Por quê: pedido do usuário para deixar documentado, mesmo sem uso ainda (exceção consciente à regra de "não criar por antecipação"; os componentes `Notification` e `Badge` de status ainda não existem).
- Azul do `info` (`--blue-600`, `#1d6fb8`) confirmado pelo usuário. Pendente (marca): cinza do `rascunho`, ainda proposta.

## 2026-09-20 (paleta preto + verde vivo)

- Marca é preto e branco e minimalista; o verde entra só para dar vida. `--color-primary` passa de verde-floresta para `--black-900` (hover `--gray-700`): botões, `Badge solid`, preços, ícones, "Ver todos" e logo sobre fundo claro ficam pretos.
- `--color-accent` passa de `--lime-400` para `--green-500` (`#22c55e`, verde vivo); novo `--color-accent-hover` (`--green-600`, `#16a34a`). `--color-ring` passa a `--green-600`: o anel lima dava 1,8:1 sobre branco, o novo dá 3,3:1 e passa também sobre preto.
- `--color-inverse` (banners) passa de `--green-900` para `--gray-900`: quase preto, para o site ler como preto e branco com uma única cor. `--green-100` (tint) clareado e refrescado para `#e7f8ec`.
- Primitivos removidos: `--green-900`, `--green-700`, `--lime-400`. Novo: `--green-500`, `--gray-700`; `--green-600` mudou de valor. `--success-600` fica verde-escuro de propósito (texto de sucesso precisa de AA).
- Verde vivo sobre branco dá 2,3:1: só como preenchimento (selo, sublinhado), nunca como texto. Por isso preços e ícones em fundo claro ficam pretos.
- `Button`: nova variante `accent` (verde vivo, texto preto) para fundo escuro, onde o preto sumiria; `whatsapp` reutiliza o mesmo estilo e perde a borda clara. `CTABanner inverse` passa a usar `accent` por padrão. Caixa do canto do hero passa a `bg-accent`.
- Ajuste no mesmo dia: `--color-inverse` passa de `--gray-900` para o novo primitivo `--black-800` (`#141d20`, preto com leve tom azul-petróleo, escolhido pelo usuário testando no navegador; o neutro `#141414` foi testado e descartado). `--gray-900` continua só como cor do texto (`#14201a`). Primitivo separado porque texto e fundo de banner evoluem de forma independente: mexer em um não pode repintar o outro. Só o `CTABanner` usa `--color-inverse`; o hero (`--color-inverse-strong`, `--black-900`) não mudou.
- Header, rodapé, `MobileMenu` e `MainNav` passaram de fundo escuro (`--color-inverse`/`--color-inverse-strong`) para claro (`--color-page` + borda `--color-border`), e o `Logo` ganhou a prop `tone` (`inverse` padrão, `default` para fundo claro). Feito antes desta rodada e registrado aqui depois. Por quê: a marca é preto e branco minimalista; o escuro fica só no hero e nos banners.
- Contraste: `--gray-500` (texto secundário) falhava AA sobre `--green-100` (4,1:1) e `--gray-50` (4,2:1) e passava por pouco sobre branco (4,5:1); afetava subtítulo e descrições da seção "Por que escolher". Escurecido de `#6b7a72` para `#627068` (aprovado pelo usuário): 5,2:1 no branco, 4,9:1 no `--gray-50`, 4,7:1 no `--green-100`. Impacto: todo `text-fg-muted` (links do rodapé e do menu, subtítulos, especificações do card, slogan do logo, placeholder) fica um pouco mais escuro.
- Paleta aprovada pelo usuário na home no mesmo dia (visual profissional, sem cansar). Sem validação do cliente/Figma ainda. Para deixar o verde mais suave ou mais forte, ajustar `--green-500` em `tokens.css`.

## 2026-09-20

- `SKILL.md` §2: explicitado por que existem componentes de UI e variantes (projeto escalável) e a regra de crescimento: variante só quando uma tela pede, dentro do `cva` do componente, registrada em `components.md` e neste changelog. Sem mudança de token, componente ou código.

## 2026-09-19 (home)

- Primeira leva de componentes para a home: `Button`, `Icon`, `Badge`, `Eyebrow`, `Input` (ui); `Header`, `Footer`, `Section`, `MainNav`, `MobileMenu`, `SkipLink`; `Logo`, `SearchBar`, `ProjectCard`, `MediaCard`, `FavoriteButton`, `CategoryTile`, `FeatureItem`, `CTABanner` (shared). Registrados em `components.md`.
- Biblioteca de ícones: `lucide-react`, encapsulada em `ui/Icon.tsx`. Marcas (WhatsApp, Instagram, YouTube, Facebook) como SVG próprio em `ui/icons/brand.tsx`.
- Novos: `Button` variante `secondary-inverse` (contorno claro para fundo escuro) e `MediaCard` (não estava no catálogo; a home tem cards de complementares só com imagem, título e preço) e `Eyebrow` (o rótulo em caixa alta se repete 3×, então virou componente, como manda `tokens.md`).
- `CategoryTile` não usa `Chip`: é só um link, sem estado de seleção. `Chip` volta ao backlog.
- Variante `whatsapp` do `Button` usa `--color-primary` + borda clara. Branco sobre `--green-600` dá ~4,3:1 (falha AA em texto pequeno), então o verde-claro não vira fundo em repouso. Se faltar destaque sobre a faixa escura, propor token `--color-whatsapp` (decisão de marca: confirmar).
- Sem novos tokens de cor, raio, sombra ou tipografia. Fotos de exemplo (Unsplash) são temporárias.

## 2026-09-19

- Criação da skill `design-system`: tokens (3 níveis), regras de UX e catálogo inicial. Baseada na referência visual da home (preto-esverdeado, verde, verde-limão, branco).
- Valores de cor, fonte e escala são **aproximados**; pendente confirmação do usuário/Figma.
- Estilização (Tailwind, CSS Modules...) ainda não definida; tokens em CSS variables para funcionar com qualquer uma.

## 2026-09-19 (Tailwind)

- Estilização definida: **Tailwind v4** (config em CSS). Tokens em `src/styles/tokens.css`; primitivos em `:root`, semânticos em `@theme`.
- Paleta padrão do Tailwind desligada; só existem as cores do design system.
- Tokens semânticos renomeados para virarem classes limpas: `color-bg-*` → `color-page/subtle/tint/inverse`, `color-text*` → `color-fg*`, `color-action-primary*` → `color-primary*`, `color-focus-ring` → `color-ring`. Sem impacto: ainda não havia código consumidor.
- `--color-success` separado do verde dos botões (novo primitivo `--success-600`).
- Espaçamento: adotada a escala padrão do Tailwind (removidos os `--space-*`).
- Fontes definidas: Poppins (títulos) + Inter (texto).

## 2026-09-20 (painel do administrador)

- Novos componentes: `Table` e `SidebarNav`. Variantes novas do `Badge` (`success`, `draft`), prop `hideLabel` no `Checkbox` e `defaultValue` no `SearchBar`. Ícones novos: copy, dashboard, file-pen, folder, chart, log-out.
- Nenhum token novo: os tokens de badge e de notificação que já existiam cobriram o painel.
- Layout do painel separado do site (route groups `(site)` e `admin`), porque o painel usa menu lateral e não tem cabeçalho nem rodapé públicos.
