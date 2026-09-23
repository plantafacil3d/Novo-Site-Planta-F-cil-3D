import 'server-only'

import { exigirAdmin } from '@/features/admin'
import { bibliotecaExemplosRepository } from '@/repositories/biblioteca-exemplos'
import { fileStorage } from '@/services/storage'
import type { Pagina } from '@/types/pagina'

import { POR_PAGINA_BIBLIOTECA } from './rules'
import type { ArquivoParaSelecao, LinhaDaBibliotecaAdmin, ParametrosAdminBiblioteca } from './types'

// Loaders para Server Components do painel. Toda leitura confere o administrador no servidor
// (skill `seguranca` §5): o layout do painel já confere, mas não roda de novo em toda navegação.

/** Página da biblioteca já com a URL pública de cada arquivo resolvida (bucket público — não
 *  precisa de link temporário), mesmo padrão de `cadastro-projeto/queries.ts`. */
export async function listarBibliotecaAdmin(
  params: ParametrosAdminBiblioteca,
): Promise<Pagina<LinhaDaBibliotecaAdmin>> {
  await exigirAdmin()
  const pagina = await bibliotecaExemplosRepository.listar({
    busca: params.q,
    pagina: params.pagina,
    porPagina: POR_PAGINA_BIBLIOTECA,
  })
  const itens = await Promise.all(
    pagina.itens.map(async (item) => ({
      ...item,
      url: await fileStorage.urlPublica({ acesso: 'biblioteca', caminho: item.caminho }),
    })),
  )
  return { ...pagina, itens }
}

/** Arquivos da biblioteca para os checkboxes da aba "Arquivos de Exemplo" do cadastro de projeto. */
export async function listarBibliotecaParaSelecao(): Promise<ArquivoParaSelecao[]> {
  await exigirAdmin()
  return bibliotecaExemplosRepository.listarParaSelecao()
}
