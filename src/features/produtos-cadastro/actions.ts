'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

import { produtoAdminRepository } from '@/repositories/produtos-admin'
import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'
import { fileStorage } from '@/services/storage'
import { extensaoDe } from '@/services/upload/arquivos'
import { formatoConfere } from '@/services/upload/assinaturas'
import { AppError } from '@/types/erro'

import { LIMITES_PRODUTO, TAG_PRODUTOS, caminhoDaFoto, nomeJaExiste, normalizarLink } from './rules'
import {
  schemaBusca,
  schemaFoto,
  schemaLink,
  schemaNovaOpcao,
  schemaSalvarProduto,
} from './schemas'
import type {
  FotoAutorizada,
  OpcaoDoProduto,
  OpcoesDoProduto,
  ProdutoLigado,
  ProdutoParaEditar,
  ProjetoParaLigar,
  ResultadoProduto,
} from './types'

// Server Actions são endpoints públicos (skill `seguranca` §9.1): cada uma confere o administrador
// aqui e valida tudo que recebe, sem confiar no formulário que a chamou. O banco (RLS) e o Storage
// (policies) conferem de novo. O caminho da foto é gerado aqui, nunca vem do navegador.

const naoAutorizado = {
  ok: false,
  mensagem: 'Sua sessão expirou. Entre novamente para continuar.',
} as const

const falha = (mensagem: string) => ({ ok: false, mensagem }) as const

async function rodarComoAdmin<T extends object>(
  agir: () => Promise<ResultadoProduto<T>>,
): Promise<ResultadoProduto<T>> {
  const usuario = await authService.usuarioAtual()
  if (!usuario?.ehAdmin) return naoAutorizado

  try {
    return await agir()
  } catch (erro) {
    // A mensagem para o navegador continua genérica (skill `seguranca` §8); isto é só o log.
    console.error(erro)
    const mensagem =
      erro instanceof AppError ? erro.message : 'Não foi possível concluir a operação.'
    return falha(mensagem)
  }
}

const schemaId = z.uuid()
const EXTENSAO_DO_TIPO = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' } as const

/** Mudou o que o site mostra: renova a Loja, as páginas de projeto e a tabela do painel. */
function renovarTelas() {
  revalidateTag(TAG_PRODUTOS, { expire: 0 })
  revalidatePath('/admin/produtos')
}

const apagarFoto = (caminho: string) =>
  fileStorage.remover([{ acesso: 'publico', caminho }]).catch((erro: unknown) => {
    console.error('Foto de produto não foi apagada do armazenamento:', erro)
  })

// ── Foto ─────────────────────────────────────────────────────────────────────────────────────────

/** Confere a foto escolhida e autoriza o navegador a enviá-la direto ao Storage. */
export async function prepararFotoDoProduto(
  entrada: unknown,
): Promise<ResultadoProduto<FotoAutorizada>> {
  return rodarComoAdmin<FotoAutorizada>(async () => {
    const lido = schemaFoto.safeParse(entrada)
    if (!lido.success) return falha(lido.error.issues[0]?.message ?? 'Foto inválida.')

    const tipoDoConteudo = lido.data.tipo
    const caminho = caminhoDaFoto(crypto.randomUUID(), EXTENSAO_DO_TIPO[tipoDoConteudo])
    const envio = await fileStorage.autorizarEnvio({ acesso: 'publico', caminho, tipoDoConteudo })
    return { ok: true, mensagem: 'Envio autorizado.', envio, caminho }
  })
}

/** A foto chegou ao Storage, tem o tamanho permitido e é mesmo uma imagem do formato do nome? */
async function conferirFotoEnviada(caminho: string): Promise<string | null> {
  const destino = { acesso: 'publico' as const, caminho }
  const noStorage = await fileStorage.inspecionar(destino)
  if (!noStorage) return 'A foto não chegou ao armazenamento. Escolha a foto de novo.'

  const extensao = extensaoDe(caminho)
  const valida =
    noStorage.tamanho <= LIMITES_PRODUTO.fotoBytesMax && formatoConfere(extensao, noStorage.inicio)
  if (valida) return null
  await apagarFoto(caminho)
  return 'A foto enviada não é uma imagem válida (JPG, PNG ou WEBP, até 2 MB).'
}

