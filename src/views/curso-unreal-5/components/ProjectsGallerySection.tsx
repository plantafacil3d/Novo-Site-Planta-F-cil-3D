import { Section } from '@/components/layout/Section'
import { MediaGallery } from '@/components/shared/MediaGallery'

import { projetosDeAlunos, projetosDviz } from '../data'

/** Resultados: projetos de alunos e portfólio profissional da DVIZ, cada um em sua própria galeria. */
export function ProjectsGallerySection() {
  return (
    <>
      <Section
        title="Veja alguns projetos feitos por alunos"
        subtitle="Não é foto, é 3D: projetos que você vai aprender a fazer dentro do curso."
      >
        <MediaGallery images={projetosDeAlunos} label="Projetos de alunos do curso" />
      </Section>

      <Section
        tone="subtle"
        title="Aprenda com quem é referência no mercado"
        subtitle="Projetos profissionais assinados pela DVIZ, do mesmo instrutor do curso."
      >
        <MediaGallery images={projetosDviz} label="Projetos profissionais da DVIZ" />
      </Section>
    </>
  )
}
