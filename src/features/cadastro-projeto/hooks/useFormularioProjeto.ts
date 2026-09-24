import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import { fileUploader } from '@/services/upload'

import {
  confirmarEnvioEmLote,
  prepararEnvioEmLote,
  publicarProjeto,
  salvarProjeto,
} from '../actions'
import { etapasDoCadastro, type ChaveDeCaracteristica } from '../catalogo'
import {
  ARQUIVOS_DE_ENTREGA,
  ARQUIVOS_DE_PDF,
  LIMITES,
  dadosVazios,
  erroDeAnexo,
  erroDeImagem,
  filtrarCodigoManual,
  filtrarDecimal,
  filtrarInteiro,
  filtrarPreco,
  idDoCampo,
  listarArquivosDoFormulario,
  listarEmTexto,
  montarPayload,
  parsearListaColada,
  semSimbolos,
  situacaoDaEtapa,
  somarTamanhos,
  sugerirProximoNumero,
  formatarTamanho,
  type ArquivoDoFormulario,
  type LinhaColada,
} from '../rules'
import { validarEtapas, validarRascunho } from '../schemas'
import type {
  AnexoProjeto,
  ArquivoEscolhido,
  ComplementarProjeto,
  DadosProjeto,
  EtapaId,
  ImagemProjeto,
  ItemDaPlanta,
  ModoSalvar,
  PavimentoProjeto,
  SituacaoDaEtapa,
} from '../types'

/** Resultado do último "Salvar". Guarda os dados de quando apareceu: ao editar qualquer campo, some. */
type Aviso = { tipo: 'sucesso' | 'erro'; mensagem: string; dados: DadosProjeto }

type Opcoes = {
  /** Projeto para editar. Sem ele, o formulário nasce vazio. */
  projetoInicial?: DadosProjeto
  /** Id do projeto em edição: sem ele, o primeiro "Salvar" cria um projeto novo em vez de atualizar. */
  projetoIdInicial?: string
  /** Endereço público já gravado do projeto em edição (fixo desde a criação, nunca recalculado). */
  slugAtual?: string
}

/** Onde o cadastro vai depois de publicar, com um sinal para a listagem mostrar a confirmação. */
const LISTA_DE_PROJETOS = '/admin/projetos?salvo=1'

/** Campos do formulário cujo valor é um texto simples. */
type ChaveDeTexto = {
  [K in keyof DadosProjeto]: DadosProjeto[K] extends string ? K : never
}[keyof DadosProjeto]

type CampoDeImagem = 'imagemPrincipal' | 'imagens'

const novoId = () => crypto.randomUUID()

const metadados = (arquivo: File) => ({
  nomeArquivo: arquivo.name,
  tamanho: arquivo.size,
  tipo: arquivo.type,
})

const novoItemVazio = (itens: readonly ItemDaPlanta[]): ItemDaPlanta => ({
  id: novoId(),
  nome: '',
  metragem: '',
  numeroBolinha: sugerirProximoNumero(itens),
})

/**
 * Estado e ações do cadastro de projeto: dados, aba atual, erros, envio de arquivos e salvamento.
 * As telas só leem daqui e chamam as ações; a conferência mora em `schemas.ts`.
 */
