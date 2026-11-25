'use client'

import { ProdutosDoProjeto } from '@/features/produtos-cadastro'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { PainelDaEtapa } from './PainelDaEtapa'

/**
 * Aba "Produtos" (opcional): produtos do cadastro geral que aparecem na seção "Decore como no
 * projeto". A lista é gravada junto com o projeto, no "Salvar".
 */
export function EtapaDecoracao({ form }: { form: FormularioProjetoApi }) {
  return (
    <PainelDaEtapa
      titulo="Produtos"
      dica="Produtos parecidos com os das imagens. Aparecem na página do projeto, na ordem da lista (arraste para mudar). Produto inativo não aparece no site."
    >
      <ProdutosDoProjeto
        produtos={form.dados.produtosLigados}
        aoMudar={(produtosLigados) => form.atualizar({ produtosLigados })}
        erro={form.erroDe('produtosLigados')}
      />
    </PainelDaEtapa>
  )
}
