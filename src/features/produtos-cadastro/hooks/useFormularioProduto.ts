'use client'

import { useState } from 'react'

import { fileUploader, reduzirImagem } from '@/services/upload'
import { AppError } from '@/types/erro'

import {
  lerLinkDoProduto,
  prepararFotoDoProduto,
  salvarProduto,
  verificarLinkDoProduto,
} from '../actions'
import type { OrigemProduto } from '../catalogo'
import { LIMITES_PRODUTO } from '../rules'
import { schemaCamposDoProduto } from '../schemas'
import type { ProdutoLigado, ProdutoParaEditar, ProjetoParaLigar } from '../types'

type Campos = {
  nome: string
  link: string
  categoria: string
  ambientes: string[]
  origem: OrigemProduto
  ativo: boolean
  emTodosProjetos: boolean
}

const camposVazios: Campos = {
  nome: '',
  link: '',
  categoria: '',
  ambientes: [],
  origem: 'afiliado',
  ativo: true,
  emTodosProjetos: false,
}

type Foto = { caminho: string; url: string }

export type CampoDoProduto = keyof Campos | 'foto'

const EXTENSAO_DO_TIPO: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

/** A foto que veio do servidor (base64) vira um arquivo, como se a pessoa a tivesse escolhido. */
function arquivoDaFoto(foto: { base64: string; tipo: string }): File {
  const bytes = Uint8Array.from(atob(foto.base64), (letra) => letra.charCodeAt(0))
  return new File([bytes], `foto-do-link.${EXTENSAO_DO_TIPO[foto.tipo] ?? 'webp'}`, {
    type: foto.tipo,
  })
}

function camposDe(produto: ProdutoParaEditar): Campos {
  return {
    nome: produto.nome,
    link: produto.link,
    categoria: produto.categoria,
    ambientes: produto.ambientes,
    origem: produto.origem,
    ativo: produto.ativo,
    emTodosProjetos: produto.emTodosProjetos,
  }
}

/**
 * Estado do formulário de produto (o mesmo no menu Produtos e na aba Produtos). `inicial` nulo =
 * produto novo; senão, o produto já carregado para editar. `comProjetos`: mostra e grava o
 * "Aparece nos projetos" (só no menu Produtos).
 */
