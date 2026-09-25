import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'
import { FeatureItem } from '@/components/shared/FeatureItem'
import type { IconName } from '@/components/ui/Icon'

const vantagens: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'sparkles',
    title: 'Desbloqueie sua criatividade',
    description: 'Renderização em tempo real muda a forma como você testa e apresenta ideias.',
  },
  {
    icon: 'globe',
    title: 'Trabalhe de onde quiser',
    description: 'Todo o fluxo de trabalho é on-line: leve seus projetos para qualquer lugar.',
  },
  {
    icon: 'award',
    title: 'A cereja do bolo',
    description: 'Diferencie-se no mercado entregando experiências imersivas aos clientes.',
  },
  {
    icon: 'rocket',
    title: 'O único erro é não começar',
    description: 'E o software? Gratuito. O investimento aqui é só o seu tempo de estudo.',
  },
]

const accordionSemTempo = [
  {
    title: 'Sem tempo para estudar?',
    content:
      'O curso segue um método testado com mais de 5 mil alunos: aulas curtas e diretas, organizadas para você praticar enquanto assiste, sem depender de blocos longos de estudo.',
  },
]

/** Combina "100% aprimorado", o destaque da UE5.6 e as vantagens de dominar renderização em tempo real. */
export function CourseHighlightSection() {
  return (
    <Section
      title="Destaque-se no mercado com as tecnologias mais avançadas"
      subtitle="Curso 100% reformulado para a Unreal Engine 5.6: ferramentas procedurais, animações e realismo em tempo real, compatível com os principais softwares do mercado."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <ul className="grid gap-6 sm:grid-cols-2">
          {vantagens.map((vantagem) => (
            <li key={vantagem.title}>
              <FeatureItem layout="stack" titleAs="h3" {...vantagem} />
            </li>
          ))}
        </ul>
        <Accordion items={accordionSemTempo} />
      </div>
    </Section>
  )
}