/** A categoria e os ambientes escolhidos ainda existem? (Podem ter sido apagados em outra aba.) */
async function conferirOpcoesEscolhidas(
  categoria: string,
  ambientes: string[],
): Promise<string | null> {
  const opcoes = await produtoAdminRepository.listarOpcoes()
  if (!opcoes.categorias.some((opcao) => opcao.nome === categoria)) {
    return 'Esta categoria não existe mais. Escolha outra.'
  }
  const existentes = new Set(opcoes.ambientes.map((opcao) => opcao.nome))
  const apagado = ambientes.find((ambiente) => !existentes.has(ambiente))
  return apagado ? `O ambiente “${apagado}” não existe mais. Desmarque-o.` : null
}

// ── Salvar ───────────────────────────────────────────────────────────────────────────────────────

/**
 * O link já é de outro produto? Usado pelo formulário quando a pessoa termina de digitar o link,
 * para avisar antes de enviar a foto. O "Salvar" confere de novo.
 */
export async function verificarLinkDoProduto(
  link: unknown,
  produtoId: unknown,
): Promise<ResultadoProduto<{ duplicado: ProdutoLigado | null }>> {
  return rodarComoAdmin<{ duplicado: ProdutoLigado | null }>(async () => {
    const linkLido = schemaLink.safeParse(link)
    const idLido = schemaId.nullable().safeParse(produtoId)
    if (!linkLido.success || !idLido.success) {
      return { ok: true, mensagem: '', duplicado: null }
    }
    const existente = await produtoAdminRepository.buscarPorLink(linkLido.data)
    return {
      ok: true,
      mensagem: '',
      duplicado: existente && existente.id !== idLido.data ? existente : null,
    }
  })
}

/**
 * Cria ou atualiza um produto. Com `projetoIds`, deixa o produto ligado exatamente a esses
 * projetos (menu Produtos); sem ele, as ligações não mudam (a aba Produtos grava as dela ao salvar
 * o projeto). Se o link já é de outro produto, não salva e devolve esse produto em `duplicado`.
 */
export async function salvarProduto(
  entrada: unknown,
): Promise<ResultadoProduto<{ produto: ProdutoLigado }>> {
  return rodarComoAdmin<{ produto: ProdutoLigado }>(async () => {
    const lido = schemaSalvarProduto.safeParse(entrada)
    if (!lido.success) return falha(lido.error.issues[0]?.message ?? 'Dados inválidos.')
    const { id, fotoCaminho, projetoIds, ...campos } = lido.data
    const link = normalizarLink(campos.link)

    const fotoAtual = id ? await produtoAdminRepository.lerCaminhoDaFoto(id) : null
    if (id && fotoAtual === null) return falha('Este produto não existe mais.')
    const fotoNova = fotoCaminho !== fotoAtual

    const existente = await produtoAdminRepository.buscarPorLink(link)
    if (existente && existente.id !== id) {
      // A foto que acabou de subir não será usada.
      if (fotoNova) await apagarFoto(fotoCaminho)
      return {
        ok: false,
        mensagem: 'Este produto já está cadastrado.',
        duplicado: existente,
      }
    }

    if (fotoNova) {
      const problema = await conferirFotoEnviada(fotoCaminho)
      if (problema) return falha(problema)
    }

    const problemaNasOpcoes = await conferirOpcoesEscolhidas(campos.categoria, campos.ambientes)
    if (problemaNasOpcoes) {
      if (fotoNova) await apagarFoto(fotoCaminho)
      return falha(problemaNasOpcoes)
    }

    const gravavel = { ...campos, link, fotoCaminho }
    let produtoId: string
    if (id) {
      await produtoAdminRepository.atualizar(id, gravavel)
      produtoId = id
    } else {
      produtoId = await produtoAdminRepository.criar(gravavel)
    }
    if (fotoNova && fotoAtual) await apagarFoto(fotoAtual)

    if (projetoIds) {
      await produtoAdminRepository.sincronizarProjetosDoProduto(produtoId, projetoIds)
    }

    renovarTelas()
    const produto = await produtoAdminRepository.buscarLigado(produtoId)
    if (!produto) return falha('Não foi possível carregar o produto salvo.')
    return { ok: true, mensagem: 'Produto salvo.', produto }
  })
}

/** Dados completos de um produto para o formulário de edição. */
export async function carregarProdutoParaEditar(
  id: unknown,
): Promise<ResultadoProduto<{ produto: ProdutoParaEditar }>> {
  return rodarComoAdmin<{ produto: ProdutoParaEditar }>(async () => {
    const lido = schemaId.safeParse(id)
    if (!lido.success) return falha('Produto inválido.')
    const produto = await produtoAdminRepository.buscarParaEditar(lido.data)
    if (!produto) return falha('Este produto não existe mais.')
    return { ok: true, mensagem: '', produto }
  })
}

// ── Excluir ──────────────────────────────────────────────────────────────────────────────────────

