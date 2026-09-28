import { linkVideoAlunos, secaoVideoAlunos } from '../data'
import { SectionEyebrow } from './SectionEyebrow'
import { VideoEmbed } from './VideoEmbed'

export function StudentProjectsVideoSection() {
  return (
    <section className="bg-[var(--course-bg-elevated)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto grid max-w-content items-center gap-8 px-4 md:grid-cols-2">
        <div>
          <SectionEyebrow>{secaoVideoAlunos.badge}</SectionEyebrow>
          <h2 className="mt-6 font-heading text-2xl font-bold md:text-3xl">
            {secaoVideoAlunos.title}
          </h2>
        </div>
        <VideoEmbed
          href={linkVideoAlunos}
          thumbnail="/images/curso-unreal-5/alunos-video-thumb.jpg"
          title="Projetos feitos por alunos do curso Unreal Engine 5"
          hideControls
          className="curso-video-brilho"
        />
      </div>
    </section>
  )
}
