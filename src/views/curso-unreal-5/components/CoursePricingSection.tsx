import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PriceTag } from '@/components/shared/PriceTag'

import { cursoPreco, hotmartCheckoutUrl } from '../data'

const inclusos = [
  '+60 horas de aulas gravadas',
  'Materiais e cenas bônus',
  'Acesso por 12 meses',
  'Comunidade exclusiva de alunos',
  'Suporte para tirar dúvidas',
  'Certificado de conclusão',
]

/**
 * Seção de preço e matrícula. Não reaproveita `CTABanner` (`variant="card"`): o botão dele é fixo
 * no verde global, e aqui o CTA precisa do azul do tema do curso (exceção combinada, ver `theme.css`).
 */
export function CoursePricingSection() {
  return (
    <section id="matricula" className="bg-[var(--course-bg)] py-16 text-[var(--course-fg)]">
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 px-4 text-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--course-accent)] uppercase">
            Oferta por tempo limitado
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl">
            Do zero ao realismo que encanta clientes em tempo real
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[var(--course-fg-muted)]">
            O mercado já mudou. Mais de 5 mil criadores já garantiram a vaga.
          </p>
        </div>

        <ul className="grid gap-x-8 gap-y-3 text-left sm:grid-cols-2">
          {inclusos.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <Icon name="check" className="size-4 text-[var(--course-accent)]" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>

        <PriceTag
          price={cursoPreco.atual}
          originalPrice={cursoPreco.original}
          discountLabel={cursoPreco.desconto}
          priceClassName="text-3xl text-[var(--course-fg)]"
          originalPriceClassName="text-[var(--course-fg-muted)]"
        />

        <Button
          href={hotmartCheckoutUrl}
          size="lg"
          iconLeft="cart"
          className="text-white bg-[var(--course-accent)] hover:bg-[var(--course-accent-hover)]"
        >
          Garantir essa oferta
        </Button>
      </div>
    </section>
  )
}
