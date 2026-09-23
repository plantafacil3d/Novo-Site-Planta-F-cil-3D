'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { fileUploader } from '@/services/upload'

import { confirmarEnvioBiblioteca, prepararEnvioBiblioteca } from '../actions'
import { LIMITES_BIBLIOTECA, erroDoArquivoDaBiblioteca } from '../rules'

const novoId = () => crypto.randomUUID()

type ItemPendente = {
  id: string
  nomeArquivo: string
  tamanho: number
  tipo: string
  arquivo: File
}

type DadosDoArquivo = Omit<ItemPendente, 'arquivo'>

const paraDadosDoArquivo = ({ id, nomeArquivo, tamanho, tipo }: ItemPendente): DadosDoArquivo => ({
  id,
  nomeArquivo,
  tamanho,
  tipo,
})

/**
 * Envia arquivos para a biblioteca central: confere cada um no navegador (feedback rápido, não é a
 * barreira real), depois autoriza, envia e confirma em lotes — mesmo fluxo de 2 fases usado no
 * cadastro de projeto (`useFormularioProjeto`). Sem "rascunho": cada arquivo escolhido sobe direto,
 * não existe um "Salvar" para confirmar depois.
 */
export function useEnvioBiblioteca() {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [progresso, setProgresso] = useState<string | null>(null)
  const [recusas, setRecusas] = useState<string[]>([])
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  /** Autoriza, envia e confirma UM lote (2 idas ao servidor, autenticando uma vez para o lote todo).
   *  Devolve as mensagens de erro dos itens que não deram certo (lote inteiro ou item a item). */
  async function enviarLote(itens: ItemPendente[]): Promise<string[]> {
    const dadosDosArquivos = itens.map(paraDadosDoArquivo)
    const preparo = await prepararEnvioBiblioteca(dadosDosArquivos)
    if (!preparo.ok) return itens.map((item) => `${item.nomeArquivo}: ${preparo.mensagem}`)

    const preparoPorId = new Map(preparo.itens.map((resultado) => [resultado.id, resultado]))
    const falhasNoEnvio = new Set<string>()
    await Promise.all(
      itens.map(async (item) => {
        const preparoItem = preparoPorId.get(item.id)
        if (!preparoItem?.ok) return
        try {
          await fileUploader.enviar(preparoItem.envio, item.arquivo)
        } catch {
          falhasNoEnvio.add(item.id)
        }
      }),
    )

    const paraConfirmar = dadosDosArquivos.filter((dados) => preparoPorId.get(dados.id)?.ok)
    const confirmado =
      paraConfirmar.length > 0
        ? await confirmarEnvioBiblioteca(paraConfirmar)
        : { ok: true as const, mensagem: '', itens: [] }
    const confirmadoPorId = new Map(
      confirmado.ok ? confirmado.itens.map((resultado) => [resultado.id, resultado]) : [],
    )

    const mensagens: string[] = []
    for (const item of itens) {
      const preparoItem = preparoPorId.get(item.id)
      if (!preparoItem?.ok) {
        mensagens.push(
          `${item.nomeArquivo}: ${preparoItem?.mensagem ?? 'Não foi possível preparar o envio.'}`,
        )
        continue
      }
      if (falhasNoEnvio.has(item.id)) {
        mensagens.push(
          `${item.nomeArquivo}: não foi possível enviar. Confira a conexão e tente de novo.`,
        )
        continue
      }
      const confirmadoItem = confirmadoPorId.get(item.id)
      if (confirmadoItem?.ok) continue
      const motivo = confirmadoItem?.mensagem ?? (!confirmado.ok ? confirmado.mensagem : null)
      mensagens.push(`${item.nomeArquivo}: ${motivo ?? 'Não foi possível confirmar o arquivo.'}`)
    }
    return mensagens
  }

  /** Confere cada arquivo escolhido: os bons entram na fila de envio, os ruins viram recusa. */
  async function enviar(arquivos: File[]) {
    const aceitos: ItemPendente[] = []
    const rejeitados: string[] = []
    for (const arquivo of arquivos) {
      const metadados = { nomeArquivo: arquivo.name, tamanho: arquivo.size, tipo: arquivo.type }
      const erro = erroDoArquivoDaBiblioteca(metadados)
      if (erro) {
        rejeitados.push(`${arquivo.name}: ${erro}`)
      } else {
        aceitos.push({ id: novoId(), ...metadados, arquivo })
      }
    }
    setRecusas(rejeitados)
    setErroGeral(null)
    if (aceitos.length === 0) return

    setEnviando(true)
    try {
      const mensagensDeErro: string[] = []
      for (let inicio = 0; inicio < aceitos.length; inicio += LIMITES_BIBLIOTECA.loteMax) {
        const lote = aceitos.slice(inicio, inicio + LIMITES_BIBLIOTECA.loteMax)
        const fim = Math.min(inicio + LIMITES_BIBLIOTECA.loteMax, aceitos.length)
        setProgresso(
          aceitos.length > 1
            ? `Enviando arquivos ${inicio + 1}–${fim} de ${aceitos.length}…`
            : 'Enviando arquivo…',
        )
        mensagensDeErro.push(...(await enviarLote(lote)))
      }
      if (mensagensDeErro.length > 0) setRecusas((atual) => [...atual, ...mensagensDeErro])
      router.refresh()
    } catch {
      setErroGeral('Não foi possível enviar agora. Tente de novo.')
    } finally {
      setEnviando(false)
      setProgresso(null)
    }
  }

  return { enviar, enviando, progresso, recusas, erroGeral }
}
