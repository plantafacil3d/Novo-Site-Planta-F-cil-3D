import 'server-only'

import {
  formatarFamiliaIndicada,
  type Categoria,
  type Complementar,
  type ConsultaProjetos,
  type Diferencial,
  type ItemGaleria,
  type ItemInformacaoPavimento,
  type LimitesDeFiltro,
  type OrdenacaoProjetos,
  type PavimentoPublico,
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
  'perfil_terreno, familia_capacidade, itens, video_url, ' +
  'projeto_arquivos (caminho, papel, ordem, pavimento_id), ' +
  'projeto_pavimentos (id, nome, ordem, pavimento_itens (id, nome, metragem_m2, numero_bolinha, ordem))'

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

type LinhaArquivoDetalhe = LinhaArquivo & { pavimento_id: string | null }

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

type LinhaDetalhe = Omit<LinhaResumo, 'projeto_arquivos'> & {
  projeto_arquivos: LinhaArquivoDetalhe[]
  projeto_pavimentos: LinhaPavimento[]
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

function derivarDiferencial(piscina: boolean, areaGourmet: boolean): Diferencial | undefined {
  if (piscina) return { tipo: 'piscina', rotulo: 'Piscina' }
  if (areaGourmet) return { tipo: 'varanda-gourmet', rotulo: 'Área Gourmet' }
  return undefined
}

/** `null` quando o projeto não tem imagem principal (não deveria acontecer com status "publicado"). */
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
      alt: `Foto principal do projeto ${linha.titulo}`,
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
        alt: `Foto ${indice + 2} do projeto ${linha.titulo}`,
      },
    })),
  )
  const galeria: ItemGaleria[] = [{ id: principal.caminho, imagem: base.imagem }, ...restante]

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
            imagem: { src: await resolverUrl(arquivo.caminho), alt: `Planta: ${nome}` },
            itens,
          }
        }),
    )
  ).filter((pavimento): pavimento is PavimentoPublico => pavimento !== null)

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
    video: linha.video_url ? { src: linha.video_url } : undefined,
    itensInclusos: linha.itens,
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
