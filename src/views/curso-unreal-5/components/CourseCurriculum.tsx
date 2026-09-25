import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'

import { modulosDoCurso } from '../data'

/** Currículo completo: 19 módulos, cada um com sanfona própria para os tópicos. */
export function CourseCurriculum() {
  const itens = modulosDoCurso.map((modulo) => ({
    title: modulo.titulo,
    content: (
      <ul className="flex flex-col gap-1">
        {modulo.topicos.map((topico) => (
          <li key={topico}>• {topico}</li>
        ))}
      </ul>
    ),
  }))

  return (
    <Section
      tone="subtle"
      title="+60 horas de conteúdo, dinâmico e prático"
      subtitle="19 módulos completos, do primeiro contato com a Unreal Engine até projetos com Blueprints e IA."
    >
      <Accordion items={itens} />
    </Section>
  )
}
