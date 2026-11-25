import { hrefDaOferta, rotuloDoProduto } from '../rules'
import type { ProdutoResumo } from '../types'
import { ProdutoCard } from './ProdutoCard'

/** Largura real da foto: 2 colunas no celular, 3 no `sm`, 4 no `md` e 6 do `lg` em diante. */
const SIZES_DA_GRADE = [
  '(min-width: 1200px) 185px',
  '(min-width: 1024px) 16vw',
  '(min-width: 768px) 24vw',
  '(min-width: 640px) 32vw',
  '48vw',
].join(', ')

/** Grade da Loja (não é carrossel): o mesmo card da seção do projeto, com "Categoria · Ambiente". */
export function GradeDeProdutos({ produtos }: { produtos: ProdutoResumo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {produtos.map((produto) => (
        <li key={produto.id}>
          <ProdutoCard
            produto={produto}
            rotulo={rotuloDoProduto(produto, 'categoria-e-ambiente')}
            hrefOferta={hrefDaOferta(produto.id, { pagina: 'loja' })}
            imageSizes={SIZES_DA_GRADE}
          />
        </li>
      ))}
    </ul>
  )
}
