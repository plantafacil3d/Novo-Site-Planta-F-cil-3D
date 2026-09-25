import { Section } from '@/components/layout/Section'
import { CheckList } from '@/components/shared/CheckList'

/** "O que está incluso": itens do Cadastro (aba 4), o que o cliente recebe na compra. */
export function IncluidoNoProjeto({ itens }: { itens: string[] }) {
  return (
    <Section
      tone="tint"
      title="O que está incluso"
      subtitle="Tudo o que você precisa para começar seu projeto."
    >
      <CheckList items={itens} columns={2} />
    </Section>
  )
}