export function useFormularioProjeto({ projetoInicial, projetoIdInicial, slugAtual }: Opcoes) {
  const router = useRouter()
  const [dados, setDados] = useState<DadosProjeto>(() => projetoInicial ?? dadosVazios())
  // Depois do primeiro "Salvar" o projeto já existe: salvar de novo atualiza em vez de duplicar.
  // Na edição, já nasce preenchido (senão o primeiro "Salvar" criaria um projeto novo).
  const [projetoId, setProjetoId] = useState<string | null>(projetoIdInicial ?? null)
  // Arquivos que já chegaram ao Storage nesta tela; um novo "Salvar" não os envia de novo.
  const [salvos, setSalvos] = useState<ReadonlySet<string>>(new Set())
  const [progresso, setProgresso] = useState<string | null>(null)
  const [etapaAtual, setEtapaAtual] = useState<EtapaId>('informacoes')
  const [tocados, setTocados] = useState<Record<string, true>>({})
  const [tentouSalvar, setTentouSalvar] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [salvando, setSalvando] = useState<ModoSalvar | null>(null)
  const [avisosDeArquivo, setAvisosDeArquivo] = useState<Record<string, string[]>>({})
  const [complementarNovo, setComplementarNovo] = useState<string | null>(null)
  /** Prévia do "Colar lista" (aba Planta Humanizada), esperando o usuário confirmar. */
  const [previaColada, setPreviaColada] = useState<{
    pavimentoId: string
    linhas: LinhaColada[]
  } | null>(null)
  const urlsDePrevia = useRef(new Set<string>())

  // Libera da memória as prévias locais das imagens ao sair da tela.
  useEffect(() => {
    const urls = urlsDePrevia.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  // ── Erros ────────────────────────────────────────────────────────────────────────────────────

  const errosPorEtapa = useMemo(() => validarEtapas(dados), [dados])
  const erros = useMemo(() => Object.assign({}, ...Object.values(errosPorEtapa)), [errosPorEtapa])
  const situacoes = useMemo(
    () =>
      Object.fromEntries(
        etapasDoCadastro.map((etapa) => [
          etapa.id,
          situacaoDaEtapa(etapa.id, errosPorEtapa[etapa.id], dados),
        ]),
      ) as Record<EtapaId, SituacaoDaEtapa>,
    [errosPorEtapa, dados],
  )

  /** Erro do campo, mas só depois de o usuário sair dele ou tentar salvar (não a cada tecla). */
  function erroDe(chave: string): string | undefined {
    return tentouSalvar || tocados[chave] ? (erros as Record<string, string>)[chave] : undefined
  }

  function tocar(chave: string) {
    setTocados((atual) => (atual[chave] ? atual : { ...atual, [chave]: true }))
  }

  function esquecerToques(prefixo: string) {
    setTocados((atual) =>
      Object.fromEntries(Object.entries(atual).filter(([chave]) => !chave.startsWith(prefixo))),
    )
  }

  function focarCampo(chave: string) {
    requestAnimationFrame(() => document.getElementById(idDoCampo(chave))?.focus())
  }

  // ── Campos ───────────────────────────────────────────────────────────────────────────────────

  /** Atualiza campos. Todo texto passa pelo filtro que tira `<` e `>`. */
  function atualizar(patch: Partial<DadosProjeto>) {
    const limpo = Object.fromEntries(
      Object.entries(patch).map(([chave, valor]) => [
        chave,
        typeof valor === 'string' ? semSimbolos(valor) : valor,
      ]),
    ) as Partial<DadosProjeto>
    setDados((atual) => ({ ...atual, ...limpo }))
  }

  /** Propriedades comuns de um campo: id, nome, erro (com `aria-describedby`) e "tocado" ao sair. */
  function campo(chave: string) {
    const id = idDoCampo(chave)
    const erro = erroDe(chave)
    return {
      id,
      name: chave,
      invalid: Boolean(erro),
      'aria-describedby': erro ? `${id}-erro` : undefined,
      onBlur: () => tocar(chave),
    }
  }

  type AoMudar = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

  function campoTexto(chave: ChaveDeTexto) {
    return {
      ...campo(chave),
      value: dados[chave],
      onChange: (evento: AoMudar) => atualizar({ [chave]: evento.target.value }),
    }
  }

  function campoNumero(chave: ChaveDeCaracteristica | 'familiaCapacidade', decimal: boolean) {
    return {
      ...campo(chave),
      value: dados[chave],
      inputMode: decimal ? ('decimal' as const) : ('numeric' as const),
      autoComplete: 'off',
      onChange: (evento: AoMudar) =>
        atualizar({ [chave]: (decimal ? filtrarDecimal : filtrarInteiro)(evento.target.value) }),
    }
  }

  function campoPreco(chave: 'precoNormal' | 'precoPromocional') {
    return {
      ...campo(chave),
      value: dados[chave],
      inputMode: 'decimal' as const,
      autoComplete: 'off',
      onChange: (evento: AoMudar) => atualizar({ [chave]: filtrarPreco(evento.target.value) }),
    }
  }

  function campoCodigoYoutube() {
    return {
      ...campo('codigoYoutube'),
      value: dados.codigoYoutube,
      autoComplete: 'off',
      onChange: (evento: AoMudar) =>
        atualizar({ codigoYoutube: filtrarCodigoManual(evento.target.value) }),
    }
  }

  // ── Arquivos ─────────────────────────────────────────────────────────────────────────────────

  function guardarAvisosDeArquivo(chave: string, recusas: string[]) {
    setAvisosDeArquivo((atual) => ({ ...atual, [chave]: recusas }))
  }

  function criarPrevia(arquivo: File): string {
    const url = URL.createObjectURL(arquivo)
    urlsDePrevia.current.add(url)
    return url
  }

  function liberarPrevia(url: string) {
    if (urlsDePrevia.current.delete(url)) URL.revokeObjectURL(url)
  }

  /** Confere cada imagem escolhida: as boas entram, as ruins viram aviso com o motivo. */
  function enviarImagens(chave: CampoDeImagem, arquivos: File[]) {
    const recebidos = chave === 'imagemPrincipal' ? arquivos.slice(0, 1) : arquivos
    const aceitas: ImagemProjeto[] = []
    const recusas: string[] = []
    for (const arquivo of recebidos) {
      const erro = erroDeImagem(metadados(arquivo))
      if (erro) {
        recusas.push(`${arquivo.name}: ${erro}`)
      } else {
        aceitas.push({ id: novoId(), ...metadados(arquivo), arquivo, url: criarPrevia(arquivo) })
      }
    }
    guardarAvisosDeArquivo(chave, recusas)
    tocar(chave)
    if (aceitas.length === 0) return

    if (chave === 'imagemPrincipal') {
      atualizar({ imagemPrincipal: aceitas[0] })
    } else {
      setDados((atual) => ({ ...atual, imagens: [...atual.imagens, ...aceitas] }))
    }
  }

  function removerImagem(chave: CampoDeImagem, id: string) {
    const removida =
      chave === 'imagemPrincipal'
        ? dados.imagemPrincipal
        : dados[chave].find((imagem) => imagem.id === id)
    if (removida) liberarPrevia(removida.url)
    if (chave === 'imagemPrincipal') {
      atualizar({ imagemPrincipal: null })
    } else {
      setDados((atual) => ({ ...atual, [chave]: atual[chave].filter((item) => item.id !== id) }))
    }
    guardarAvisosDeArquivo(chave, [])
    tocar(chave)
  }

  /** Arquivos da entrega (PDF, ZIP, RAR): a soma deles não pode passar de 20 MB. */
  function enviarArquivosDeEntrega(arquivos: File[]) {
    const aceitos: AnexoProjeto[] = []
    const recusas: string[] = []
    let total = somarTamanhos(dados.entregaArquivos)
    for (const arquivo of arquivos) {
      const erro = erroDeAnexo(metadados(arquivo), ARQUIVOS_DE_ENTREGA.extensoes)
      if (erro) {
        recusas.push(`${arquivo.name}: ${erro}`)
      } else if (total + arquivo.size > LIMITES.anexoMaxBytes) {
        recusas.push(
          `${arquivo.name}: passa do limite de 20 MB no total (já enviados: ${formatarTamanho(total)}).`,
        )
      } else {
        total += arquivo.size
        aceitos.push({ id: novoId(), ...metadados(arquivo), arquivo })
      }
    }
    guardarAvisosDeArquivo('entregaArquivos', recusas)
    tocar('entregaArquivos')
    if (aceitos.length > 0) {
      setDados((atual) => ({
        ...atual,
        entregaArquivos: [...atual.entregaArquivos, ...aceitos],
      }))
    }
  }

  function removerArquivoDeEntrega(id: string) {
    setDados((atual) => ({
      ...atual,
      entregaArquivos: atual.entregaArquivos.filter((arquivo) => arquivo.id !== id),
    }))
    guardarAvisosDeArquivo('entregaArquivos', [])
    tocar('entregaArquivos')
  }

  // ── Planta humanizada ────────────────────────────────────────────────────────────────────────

  function indiceDoPavimento(id: string) {
    return dados.plantaHumanizada.findIndex((pavimento) => pavimento.id === id)
  }

  function adicionarPavimento() {
    const novo: PavimentoProjeto = { id: novoId(), nome: '', imagem: null, itens: [] }
    setDados((atual) => ({ ...atual, plantaHumanizada: [...atual.plantaHumanizada, novo] }))
  }

  /** Nome vazio volta ao padrão calculado pela posição — não guarda flag nenhuma para isso. */
  function renomearPavimento(id: string, nome: string) {
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) =>
        pavimento.id === id ? { ...pavimento, nome: semSimbolos(nome) } : pavimento,
      ),
    }))
  }

  /** Copia a imagem (reenviando os bytes se ela já estava salva no servidor) e os itens; o nome
   *  nasce vazio, pega o padrão da nova posição, em vez de repetir o nome do original. */
  async function duplicarPavimento(id: string) {
    const original = dados.plantaHumanizada.find((pavimento) => pavimento.id === id)
    if (!original) return

    let imagem: ImagemProjeto | null = null
    if (original.imagem) {
      let arquivoLocal = original.imagem.arquivo
      if (!arquivoLocal) {
        try {
          const resposta = await fetch(original.imagem.url)
          const blob = await resposta.blob()
          arquivoLocal = new File([blob], original.imagem.nomeArquivo, {
            type: original.imagem.tipo,
          })
        } catch {
          arquivoLocal = undefined
        }
      }
      if (arquivoLocal) {
        imagem = {
          id: novoId(),
          ...metadados(arquivoLocal),
          arquivo: arquivoLocal,
          url: criarPrevia(arquivoLocal),
        }
      }
    }

    const novo: PavimentoProjeto = {
      id: novoId(),
      nome: '',
      imagem,
      itens: original.itens.map((item) => ({ ...item, id: novoId() })),
    }
    setDados((atual) => ({ ...atual, plantaHumanizada: [...atual.plantaHumanizada, novo] }))
  }

  function removerPavimento(id: string) {
    const pavimento = dados.plantaHumanizada.find((item) => item.id === id)
    if (pavimento?.imagem) liberarPrevia(pavimento.imagem.url)
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.filter((item) => item.id !== id),
    }))
    // Os erros são guardados pela posição do cartão; depois de remover um, as posições mudam.
    esquecerToques('plantaHumanizada.')
    guardarAvisosDeArquivo(`pavimento-${id}`, [])
  }

  function reordenarPavimentos(idOrigem: string, idDestino: string) {
    if (idOrigem === idDestino) return
    setDados((atual) => {
      const pavimentos = [...atual.plantaHumanizada]
      const origem = pavimentos.findIndex((pavimento) => pavimento.id === idOrigem)
      const destino = pavimentos.findIndex((pavimento) => pavimento.id === idDestino)
      if (origem === -1 || destino === -1) return atual
      const [movido] = pavimentos.splice(origem, 1)
      if (!movido) return atual
      pavimentos.splice(destino, 0, movido)
      return { ...atual, plantaHumanizada: pavimentos }
    })
  }

  function enviarImagemDoPavimento(pavimentoId: string, arquivos: File[]) {
    const arquivo = arquivos[0]
    if (!arquivo) return
    const erro = erroDeImagem(metadados(arquivo))
    guardarAvisosDeArquivo(`pavimento-${pavimentoId}`, erro ? [`${arquivo.name}: ${erro}`] : [])
    if (erro) return
    const nova: ImagemProjeto = {
      id: novoId(),
      ...metadados(arquivo),
      arquivo,
      url: criarPrevia(arquivo),
    }
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) =>
        pavimento.id === pavimentoId ? { ...pavimento, imagem: nova } : pavimento,
      ),
    }))
  }

  function removerImagemDoPavimento(pavimentoId: string) {
    const pavimento = dados.plantaHumanizada.find((item) => item.id === pavimentoId)
    if (pavimento?.imagem) liberarPrevia(pavimento.imagem.url)
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((item) =>
        item.id === pavimentoId ? { ...item, imagem: null } : item,
      ),
    }))
    guardarAvisosDeArquivo(`pavimento-${pavimentoId}`, [])
  }

  /** Novo item nasce com o próximo número de bolinha sugerido; o foco vai para o nome dele. */
  function adicionarItemDaPlanta(pavimentoId: string) {
    const pavimento = dados.plantaHumanizada.find((item) => item.id === pavimentoId)
    if (!pavimento) return
    const indiceDoPavimentoAtual = indiceDoPavimento(pavimentoId)
    const indiceDoItem = pavimento.itens.length
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((item) =>
        item.id === pavimentoId
          ? { ...item, itens: [...item.itens, novoItemVazio(item.itens)] }
          : item,
      ),
    }))
    focarCampo(`plantaHumanizada.${indiceDoPavimentoAtual}.itens.${indiceDoItem}.nome`)
  }

  function atualizarItemDaPlanta(
    pavimentoId: string,
    itemId: string,
    patch: Partial<Omit<ItemDaPlanta, 'id'>>,
  ) {
    const limpo = {
      ...patch,
      ...(patch.nome !== undefined ? { nome: semSimbolos(patch.nome) } : {}),
    }
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) =>
        pavimento.id === pavimentoId
          ? {
              ...pavimento,
              itens: pavimento.itens.map((item) =>
                item.id === itemId ? { ...item, ...limpo } : item,
              ),
            }
          : pavimento,
      ),
    }))
  }

  function removerItemDaPlanta(pavimentoId: string, itemId: string) {
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) =>
        pavimento.id === pavimentoId
          ? { ...pavimento, itens: pavimento.itens.filter((item) => item.id !== itemId) }
          : pavimento,
      ),
    }))
  }

  function reordenarItensDaPlanta(pavimentoId: string, idOrigem: string, idDestino: string) {
    if (idOrigem === idDestino) return
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) => {
        if (pavimento.id !== pavimentoId) return pavimento
        const itens = [...pavimento.itens]
        const origem = itens.findIndex((item) => item.id === idOrigem)
        const destino = itens.findIndex((item) => item.id === idDestino)
        if (origem === -1 || destino === -1) return pavimento
        const [movido] = itens.splice(origem, 1)
        if (!movido) return pavimento
        itens.splice(destino, 0, movido)
        return { ...pavimento, itens }
      }),
    }))
  }

  /** Prévia do "Colar lista", para o usuário confirmar antes de os itens entrarem de fato. */
  function colarListaDeItens(pavimentoId: string, texto: string) {
    const linhas = parsearListaColada(texto)
    setPreviaColada(linhas.length > 0 ? { pavimentoId, linhas } : null)
  }

  function cancelarListaColada() {
    setPreviaColada(null)
  }

  function confirmarListaColada() {
    if (!previaColada) return
    const { pavimentoId, linhas } = previaColada
    setDados((atual) => ({
      ...atual,
      plantaHumanizada: atual.plantaHumanizada.map((pavimento) => {
        if (pavimento.id !== pavimentoId) return pavimento
        let itens = pavimento.itens
        for (const linha of linhas) {
          itens = [
            ...itens,
            {
              id: novoId(),
              nome: linha.nome,
              metragem: linha.metragem,
              numeroBolinha: sugerirProximoNumero(itens),
            },
          ]
        }
        return { ...pavimento, itens }
      }),
    }))
    setPreviaColada(null)
  }

  // ── Complementares ───────────────────────────────────────────────────────────────────────────

  function adicionarComplementar() {
    const id = novoId()
    const novo: ComplementarProjeto = {
      id,
      titulo: '',
      valor: '',
      descricao: '',
      entrega: '',
      link: '',
      pdf: null,
    }
    setDados((atual) => ({ ...atual, complementares: [...atual.complementares, novo] }))
    setComplementarNovo(id)
    focarCampo(`complementares.${dados.complementares.length}.titulo`)
  }

  function atualizarComplementar(id: string, patch: Partial<Omit<ComplementarProjeto, 'id'>>) {
    const limpo = Object.fromEntries(
      Object.entries(patch).map(([chave, valor]) => [
        chave,
        typeof valor === 'string' ? semSimbolos(valor) : valor,
      ]),
    ) as typeof patch
    setDados((atual) => ({
      ...atual,
      complementares: atual.complementares.map((item) =>
        item.id === id ? { ...item, ...limpo } : item,
      ),
    }))
  }

  function removerComplementar(id: string) {
    setDados((atual) => ({
      ...atual,
      complementares: atual.complementares.filter((item) => item.id !== id),
    }))
    // Os erros são guardados pela posição do cartão; depois de remover um, as posições mudam.
    esquecerToques('complementares.')
  }

  /** PDF de um complementar: só um arquivo, até 20 MB. */
  function enviarPdfDoComplementar(id: string, arquivos: File[]) {
    const arquivo = arquivos[0]
    if (!arquivo) return
    const erro = erroDeAnexo(metadados(arquivo), ARQUIVOS_DE_PDF.extensoes)
    guardarAvisosDeArquivo(`pdf-${id}`, erro ? [`${arquivo.name}: ${erro}`] : [])
    if (erro) return
    atualizarComplementar(id, { pdf: { id: novoId(), ...metadados(arquivo), arquivo } })
  }

  function removerPdfDoComplementar(id: string) {
    atualizarComplementar(id, { pdf: null })
    guardarAvisosDeArquivo(`pdf-${id}`, [])
  }

  // ── Abas ─────────────────────────────────────────────────────────────────────────────────────

  const indiceDaEtapa = etapasDoCadastro.findIndex((etapa) => etapa.id === etapaAtual)

  function irParaEtapa(id: EtapaId) {
    setEtapaAtual(id)
  }

  function etapaAnterior() {
    const anterior = etapasDoCadastro[indiceDaEtapa - 1]
    if (anterior) setEtapaAtual(anterior.id)
  }

  function proximaEtapa() {
    const proxima = etapasDoCadastro[indiceDaEtapa + 1]
    if (proxima) setEtapaAtual(proxima.id)
  }

  // ── Salvar ───────────────────────────────────────────────────────────────────────────────────

  const etapasComPendencia = etapasDoCadastro.filter(
    (etapa) => Object.keys(errosPorEtapa[etapa.id]).length > 0,
  )
  // Só depois do primeiro "Salvar", e sempre atualizado: o aviso some quando não sobra pendência.
  const resumoDePendencias =
    tentouSalvar && etapasComPendencia.length > 0
      ? `Faltam informações em: ${listarEmTexto(etapasComPendencia.map((etapa) => etapa.rotulo))}.`
      : null
  const avisoAtual = aviso && aviso.dados === dados ? aviso : null

  const paraDadosDoArquivo = ({
    papel,
    arquivo,
    ordem,
    complementarId,
    pavimentoId,
  }: ArquivoDoFormulario<ArquivoEscolhido>) => ({
    id: arquivo.id,
    papel,
    nomeArquivo: arquivo.nomeArquivo,
    tamanho: arquivo.tamanho,
    tipo: arquivo.tipo,
    complementarId,
    pavimentoId,
    ordem,
  })

  type ResultadoDoEnvio = { ok: boolean; mensagem: string }
  type PendenteDeEnvio = { item: ArquivoDoFormulario<ArquivoEscolhido>; arquivoLocal: File }

  /**
   * Autoriza, envia e confirma um LOTE inteiro em só 2 idas ao servidor (em vez de 2 por arquivo):
   * autentica uma vez para o lote todo. Devolve um resultado por arquivo, para quem chamar marcar
   * como salvo só quem realmente deu certo, mesmo que outros itens do lote tenham falhado.
   */
  async function enviarLote(
    id: string,
    itens: PendenteDeEnvio[],
  ): Promise<Map<string, ResultadoDoEnvio>> {
    const dadosDosArquivos = itens.map(({ item }) => paraDadosDoArquivo(item))

    const preparo = await prepararEnvioEmLote(id, dadosDosArquivos)
    if (!preparo.ok) {
      // Falha do lote inteiro (ex.: sessão expirou): nenhum item deste lote foi autorizado.
      return new Map(itens.map(({ item }) => [item.arquivo.id, preparo]))
    }
    const preparoPorId = new Map(preparo.itens.map((resultado) => [resultado.id, resultado]))

    const falhasNoEnvio = new Set<string>()
    await Promise.all(
      itens.map(async ({ item, arquivoLocal }) => {
        const preparoItem = preparoPorId.get(item.arquivo.id)
        if (!preparoItem?.ok) return
        try {
          await fileUploader.enviar(preparoItem.envio, arquivoLocal)
        } catch {
          falhasNoEnvio.add(item.arquivo.id)
        }
      }),
    )

    const paraConfirmar = dadosDosArquivos.filter((dados) => preparoPorId.get(dados.id)?.ok)
    const confirmado =
      paraConfirmar.length > 0
        ? await confirmarEnvioEmLote(id, paraConfirmar)
        : { ok: true as const, mensagem: '', itens: [] }
    const confirmadoPorId = new Map(
      confirmado.ok ? confirmado.itens.map((resultado) => [resultado.id, resultado]) : [],
    )

    return new Map(
      itens.map(({ item }): [string, ResultadoDoEnvio] => {
        const idArquivo = item.arquivo.id
        const preparoItem = preparoPorId.get(idArquivo)
        if (!preparoItem?.ok) {
          return [
            idArquivo,
            { ok: false, mensagem: preparoItem?.mensagem ?? 'Não foi possível preparar o envio.' },
          ]
        }
        const confirmadoItem = confirmadoPorId.get(idArquivo)
        if (confirmadoItem?.ok) return [idArquivo, confirmadoItem]
        if (falhasNoEnvio.has(idArquivo)) {
          return [
            idArquivo,
            {
              ok: false,
              mensagem: `Não foi possível enviar "${item.arquivo.nomeArquivo}". Confira a conexão e salve de novo.`,
            },
          ]
        }
        if (!confirmado.ok) return [idArquivo, confirmado]
        return [
          idArquivo,
          confirmadoItem ?? { ok: false, mensagem: 'Não foi possível confirmar o arquivo.' },
        ]
      }),
    )
  }

  /**
   * Os passos do salvamento: 1) dados do projeto, 2) os arquivos novos, em lotes, 3) no "Salvar", a
   * publicação. Se algo falhar no meio, o que já foi gravado fica e o próximo "Salvar" continua dali.
   * Os LOTES rodam em sequência, um depois do outro (nunca em paralelo entre si) — dentro de cada
   * lote os arquivos sobem juntos, autorizados e confirmados numa chamada só ao servidor.
   */
  async function gravar(modo: ModoSalvar): Promise<{ ok: boolean; mensagem: string }> {
    setProgresso('Salvando as informações…')
    const salvo = await salvarProjeto(montarPayload(dados, salvos), modo, projetoId)
    if (!salvo.ok) return salvo
    const id = salvo.projetoId
    setProjetoId(id)

    const pendentes: PendenteDeEnvio[] = listarArquivosDoFormulario(dados).flatMap((item) =>
      item.arquivo.arquivo && !salvos.has(item.arquivo.id)
        ? [{ item, arquivoLocal: item.arquivo.arquivo }]
        : [],
    )
    const gravados = new Set(salvos)
    for (let inicio = 0; inicio < pendentes.length; inicio += LIMITES.loteDeArquivosMax) {
      const lote = pendentes.slice(inicio, inicio + LIMITES.loteDeArquivosMax)
      const ultimo = Math.min(inicio + LIMITES.loteDeArquivosMax, pendentes.length)
      setProgresso(
        pendentes.length > 1
          ? `Enviando arquivos ${inicio + 1}–${ultimo} de ${pendentes.length}…`
          : 'Enviando arquivo…',
      )
      const resultados = await enviarLote(id, lote)
      for (const { item } of lote) {
        if (resultados.get(item.arquivo.id)?.ok) gravados.add(item.arquivo.id)
      }
      setSalvos(new Set(gravados))
      const falha = lote
        .map(({ item }) => resultados.get(item.arquivo.id))
        .find((resultado) => resultado && !resultado.ok)
      if (falha) return falha
    }

    if (modo === 'rascunho') {
      return {
        ok: true,
        mensagem: 'Rascunho salvo. Você pode continuar preenchendo e salvar de novo.',
      }
    }
    setProgresso('Publicando o projeto…')
    return publicarProjeto(id)
  }

  async function concluir(modo: ModoSalvar) {
    setSalvando(modo)
    setAviso(null)
    try {
      const resultado = await gravar(modo)
      setAviso({ tipo: resultado.ok ? 'sucesso' : 'erro', mensagem: resultado.mensagem, dados })
      if (resultado.ok && modo === 'completo') router.push(LISTA_DE_PROJETOS)
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Não foi possível salvar agora. Tente de novo.', dados })
    } finally {
      setSalvando(null)
      setProgresso(null)
    }
  }

  /** "Salvar rascunho" confere só o título; "Salvar" confere todas as abas e abre a primeira com erro. */
  async function salvar(modo: ModoSalvar) {
    if (modo === 'rascunho') {
      const errosDoRascunho = validarRascunho(dados)
      if (Object.keys(errosDoRascunho).length > 0) {
        tocar('titulo')
        setEtapaAtual('informacoes')
        setAviso({
          tipo: 'erro',
          mensagem: 'Para salvar o rascunho, preencha o título do projeto.',
          dados,
        })
        focarCampo('titulo')
        return
      }
      await concluir(modo)
      return
    }

    setTentouSalvar(true)
    setAviso(null)
    const primeira = etapasComPendencia[0]
    if (primeira) {
      setEtapaAtual(primeira.id)
      const primeiroCampo = Object.keys(errosPorEtapa[primeira.id])[0]
      if (primeiroCampo) focarCampo(primeiroCampo)
      return
    }
    await concluir(modo)
  }

  return {
    dados,
    /** `null` num projeto novo (o slug só existe depois do primeiro "Salvar"). */
    slugAtual: slugAtual ?? null,
    atualizar,
    campo,
    campoTexto,
    campoNumero,
    campoPreco,
    campoCodigoYoutube,
    erroDe,
    tocar,
    tentouSalvar,
    situacoes,
    avisosDeArquivo,
    enviarImagens,
    removerImagem,
    adicionarPavimento,
    renomearPavimento,
    duplicarPavimento,
    removerPavimento,
    reordenarPavimentos,
    enviarImagemDoPavimento,
    removerImagemDoPavimento,
    adicionarItemDaPlanta,
    atualizarItemDaPlanta,
    removerItemDaPlanta,
    reordenarItensDaPlanta,
    previaColada,
    colarListaDeItens,
    cancelarListaColada,
    confirmarListaColada,
    enviarArquivosDeEntrega,
    removerArquivoDeEntrega,
    adicionarComplementar,
    atualizarComplementar,
    removerComplementar,
    enviarPdfDoComplementar,
    removerPdfDoComplementar,
    complementarNovo,
    etapaAtual,
    irParaEtapa,
    etapaAnterior,
    proximaEtapa,
    primeiraEtapa: indiceDaEtapa === 0,
    ultimaEtapa: indiceDaEtapa === etapasDoCadastro.length - 1,
    aviso: avisoAtual,
    resumoDePendencias,
    salvando,
    progresso,
    salvar,
  }
}

export type FormularioProjetoApi = ReturnType<typeof useFormularioProjeto>
