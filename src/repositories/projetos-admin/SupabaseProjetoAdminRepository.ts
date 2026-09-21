import 'server-only'

import type { PostgrestError } from '@supabase/supabase-js'

import type {
  ConsultaProjetosAdmin,
  DadosCadastroProjeto,
  NovoProjetoAdmin,
  ProjetoAdmin,
  ProjetoAdminCompleto,
  StatusProjeto,
} from '@/features/admin'
import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { ProjetoAdminRepository } from './ProjetoAdminRepository'

/** Teto por página imposto aqui, além da validação da URL (skill `seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 50

/** Só as colunas que a tabela usa; nada de `select('*')`. */
const COLUNAS = 'id, codigo, slug, titulo, tipo, preco_centavos, status, criado_em'

type Linha = {
  id: string
  codigo: string
  slug: string
  titulo: string
  tipo: ProjetoAdmin['tipo']
  preco_centavos: number
  status: StatusProjeto
  criado_em: string
}

/** Colunas do cadastro (etapas 1 e 2), além das da tabela. */
const COLUNAS_COMPLETAS = `${COLUNAS}, estilo, selo, checkout_url, resumo, descricao, largura_m, profundidade_m, area_construida_m2, quartos, suites, banheiros, vagas, pavimentos, piscina, closet, area_gourmet, diferencial_tipo, diferencial_rotulo`

type LinhaCompleta = Linha & {
  estilo: ProjetoAdminCompleto['estilo'] | null
  selo: ProjetoAdminCompleto['selo'] | null
  checkout_url: string | null
  resumo: string | null
  descricao: string | null
  largura_m: number | null
  profundidade_m: number | null
  area_construida_m2: number | null
  quartos: number | null
  suites: number | null
  banheiros: number | null
  vagas: number | null
  pavimentos: number | null
  piscina: boolean
  closet: boolean
  area_gourmet: boolean
  diferencial_tipo: ProjetoAdminCompleto['diferencialTipo'] | null
  diferencial_rotulo: string | null
}

function paraProjetoCompleto(linha: LinhaCompleta): ProjetoAdminCompleto {
  return {
    ...paraProjeto(linha),
    estilo: linha.estilo ?? undefined,
    selo: linha.selo ?? undefined,
    checkoutUrl: linha.checkout_url ?? undefined,
    resumo: linha.resumo ?? undefined,
    descricao: linha.descricao ?? undefined,
    larguraM: linha.largura_m ?? undefined,
    profundidadeM: linha.profundidade_m ?? undefined,
    areaConstruidaM2: linha.area_construida_m2 ?? undefined,
    quartos: linha.quartos ?? undefined,
    suites: linha.suites ?? undefined,
    banheiros: linha.banheiros ?? undefined,
    vagas: linha.vagas ?? undefined,
    pavimentos: linha.pavimentos ?? undefined,
    piscina: linha.piscina,
    closet: linha.closet,
    areaGourmet: linha.area_gourmet,
    diferencialTipo: linha.diferencial_tipo ?? undefined,
    diferencialRotulo: linha.diferencial_rotulo ?? undefined,
  }
}

/** Formulário → colunas. Campo em branco vira `null`, para a edição conseguir limpar um valor. */
function paraColunas(dados: DadosCadastroProjeto) {
  return {
    slug: dados.slug,
    titulo: dados.titulo,
    tipo: dados.tipo,
    preco_centavos: dados.precoCentavos,
    estilo: dados.estilo ?? null,
    selo: dados.selo ?? null,
    checkout_url: dados.checkoutUrl ?? null,
    resumo: dados.resumo ?? null,
    descricao: dados.descricao ?? null,
    largura_m: dados.larguraM ?? null,
    profundidade_m: dados.profundidadeM ?? null,
    area_construida_m2: dados.areaConstruidaM2 ?? null,
    quartos: dados.quartos ?? null,
    suites: dados.suites ?? null,
    banheiros: dados.banheiros ?? null,
    vagas: dados.vagas ?? null,
    pavimentos: dados.pavimentos ?? null,
    piscina: dados.piscina,
    closet: dados.closet,
    area_gourmet: dados.areaGourmet,
    diferencial_tipo: dados.diferencialTipo ?? null,
    diferencial_rotulo: dados.diferencialRotulo ?? null,
  }
}