export function useFormularioProduto({
  inicial,
  comProjetos,
  aoSalvar,
}: {
  inicial: ProdutoParaEditar | null
  comProjetos: boolean
  aoSalvar: (produto: ProdutoLigado) => void
}) {
  const produtoId = inicial?.id ?? null
  const [campos, setCampos] = useState<Campos>(() => (inicial ? camposDe(inicial) : camposVazios))
  const [foto, setFoto] = useState<Foto | null>(inicial?.foto ?? null)
  const [projetos, setProjetos] = useState<ProjetoParaLigar[]>(inicial?.projetos ?? [])
  const [erros, setErros] = useState<Partial<Record<CampoDoProduto, string>>>({})
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [duplicado, setDuplicado] = useState<ProdutoLigado | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [lendoLink, setLendoLink] = useState(false)
  const [avisoDoLink, setAvisoDoLink] = useState<string | null>(null)

  function atualizar(patch: Partial<Campos>) {
    setCampos((atual) => ({ ...atual, ...patch }))
    setErros((atual) => {
      const proximo = { ...atual }
      for (const chave of Object.keys(patch) as (keyof Campos)[]) delete proximo[chave]
      return proximo
    })
    if ('link' in patch) {
      setDuplicado(null)
      setAvisoDoLink(null)
    }
  }

  function alternarAmbiente(valor: string) {
    const lista = campos.ambientes.includes(valor)
      ? campos.ambientes.filter((ambiente) => ambiente !== valor)
      : [...campos.ambientes, valor]
    atualizar({ ambientes: lista })
  }

  /** Uma categoria ou um ambiente foi apagado: sai também deste produto. */
  function esquecerOpcao(tipo: 'categoria' | 'ambiente', nome: string) {
    setCampos((atual) =>
      tipo === 'categoria'
        ? { ...atual, categoria: atual.categoria === nome ? '' : atual.categoria }
        : { ...atual, ambientes: atual.ambientes.filter((ambiente) => ambiente !== nome) },
    )
  }

  /** Reduz a foto no navegador, pede autorização ao servidor e envia direto ao armazenamento. */
  async function escolherFoto(arquivo: File) {
    setErros((atual) => ({ ...atual, foto: undefined }))
    setEnviandoFoto(true)
    try {
      const pronta = await reduzirImagem(arquivo, {
        limite: LIMITES_PRODUTO.fotoLadoMax,
        qualidade: LIMITES_PRODUTO.fotoQualidade,
      })
      const autorizado = await prepararFotoDoProduto({
        nomeArquivo: pronta.name,
        tamanho: pronta.size,
        tipo: pronta.type,
      })
      if (!autorizado.ok) throw new AppError('dados_invalidos', autorizado.mensagem)
      await fileUploader.enviar(autorizado.envio, pronta)
      setFoto({ caminho: autorizado.caminho, url: URL.createObjectURL(pronta) })
    } catch (erro) {
      const mensagem =
        erro instanceof AppError ? erro.message : 'Não foi possível enviar a foto. Tente de novo.'
      setErros((atual) => ({ ...atual, foto: mensagem }))
    } finally {
      setEnviandoFoto(false)
    }
  }

  /** Ao sair do campo do link: avisa já se o produto está cadastrado. */
  async function conferirLink() {
    if (campos.link.trim() === '') return
    const resultado = await verificarLinkDoProduto(campos.link, produtoId)
    if (resultado.ok) setDuplicado(resultado.duplicado)
  }

  /** "Preencher": busca o nome e a foto do link e preenche os campos para a pessoa conferir. */
  async function preencherPeloLink() {
    setAvisoDoLink(null)
    const lido = schemaCamposDoProduto.shape.link.safeParse(campos.link)
    if (!lido.success) {
      setErros((atual) => ({ ...atual, link: lido.error.issues[0]?.message ?? 'Link inválido.' }))
      return
    }
    setLendoLink(true)
    try {
      const resultado = await lerLinkDoProduto(lido.data)
      if (!resultado.ok) {
        setAvisoDoLink(resultado.mensagem)
        return
      }
      if (resultado.nome) atualizar({ nome: resultado.nome })
      void conferirLink()
      if (resultado.foto) await escolherFoto(arquivoDaFoto(resultado.foto))
      else setAvisoDoLink('Não achei a foto neste link. Escolha a foto à mão.')
    } catch {
      setAvisoDoLink('Não consegui ler este link. Preencha o nome e a foto à mão.')
    } finally {
      setLendoLink(false)
    }
  }

  async function salvar() {
    setErroGeral(null)
    const lido = schemaCamposDoProduto.safeParse(campos)
    const novosErros: Partial<Record<CampoDoProduto, string>> = {}
    if (!lido.success) {
      for (const problema of lido.error.issues) {
        const chave = problema.path[0] as keyof Campos
        novosErros[chave] ??= problema.message
      }
    }
    if (!foto) novosErros.foto = 'Escolha a foto do produto.'
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0 || !lido.success || !foto) return

    setSalvando(true)
    try {
      const resultado = await salvarProduto({
        ...lido.data,
        id: produtoId,
        fotoCaminho: foto.caminho,
        projetoIds: comProjetos ? projetos.map((projeto) => projeto.id) : undefined,
      })
      if (resultado.ok) {
        aoSalvar(resultado.produto)
        return
      }
      if (resultado.duplicado) {
        setDuplicado(resultado.duplicado)
        // A foto enviada foi descartada pelo servidor: precisa escolher de novo se for continuar.
        if (foto.caminho !== inicial?.foto.caminho) setFoto(null)
        return
      }
      setErroGeral(resultado.mensagem)
    } catch {
      setErroGeral('Não foi possível salvar agora. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  return {
    campos,
    atualizar,
    alternarAmbiente,
    esquecerOpcao,
    foto,
    escolherFoto,
    enviandoFoto,
    projetos,
    setProjetos,
    conferirLink,
    preencherPeloLink,
    lendoLink,
    avisoDoLink,
    duplicado,
    erros,
    erroGeral,
    salvando,
    salvar,
  }
}
