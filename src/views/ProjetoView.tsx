import { CTABanner } from '@/components/shared/CTABanner'
import { JsonLd } from '@/components/shared/JsonLd'
import { VideoBanner } from '@/components/shared/VideoBanner'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import {
  BarraCompraMobile,
  EspecificacoesTecnicas,
  GaleriaCompleta,
  IncluidoNoProjeto,
  PerfilProjeto,
  PerguntasFrequentes,
  ProjetoHero,
  ProjetosRelacionados,
  SobreProjeto,
  checkoutSeguro,
  exibirPreco,
  hrefProjeto,
  listarProjetosRelacionados,
  type ProjetoDetalhe,
} from '@/features/projetos'
import { siteConfig, siteUrl } from '@/features/site'

/** Página pública de um projeto. A ordem das seções segue a referência visual aprovada. */
export async function ProjetoView({ projeto }: { projeto: ProjetoDetalhe }) {
  const relacionados = await listarProjetosRelacionados(projeto.slug)
  const preco = exibirPreco(projeto)
  const checkoutUrl = checkoutSeguro(projeto.checkoutUrl)

  return (
    <div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: projeto.titulo,
          description: `${projeto.resumo} ${projeto.sobre.descricao}`,
          image: projeto.galeria.slice(0, 5).map((item) => item.imagem.src),
          sku: projeto.id,
          category: 'Projeto arquitetônico',
          brand: { '@type': 'Brand', name: siteConfig.nome },
          offers: {
            '@type': 'Offer',
            url: `${siteUrl}${hrefProjeto(projeto)}`,
            priceCurrency: 'BRL',
            price: (projeto.precoCentavos / 100).toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      <div className="mx-auto max-w-content px-4 pt-2">
        <Breadcrumb
          items={[
            { label: 'Início', href: '/' },
            { label: 'Projetos', href: '/projetos' },
            { label: projeto.categoriaRotulo, href: '/projetos' },
            { label: projeto.titulo },
          ]}
        />
      </div>

      <ProjetoHero projeto={projeto} preco={preco} checkoutUrl={checkoutUrl} />
      <EspecificacoesTecnicas projeto={projeto} />
      <SobreProjeto sobre={projeto.sobre} imagem={projeto.imagem} />
      <IncluidoNoProjeto itens={projeto.itensInclusos} />
      <GaleriaCompleta itens={projeto.galeria} />
      {projeto.video && (
        <VideoBanner
          title="Conheça o projeto em detalhes"
          description="Assista ao vídeo e veja todos os ambientes, medidas e diferenciais deste projeto."
          image={projeto.imagem}
          videoSrc={projeto.video.src}
        />
      )}
      <PerfilProjeto perfil={projeto.perfil} />
      <PerguntasFrequentes />

      {checkoutUrl && (
        <CTABanner
          variant="card"
          eyebrow="Pronto para começar?"
          title="Gostou deste projeto?"
          description="Tenha acesso aos arquivos e comece a transformar sua ideia em realidade."
          image={projeto.imagem}
          price={{
            value: preco.atual,
            original: preco.original,
            discount: preco.desconto,
            note: 'Pagamento facilitado',
          }}
          action={{ label: 'Comprar projeto', href: checkoutUrl, iconLeft: 'cart' }}
        />
      )}

      <ProjetosRelacionados projetos={relacionados} />

      {/* Precisa ser o último item: `sticky` para no fim da página e não cobre o rodapé. */}
      <BarraCompraMobile preco={preco} checkoutUrl={checkoutUrl} />
    </div>
  )
}
