import { CTABanner } from '@/components/shared/CTABanner'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { Section } from '@/components/layout/Section'
import type { IconName } from '@/components/ui/Icon'
import {
  CategoriasGrid,
  ProjetosDestaque,
  listarCategorias,
  listarProjetosEmDestaque,
} from '@/features/projetos'
import { urlWhatsapp } from '@/features/site'

import { HeroSection } from './home/HeroSection'

// TEMPORÁRIO: foto de exemplo. Trocar por arquivo em public/.
const imagemUnreal = {
  src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=75',
  alt: 'Pessoa de costas diante de um monitor exibindo um ambiente em 3D',
}

const vantagens: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'file-text',
    title: 'Projetos completos',
    description: 'Plantas, fachadas, cortes, 3D e muito mais.',
  },
  {
    icon: 'target',
    title: 'Ideal para você',
    description: 'Seja para construir, investir ou personalizar.',
  },
  {
    icon: 'house',
    title: 'Design moderno',
    description: 'Projetos atuais, funcionais e bem aproveitados.',
  },
  {
    icon: 'shield-check',
    title: 'Suporte e segurança',
    description: 'Equipe pronta para te atender e garantir sua compra.',
  },
]

const mensagemWhatsapp =
  'Olá! Não encontrei o projeto que procuro e gostaria de um projeto personalizado.'

export async function HomeView() {
  const [categorias, destaques] = await Promise.all([
    listarCategorias(),
    listarProjetosEmDestaque(),
  ])

  return (
    <>
      <HeroSection />

      <Section
        title="Explore por categoria"
        subtitle="Encontre o projeto perfeito para o seu terreno e estilo de vida."
        action={{ label: 'Ver todos os projetos', href: '/projetos' }}
      >
        <CategoriasGrid categorias={categorias} />
      </Section>

      {destaques.length > 0 && (
        <Section
          title="Projetos em destaque"
          subtitle="Os mais recentes publicados no nosso catálogo."
          action={{ label: 'Ver todos os projetos', href: '/projetos' }}
        >
          <ProjetosDestaque projetos={destaques} />
        </Section>
      )}

      <Section
        tone="tint"
        title="Por que escolher o Planta Fácil 3D?"
        subtitle="Aqui você encontra projetos completos, com qualidade, praticidade e o melhor custo-benefício."
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-primary/20">
          {vantagens.map((vantagem) => (
            <li key={vantagem.title} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <FeatureItem titleAs="h3" {...vantagem} />
            </li>
          ))}
        </ul>
      </Section>

      <CTABanner
        variant="inverse"
        eyebrow="3D / Unreal Engine"
        title="Visualize seu projeto em outro nível"
        description="Imagens e vídeos em alta qualidade com Unreal Engine, para uma experiência ainda mais realista e imersiva."
        image={imagemUnreal}
        action={{
          label: 'Conheça nossos projetos 3D',
          href: '/3d-unreal',
          variant: 'secondary-inverse',
        }}
      />

      <CTABanner
        variant="brand"
        title="Não encontrou seu projeto?"
        description="Fale com a gente! Podemos desenvolver um projeto personalizado para você."
        action={{ label: 'Falar no WhatsApp', href: urlWhatsapp(mensagemWhatsapp) }}
      />
    </>
  )
}
