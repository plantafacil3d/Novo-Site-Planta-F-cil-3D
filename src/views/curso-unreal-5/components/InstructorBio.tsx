import Image from 'next/image'

import { Section } from '@/components/layout/Section'
import { Icon } from '@/components/ui/Icon'

import { instrutor } from '../data'

/** Perfil do instrutor. Não existe equivalente genérico no catálogo (mais simples que `PerfilProjeto`). */
export function InstructorBio() {
  return (
    <Section title="Quem vai te ensinar" subtitle={instrutor.cargo}>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full">
          <Image src={instrutor.foto.src} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Icon name="graduation-cap" className="size-5 text-primary" />
            <h3 className="font-body text-lg font-semibold">{instrutor.nome}</h3>
          </div>
          <p className="mt-2 max-w-2xl text-fg-muted">{instrutor.bio}</p>
        </div>
      </div>
    </Section>
  )
}
