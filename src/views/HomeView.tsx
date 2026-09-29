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

import { HeroSection } from './home/HeroSection'

// Imagem do banner do curso Unreal. Coloque o arquivo com este nome na pasta public/images/home/
const imagemUnreal = {
  src: '/images/home/banner-unreal.jpg.png',
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
        eyebrow="Curso de Unreal Engine"
        title="Aprenda a criar renderizações realistas como as nossas"
        description="Quer dominar o Unreal Engine e produzir vídeos e imagens ultrarrealistas dos seus projetos? Conheça o nosso curso."
        image={imagemUnreal}
        action={{
          label: 'Conheça nosso curso',
          href: '/curso-unreal-engine',
          variant: 'secondary-inverse',
        }}
      />
    </>
  )
}
