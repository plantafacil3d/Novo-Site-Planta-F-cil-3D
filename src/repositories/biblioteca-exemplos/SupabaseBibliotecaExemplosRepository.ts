import 'server-only'

import type { PostgrestError } from '@supabase/supabase-js'

import type {
  ArquivoApagado,
  ArquivoDaBiblioteca,
  ArquivoParaSelecao,
  ConsultaBiblioteca,
  NovoArquivoDaBiblioteca,
} from '@/features/biblioteca-exemplos'
import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { BibliotecaExemplosRepository } from './BibliotecaExemplosRepository'

/** Teto por página imposto aqui, além da validação da URL (skill `seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 50
/** Teto de `listarParaSelecao`, imposto aqui (skill `arquitetura` §3.1): a tela pede tudo de uma vez
 *  para os checkboxes da aba de exemplos, mas nunca sem limite. */
const SELECAO_MAXIMA_PARA_FORMULARIO = 200

/** Só as colunas que a listagem usa; nada de `select('*')`. */
const COLUNAS = 'id, caminho, nome_original, tipo_mime, tamanho_bytes, criado_em'

type Linha = {
  id: string
  caminho: string
  nome_original: string
  tipo_mime: string
  tamanho_bytes: number
  criado_em: string
}

/** `projeto_arquivos_exemplo(count)` é uma contagem agregada do Postgrest: sempre um item só. */
type LinhaComVinculos = Linha & { projeto_arquivos_exemplo: { count: number }[] }

function traduzir(erro: PostgrestError): AppError {
  // 23505 = arquivo repetido; 42501 = negado pelas policies; 23514 = passou de um limite da tabela.
  if (erro.code === '23505')
    return new AppError('conflito', 'Esse arquivo já existe na biblioteca.')
  if (erro.code === '42501')
    return new AppError('sem_permissao', 'Você não tem permissão para isso.')
  if (erro.code === '23514')
    return new AppError('dados_invalidos', 'Algum dado passou do limite permitido.')
  return new AppError('falha_inesperada', 'Não foi possível concluir a operação.')
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto. */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

function paraArquivoParaSelecao(linha: Linha): ArquivoParaSelecao {
  return {
    id: linha.id,
    nomeOriginal: linha.nome_original,
    tipoMime: linha.tipo_mime,
    tamanhoBytes: linha.tamanho_bytes,
  }
}

export class SupabaseBibliotecaExemplosRepository implements BibliotecaExemplosRepository {
  async listar({
    busca,
    pagina,
    porPagina,
  }: ConsultaBiblioteca): Promise<Pagina<ArquivoDaBiblioteca>> {
    const tamanho = Math.min(Math.max(1, porPagina), POR_PAGINA_MAXIMO)
    const de = (Math.max(1, pagina) - 1) * tamanho
    const supabase = await criarClienteServidor()

    let consulta = supabase
      .from('arquivos_exemplo')
      .select(`${COLUNAS}, projeto_arquivos_exemplo(count)`, { count: 'exact' })
    // Cada palavra vira um filtro parametrizado no nome do arquivo.
    for (const palavra of (busca ?? '').toLowerCase().split(/\s+/).filter(Boolean)) {
      consulta = consulta.ilike('nome_original', comoTrecho(palavra))
    }

    const { data, count, error } = await consulta
      .order('criado_em', { ascending: false })
      .order('id', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<LinhaComVinculos[], { merge: false }>()
    if (error) throw traduzir(error)

    return {
      itens: data.map((linha) => ({
        ...paraArquivoParaSelecao(linha),
        caminho: linha.caminho,
        criadoEm: linha.criado_em,
        vinculos: linha.projeto_arquivos_exemplo[0]?.count ?? 0,
      })),
      total: count ?? 0,
      pagina,
      porPagina: tamanho,
    }
  }

  async listarParaSelecao(): Promise<ArquivoParaSelecao[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('arquivos_exemplo')
      .select(COLUNAS)
      .order('nome_original', { ascending: true })
      .limit(SELECAO_MAXIMA_PARA_FORMULARIO)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map(paraArquivoParaSelecao)
  }

  async buscarPorIds(ids: string[]): Promise<ArquivoParaSelecao[]> {
    if (ids.length === 0) return []
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('arquivos_exemplo')
      .select(COLUNAS)
      .in('id', ids)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map(paraArquivoParaSelecao)
  }

  async registrar(arquivo: NovoArquivoDaBiblioteca): Promise<void> {
    const supabase = await criarClienteServidor()
    const { error } = await supabase.from('arquivos_exemplo').insert({
      id: arquivo.id,
      caminho: arquivo.caminho,
      nome_original: arquivo.nomeOriginal,
      tipo_mime: arquivo.tipoMime,
      tamanho_bytes: arquivo.tamanhoBytes,
    })
    if (error) throw traduzir(error)
  }

  async renomear(id: string, nomeOriginal: string): Promise<void> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('arquivos_exemplo')
      .update({ nome_original: nomeOriginal })
      .eq('id', id)
      .select('id')
    if (error) throw traduzir(error)
    if (data.length === 0) throw new AppError('dados_invalidos', 'Arquivo não encontrado.')
  }

  async remover(ids: string[]): Promise<ArquivoApagado[]> {
    if (ids.length === 0) return []
    const supabase = await criarClienteServidor()
    // O `select` devolve só as linhas que a policy deixou apagar, então a lista é a real.
    const { data, error } = await supabase
      .from('arquivos_exemplo')
      .delete()
      .in('id', ids)
      .select('id, caminho')
      .overrideTypes<ArquivoApagado[], { merge: false }>()
    if (error) throw traduzir(error)
    return data
  }
}
