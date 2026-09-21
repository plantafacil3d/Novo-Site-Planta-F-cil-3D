import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import { etapasDoCadastro, type ChaveDeCaracteristica } from '../catalogo'
import {
  ARQUIVOS_DE_ENTREGA,
  ARQUIVOS_DE_PDF,
  LIMITES,
  dadosVazios,
  erroDeAnexo,
  erroDeImagem,
  filtrarDecimal,
  filtrarInteiro,
  filtrarPreco,
  idDoCampo,
  listarEmTexto,
  semSimbolos,
  situacaoDaEtapa,
  somarTamanhos,
  formatarTamanho,
} from '../rules'
import { validarEtapas, validarRascunho } from '../schemas'
import type {
  AnexoProjeto,
  ComplementarProjeto,
  DadosProjeto,
  EtapaId,
  ImagemProjeto,
  ModoSalvar,
  ResultadoSalvar,
  SituacaoDaEtapa,
} from '../types'

/** Resultado do último "Salvar". Guarda os dados de quando apareceu: ao editar qualquer campo, some. */
type Aviso = { tipo: 'sucesso' | 'erro'; mensagem: string; dados: DadosProjeto }

type Opcoes = {
  /** Projeto para editar. Sem ele, o formulário nasce vazio. */
  projetoInicial?: DadosProjeto
  /**
   * Chamada depois que a conferência passa. Ainda não existe: o salvamento de verdade entra na etapa do
   * banco. Sem ela, o formulário só confere e avisa que nada foi gravado.
   */
  aoSalvar?: (dados: DadosProjeto, modo: ModoSalvar) => Promise<ResultadoSalvar>
}

/** Campos do formulário cujo valor é um texto simples. */
type ChaveDeTexto = {
  [K in keyof DadosProjeto]: DadosProjeto[K] extends string ? K : never
}[keyof DadosProjeto]

type CampoDeImagem = 'imagemPrincipal' | 'imagens' | 'plantas'

const SEM_BANCO = 'Nada foi gravado ainda: a conexão com o banco vem na próxima etapa.'

const novoId = () => crypto.randomUUID()

const metadados = (arquivo: File) => ({
  nomeArquivo: arquivo.name,
  tamanho: arquivo.size,
  tipo: arquivo.type,
})

/**
 * Estado e ações do cadastro de projeto: dados, aba atual, erros, envio de arquivos e salvamento.
 * As telas só leem daqui e chamam as ações; a conferência mora em `schemas.ts`.
 */
export function useFormularioProjeto({ projetoInicial, aoSalvar }: Opcoes) {
  const [dados, setDados] = useState<DadosProjeto>(() => projetoInicial ?? dadosVazios())
  const [etapaAtual, setEtapaAtual] = useState<EtapaId>('informacoes')
  const [tocados, setTocados] = useState<Record<string, true>>({})
  const [tentouSalvar, setTentouSalvar] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [salvando, setSalvando] = useState<ModoSalvar | null>(null)
  const [avisosDeArquivo, setAvisosDeArquivo] = useState<Record<string, string[]>>({})
  const [complementarNovo, setComplementarNovo] = useState<string | null>(null)
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

  function campoNumero(chave: ChaveDeCaracteristica, decimal: boolean) {
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
    } else if (chave === 'imagens') {
      setDados((atual) => ({ ...atual, imagens: [...atual.imagens, ...aceitas] }))
    } else {
      const plantas = aceitas.map((imagem) => ({ ...imagem, nome: '' }))
      setDados((atual) => ({ ...atual, plantas: [...atual.plantas, ...plantas] }))
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

  function atualizarNomeDaPlanta(id: string, nome: string) {
    setDados((atual) => ({
      ...atual,
      plantas: atual.plantas.map((planta) =>
        planta.id === id ? { ...planta, nome: semSimbolos(nome) } : planta,
      ),
    }))
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

  async function concluir(modo: ModoSalvar) {
    if (!aoSalvar) {
      const conferido =
        modo === 'rascunho'
          ? 'Rascunho conferido: o título está certo.'
          : 'Tudo certo: as informações obrigatórias estão preenchidas.'
      setAviso({ tipo: 'sucesso', mensagem: `${conferido} ${SEM_BANCO}`, dados })
      return
    }
    setSalvando(modo)
    try {
      const resultado = await aoSalvar(dados, modo)
      setAviso({ tipo: resultado.ok ? 'sucesso' : 'erro', mensagem: resultado.mensagem, dados })
    } catch {
      setAviso({ tipo: 'erro', mensagem: 'Não foi possível salvar agora. Tente de novo.', dados })
    } finally {
      setSalvando(null)
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
    atualizar,
    campo,
    campoTexto,
    campoNumero,
    campoPreco,
    erroDe,
    tocar,
    tentouSalvar,
    situacoes,
    avisosDeArquivo,
    enviarImagens,
    removerImagem,
    atualizarNomeDaPlanta,
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
    salvar,
  }
}

export type FormularioProjetoApi = ReturnType<typeof useFormularioProjeto>
