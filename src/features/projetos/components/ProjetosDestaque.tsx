import { ProjectCard } from '@/components/shared/ProjectCard'
import { cn } from '@/components/ui/cn'

import { exibirPreco, hrefProjeto } from '../rules'
import type { Projeto } from '../types'
import { especificacoesDoCard } from './especificacoes'

type ProjetosDestaqueProps = {
  projetos: Projeto[]
  /** Muda as colunas quando a grade divide a tela com outra coisa (ex.: `lg:grid-cols-2`). */
  className?: string
}

/** Grade de cards de projeto: 1 coluna no celular, 2 no tablet e 4 no desktop (padrão). */
export function ProjetosDestaque({ projetos, className }: ProjetosDestaqueProps) {
  return (
    <ul className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {projetos.map((projeto) => {
        const preco = exibirPreco(projeto)
        return (
          <li key={projeto.id} className="grid">
            <ProjectCard
              href={hrefProjeto(projeto)}
              title={projeto.titulo}
              code={projeto.codigoYoutube}
              image={projeto.imagem}
              badge={projeto.selo}
              specs={especificacoesDoCard(projeto)}
              price={preco.atual}
              priceOriginal={preco.original}
              priceDiscount={preco.desconto}
              favoriteLabel={`Favoritar ${projeto.titulo}`}
            />
          </li>
        )
      })}
    </ul>
  )
}
