import type { DestinoDeArquivo, EnvioAutorizado } from '@/types/envio'

/** O que o servidor consegue ver de um arquivo já enviado: o tamanho real e os primeiros bytes. */
export type ArquivoNoStorage = {
  /** Em bytes, como o Storage guardou (não o que o navegador disse). */
  tamanho: number
  /** Primeiros bytes do arquivo, para conferir o formato de verdade. */
  inicio: Uint8Array
}

/** Armazenamento de arquivos, usado só no servidor. O navegador envia por `FileUploader`. */
export interface FileStorage {
  /** Autoriza o navegador a enviar UM arquivo para o caminho e o tipo dados. */
  autorizarEnvio(destino: DestinoDeArquivo & { tipoDoConteudo: string }): Promise<EnvioAutorizado>
  /** `null` se o arquivo não está lá. */
  inspecionar(destino: DestinoDeArquivo): Promise<ArquivoNoStorage | null>
  /** URL pública e estável de um arquivo já gravado (só serve para acesso "publico"). */
  urlPublica(destino: DestinoDeArquivo): Promise<string>
  remover(destinos: DestinoDeArquivo[]): Promise<void>
}
