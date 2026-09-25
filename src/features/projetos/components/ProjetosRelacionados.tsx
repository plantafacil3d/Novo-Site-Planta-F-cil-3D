import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/shared/Carousel'
import { ProjectCard } from '@/components/shared/ProjectCard'
import { entrarComGoogle } from '@/features/conta'
import { FavoriteToggle } from '@/features/favoritos'

import { exibirPreco, hrefProjeto } from '../rules'
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
        {projetos.map((projeto) => {
          const preco = exibirPreco(projeto)
          return (
            <ProjectCard
              key={projeto.id}
              href={hrefProjeto(projeto)}
              title={projeto.titulo}
              code={projeto.codigoYoutube}
              image={projeto.imagem}
              badge="Similar"
              specs={especificacoesDoCard(projeto)}
              price={preco.atual}
              priceOriginal={preco.original}
              priceDiscount={preco.desconto}
              favorite={
                <FavoriteToggle
                  projetoId={projeto.id}
                  label={`Favoritar ${projeto.titulo}`}
                  entrarComGoogleAction={entrarComGoogle.bind(null, projeto.id)}
                />
              }
            />
          )
        })}
      </Carousel>
    </Section>
  )
}
