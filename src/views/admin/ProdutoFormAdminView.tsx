import { CadastroDeProduto, type ProdutoParaEditar } from '@/features/produtos-cadastro'

/** Tela de cadastro ou edição de produto do painel (o mesmo formulário serve para os dois). */
export function ProdutoFormAdminView({ produto }: { produto?: ProdutoParaEditar }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">{produto ? 'Editar produto' : 'Cadastrar produto'}</h1>
        <p className="mt-2 text-fg-muted">
          {produto
            ? 'Altere os dados do produto e salve para atualizar.'
            : 'Cadastre o produto uma vez e escolha em quais projetos ele aparece.'}
        </p>
      </div>

      <CadastroDeProduto inicial={produto ?? null} />
    </div>
  )
}
