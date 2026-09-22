import { criarClienteNavegador } from '@/lib/supabase/client'
import { bucketDoAcesso } from '@/services/storage/buckets'
import { AppError } from '@/types/erro'
import type { EnvioAutorizado } from '@/types/envio'

import type { FileUploader } from './FileUploader'

export class SupabaseFileUploader implements FileUploader {
  async enviar({ acesso, caminho, token, tipoDoConteudo }: EnvioAutorizado, arquivo: File) {
    const { error } = await criarClienteNavegador()
      .storage.from(bucketDoAcesso[acesso])
      .uploadToSignedUrl(caminho, token, arquivo, { contentType: tipoDoConteudo })
    if (error) throw new AppError('falha_inesperada', 'Não foi possível enviar o arquivo.')
  }
}
