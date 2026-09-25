import { JsonLd } from '@/components/shared/JsonLd'
import { siteConfig, siteUrl } from '@/features/site'

import { AudienceSection } from './components/AudienceSection'
import { BenefitBadgesStrip } from './components/BenefitBadgesStrip'
import { BonusScenesSection } from './components/BonusScenesSection'
import { CourseCurriculum } from './components/CourseCurriculum'
import { CourseFaqSection } from './components/CourseFaqSection'
import { CourseHero } from './components/CourseHero'
import { CourseHighlightSection } from './components/CourseHighlightSection'
import { CoursePricingSection } from './components/CoursePricingSection'
import { InstructorBio } from './components/InstructorBio'
import { ProjectsGallerySection } from './components/ProjectsGallerySection'
import { StickyMobileCta } from './components/StickyMobileCta'
import { TestimonialsSection } from './components/TestimonialsSection'
import { WhatYoullLearnGrid } from './components/WhatYoullLearnGrid'
import { cursoPreco } from './data'
import './theme.css'

const descricaoCurso =
  'Curso completo de Unreal Engine 5.6 para arquitetos e artistas 3D: mais de 60 horas de aulas, 19 módulos, cenas bônus e comunidade exclusiva.'

/** Landing page de vendas do curso Unreal Engine 5.6. Tema visual próprio (ver `theme.css`). */
export function CursoUnreal5View() {
  return (
    <div className="tema-curso-ue5">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: 'Curso Unreal Engine 5.6',
          description: descricaoCurso,
          provider: { '@type': 'Organization', name: siteConfig.nome, sameAs: siteUrl },
          offers: {
            '@type': 'Offer',
            url: `${siteUrl}/3d-unreal`,
            priceCurrency: 'BRL',
            price: cursoPreco.atualNumero,
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      <CourseHero />
      <BenefitBadgesStrip />
      <CourseHighlightSection />
      <CourseCurriculum />
      <BonusScenesSection />
      <WhatYoullLearnGrid />
      <TestimonialsSection />
      <ProjectsGallerySection />
      <AudienceSection />
      <InstructorBio />
      <CoursePricingSection />
      <CourseFaqSection />

      {/* Precisa ser o último item: `sticky` para no fim da página e não cobre o rodapé. */}
      <StickyMobileCta />
    </div>
  )
}