/** Apaga o produto de vez: sai da Loja e de todos os projetos (as ligações saem junto). */
export async function excluirProduto(id: unknown): Promise<ResultadoProduto> {
  return rodarComoAdmin<object>(async (): Promise<ResultadoProduto> => {
    const lido = schemaId.safeParse(id)
    if (!lido.success) return falha('Produto inválido.')
    const foto = await produtoAdminRepository.excluir(lido.data)
    if (foto === null) return falha('Este produto não existe mais.')
    await apagarFoto(foto)
    renovarTelas()
    return { ok: true, mensagem: 'Produto excluído.' }
  })
}

// ── Categorias e ambientes ───────────────────────────────────────────────────────────────────────

/** As categorias e os ambientes cadastrados (formulário de produto e tela de gerenciar). */
export async function listarOpcoesDoProduto(): Promise<
  ResultadoProduto<{ opcoes: OpcoesDoProduto }>
> {
  return rodarComoAdmin<{ opcoes: OpcoesDoProduto }>(async () => {
    const opcoes = await produtoAdminRepository.listarOpcoes()
    return { ok: true, mensagem: '', opcoes }
  })
}

/** Cria uma categoria ou um ambiente. Depois de criado, aparece para todos os produtos. */
export async function criarOpcaoDoProduto(
  entrada: unknown,
): Promise<ResultadoProduto<{ opcao: OpcaoDoProduto }>> {
  return rodarComoAdmin<{ opcao: OpcaoDoProduto }>(async () => {
    const lido = schemaNovaOpcao.safeParse(entrada)
    if (!lido.success) return falha(lido.error.issues[0]?.message ?? 'Nome inválido.')
    const opcoes = await produtoAdminRepository.listarOpcoes()
    const lista = lido.data.tipo === 'categoria' ? opcoes.categorias : opcoes.ambientes
    if (nomeJaExiste(lido.data.nome, lista)) {
      return falha(`“${lido.data.nome}” já está na lista.`)
    }
    if (lista.length >= LIMITES_PRODUTO.opcoesMax) return falha('A lista já está cheia.')
    const opcao = await produtoAdminRepository.criarOpcao(lido.data.tipo, lido.data.nome)
    return { ok: true, mensagem: 'Adicionado.', opcao }
  })
}

/**
 * Apaga uma categoria ou um ambiente. Ambiente apagado sai de todos os produtos; categoria em uso
 * não pode ser apagada (o banco recusa).
 */
export async function excluirOpcaoDoProduto(id: unknown): Promise<ResultadoProduto> {
  return rodarComoAdmin<object>(async (): Promise<ResultadoProduto> => {
    const lido = schemaId.safeParse(id)
    if (!lido.success) return falha('Opção inválida.')
    const apagou = await produtoAdminRepository.excluirOpcao(lido.data)
    if (!apagou) return falha('Esta opção não existe mais.')
    renovarTelas()
    return { ok: true, mensagem: 'Apagado.' }
  })
}

// ── Buscas ao vivo ───────────────────────────────────────────────────────────────────────────────

/** "Adicionar produto" da aba Produtos: procura no cadastro geral pelo nome. */
export async function buscarProdutosParaLigar(
  texto: unknown,
): Promise<ResultadoProduto<{ produtos: ProdutoLigado[] }>> {
  return rodarComoAdmin<{ produtos: ProdutoLigado[] }>(async () => {
    const lido = schemaBusca.safeParse(texto)
    if (!lido.success) return falha('Digite ao menos 2 letras para buscar.')
    const produtos = await produtoAdminRepository.pesquisar(lido.data, LIMITES_PRODUTO.buscaMax)
    return { ok: true, mensagem: '', produtos }
  })
}

/** "Aparece nos projetos" do formulário: procura projetos por nome ou código. */
export async function buscarProjetosParaLigar(
  texto: unknown,
): Promise<ResultadoProduto<{ projetos: ProjetoParaLigar[] }>> {
  return rodarComoAdmin<{ projetos: ProjetoParaLigar[] }>(async () => {
    const lido = schemaBusca.safeParse(texto)
    if (!lido.success) return falha('Digite ao menos 2 letras para buscar.')
    const pagina = await projetoAdminRepository.listar({
      busca: lido.data,
      pagina: 1,
      porPagina: LIMITES_PRODUTO.buscaMax,
    })
    return {
      ok: true,
      mensagem: '',
      projetos: pagina.itens.map((projeto) => ({
        id: projeto.id,
        codigo: projeto.codigo,
        titulo: projeto.titulo,
        publicado: projeto.status === 'publicado',
      })),
    }
  })
}
