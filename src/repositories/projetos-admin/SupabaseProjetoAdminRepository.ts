import 'server-only'

import type { PostgrestError } from '@supabase/supabase-js'

import type {
  ArquivoDeProjeto,
  ConsultaProjetosAdmin,
  NovoProjetoAdmin,
  ProjetoAdmin,
  StatusProjeto,
} from '@/features/admin'
import type {
  ArquivoGravado,
  CadastroGravavel,
  ComplementarGravavel,
  EstadoParaPublicar,
  NovoArquivoProjeto,
  PapelDoArquivo,
  ProjetoCriado,
} from '@/features/cadastro-projeto'
import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { ProjetoAdminRepository } from './ProjetoAdminRepository'

/** Teto por página imposto aqui, além da validação da URL (skill `seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 50

/** Só as colunas que a tabela usa; nada de `select('*')`. */
const COLUNAS = 'id, codigo, slug, titulo, categoria, preco_centavos, status, criado_em'

type Linha = {
  id: string
  codigo: string
  slug: string
  titulo: string
  categoria: string | null
  preco_centavos: number | null
  status: StatusProjeto
  criado_em: string
}

function paraProjeto(linha: Linha): ProjetoAdmin {
  return {
    id: linha.id,
    codigo: linha.codigo,
    slug: linha.slug,
    titulo: linha.titulo,
    categoria: linha.categoria,
    precoCentavos: linha.preco_centavos,
    status: linha.status,
    criadoEm: linha.criado_em,
  }
}

