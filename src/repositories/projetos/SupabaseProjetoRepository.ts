import 'server-only'

import { formatarFamiliaIndicada } from '@/features/projetos'
import type { Diferencial, ItemGaleria, Projeto, ProjetoDetalhe } from '@/features/projetos'
import { criarClientePublico } from '@/lib/supabase/publico'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'

import { InMemoryProjetoRepository } from './InMemoryProjetoRepository'
import type { ProjetoRepository } from './ProjetoRepository'

/** Quantos projetos relacionados reais buscar no máximo. */
const RELACIONADOS_MAXIMO = 8

type LinhaArquivo = { caminho: string; papel: string; ordem: number }

const COLUNAS_RESUMO =
  'id, codigo, slug, titulo, codigo_youtube, categoria, preco_centavos, preco_promocional_centavos, ' +
  'largura_m, profundidade_m, area_construida_m2, quartos, suites, suite_master, banheiros, lavabo, ' +
  'vagas, pavimentos, piscina, area_gourmet, ' +
  'projeto_arquivos (caminho, papel, ordem)'

type LinhaResumo = {
  id: string
  codigo: string
  slug: string
  titulo: string
  codigo_youtube: string | null
  categoria: string | null
  preco_centavos: number | null
  preco_promocional_centavos: number | null
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
  'id, codigo, slug, titulo, codigo_youtube, categoria, preco_centavos, preco_promocional_centavos, ' +
  'largura_m, profundidade_m, area_construida_m2, quartos, suites, suite_master, banheiros, lavabo, ' +
  'vagas, pavimentos, piscina, area_gourmet, ' +
  'checkout_url, resumo, descricao, ambientes, indicado_para, aplicacoes, ' +
  'perfil_terreno, familia_capacidade, estilo, itens, video_url, ' +
  'projeto_arquivos (caminho, papel, ordem)'

type LinhaDetalhe = LinhaResumo & {
  checkout_url: string | null
  resumo: string | null
  descricao: string | null
  ambientes: string | null
  indicado_para: string | null
  aplicacoes: string | null
  perfil_terreno: string | null
  familia_capacidade: number | null
  estilo: string | null
  itens: string[]
  video_url: string | null
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
    // A promocional é o preço real de venda quando existe.
    precoCentavos: linha.preco_promocional_centavos ?? linha.preco_centavos ?? 0,
  }
}

async function montarDetalhe(linha: LinhaDetalhe): Promise<ProjetoDetalhe | null> {
  const base = await montarResumo(linha)
  if (!base) return null

  const galeriaArquivos = linha.projeto_arquivos
    .filter((arquivo) => arquivo.papel === 'galeria')
    .sort((a, b) => a.ordem - b.ordem)
  const galeria: ItemGaleria[] = await Promise.all(
    galeriaArquivos.map(async (arquivo, indice) => ({
      id: arquivo.caminho,
      imagem: {
        src: await resolverUrl(arquivo.caminho),
        alt: `Foto ${indice + 1} do projeto ${linha.titulo}`,
      },
    })),
  )

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
 * Adapter real do site público. Página de um projeto, relacionados e slugs já vêm do Cadastro
 * (Supabase). TEMPORÁRIO: listagem, filtros, destaques, categorias e complementares continuam no
 * mock — o vocabulário de categoria/estilo da listagem pública ainda não foi unificado com o do
 * Cadastro (fica para uma etapa própria).
 */
export class SupabaseProjetoRepository implements ProjetoRepository {
  private readonly mock = new InMemoryProjetoRepository()

  async listarDestaques() {
    return this.mock.listarDestaques()
  }

  async buscarProjetos(consulta: Parameters<ProjetoRepository['buscarProjetos']>[0]) {
    return this.mock.buscarProjetos(consulta)
  }

  async listarComplementares() {
    return this.mock.listarComplementares()
  }

  async listarCategorias() {
    return this.mock.listarCategorias()
  }

  async buscarPorSlug(slug: string): Promise<ProjetoDetalhe | null> {
    const real = await this.buscarRealPorSlug(slug)
    if (real) return real
    return this.mock.buscarPorSlug(slug)
  }

  async listarSlugs(): Promise<string[]> {
    const [doMock, reais] = await Promise.all([this.mock.listarSlugs(), this.listarSlugsReais()])
    return [...doMock, ...reais]
  }

  async listarRelacionados(slug: string): Promise<Projeto[]> {
    const reais = await this.relacionadosReais(slug)
    if (reais.length > 0) return reais
    return this.mock.listarRelacionados(slug)
  }

  private async buscarRealPorSlug(slug: string): Promise<ProjetoDetalhe | null> {
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

  private async listarSlugsReais(): Promise<string[]> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('projetos')
      .select('slug')
      .eq('status', 'publicado')
      .overrideTypes<{ slug: string }[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os projetos.')
    return data.map((linha) => linha.slug)
  }

  private async relacionadosReais(slug: string): Promise<Projeto[]> {
    const supabase = criarClientePublico()
    const { data: atual, error: erroAtual } = await supabase
      .from('projetos')
      .select('id, categoria')
      .eq('slug', slug)
      .eq('status', 'publicado')
      .maybeSingle()
      .overrideTypes<{ id: string; categoria: string | null }, { merge: false }>()
    if (erroAtual) {
      throw new AppError('falha_inesperada', 'Não foi possível carregar projetos relacionados.')
    }
    if (!atual) return []

    let consulta = supabase
      .from('projetos')
      .select(COLUNAS_RESUMO)
      .eq('status', 'publicado')
      .neq('id', atual.id)
    if (atual.categoria) consulta = consulta.eq('categoria', atual.categoria)

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
