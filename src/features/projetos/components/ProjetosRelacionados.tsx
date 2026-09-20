import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/shared/Carousel'
import { ProjectCard } from '@/components/shared/ProjectCard'

import { formatarPreco, hrefProjeto } from '../rules'
import type { Projeto } from '../types'
import { especificacoesDoCard } from './especificacoes'

/** Carrossel de projetos parecidos, com o mesmo card da home. */
export function ProjetosRelacionados({ projetos }: { projetos: Projeto[] }) {
  if (projetos.length === 0) return null

  return (
    <Section
      title="Projetos relacionados"
      subtitle="Confira outros projetos que podem te interessar."
    >
      <Carousel label="Projetos relacionados" itemClassName="grid w-72 sm:w-80">
        {projetos.map((projeto) => (
          <ProjectCard
            key={projeto.id}
            href={hrefProjeto(projeto)}
            title={projeto.titulo}
            image={projeto.imagem}
            badge="Similar"
            specs={especificacoesDoCard(projeto)}
            price={formatarPreco(projeto.precoCentavos)}
            favoriteLabel={`Favoritar ${projeto.titulo}`}
          />
        ))}
      </Carousel>
    </Section>
  )
}
