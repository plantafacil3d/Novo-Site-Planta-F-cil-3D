import 'server-only'

import type { PostgrestError } from '@supabase/supabase-js'

import {
  LIMITES_PRODUTO,
  ordenarAmbientes,
  ordenarNomes,
  type ConsultaProdutosAdmin,
  type LinhaProdutoAdmin,
  type OpcaoDoProduto,
  type OpcoesDoProduto,
  type OrigemProduto,
  type TipoDeOpcao,
  type ProdutoGravavel,
  type ProdutoLigado,
  type ProdutoParaEditar,
} from '@/features/produtos-cadastro'
import { criarClienteServidor } from '@/lib/supabase/server'
import { fileStorage } from '@/services/storage'
import { AppError } from '@/types/erro'
import type { Pagina } from '@/types/pagina'

import type { ProdutoAdminRepository } from './ProdutoAdminRepository'

/** Teto por página, imposto aqui além da validação da URL (skill `seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 50
/** Teto de produtos de um projeto e de projetos de um produto (listas curtas, mas com limite). */
const LIGACOES_MAXIMO = 200
/** Posição de um produto ligado pelo menu Produtos: vai para o fim da seção do projeto. */
const ORDEM_NO_FIM = 10000
/** Teto da leitura que conta quantos produtos usam cada categoria e ambiente. */
const USOS_MAXIMO = 5000

const COLUNAS =
  'id, nome, foto_caminho, categoria, ambientes, ativo, origem, link, em_todos_projetos, produto_projetos(count)'

type Linha = {
  id: string
  nome: string
  foto_caminho: string
  categoria: string
  ambientes: string[]
  ativo: boolean
  origem: OrigemProduto
  link: string
  em_todos_projetos: boolean
  /** Contagem agregada do Postgrest: sempre um item só. */
  produto_projetos: { count: number }[]
}

type LinhaProjeto = {
  id: string
  codigo: string
  codigo_youtube: string | null
  titulo: string
  status: string
}

function traduzir(erro: PostgrestError): AppError {
  // 23505 = link repetido; 42501 = negado pelas policies; 23514 = passou de um limite da tabela;
  // 23503 = aponta para um projeto ou produto que não existe mais.
  if (erro.code === '23505') return new AppError('conflito', 'Este link já está cadastrado.')
  if (erro.code === '42501')
    return new AppError('sem_permissao', 'Você não tem permissão para isso.')
  if (erro.code === '23514')
    return new AppError('dados_invalidos', 'Algum dado passou do limite permitido.')
  if (erro.code === '23503')
    return new AppError('dados_invalidos', 'Algum projeto ou produto escolhido não existe mais.')
  return new AppError('falha_inesperada', 'Não foi possível concluir a operação.')
}

/** Escapa os curingas do `like` para o texto digitado valer só como texto. */
function comoTrecho(palavra: string): string {
  return `%${palavra.replace(/[\\%_]/g, '\\$&')}%`
}

const urlDaFoto = (caminho: string) => fileStorage.urlPublica({ acesso: 'publico', caminho })

async function paraLinha(linha: Linha): Promise<LinhaProdutoAdmin> {
  return {
    id: linha.id,
    nome: linha.nome,
    fotoUrl: await urlDaFoto(linha.foto_caminho),
    categoria: linha.categoria,
    ambientes: ordenarAmbientes(linha.ambientes),
    ativo: linha.ativo,
    projetos: linha.produto_projetos[0]?.count ?? 0,
    origem: linha.origem,
    link: linha.link,
    emTodosProjetos: linha.em_todos_projetos,
  }
}

async function paraLigado(linha: Linha): Promise<ProdutoLigado> {
  const { id, nome, fotoUrl, categoria, ambientes, ativo, projetos } = await paraLinha(linha)
  return { id, nome, fotoUrl, categoria, ambientes, ativo, projetos }
}

function paraColunas(produto: ProdutoGravavel) {
  return {
    nome: produto.nome,
    link: produto.link,
    categoria: produto.categoria,
    ambientes: produto.ambientes,
    origem: produto.origem,
    ativo: produto.ativo,
    em_todos_projetos: produto.emTodosProjetos,
    foto_caminho: produto.fotoCaminho,
  }
}

export class SupabaseProdutoAdminRepository implements ProdutoAdminRepository {
  async listar({
    busca,
    pagina,
    porPagina,
  }: ConsultaProdutosAdmin): Promise<Pagina<LinhaProdutoAdmin>> {
    const tamanho = Math.min(Math.max(1, porPagina), POR_PAGINA_MAXIMO)
    const de = (Math.max(1, pagina) - 1) * tamanho
    const supabase = await criarClienteServidor()

    let consulta = supabase.from('produtos').select(COLUNAS, { count: 'exact' })
    for (const palavra of (busca ?? '').toLowerCase().split(/\s+/).filter(Boolean)) {
      consulta = consulta.ilike('nome', comoTrecho(palavra))
    }
    const { data, count, error } = await consulta
      .order('criado_em', { ascending: false })
      .order('id', { ascending: false })
      .range(de, de + tamanho - 1)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)

