import { ProjectCard } from '@/components/shared/ProjectCard'

import { formatarPreco, hrefProjeto } from '../rules'
import type { Projeto } from '../types'
import { especificacoesDoCard } from './especificacoes'

export function ProjetosDestaque({ projetos }: { projetos: Projeto[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {projetos.map((projeto) => (
        <li key={projeto.id} className="grid">
          <ProjectCard
            href={hrefProjeto(projeto)}
            title={projeto.titulo}
            image={projeto.imagem}
            badge={projeto.selo}
            specs={especificacoesDoCard(projeto)}
            price={formatarPreco(projeto.precoCentavos)}
            favoriteLabel={`Favoritar ${projeto.titulo}`}
          />
        </li>
      ))}
    </ul>
  )
}
