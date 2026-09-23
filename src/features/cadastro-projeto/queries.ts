import 'server-only'

import { projetoAdminRepository } from '@/repositories/projetos-admin'
import { authService } from '@/services/auth'
import { fileStorage } from '@/services/storage'

import { acessoDoPapel, paraDadosProjeto } from './rules'
import type { ArquivoCompletoDoBanco, DadosProjeto } from './types'

// Loader para a tela de edição. Confere o administrador aqui (skill `seguranca` §5): o `id` vem da
// URL, entrada não confiável, e a rota sozinha não basta como autorização.

/**
 * Dados do projeto para a tela de edição, ou `null` se não existir (id errado ou sem permissão).
 * `slug` vem à parte de `dados` (não faz parte de `DadosProjeto`) porque é só para exibição: o
 * endereço real nunca é reenviado ao salvar, então não tem por que entrar no payload do formulário.
 */
export async function buscarProjetoParaEditar(
  id: string,
): Promise<{ dados: DadosProjeto; slug: string } | null> {
  const usuario = await authService.usuarioAtual()
  if (!usuario?.ehAdmin) return null

  const cadastro = await projetoAdminRepository.buscarCadastroCompleto(id)
  if (!cadastro) return null

  // Só as imagens (principal, galeria, plantas) precisam de URL: PDFs e outros anexos, sendo
  // privados, só mostram nome e tamanho no formulário (ver `ListaDeAnexos`).
  const urls = new Map<string, string>()
  await Promise.all(
    cadastro.arquivos
      .filter((arquivo) => acessoDoPapel(arquivo.papel) === 'publico')
      .map(async (arquivo) => {
        const url = await fileStorage.urlPublica({ acesso: 'publico', caminho: arquivo.caminho })
        urls.set(arquivo.id, url)
      }),
  )

  const dados = paraDadosProjeto(
    cadastro,
    (arquivo: ArquivoCompletoDoBanco) => urls.get(arquivo.id) ?? '',
  )
  return { dados, slug: cadastro.slug }
}
