import 'server-only'

import type {
  ConsultaLoja,
  FiltrosDaLoja,
  OrigemDoClique,
  ProdutoResumo,
} from '@/features/produtos'
import { ordenarAmbientes, ordenarNomes } from '@/features/produtos-cadastro'
import { criarClientePublico } from '@/lib/supabase/publico'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { ProdutoRepository } from './ProdutoRepository'

/** Teto por página, imposto aqui além da validação da URL (skill `seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 48
/** Teto da seção "Decore como no projeto" (lista curta, mas com limite no banco). */
const DO_PROJETO_MAXIMO = 60
/**
 * Teto da leitura que descobre as categorias e ambientes em uso. Só duas colunas estreitas; o
 * vocabulário é pequeno e fixo, então a resposta não cresce com o número de produtos na prática.
 */
const VOCABULARIO_MAXIMO = 5000

/**
 * Lista do Postgres com um item, entre aspas: o nome do ambiente pode ter espaço, vírgula ou
 * aspas (o supabase-js junta os itens sem aspas, e uma vírgula viraria dois itens).
 */
function comoListaDoBanco(item: string): string {
  return `{"${item.replace(/[\\"]/g, '\\$&')}"}`
}

/** Só as colunas que o card usa; nada de `select('*')`. */
const COLUNAS = 'id, nome, foto_caminho, categoria, ambientes'

type Linha = {
  id: string
  nome: string
  foto_caminho: string
  categoria: string
  ambientes: string[]
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto (skill `seguranca` §8.1). */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

async function paraResumo(linha: Linha): Promise<ProdutoResumo> {
  return {
    id: linha.id,
    nome: linha.nome,
    foto: {
      src: await fileStorage.urlPublica({ acesso: 'publico', caminho: linha.foto_caminho }),
      alt: linha.nome,
    },
    categoria: linha.categoria,
    ambientes: ordenarAmbientes(linha.ambientes),
  }
}

/**
 * Adapter público: usa o client sem sessão (papel `anon`), então as policies só deixam ver produtos
 * ativos e ligações com projetos publicados — a mesma regra do site, garantida pelo banco.
 */
export class SupabaseProdutoRepository implements ProdutoRepository {
  async buscar({
    busca,
    categoria,
    ambiente,
    pagina,
    porPagina,
  }: ConsultaLoja): Promise<Pagina<ProdutoResumo>> {
    const tamanho = Math.min(Math.max(1, Math.floor(porPagina)), POR_PAGINA_MAXIMO)
    const de = (Math.max(1, Math.floor(pagina)) - 1) * tamanho
    const supabase = criarClientePublico()

    let consulta = supabase.from('produtos').select(COLUNAS, { count: 'exact' }).eq('ativo', true)
    // Cada palavra vira um filtro parametrizado no nome.
    for (const palavra of (busca ?? '').toLowerCase().split(/\s+/).filter(Boolean)) {
      consulta = consulta.ilike('nome', comoTrecho(palavra))
    }
    if (categoria) consulta = consulta.eq('categoria', categoria)
    if (ambiente) consulta = consulta.contains('ambientes', comoListaDoBanco(ambiente))

    // Desempate por `id`: sem ele, itens iguais podem trocar de lugar entre uma página e outra.
    const { data, count, error } = await consulta
      .order('criado_em', { ascending: false })
      .order('id', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os produtos.')

    return {
      itens: await Promise.all(data.map(paraResumo)),
      total: count ?? 0,
      pagina,
      porPagina: tamanho,
    }
  }

  async listarFiltrosUsados(): Promise<FiltrosDaLoja> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('produtos')
      .select('categoria, ambientes')
      .eq('ativo', true)
      .limit(VOCABULARIO_MAXIMO)
      .overrideTypes<Pick<Linha, 'categoria' | 'ambientes'>[], { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível carregar os filtros.')
    return {
      categorias: ordenarNomes(data.map((linha) => linha.categoria)),
      ambientes: ordenarAmbientes(data.flatMap((linha) => linha.ambientes)),
    }
  }

  async listarDoProjeto(projetoId: string): Promise<ProdutoResumo[]> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('produto_projetos')
      .select(`ordem, produtos!inner (${COLUNAS})`)
      .eq('projeto_id', projetoId)
      .order('ordem', { ascending: true })
      .order('criado_em', { ascending: true })
      .limit(DO_PROJETO_MAXIMO)
      .overrideTypes<{ ordem: number; produtos: Linha }[], { merge: false }>()
    if (error) {
      throw new AppError('falha_inesperada', 'Não foi possível carregar os produtos do projeto.')
    }
    return Promise.all(data.map((linha) => paraResumo(linha.produtos)))
  }

  async buscarLinkDaOferta(produtoId: string): Promise<string | null> {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('produtos')
      .select('link')
      .eq('id', produtoId)
      .eq('ativo', true)
      .maybeSingle()
      .overrideTypes<{ link: string } | null, { merge: false }>()
    if (error) throw new AppError('falha_inesperada', 'Não foi possível abrir a oferta.')
    return data?.link ?? null
  }

  async registrarClique(produtoId: string, origem: OrigemDoClique): Promise<void> {
    const supabase = criarClientePublico()
    const { error } = await supabase.from('produto_cliques').insert({
      produto_id: produtoId,
      pagina: origem.pagina,
      projeto_id: origem.pagina === 'projeto' ? origem.projetoId : null,
    })
    if (error) throw new AppError('falha_inesperada', 'Não foi possível anotar o clique.')
  }
}
