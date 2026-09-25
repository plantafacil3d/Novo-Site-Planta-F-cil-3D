import Image from 'next/image'

import { CTABanner } from '@/components/shared/CTABanner'
import { CheckList } from '@/components/shared/CheckList'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { Section } from '@/components/layout/Section'
import { urlWhatsapp } from '@/features/site'

import { HeroSobre } from './sobre/HeroSobre'
import { Timeline } from './sobre/Timeline'

const valores = [
  'Comprometimento com o cliente',
  'Inovação constante',
  'Ética e responsabilidade profissional',
  'Acessibilidade e inclusão',
  'Qualidade técnica e estética',
]

const mensagemWhatsapp = 'Olá! Vi a página Sobre e quero saber mais sobre os projetos da Planta Fácil 3D.'

export function SobreView() {
  return (
    <>
      <HeroSobre />

      <Section
        tone="page"
        title="Nossa história"
        subtitle="De um canal no YouTube a uma plataforma que já ajudou milhares de famílias."
      >
        <div className="max-w-2xl">
          <Timeline />
        </div>
      </Section>

      <Section tone="tint" title="Missão, visão e valores">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <FeatureItem
              icon="target"
              titleAs="h3"
              title="Missão"
              description="Democratizar o acesso à arquitetura por meio da tecnologia, oferecendo soluções práticas, econômicas e de qualidade."
              className="transition-transform duration-200 ease-standard hover:translate-x-1"
            />
            <FeatureItem
              icon="sparkles"
              titleAs="h3"
              title="Visão"
              description="Ser reconhecida como a maior plataforma de projetos arquitetônicos acessíveis do Brasil, expandindo também para o mercado internacional."
              className="transition-transform duration-200 ease-standard hover:translate-x-1"
            />
          </div>
          <div>
            <h3 className="font-body text-sm font-semibold">Valores</h3>
            <div className="mt-3">
              <CheckList items={valores} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="inverse" title="Dias atuais">
        <div className="relative grid gap-10 md:grid-cols-2">
          <Image
            src="/images/sobre/logo-fundo-escuro.png"
            alt=""
            aria-hidden="true"
            width={160}
            height={160}
            className="pointer-events-none absolute -top-4 right-0 hidden opacity-10 md:block"
          />
          <div className="flex flex-col gap-4 text-fg-inverse/90">
            <p>
              Hoje, a Planta Fácil 3D atende clientes de todo o Brasil e também do exterior. Seja
              para construir no litoral, no interior ou em outro país, nossos projetos digitais
              são entregues com acesso instantâneo e suporte humano, sempre que necessário.
            </p>
            <p>
              Com milhares de projetos vendidos, seguimos firmes com a proposta de tornar a
              arquitetura mais acessível e prática para todos.
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-fg-inverse/15 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
            <h3 className="font-body text-lg font-semibold text-fg-inverse">Nossos princípios</h3>
            <p className="text-fg-inverse/90">
              Acreditamos que a arquitetura pode transformar vidas. Por isso, nossos projetos são
              pensados com carinho, equilíbrio entre estética e função, e foco total na realização
              dos sonhos dos nossos clientes.
            </p>
            <p className="text-fg-inverse/90">
              Trabalhamos com clareza, comprometimento e inovação — sem jamais perder o contato
              humano e a empatia com cada realidade.
            </p>
          </div>
        </div>
      </Section>

      <CTABanner
        variant="brand"
        title="Bem-vindo à nossa comunidade"
        description="Somos feitos de pessoas reais: profissionais apaixonados por arquitetura e clientes determinados a realizar seus sonhos. Estamos aqui para construir com você."
        action={{ label: 'Falar no WhatsApp', href: urlWhatsapp(mensagemWhatsapp) }}
      />
    </>
  )
}
