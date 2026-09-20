import 'server-only'

import type { PostgrestError } from '@supabase/supabase-js'

import type {
  ConsultaProjetosAdmin,
  NovoProjetoAdmin,
  ProjetoAdmin,
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
