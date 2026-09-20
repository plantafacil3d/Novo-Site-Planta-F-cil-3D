import { ProjectCard, type ProjectSpec } from '@/components/shared/ProjectCard'

import { descreverProjeto, formatarPreco, hrefProjeto } from '../rules'
import type { Projeto } from '../types'

function especificacoes(projeto: Projeto): ProjectSpec[] {
  const texto = descreverProjeto(projeto)
  return [
    { icon: 'ruler', label: texto.medidas },
    { icon: 'bed-double', label: texto.suites },
    { icon: 'bed-single', label: texto.quartos },
    { icon: 'car', label: texto.vagas },
    { icon: 'layers', label: texto.pavimentos },
    {
      icon: projeto.diferencial.tipo === 'piscina' ? 'waves' : 'utensils',
      label: texto.diferencial,
    },
  ]
}

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
            specs={especificacoes(projeto)}
            price={formatarPreco(projeto.precoCentavos)}
            favoriteLabel={`Favoritar ${projeto.titulo}`}
          />
        </li>
      ))}
    </ul>
  )
}
