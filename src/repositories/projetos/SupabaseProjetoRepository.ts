import 'server-only'

import {
  iconeDoComplementar,
  rotuloDaEtapaDaObra,
  textoAlternativoDaImagem,
  type DadosDoNomeDaImagem,
} from '@/features/cadastro-projeto'
import {
  formatarFamiliaIndicada,
  type Categoria,
  type ComentarioDeCliente,
  type FotoDeObra,
  type Complementar,
  type ComplementarDoProjeto,
  type ConsultaProjetos,
  type Diferencial,
  type ItemGaleria,
  type ItemInformacaoPavimento,
  type LimitesDeFiltro,
  type OrdenacaoProjetos,
  type PavimentoPublico,
  type PrintDeCliente,
  type ProvaSocialDoProjeto,
  type Projeto,
  type ProjetoDetalhe,
} from '@/features/projetos'
import { criarClientePublico } from '@/lib/supabase/publico'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import { InMemoryProjetoRepository } from './InMemoryProjetoRepository'
import type { ProjetoRepository } from './ProjetoRepository'

/** Quantos projetos relacionados reais buscar no máximo. */
const RELACIONADOS_MAXIMO = 8
/** Quantos projetos aparecem na vitrine ("Projetos em destaque"): os publicados mais recentes. */
const DESTAQUES_MAXIMO = 8

type LinhaArquivo = { caminho: string; papel: string; ordem: number }

// `!inner` + filtro por `papel` abaixo: só entra projeto com imagem principal cadastrada (índice
// único garante no máximo uma por projeto), e a contagem da página fecha com o que é exibido —
// sem isso, um projeto "publicado" sem foto ainda contaria no total mas sumiria do grid.
const COLUNAS_RESUMO =
  'id, codigo, slug, titulo, codigo_youtube, categoria, estilo, ' +
  'preco_centavos, preco_promocional_centavos, preco_efetivo_centavos, ' +
  'largura_m, profundidade_m, area_construida_m2, quartos, suites, suite_master, banheiros, lavabo, ' +
  'vagas, pavimentos, piscina, area_gourmet, ' +
  'projeto_arquivos!inner (caminho, papel, ordem)'

type LinhaResumo = {
  id: string
  codigo: string
  slug: string
  titulo: string
  codigo_youtube: string | null
  categoria: string | null
  estilo: string | null
  preco_centavos: number | null
  preco_promocional_centavos: number | null
  /** Sempre um número: a coluna gerada já resolve para 0 quando não há preço. */
  preco_efetivo_centavos: number
  largura_m: number | null
  profundidade_m: number | null
  area_construida_m2: number | null
  quartos: number | null
  suites: number | null
  suite_master: number | null
  banheiros: number | null
  lavabo: number | null
  vagas: number | null
  pavimentos: number | null
  piscina: boolean | null
  area_gourmet: boolean | null
  projeto_arquivos: LinhaArquivo[]
}

const COLUNAS_DETALHE =
  'id, codigo, slug, titulo, codigo_youtube, categoria, estilo, ' +
  'preco_centavos, preco_promocional_centavos, preco_efetivo_centavos, ' +
  'largura_m, profundidade_m, area_construida_m2, quartos, suites, suite_master, banheiros, lavabo, ' +
  'vagas, pavimentos, piscina, area_gourmet, ' +
  'checkout_url, resumo, descricao, ambientes, indicado_para, aplicacoes, ' +
  'perfil_terreno, familia_capacidade, itens, video_url, comentarios_clientes, obras_clientes, ' +
  'prova_social_clientes, prova_social_nota, ' +
  'projeto_arquivos (id, caminho, papel, ordem, pavimento_id), ' +
  'projeto_pavimentos (id, nome, ordem, pavimento_itens (id, nome, metragem_m2, numero_bolinha, ordem)), ' +
  // Só as colunas liberadas ao público (`entrega` e `link` são conteúdo pago).
  'projeto_complementares (id, titulo, valor_centavos, descricao, checkout_url, icone, ordem)'

