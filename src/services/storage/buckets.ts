import type { AcessoDoArquivo } from '@/types/envio'

/** Nome de cada bucket, criados na migration `projetos_cadastro_completo`. Só os adapters conhecem. */
export const bucketDoAcesso: Record<AcessoDoArquivo, string> = {
  publico: 'projetos-publico',
  privado: 'projetos-privado',
}
