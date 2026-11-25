'use client'

import { useRouter } from 'next/navigation'

import type { ProdutoParaEditar } from '../types'
import { FormularioProduto } from './FormularioProduto'

const LISTA_DE_PRODUTOS = '/admin/produtos'

/**
 * Página de cadastro ou edição de produto do menu Produtos (como o cadastro de projetos: página
 * própria, sem janela flutuante). Ao salvar, volta para a lista com o aviso de "salvo".
 */
export function CadastroDeProduto({ inicial }: { inicial: ProdutoParaEditar | null }) {
  const router = useRouter()

  return (
    <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <FormularioProduto
        inicial={inicial}
        comProjetos
        aoSalvar={() => router.push(`${LISTA_DE_PRODUTOS}?salvo=1`)}
        aoCancelar={() => router.push(LISTA_DE_PRODUTOS)}
        acaoParaDuplicado={{
          rotulo: 'Abrir o produto cadastrado',
          agir: (produto) => router.push(`${LISTA_DE_PRODUTOS}/${produto.id}/editar`),
        }}
      />
    </section>
  )
}