function traduzir(erro: PostgrestError): AppError {
  // 23505 = valor único repetido (código ou slug); 42501 = negado pelas policies;
  // 23514 = passou de um limite da tabela; 23503 = aponta para um projeto que não existe.
  if (erro.code === '23505')
    return new AppError('conflito', 'Já existe um projeto com esses dados.')
  if (erro.code === '42501')
    return new AppError('sem_permissao', 'Você não tem permissão para isso.')
  if (erro.code === '23514')
    return new AppError('dados_invalidos', 'Algum dado passou do limite permitido.')
  if (erro.code === '23503') return new AppError('dados_invalidos', 'Projeto não encontrado.')
  return new AppError('falha_inesperada', 'Não foi possível concluir a operação.')
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto. */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

/** Nome de coluna de cada campo do cadastro (o app fala em camelCase, o banco em snake_case). */
function paraColunas(cadastro: CadastroGravavel) {
  return {
    titulo: cadastro.titulo,
    categoria: cadastro.categoria,
    estilo: cadastro.estilo,
    preco_centavos: cadastro.precoCentavos,
    preco_promocional_centavos: cadastro.precoPromocionalCentavos,
    resumo: cadastro.resumo,
    descricao: cadastro.descricao,
    tags: cadastro.tags,
    video_url: cadastro.videoUrl,
    largura_m: cadastro.larguraM,
    profundidade_m: cadastro.profundidadeM,
    area_construida_m2: cadastro.areaConstruidaM2,
    quartos: cadastro.quartos,
    suites: cadastro.suites,
    suite_master: cadastro.suiteMaster,
    banheiros: cadastro.banheiros,
    lavabo: cadastro.lavabo,
    vagas: cadastro.vagas,
    pavimentos: cadastro.pavimentos,
    piscina: cadastro.piscina,
    area_gourmet: cadastro.areaGourmet,
    itens: cadastro.itens,
    entrega_link: cadastro.entregaLink,
  }
}

function paraColunasDoComplementar(complementar: ComplementarGravavel) {
  return {
    titulo: complementar.titulo,
    valor_centavos: complementar.valorCentavos,
    descricao: complementar.descricao,
    entrega: complementar.entrega,
    link: complementar.link,
    ordem: complementar.ordem,
  }
}

type LinhaDeArquivo = {
  id: string
  papel: PapelDoArquivo
  complementar_id: string | null
  caminho: string
  tamanho_bytes: number
}

/** Só o que a limpeza do Storage precisa saber de um arquivo, com o projeto a que ele pertence. */
type LinhaDeArquivoDeProjeto = {
  projeto_id: string
  papel: PapelDoArquivo
  caminho: string
}

type LinhaParaPublicar = {
  entrega_link: string | null
  projeto_complementares: { id: string; entrega: 'link' | 'pdf' | null }[]
  projeto_arquivos: { papel: PapelDoArquivo; complementar_id: string | null }[]
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
        categoria: projeto.categoria,
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

  async remover(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return []
    const supabase = await criarClienteServidor()
    // O `select` devolve só as linhas que a policy deixou apagar, então a lista é a real.
    const { data, error } = await supabase
      .from('projetos')
      .delete()
      .in('id', ids)
      .select('id')
      .overrideTypes<{ id: string }[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map((linha) => linha.id)
  }

  // ── Cadastro completo ────────────────────────────────────────────────────────────────────────

  async criarCadastro(cadastro: CadastroGravavel, slug: string): Promise<ProjetoCriado> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projetos')
      .insert({ ...paraColunas(cadastro), slug, status: 'rascunho' })
      .select('id, codigo, slug')
      .single()
      .overrideTypes<ProjetoCriado, { merge: false }>()
    if (error) throw traduzir(error)
    return data
  }

  async atualizarCadastro(id: string, cadastro: CadastroGravavel): Promise<void> {
    const supabase = await criarClienteServidor()
    // O `select` mostra quantas linhas a policy deixou alterar: zero é projeto que não existe.
    const { data, error } = await supabase
      .from('projetos')
      .update({ ...paraColunas(cadastro), atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select('id')
    if (error) throw traduzir(error)
    if (data.length === 0) throw new AppError('dados_invalidos', 'Projeto não encontrado.')
  }

  async sincronizarComplementares(
    projetoId: string,
    complementares: ComplementarGravavel[],
  ): Promise<void> {
    const supabase = await criarClienteServidor()

    const { data: existentes, error: erroDaBusca } = await supabase
      .from('projeto_complementares')
      .select('id')
      .eq('projeto_id', projetoId)
      .overrideTypes<{ id: string }[], { merge: false }>()
    if (erroDaBusca) throw traduzir(erroDaBusca)

    const idsExistentes = new Set(existentes.map((linha) => linha.id))
    const idsNovos = new Set(complementares.map((complementar) => complementar.id))

    const sobrando = [...idsExistentes].filter((id) => !idsNovos.has(id))
    if (sobrando.length > 0) {
      const { error } = await supabase
        .from('projeto_complementares')
        .delete()
        .eq('projeto_id', projetoId)
        .in('id', sobrando)
      if (error) throw traduzir(error)
    }

    const paraCriar = complementares.filter((complementar) => !idsExistentes.has(complementar.id))
    if (paraCriar.length > 0) {
      const { error } = await supabase.from('projeto_complementares').insert(
        paraCriar.map((complementar) => ({
          id: complementar.id,
          projeto_id: projetoId,
          ...paraColunasDoComplementar(complementar),
        })),
      )
      if (error) throw traduzir(error)
    }

    // Atualiza só dentro deste projeto: um id de outro projeto nunca é sobrescrito.
    await Promise.all(
      complementares
        .filter((complementar) => idsExistentes.has(complementar.id))
        .map(async (complementar) => {
          const { error } = await supabase
            .from('projeto_complementares')
            .update(paraColunasDoComplementar(complementar))
            .eq('id', complementar.id)
            .eq('projeto_id', projetoId)
          if (error) throw traduzir(error)
        }),
    )
  }

  async listarArquivos(projetoId: string): Promise<ArquivoGravado[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projeto_arquivos')
      .select('id, papel, complementar_id, caminho, tamanho_bytes')
      .eq('projeto_id', projetoId)
      .overrideTypes<LinhaDeArquivo[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map((linha) => ({
      id: linha.id,
      papel: linha.papel,
      complementarId: linha.complementar_id,
      caminho: linha.caminho,
      tamanhoBytes: linha.tamanho_bytes,
    }))
  }

  async listarArquivosDeProjetos(ids: string[]): Promise<ArquivoDeProjeto[]> {
    if (ids.length === 0) return []
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projeto_arquivos')
      .select('projeto_id, papel, caminho')
      .in('projeto_id', ids)
      .overrideTypes<LinhaDeArquivoDeProjeto[], { merge: false }>()
    if (error) throw traduzir(error)
    return data.map((linha) => ({
      projetoId: linha.projeto_id,
      papel: linha.papel,
      caminho: linha.caminho,
    }))
  }

  async registrarArquivo(arquivo: NovoArquivoProjeto): Promise<void> {
    const supabase = await criarClienteServidor()
    const { error } = await supabase.from('projeto_arquivos').insert({
      id: arquivo.id,
      projeto_id: arquivo.projetoId,
      papel: arquivo.papel,
      complementar_id: arquivo.complementarId,
      caminho: arquivo.caminho,
      nome_original: arquivo.nomeOriginal,
      rotulo: arquivo.rotulo,
      tamanho_bytes: arquivo.tamanhoBytes,
      tipo_mime: arquivo.tipoMime,
      ordem: arquivo.ordem,
    })
    if (error) {
      if (error.code === '23505') {
        throw new AppError(
          'conflito',
          'Esse arquivo já foi enviado ou já existe uma imagem principal.',
        )
      }
      throw traduzir(error)
    }
  }

  async removerArquivos(ids: string[]): Promise<void> {
    if (ids.length === 0) return
    const supabase = await criarClienteServidor()
    const { error } = await supabase.from('projeto_arquivos').delete().in('id', ids)
    if (error) throw traduzir(error)
  }

  async atualizarRotulos(rotulos: { id: string; rotulo: string | null }[]): Promise<void> {
    const supabase = await criarClienteServidor()
    await Promise.all(
      rotulos.map(async ({ id, rotulo }) => {
        const { error } = await supabase.from('projeto_arquivos').update({ rotulo }).eq('id', id)
        if (error) throw traduzir(error)
      }),
    )
  }

  async lerParaPublicar(id: string): Promise<EstadoParaPublicar | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('projetos')
      .select(
        'entrega_link, projeto_complementares(id, entrega), projeto_arquivos(papel, complementar_id)',
      )
      .eq('id', id)
      .maybeSingle()
    if (error) throw traduzir(error)
    if (!data) return null

    const linha = data as unknown as LinhaParaPublicar
    return {
      entregaLink: linha.entrega_link,
      complementares: linha.projeto_complementares,
      arquivos: linha.projeto_arquivos.map((arquivo) => ({
        papel: arquivo.papel,
        complementarId: arquivo.complementar_id,
      })),
    }
  }
}