function paraProjeto(linha: Linha): ProjetoAdmin {
  return {
    id: linha.id,
    codigo: linha.codigo,
    slug: linha.slug,
    titulo: linha.titulo,
    tipo: linha.tipo,
    precoCentavos: linha.preco_centavos,
    status: linha.status,
    criadoEm: linha.criado_em,
  }
}

function traduzir(erro: PostgrestError): AppError {
  // 23505 = valor único repetido (código ou slug); 42501 = negado pelas policies.
  if (erro.code === '23505')
    return new AppError('conflito', 'Já existe um projeto com esses dados.')
  if (erro.code === '42501')
    return new AppError('sem_permissao', 'Você não tem permissão para isso.')
  return new AppError('falha_inesperada', 'Não foi possível concluir a operação.')
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto. */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

export class SupabaseProjetoAdminRepository implements ProjetoAdminRepository {
  async listar({ busca, pagina, porPagina }: ConsultaProjetosAdmin): Promise<Pagina<ProjetoAdmin>> {
    const tamanho = Math.min(Math.max(1, porPagina), POR_PAGINA_MAXIMO)
    const de = (Math.max(1, pagina) - 1) * tamanho
    const supabase = await criarClienteServidor()

    let consulta = supabase.from('projetos').select(COLUNAS, { count: 'exact' })
    // Cada palavra vira um filtro parametrizado na coluna `busca` (nome + código, em minúsculas).
    for (const palavra of (busca ?? '').toLowerCase().split(/\s+/).filter(Boolean)) {
      consulta = consulta.ilike('busca', comoTrecho(palavra))
    }

    const { data, count, error } = await consulta
      .order('criado_em', { ascending: false })
      .order('id', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)

    return { itens: data.map(paraProjeto), total: count ?? 0, pagina, porPagina: tamanho }
  }

  async buscarPorIds(ids: string[]): Promise<ProjetoAdmin[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projetos')
      .select(COLUNAS)
      .in('id', ids)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map(paraProjeto)
  }

  async buscarCompleto(id: string): Promise<ProjetoAdminCompleto | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projetos')
      .select(COLUNAS_COMPLETAS)
      .eq('id', id)
      .limit(1)
      .overrideTypes<LinhaCompleta[], { merge: false }>()
    if (error) throw traduzir(error)
    return data[0] ? paraProjetoCompleto(data[0]) : null
  }

  async criarRascunho(dados: DadosCadastroProjeto): Promise<string> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projetos')
      .insert({ ...paraColunas(dados), status: 'rascunho' })
      .select('id')
      .overrideTypes<{ id: string }[], { merge: false }>()
    if (error) throw traduzir(error)
    const criado = data[0]
    if (!criado) throw new AppError('falha_inesperada', 'Não foi possível concluir a operação.')
    return criado.id
  }

  async atualizar(id: string, dados: DadosCadastroProjeto): Promise<void> {
    const supabase = await criarClienteServidor()
    // O `select` devolve só a linha que a policy deixou alterar: vazio = não existe ou sem permissão.
    const { data, error } = await supabase
      .from('projetos')
      .update({ ...paraColunas(dados), atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select('id')
    if (error) throw traduzir(error)
    if (data.length === 0) throw new AppError('dados_invalidos', 'Projeto não encontrado.')
  }

  async criar(projetos: NovoProjetoAdmin[]): Promise<number> {
    if (projetos.length === 0) return 0
    const supabase = await criarClienteServidor()
    const { error } = await supabase.from('projetos').insert(
      projetos.map((projeto) => ({
        slug: projeto.slug,
        titulo: projeto.titulo,
        tipo: projeto.tipo,
        preco_centavos: projeto.precoCentavos,
        status: projeto.status,
      })),
    )
    if (error) throw traduzir(error)
    return projetos.length
  }

  async definirStatus(ids: string[], status: StatusProjeto): Promise<number> {
    const supabase = await criarClienteServidor()
    // O `select` devolve só as linhas que a policy deixou alterar, então a contagem é a real.
    const { data, error } = await supabase
      .from('projetos')
      .update({ status, atualizado_em: new Date().toISOString() })
      .in('id', ids)
      .select('id')
    if (error) throw traduzir(error)
    return data.length
  }
}