type LinhaLimite = {
  preco_efetivo_centavos: number
  area_construida_m2: number | null
  quartos_total: number | null
  suites: number | null
  suite_master: number | null
  banheiros: number | null
  lavabo: number | null
  vagas: number | null
  pavimentos: number | null
}

type LinhaVocabulario = { categoria: string | null; estilo: string | null }

const COLUNAS_LIMITE =
  'preco_efetivo_centavos, area_construida_m2, quartos_total, suites, suite_master, banheiros, ' +
  'lavabo, vagas, pavimentos, projeto_arquivos!inner(papel)'

type LinhaArquivoDetalhe = LinhaArquivo & { id: string; pavimento_id: string | null }

type LinhaPavimento = {
  id: string
  nome: string | null
  ordem: number
  pavimento_itens: {
    id: string
    nome: string
    metragem_m2: number | null
    numero_bolinha: number | null
    ordem: number
  }[]
}

type LinhaComplementar = {
  id: string
  titulo: string | null
  valor_centavos: number | null
  descricao: string | null
  checkout_url: string | null
  icone: string | null
  ordem: number
}

type LinhaDetalhe = Omit<LinhaResumo, 'projeto_arquivos'> & {
  projeto_arquivos: LinhaArquivoDetalhe[]
  projeto_pavimentos: LinhaPavimento[]
  projeto_complementares: LinhaComplementar[]
  checkout_url: string | null
  resumo: string | null
  descricao: string | null
  ambientes: string | null
  indicado_para: string | null
  aplicacoes: string | null
  perfil_terreno: string | null
  familia_capacidade: number | null
  itens: string[]
  video_url: string | null
  /** jsonb gravado pelo cadastro (aba Marketing); lido com cuidado, como dado de fora. */
  comentarios_clientes: unknown
  /** jsonb com a legenda das fotos de obras (aba Marketing); lido como dado de fora. */
  obras_clientes: unknown
  prova_social_clientes: number | null
  prova_social_nota: number | string | null
}

/** Faixa de prova social: só com a quantidade de clientes; a nota fora de 1–5 é ignorada. */
function lerProvaSocial(linha: LinhaDetalhe): ProvaSocialDoProjeto | null {
  const clientes = linha.prova_social_clientes
  if (typeof clientes !== 'number' || !Number.isInteger(clientes) || clientes < 1) return null
  const nota = linha.prova_social_nota === null ? null : Number(linha.prova_social_nota)
  return { clientes, nota: nota !== null && nota >= 1 && nota <= 5 ? nota : null }
}

/** Legenda de cada foto de obra, pelo id do arquivo. O que vier fora do formato vira "sem legenda". */
function lerLegendasDasObras(
  valor: unknown,
): Map<string, { etapa: string | null; cidade: string | null }> {
  const legendas = new Map<string, { etapa: string | null; cidade: string | null }>()
  if (!Array.isArray(valor)) return legendas
  for (const item of valor as unknown[]) {
    if (typeof item !== 'object' || item === null) continue
    const { arquivoId, etapa, cidade } = item as Record<string, unknown>
    if (typeof arquivoId !== 'string') continue
    const cidadeLida = typeof cidade === 'string' ? cidade.trim() : ''
    legendas.set(arquivoId, { etapa: rotuloDaEtapaDaObra(etapa), cidade: cidadeLida || null })
  }
  return legendas
}

/** Um comentário só aparece completo: nota de 1 a 5 e texto, nome e cidade preenchidos (um rascunho
 *  pode ter gravado um pela metade). Qualquer coisa fora desse formato é ignorada. */
