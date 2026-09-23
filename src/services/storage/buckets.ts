import type { AcessoDoArquivo } from '@/types/envio'

/**
 * Nome de cada bucket. Só os adapters conhecem. `publico`/`privado` vêm da migration
 * `projetos_cadastro_completo`; `biblioteca` (arquivos de exemplo reaproveitáveis entre projetos,
 * sempre públicos) vem de `biblioteca_arquivos_exemplo`.
 */
export const bucketDoAcesso: Record<AcessoDoArquivo, string> = {
  publico: 'projetos-publico',
  privado: 'projetos-privado',
  biblioteca: 'biblioteca-exemplos',
}
