import type { EnvioAutorizado } from '@/types/envio'

/** Envio de arquivo pelo navegador, com a autorização que o servidor deu (`FileStorage.autorizarEnvio`). */
export interface FileUploader {
  /** Lança `AppError` se o envio falhar. */
  enviar(envio: EnvioAutorizado, arquivo: File): Promise<void>
}