function lerComentarios(valor: unknown, slug: string): ComentarioDeCliente[] {
  if (!Array.isArray(valor)) return []
  const texto = (campo: unknown) => (typeof campo === 'string' ? campo.trim() : '')
  return valor.flatMap((item: unknown, indice): ComentarioDeCliente[] => {
    if (typeof item !== 'object' || item === null) return []
    const { nota, texto: comentario, nome, cidade } = item as Record<string, unknown>
    const lido = { texto: texto(comentario), nome: texto(nome), cidade: texto(cidade) }
    if (typeof nota !== 'number' || !Number.isInteger(nota) || nota < 1 || nota > 5) return []
    if (!lido.texto || !lido.nome || !lido.cidade) return []
    return [{ id: `${slug}-comentario-${indice}`, nota, ...lido }]
  })
}

/** Ícone do cartão de um complementar: o escolhido no cadastro, ou o padrão. */
function iconeDoCartao(valor: string | null): ComplementarDoProjeto['icone'] {
  const { icone, tom } = iconeDoComplementar(valor)
  return { nome: icone, tom }
}

/** Nome de coluna real de cada ordenação da URL. */
const COLUNA_DE_ORDENACAO: Record<OrdenacaoProjetos, { coluna: string; ascendente: boolean }> = {
  relevancia: { coluna: 'criado_em', ascendente: false },
  'menor-preco': { coluna: 'preco_efetivo_centavos', ascendente: true },
  'maior-preco': { coluna: 'preco_efetivo_centavos', ascendente: false },
  'maior-area': { coluna: 'area_construida_m2', ascendente: false },
  'menor-area': { coluna: 'area_construida_m2', ascendente: true },
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto (skill `seguranca` §8.1). */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

async function resolverUrl(caminho: string): Promise<string> {
  return fileStorage.urlPublica({ acesso: 'publico', caminho })
}

/** O que o texto alternativo das imagens usa do cadastro (a mesma regra do nome dos arquivos). */
const dadosDoNome = (linha: LinhaResumo): DadosDoNomeDaImagem => ({
  categoria: linha.categoria,
  larguraM: linha.largura_m,
  profundidadeM: linha.profundidade_m,
  quartos: linha.quartos,
  suites: linha.suites,
  suiteMaster: linha.suite_master,
})

function derivarDiferencial(piscina: boolean, areaGourmet: boolean): Diferencial | undefined {
  if (piscina) return { tipo: 'piscina', rotulo: 'Piscina' }
  if (areaGourmet) return { tipo: 'varanda-gourmet', rotulo: 'Área Gourmet' }
  return undefined
}

/** `null` quando o projeto não tem imagem principal (não deveria acontecer com status "publicado"). */
/** "Planta baixa de sobrado 10x20 com 3 quartos"; com mais de um pavimento, o nome dele vai no fim. */
function altDaPlanta(
  linha: LinhaResumo,
  nomeDoPavimento: string,
  variosPavimentos: boolean,
): string {
  const texto = textoAlternativoDaImagem(dadosDoNome(linha), 'planta')
  if (!texto) return `Planta: ${nomeDoPavimento}`
  return variosPavimentos ? `${texto} – ${nomeDoPavimento}` : texto
}

async function montarResumo(linha: LinhaResumo): Promise<Projeto | null> {
  const principal = linha.projeto_arquivos.find((arquivo) => arquivo.papel === 'principal')
  if (!principal) return null

  const piscina = linha.piscina ?? false
  const areaGourmet = linha.area_gourmet ?? false

  return {
    id: linha.id,
    codigo: linha.codigo,
    codigoYoutube: linha.codigo_youtube ?? undefined,
    slug: linha.slug,
    titulo: linha.titulo,
    imagem: {
      src: await resolverUrl(principal.caminho),
      alt:
        textoAlternativoDaImagem(dadosDoNome(linha), 'foto') ??
        `Foto principal do projeto ${linha.titulo}`,
    },
    estilo: (linha.estilo ?? undefined) as Projeto['estilo'],
    larguraM: linha.largura_m ?? 0,
    profundidadeM: linha.profundidade_m ?? 0,
    areaConstruidaM2: linha.area_construida_m2 ?? 0,
    suites: linha.suites ?? 0,
    suiteMaster: linha.suite_master ?? 0,
    quartos: linha.quartos ?? 0,
    banheiros: linha.banheiros ?? 0,
    lavabo: linha.lavabo ?? 0,
    vagas: linha.vagas ?? 0,
    pavimentos: linha.pavimentos ?? 0,
    piscina,
    areaGourmet,
    diferencial: derivarDiferencial(piscina, areaGourmet),
    precoCentavos: linha.preco_efetivo_centavos,
    // Só existe quando o promocional cadastrado é de fato menor que o normal (o cadastro já
    // impede promocional >= normal, mas um registro salvo antes dessa regra pode não valer mais).
    precoOriginalCentavos:
      linha.preco_promocional_centavos !== null &&
      linha.preco_centavos !== null &&
      linha.preco_promocional_centavos < linha.preco_centavos
        ? linha.preco_centavos
        : undefined,
  }
}

async function montarDetalhe(linha: LinhaDetalhe): Promise<ProjetoDetalhe | null> {
  const base = await montarResumo(linha)
  if (!base) return null

  // A foto principal (mesma do card) sempre entra como a 1ª da galeria, pra abrir a página com a
  // mesma imagem que o cliente já viu na listagem, em vez de uma foto aleatória da galeria.
  const principal = linha.projeto_arquivos.find((arquivo) => arquivo.papel === 'principal')
  if (!principal) return null

  const galeriaArquivos = linha.projeto_arquivos
    .filter((arquivo) => arquivo.papel === 'galeria' && arquivo.caminho !== principal.caminho)
    .sort((a, b) => a.ordem - b.ordem)
  const restante: ItemGaleria[] = await Promise.all(
    galeriaArquivos.map(async (arquivo, indice) => ({
      id: arquivo.caminho,
      imagem: {
        src: await resolverUrl(arquivo.caminho),
        alt:
          textoAlternativoDaImagem(dadosDoNome(linha), 'foto') ??
          `Foto ${indice + 2} do projeto ${linha.titulo}`,
      },
    })),
  )
  const galeria: ItemGaleria[] = [{ id: principal.caminho, imagem: base.imagem }, ...restante]

  // Prévias do cadastro (papel `previa`), na ordem em que o admin deixou. A leitura pública já só
  // devolve as de projeto publicado (policy do banco); sem nenhuma, a seção não aparece.
  const previas: ItemGaleria[] = await Promise.all(
    linha.projeto_arquivos
      .filter((arquivo) => arquivo.papel === 'previa')
      .sort((a, b) => a.ordem - b.ordem)
      .map(async (arquivo, indice) => ({
        id: arquivo.caminho,
        imagem: {
          src: await resolverUrl(arquivo.caminho),
          alt: `Prévia ${indice + 1} do projeto ${linha.titulo}`,
        },
      })),
  )

  // Prints de clientes (aba Marketing, papel `depoimento`), na ordem do cadastro. Mesma policy das
  // prévias: só os de projeto publicado. Sem nenhum, a seção "O que nossos clientes dizem" some.
  const prints: PrintDeCliente[] = await Promise.all(
    linha.projeto_arquivos
      .filter((arquivo) => arquivo.papel === 'depoimento')
      .sort((a, b) => a.ordem - b.ordem)
      .map(async (arquivo, indice) => ({
        id: arquivo.caminho,
        imagem: {
          src: await resolverUrl(arquivo.caminho),
          alt: `print ${indice + 1} de cliente do projeto ${linha.titulo}`,
        },
      })),
  )

  // Obras de clientes (aba Marketing, papel `obra`), na ordem do cadastro, com a legenda de cada uma.
  // Mesma policy das prévias; sem nenhuma, a seção "Do projeto à obra" some. O teto de 5 é o do
  // cadastro (e do banco): aqui só garante o mosaico mesmo com um estado inesperado.
  const legendasDasObras = lerLegendasDasObras(linha.obras_clientes)
  const obras: FotoDeObra[] = await Promise.all(
    linha.projeto_arquivos
      .filter((arquivo) => arquivo.papel === 'obra')
      .sort((a, b) => a.ordem - b.ordem)
      .slice(0, 5)
      .map(async (arquivo, indice) => {
        const legenda = legendasDasObras.get(arquivo.id)
        return {
          id: arquivo.caminho,
          imagem: {
            src: await resolverUrl(arquivo.caminho),
            alt: `Obra ${indice + 1} de cliente construída com o projeto ${linha.titulo}`,
          },
          etapa: legenda?.etapa ?? null,
          cidade: legenda?.cidade ?? null,
        }
      }),
  )

  // Só entram pavimentos com imagem gravada (a publicação já exige isso; defensivo contra estado
  // inconsistente, no mesmo espírito de `principal` acima).
  const plantaHumanizada: PavimentoPublico[] = (
    await Promise.all(
      linha.projeto_pavimentos
        .slice()
        .sort((a, b) => a.ordem - b.ordem)
        .map(async (pavimento, indice): Promise<PavimentoPublico | null> => {
          const arquivo = linha.projeto_arquivos.find(
            (item) => item.papel === 'planta' && item.pavimento_id === pavimento.id,
          )
          if (!arquivo) return null
          // Mesmo padrão de `nomePadraoPavimento` (cadastro-projeto/rules.ts): nulo = sem nome
          // customizado, mostra o padrão calculado pela posição.
          const nome = pavimento.nome ?? `Pavimento ${indice + 1}`
          const itens: ItemInformacaoPavimento[] = pavimento.pavimento_itens
            .slice()
            .sort((a, b) => a.ordem - b.ordem)
            .map((item) => ({
              id: item.id,
              nome: item.nome,
              metragemM2: item.metragem_m2,
              numeroBolinha: item.numero_bolinha,
            }))
          return {
            id: pavimento.id,
            nome,
            imagem: {
              src: await resolverUrl(arquivo.caminho),
              alt: altDaPlanta(linha, nome, linha.projeto_pavimentos.length > 1),
            },
            itens,
          }
        }),
    )
  ).filter((pavimento): pavimento is PavimentoPublico => pavimento !== null)

  // Complementar sem título é rascunho do cadastro: não tem o que mostrar.
  const complementares: ComplementarDoProjeto[] = linha.projeto_complementares
    .filter((complementar) => Boolean(complementar.titulo))
    .sort((a, b) => a.ordem - b.ordem)
    .map((complementar) => ({
      id: complementar.id,
      titulo: complementar.titulo ?? '',
      descricao: complementar.descricao ?? '',
      precoCentavos: complementar.valor_centavos,
      checkoutUrl: complementar.checkout_url ?? '',
      icone: iconeDoCartao(complementar.icone),
    }))

  return {
    ...base,
    categoriaRotulo: linha.categoria ?? '',
    checkoutUrl: linha.checkout_url ?? '',
    resumo: linha.resumo ?? '',
    sobre: {
      descricao: linha.descricao ?? '',
      ambientes: linha.ambientes ?? '',
      indicadoPara: linha.indicado_para ?? '',
      aplicacoes: linha.aplicacoes ?? '',
    },
    galeria,
    plantaHumanizada,
    previas,
    depoimentos: { prints, comentarios: lerComentarios(linha.comentarios_clientes, linha.slug) },
    obras,
    provaSocial: lerProvaSocial(linha),
    video: linha.video_url ? { src: linha.video_url } : undefined,
    itensInclusos: linha.itens,
    complementares,
    perfil: {
      terrenoMinimo: `${linha.largura_m ?? 0}x${linha.profundidade_m ?? 0}m`,
      perfilDoTerreno: linha.perfil_terreno ?? '',
      familia: linha.familia_capacidade ? formatarFamiliaIndicada(linha.familia_capacidade) : '',
      estilo: linha.estilo ?? '',
      categoria: linha.categoria ?? '',
    },
  }
}

/**
 * Adapter real do site público: todo o catálogo (vitrine, listagem com filtros, detalhe,
 * relacionados e slugs) vem do Supabase, sempre projetos com `status = 'publicado'` (a mesma regra
 * que já tem RLS no banco). `listarComplementares`/`listarCategorias` continuam num adapter à
 * parte (`InMemoryProjetoRepository`): complementares ainda não têm tabela própria, e categorias é
 * a navegação fixa da home — nenhum dos dois é "projeto".
 */
export class SupabaseProjetoRepository implements ProjetoRepository {
  private readonly estatico = new InMemoryProjetoRepository()

  async listarDestaques(): Promise<Projeto[]> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('projetos')
      .select(COLUNAS_RESUMO)
      .eq('status', 'publicado')
      .eq('projeto_arquivos.papel', 'principal')
      .order('criado_em', { ascending: false })
      .limit(DESTAQUES_MAXIMO)
      .overrideTypes<LinhaResumo[], { merge: false }>()
    if (error) {
      throw new AppError('falha_inesperada', 'Não foi possível carregar os projetos em destaque.')
    }
    const projetos = await Promise.all(data.map(montarResumo))
    return projetos.filter((projeto): projeto is Projeto => projeto !== null)
  }

  async buscarProjetos(consulta: ConsultaProjetos): Promise<Pagina<Projeto>> {
    const { filtros, ordenacao, pagina, porPagina } = consulta
    const tamanho = Math.max(1, Math.floor(porPagina))
    const de = (Math.max(1, Math.floor(pagina)) - 1) * tamanho
    const supabase = criarClientePublico()

    let consultaSupabase = supabase
      .from('projetos')
      .select(COLUNAS_RESUMO, { count: 'exact' })
      .eq('status', 'publicado')
      .eq('projeto_arquivos.papel', 'principal')

    // Cada palavra vira um filtro parametrizado na coluna `busca` (nome + código, em minúsculas).
    for (const palavra of (filtros.busca ?? '').toLowerCase().split(/\s+/).filter(Boolean)) {
      consultaSupabase = consultaSupabase.ilike('busca', comoTrecho(palavra))
    }
    if (filtros.categoria) consultaSupabase = consultaSupabase.eq('categoria', filtros.categoria)
    if (filtros.estilo) consultaSupabase = consultaSupabase.eq('estilo', filtros.estilo)
    if (filtros.quartosMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('quartos_total', filtros.quartosMin)
    }
    if (filtros.suitesMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('suites', filtros.suitesMin)
    }
    if (filtros.suiteMasterMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('suite_master', filtros.suiteMasterMin)
    }
    if (filtros.banheirosMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('banheiros', filtros.banheirosMin)
    }
    if (filtros.lavaboMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('lavabo', filtros.lavaboMin)
    }
    if (filtros.vagasMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('vagas', filtros.vagasMin)
    }
    if (filtros.pavimentosMin !== undefined) {
      consultaSupabase = consultaSupabase.gte('pavimentos', filtros.pavimentosMin)
    }
    if (filtros.areaMinM2 !== undefined) {
      consultaSupabase = consultaSupabase.gte('area_construida_m2', filtros.areaMinM2)
    }
    if (filtros.areaMaxM2 !== undefined) {
      consultaSupabase = consultaSupabase.lte('area_construida_m2', filtros.areaMaxM2)
    }
    if (filtros.precoMinCentavos !== undefined) {
      consultaSupabase = consultaSupabase.gte('preco_efetivo_centavos', filtros.precoMinCentavos)
    }
    if (filtros.precoMaxCentavos !== undefined) {
      consultaSupabase = consultaSupabase.lte('preco_efetivo_centavos', filtros.precoMaxCentavos)
    }
    // O projeto precisa caber no terreno informado.
    if (filtros.terrenoLarguraM !== undefined) {
      consultaSupabase = consultaSupabase.lte('largura_m', filtros.terrenoLarguraM)
    }
    if (filtros.terrenoProfundidadeM !== undefined) {
      consultaSupabase = consultaSupabase.lte('profundidade_m', filtros.terrenoProfundidadeM)
    }
    if (filtros.piscina) consultaSupabase = consultaSupabase.eq('piscina', true)
    if (filtros.areaGourmet) consultaSupabase = consultaSupabase.eq('area_gourmet', true)

    const { coluna, ascendente } = COLUNA_DE_ORDENACAO[ordenacao]
    // Desempate por `id`: sem ele, itens iguais podem trocar de lugar entre uma página e outra.
    const { data, count, error } = await consultaSupabase
      .order(coluna, { ascending: ascendente })
      .order('id', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<LinhaResumo[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os projetos.')

    const projetos = await Promise.all(data.map(montarResumo))
    return {
      itens: projetos.filter((projeto): projeto is Projeto => projeto !== null),
      total: count ?? 0,
      pagina,
      porPagina: tamanho,
    }
  }

  /**
   * O que existe de verdade entre os projetos exibíveis (publicados, com foto principal): preço,
   * área e as quantidades ("N ou mais") vêm de buscas de 1 linha cada, cada uma usando o índice da
   * própria coluna ordenada; categoria e estilo usados vêm de uma busca só, com só essas duas
   * colunas (o vocabulário de cada uma é pequeno e fixo, então não cresce com o catálogo — ver
   * `listarSlugs`, que já faz o mesmo tipo de busca completa por uma coluna estreita). Nada disso
   * baixa o catálogo inteiro nem calcula mínimo/máximo no servidor da aplicação.
   */
  async buscarLimites(): Promise<LimitesDeFiltro> {
    const supabase = criarClientePublico()
    const base = () =>
      supabase
        .from('projetos')
        .select(COLUNAS_LIMITE)
        .eq('status', 'publicado')
        .eq('projeto_arquivos.papel', 'principal')
    const maiorPor = (coluna: string) =>
      base()
        .order(coluna, { ascending: false })
        .limit(1)
        .maybeSingle()
        .overrideTypes<LinhaLimite, { merge: false }>()

    const [
      precoMin,
      precoMax,
      areaMin,
      areaMax,
      quartosMax,
      suitesMax,
      suiteMasterMax,
      banheirosMax,
      lavaboMax,
      vagasMax,
      pavimentosMax,
      vocabulario,
    ] = await Promise.all([
      base()
        .order('preco_efetivo_centavos', { ascending: true })
        .limit(1)
        .maybeSingle()
        .overrideTypes<LinhaLimite, { merge: false }>(),
      maiorPor('preco_efetivo_centavos'),
      base()
        .order('area_construida_m2', { ascending: true })
        .limit(1)
        .maybeSingle()
        .overrideTypes<LinhaLimite, { merge: false }>(),
      maiorPor('area_construida_m2'),
      maiorPor('quartos_total'),
      maiorPor('suites'),
      maiorPor('suite_master'),
      maiorPor('banheiros'),
      maiorPor('lavabo'),
      maiorPor('vagas'),
      maiorPor('pavimentos'),
      supabase
        .from('projetos')
        .select('categoria, estilo, projeto_arquivos!inner(papel)')
        .eq('status', 'publicado')
        .eq('projeto_arquivos.papel', 'principal')
        .overrideTypes<LinhaVocabulario[], { merge: false }>(),
    ])

    const erro =
      precoMin.error ??
      precoMax.error ??
      areaMin.error ??
      areaMax.error ??
      quartosMax.error ??
      suitesMax.error ??
      suiteMasterMax.error ??
      banheirosMax.error ??
      lavaboMax.error ??
      vagasMax.error ??
      pavimentosMax.error ??
      vocabulario.error
    if (erro) {
      throw new AppError('falha_inesperada', 'Não foi possível carregar os limites de filtro.')
    }

    const valoresUsados = (chave: keyof LinhaVocabulario) => [
      ...new Set(
        (vocabulario.data ?? [])
          .map((linha) => linha[chave])
          .filter((valor): valor is string => Boolean(valor)),
      ),
    ]

    return {
      precoMinCentavos: precoMin.data?.preco_efetivo_centavos ?? 0,
      precoMaxCentavos: precoMax.data?.preco_efetivo_centavos ?? 0,
      areaMinM2: areaMin.data?.area_construida_m2 ?? 0,
      areaMaxM2: areaMax.data?.area_construida_m2 ?? 0,
      categorias: valoresUsados('categoria'),
      estilos: valoresUsados('estilo'),
      quartosMax: quartosMax.data?.quartos_total ?? 0,
      suitesMax: suitesMax.data?.suites ?? 0,
      suiteMasterMax: suiteMasterMax.data?.suite_master ?? 0,
      banheirosMax: banheirosMax.data?.banheiros ?? 0,
      lavaboMax: lavaboMax.data?.lavabo ?? 0,
      vagasMax: vagasMax.data?.vagas ?? 0,
      pavimentosMax: pavimentosMax.data?.pavimentos ?? 0,
    }
  }

  async listarComplementares(): Promise<Complementar[]> {
    return this.estatico.listarComplementares()
  }

  async listarCategorias(): Promise<Categoria[]> {
    return this.estatico.listarCategorias()
  }

  async buscarPorSlug(slug: string): Promise<ProjetoDetalhe | null> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('projetos')
      .select(COLUNAS_DETALHE)
      .eq('slug', slug)
      .eq('status', 'publicado')
      .maybeSingle()
      .overrideTypes<LinhaDetalhe, { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar o projeto.')
    if (!data) return null
    return montarDetalhe(data)
  }

  /** Resumo dos projetos publicados entre os ids informados (ex.: favoritos). Ordem não garantida. */
  async buscarPorIds(ids: string[]): Promise<Projeto[]> {
    if (ids.length === 0) return []
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('projetos')
      .select(COLUNAS_RESUMO)
      .eq('status', 'publicado')
      .eq('projeto_arquivos.papel', 'principal')
      .in('id', ids)
      .overrideTypes<LinhaResumo[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os projetos.')

    const projetos = await Promise.all(data.map(montarResumo))
    return projetos.filter((projeto): projeto is Projeto => projeto !== null)
  }

  async listarSlugs(): Promise<string[]> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('projetos')
      .select('slug')
      .eq('status', 'publicado')
      .overrideTypes<{ slug: string }[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os projetos.')
    return data.map((linha) => linha.slug)
  }

  async listarRelacionados(id: string, categoria: string): Promise<Projeto[]> {
    const supabase = criarClientePublico()

    let consulta = supabase
      .from('projetos')
      .select(COLUNAS_RESUMO)
      .eq('status', 'publicado')
      .eq('projeto_arquivos.papel', 'principal')
      .neq('id', id)
    if (categoria) consulta = consulta.eq('categoria', categoria)

    const { data, error } = await consulta
      .order('criado_em', { ascending: false })
      .limit(RELACIONADOS_MAXIMO)
      .overrideTypes<LinhaResumo[], { merge: false }>()
    if (error) {
      throw new AppError('falha_inesperada', 'Não foi possível carregar projetos relacionados.')
    }

    const projetos = await Promise.all(data.map(montarResumo))
    return projetos.filter((projeto): projeto is Projeto => projeto !== null)
  }
}
