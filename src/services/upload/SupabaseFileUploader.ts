import { criarClienteNavegador } from '@/lib/supabase/client'
import { bucketDoAcesso } from '@/services/storage/buckets'
import { AppError } from '@/types/erro'
import type { EnvioAutorizado } from '@/types/envio'

import type { FileUploader } from './FileUploader'

/**
 * Cache de 1 ano (segundos) para o que vai aos buckets públicos. Só é seguro porque o caminho de cada
 * arquivo novo é único (imagens têm sufixo; biblioteca usa o id): trocar o arquivo muda a URL.
 */
const CACHE_LONGO = '31536000'

export class SupabaseFileUploader implements FileUploader {
  async enviar({ acesso, caminho, token, tipoDoConteudo }: EnvioAutorizado, arquivo: File) {
    // O bucket privado fica como está (cache padrão): só os públicos ganham o cache longo. A chave
    // `cacheControl` nem pode existir no privado: `cacheControl: undefined` apaga o padrão do SDK e
    // o Storage grava "max-age=undefined".
    const opcoes =
      acesso === 'privado'
        ? { contentType: tipoDoConteudo }
        : { contentType: tipoDoConteudo, cacheControl: CACHE_LONGO }
    const { error } = await criarClienteNavegador()
      .storage.from(bucketDoAcesso[acesso])
      .uploadToSignedUrl(caminho, token, arquivo, opcoes)
    if (error) throw new AppError('falha_inesperada', 'Não foi possível enviar o arquivo.')
  }
}
