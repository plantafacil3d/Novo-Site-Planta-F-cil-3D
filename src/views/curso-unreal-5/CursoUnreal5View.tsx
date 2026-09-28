import { AudienceSection } from './components/AudienceSection'
import { CourseBenefitsGrid } from './components/CourseBenefitsGrid'
import { CourseCurriculum } from './components/CourseCurriculum'
import { CourseFaqSection } from './components/CourseFaqSection'
import { CourseHero } from './components/CourseHero'
import { CourseHighlightCards } from './components/CourseHighlightCards'
import { CourseHighlightSection } from './components/CourseHighlightSection'
import { CoursePricingSection } from './components/CoursePricingSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { InstructorBio } from './components/InstructorBio'
import { MembersAreaSection } from './components/MembersAreaSection'
import { ProjectsMosaicSection } from './components/ProjectsMosaicSection'
import { ReferenceStripSection } from './components/ReferenceStripSection'
import { StudentProjectsVideoSection } from './components/StudentProjectsVideoSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { WhatYoullLearnSection } from './components/WhatYoullLearnSection'
import './theme.css'

/**
 * Landing page do curso de Unreal Engine 5.6 para Archviz, do parceiro DVIZ. Tema visual próprio
 * (`.tema-curso-ue5`, ver `theme.css`) — exceção de paleta registrada em
 * `.claude/skills/design-system/changelog.md`. Header e rodapé são os do site (`SiteShell`).
 */
export function CursoUnreal5View() {
  return (
    <div className="tema-curso-ue5">
      <CourseHero />
      <CourseHighlightCards />
      <CourseHighlightSection />
      <CourseCurriculum />
      <WhatYoullLearnSection />
      <TestimonialsSection />
      <StudentProjectsVideoSection />
      <ProjectsMosaicSection />
      <ReferenceStripSection />
      <AudienceSection />
      <MembersAreaSection />
      <CourseBenefitsGrid />
      <InstructorBio />
      <FinalCtaSection />
      <CoursePricingSection />
      <CourseFaqSection />
    </div>
  )
}
