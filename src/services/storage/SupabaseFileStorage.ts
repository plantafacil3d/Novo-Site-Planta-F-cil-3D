import 'server-only'

import { criarClienteServidor } from '@/lib/supabase/server'
import { AppError } from '@/types/erro'
import type { AcessoDoArquivo, DestinoDeArquivo, EnvioAutorizado } from '@/types/envio'

import { bucketDoAcesso } from './buckets'
import type { ArquivoNoStorage, FileStorage } from './FileStorage'

/** Quantos bytes do começo do arquivo o servidor lê para conferir o formato. */
const BYTES_DE_INICIO = 16
/** Segundos de validade do link temporário usado só para ler o começo do arquivo. */
const VALIDADE_DA_LEITURA = 60
/** Quantos caminhos vão por requisição ao apagar arquivos. */
const CAMINHOS_POR_LOTE = 100

type ErroDoStorage = { message: string; status?: number; statusCode?: string }

const naoEncontrado = (erro: ErroDoStorage) =>
  erro.status === 404 || erro.statusCode === '404' || /not found/i.test(erro.message)

function traduzir(erro: ErroDoStorage): AppError {
  if (erro.status === 403 || erro.statusCode === '403') {
    return new AppError('sem_permissao', 'Você não tem permissão para isso.')
  }
  return new AppError('falha_inesperada', 'Não foi possível concluir a operação com os arquivos.')
}

async function armazem(acesso: AcessoDoArquivo) {
  const supabase = await criarClienteServidor()
  return supabase.storage.from(bucketDoAcesso[acesso])
}

/** Prazo para conferir o arquivo: passou disso, vira erro em vez de deixar a tela esperando. */
const PRAZO_DA_LEITURA_MS = 15_000
/** Se o Storage ignorar o pedido de "só o começo" e mandar o arquivo todo, acima disso a leitura para. */
const TAMANHO_MAXIMO_SEM_RANGE = 64 * 1024

/**
 * Lê só o começo do arquivo (pedido `Range`; o Storage responde 206 com poucos bytes). Não lê pelo
 * fluxo da resposta: cancelar o fluxo antes do fim pode ficar esperando para sempre no servidor.
 */
async function lerInicio(url: string): Promise<Uint8Array> {
  const resposta = await fetch(url, {
    headers: { Range: `bytes=0-${BYTES_DE_INICIO - 1}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(PRAZO_DA_LEITURA_MS),
  })
  if (!resposta.ok) {
    throw new AppError('falha_inesperada', 'Não foi possível conferir o arquivo enviado.')
  }

  const tamanho = Number(resposta.headers.get('content-length') ?? 0)
  if (resposta.status !== 206 && tamanho > TAMANHO_MAXIMO_SEM_RANGE) {
    resposta.body?.cancel().catch(() => undefined)
    throw new AppError('falha_inesperada', 'Não foi possível conferir o arquivo enviado.')
  }

  const bytes = new Uint8Array(await resposta.arrayBuffer())
  return bytes.slice(0, BYTES_DE_INICIO)
}

export class SupabaseFileStorage implements FileStorage {
  async autorizarEnvio({
    acesso,
    caminho,
    tipoDoConteudo,
  }: DestinoDeArquivo & { tipoDoConteudo: string }): Promise<EnvioAutorizado> {
    const { data, error } = await (await armazem(acesso)).createSignedUploadUrl(caminho)
    if (error) throw traduzir(error)
    return { acesso, caminho, token: data.token, tipoDoConteudo }
  }

  async inspecionar({ acesso, caminho }: DestinoDeArquivo): Promise<ArquivoNoStorage | null> {
    const bucket = await armazem(acesso)

    const { data: info, error } = await bucket.info(caminho)
    if (error) {
      if (naoEncontrado(error)) return null
      throw traduzir(error)
    }

    const { data: leitura, error: erroDeLeitura } = await bucket.createSignedUrl(
      caminho,
      VALIDADE_DA_LEITURA,
    )
    if (erroDeLeitura) throw traduzir(erroDeLeitura)

    return { tamanho: info.size ?? 0, inicio: await lerInicio(leitura.signedUrl) }
  }

  async remover(destinos: DestinoDeArquivo[]): Promise<void> {
    for (const acesso of ['publico', 'privado'] as const) {
      const caminhos = destinos.filter((item) => item.acesso === acesso).map((item) => item.caminho)
      if (caminhos.length === 0) continue
      const armazemDoAcesso = await armazem(acesso)
      // Em lotes: excluir vários projetos de uma vez pode somar milhares de caminhos, e uma
      // requisição só desse tamanho é recusada.
      for (let inicio = 0; inicio < caminhos.length; inicio += CAMINHOS_POR_LOTE) {
        const lote = caminhos.slice(inicio, inicio + CAMINHOS_POR_LOTE)
        const { error } = await armazemDoAcesso.remove(lote)
        if (error) throw traduzir(error)
      }
    }
  }
}