    return {
      itens: await Promise.all(data.map(paraLinha)),
      total: count ?? 0,
      pagina,
      porPagina: tamanho,
    }
  }

  async pesquisar(texto: string, limite: number): Promise<ProdutoLigado[]> {
    const supabase = await criarClienteServidor()
    let consulta = supabase.from('produtos').select(COLUNAS)
    for (const palavra of texto.toLowerCase().split(/\s+/).filter(Boolean)) {
      consulta = consulta.ilike('nome', comoTrecho(palavra))
    }
    const { data, error } = await consulta
      .order('nome', { ascending: true })
      .limit(Math.min(Math.max(1, limite), POR_PAGINA_MAXIMO))
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)
    return Promise.all(data.map(paraLigado))
  }

  async buscarParaEditar(id: string): Promise<ProdutoParaEditar | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .select(
        'id, nome, link, categoria, ambientes, origem, ativo, em_todos_projetos, foto_caminho, ' +
          'produto_projetos (projetos (id, codigo, codigo_youtube, titulo, status))',
      )
      .eq('id', id)
      .limit(LIGACOES_MAXIMO, { referencedTable: 'produto_projetos' })
      .maybeSingle()
      .overrideTypes<
        Omit<Linha, 'produto_projetos'> & { produto_projetos: { projetos: LinhaProjeto }[] },
        { merge: false }
      >()
    if (error) throw traduzir(error)
    if (!data) return null

    return {
      id: data.id,
      nome: data.nome,
      link: data.link,
      categoria: data.categoria,
      ambientes: ordenarAmbientes(data.ambientes),
      origem: data.origem,
      ativo: data.ativo,
      emTodosProjetos: data.em_todos_projetos,
      foto: { caminho: data.foto_caminho, url: await urlDaFoto(data.foto_caminho) },
      projetos: data.produto_projetos.map(({ projetos: projeto }) => ({
        id: projeto.id,
        codigo: projeto.codigo_youtube ?? projeto.codigo,
        titulo: projeto.titulo,
        publicado: projeto.status === 'publicado',
      })),
    }
  }

  async buscarPorLink(link: string): Promise<ProdutoLigado | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .select(COLUNAS)
      .eq('link', link)
      .maybeSingle()
      .overrideTypes<Linha | null, { merge: false }>()
    if (error) throw traduzir(error)
    return data ? paraLigado(data) : null
  }

  async buscarLigado(id: string): Promise<ProdutoLigado | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .select(COLUNAS)
      .eq('id', id)
      .maybeSingle()
      .overrideTypes<Linha | null, { merge: false }>()
    if (error) throw traduzir(error)
    return data ? paraLigado(data) : null
  }

  async lerCaminhoDaFoto(id: string): Promise<string | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .select('foto_caminho')
      .eq('id', id)
      .maybeSingle()
      .overrideTypes<{ foto_caminho: string } | null, { merge: false }>()
    if (error) throw traduzir(error)
    return data?.foto_caminho ?? null
  }

  async criar(produto: ProdutoGravavel): Promise<string> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .insert(paraColunas(produto))
      .select('id')
      .single()
      .overrideTypes<{ id: string }, { merge: false }>()
    if (error) throw traduzir(error)
    return data.id
  }

  async atualizar(id: string, produto: ProdutoGravavel): Promise<void> {
    const supabase = await criarClienteServidor()
    // O `select` mostra quantas linhas a policy deixou alterar: zero é produto que não existe.
    const { data, error } = await supabase
      .from('produtos')
      .update({ ...paraColunas(produto), atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select('id')
    if (error) throw traduzir(error)
    if (data.length === 0) throw new AppError('dados_invalidos', 'Produto não encontrado.')
  }

  async excluir(id: string): Promise<string | null> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
      .select('foto_caminho')
      .overrideTypes<{ foto_caminho: string }[], { merge: false }>()
    if (error) throw traduzir(error)
    return data[0]?.foto_caminho ?? null
  }

  async sincronizarProjetosDoProduto(produtoId: string, projetoIds: string[]): Promise<void> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produto_projetos')
      .select('projeto_id')
      .eq('produto_id', produtoId)
      .limit(LIGACOES_MAXIMO)
      .overrideTypes<{ projeto_id: string }[], { merge: false }>()
    if (error) throw traduzir(error)

    const existentes = new Set(data.map((linha) => linha.projeto_id))
    const novos = new Set(projetoIds)

    const sobrando = [...existentes].filter((id) => !novos.has(id))
    if (sobrando.length > 0) {
      const { error: erroAoDesligar } = await supabase
        .from('produto_projetos')
        .delete()
        .eq('produto_id', produtoId)
        .in('projeto_id', sobrando)
      if (erroAoDesligar) throw traduzir(erroAoDesligar)
    }

    const paraLigar = [...novos].filter((id) => !existentes.has(id))
    if (paraLigar.length > 0) {
      const { error: erroAoLigar } = await supabase.from('produto_projetos').insert(
        paraLigar.map((projetoId) => ({
          produto_id: produtoId,
          projeto_id: projetoId,
          ordem: ORDEM_NO_FIM,
        })),
      )
      if (erroAoLigar) throw traduzir(erroAoLigar)
    }
  }

  async listarDoProjeto(projetoId: string): Promise<ProdutoLigado[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produto_projetos')
      .select(`ordem, produtos!inner (${COLUNAS})`)
      .eq('projeto_id', projetoId)
      .order('ordem', { ascending: true })
      .order('criado_em', { ascending: true })
      .limit(LIGACOES_MAXIMO)
      .overrideTypes<{ ordem: number; produtos: Linha }[], { merge: false }>()
    if (error) throw traduzir(error)
    return Promise.all(data.map((linha) => paraLigado(linha.produtos)))
  }

  async listarEmTodosOsProjetos(): Promise<ProdutoLigado[]> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produtos')
      .select(COLUNAS)
      .eq('em_todos_projetos', true)
      .order('criado_em', { ascending: true })
      .limit(LIMITES_PRODUTO.porProjetoMax)
      .overrideTypes<Linha[], { merge: false }>()
    if (error) throw traduzir(error)
    return Promise.all(data.map(paraLigado))
  }

  async sincronizarProdutosDoProjeto(projetoId: string, produtoIds: string[]): Promise<void> {
    const supabase = await criarClienteServidor()

    // Desliga o que saiu da lista. Os ids já vieram conferidos como uuid (schema da ação).
    let remocao = supabase.from('produto_projetos').delete().eq('projeto_id', projetoId)
    if (produtoIds.length > 0)
      remocao = remocao.not('produto_id', 'in', `(${produtoIds.join(',')})`)
    const { error: erroAoDesligar } = await remocao
    if (erroAoDesligar) throw traduzir(erroAoDesligar)

    if (produtoIds.length === 0) return
    // Liga os novos e grava a posição de todos (a ordem da aba Produtos).
    const { error } = await supabase.from('produto_projetos').upsert(
      produtoIds.map((produtoId, ordem) => ({
        produto_id: produtoId,
        projeto_id: projetoId,
        ordem,
      })),
      { onConflict: 'produto_id,projeto_id' },
    )
    if (error) throw traduzir(error)
  }

  async listarOpcoes(): Promise<OpcoesDoProduto> {
    const supabase = await criarClienteServidor()
    const [opcoes, usos] = await Promise.all([
      supabase
        .from('produto_opcoes')
        .select('id, tipo, nome')
        .limit(LIMITES_PRODUTO.opcoesMax * 2)
        .overrideTypes<{ id: string; tipo: TipoDeOpcao; nome: string }[], { merge: false }>(),
      // Só duas colunas estreitas, para contar quantos produtos usam cada opção.
      supabase
        .from('produtos')
        .select('categoria, ambientes')
        .limit(USOS_MAXIMO)
        .overrideTypes<{ categoria: string; ambientes: string[] }[], { merge: false }>(),
    ])
    if (opcoes.error) throw traduzir(opcoes.error)
    if (usos.error) throw traduzir(usos.error)

    const contagem = new Map<string, number>()
    const contar = (chave: string) => contagem.set(chave, (contagem.get(chave) ?? 0) + 1)
    for (const produto of usos.data) {
      contar(`categoria:${produto.categoria}`)
      for (const ambiente of new Set(produto.ambientes)) contar(`ambiente:${ambiente}`)
    }

    const doTipo = (tipo: TipoDeOpcao): OpcaoDoProduto[] => {
      const lista = opcoes.data.filter((opcao) => opcao.tipo === tipo)
      const ordem = ordenarNomes(lista.map((opcao) => opcao.nome))
      return lista
        .map((opcao) => ({ ...opcao, produtos: contagem.get(`${tipo}:${opcao.nome}`) ?? 0 }))
        .sort((a, b) => ordem.indexOf(a.nome) - ordem.indexOf(b.nome))
    }
    return { categorias: doTipo('categoria'), ambientes: doTipo('ambiente') }
  }

  async criarOpcao(tipo: TipoDeOpcao, nome: string): Promise<OpcaoDoProduto> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase
      .from('produto_opcoes')
      .insert({ tipo, nome })
      .select('id, tipo, nome')
      .single()
      .overrideTypes<{ id: string; tipo: TipoDeOpcao; nome: string }, { merge: false }>()
    if (error?.code === '23505') {
      throw new AppError(
        'conflito',
        `Já existe ${tipo === 'categoria' ? 'uma categoria' : 'um ambiente'} com esse nome.`,
      )
    }
    if (error) throw traduzir(error)
    return { ...data, produtos: 0 }
  }

  async excluirOpcao(id: string): Promise<boolean> {
    const supabase = await criarClienteServidor()
    const { data, error } = await supabase.from('produto_opcoes').delete().eq('id', id).select('id')
    // 23503: categoria em uso (o banco recusa; o produto precisa de uma categoria).
    if (error?.code === '23503') {
      throw new AppError(
        'conflito',
        'Esta categoria está em uso. Troque a categoria desses produtos antes de apagar.',
      )
    }
    if (error) throw traduzir(error)
    return data.length > 0
  }
}
