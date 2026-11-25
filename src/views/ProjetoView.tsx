import { Suspense } from 'react'

import { CTABanner } from '@/components/shared/CTABanner'
import { JsonLd } from '@/components/shared/JsonLd'
import type { DadosDeCompartilhamento } from '@/components/shared/ShareButton'
import { VideoBanner } from '@/components/shared/VideoBanner'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import {
  BarraCompraMobile,
  ComplementaresDoProjeto,
  DepoimentosDeClientes,
  EspecificacoesTecnicas,
  GaleriaCompleta,
  GaleriaPlantaHumanizada,
  GlossarioEspecificacoes,
  IncluidoNoProjeto,
  ObrasDeClientes,
  PerfilProjeto,
  PerguntasFrequentes,
  PreviasDoProjeto,
  ProjetoHero,
  ProjetosRelacionados,
  SobreProjeto,
  VariacoesDoProjeto,
  checkoutSeguro,
  exibirPreco,
  hrefProjeto,
  listarProjetosRelacionados,
  listarVariacoesDoProjeto,
  mensagemDuvidaProjeto,
  type ProjetoDetalhe,
} from '@/features/projetos'
import { DecoreComoNoProjeto, listarProdutosDoProjeto } from '@/features/produtos'
import { siteConfig, siteUrl, urlWhatsapp } from '@/features/site'

/**
 * Seções secundárias: se o banco falhar ao buscá-las, a página sai sem elas (lista vazia = a seção
 * some) em vez de a página inteira dar erro. O erro fica no log do servidor, e a seção volta na
 * próxima vez que a página for refeita (ao salvar um projeto ou no prazo do cache).
 */
async function listaOuVazia<T>(secao: string, buscar: () => Promise<T[]>): Promise<T[]> {
  try {
    return await buscar()
  } catch (erro) {
    console.error(`Seção "${secao}" ficou de fora da página do projeto:`, erro)
    return []
  }
}

/** Seção à parte: carrega depois do resto da página, sem travar o carregamento principal nela. */
async function SecaoRelacionados({ projeto }: { projeto: ProjetoDetalhe }) {
  const relacionados = await listaOuVazia('Projetos relacionados', () =>
    listarProjetosRelacionados(projeto),
  )
  return <ProjetosRelacionados projetos={relacionados} />
}

/** "Mesmo projeto, outros terrenos": também à parte, como os relacionados. */
async function SecaoVariacoes({ projeto }: { projeto: ProjetoDetalhe }) {
  const variacoes = await listaOuVazia('Mesmo projeto, outros terrenos', () =>
    listarVariacoesDoProjeto(projeto),
  )
  return <VariacoesDoProjeto projeto={projeto} variacoes={variacoes} />
}

/** "Decore como no projeto": produtos ligados no cadastro (aba Produtos), também à parte. */
async function SecaoDecoracao({ projeto }: { projeto: ProjetoDetalhe }) {
  const produtos = await listaOuVazia('Decore como no projeto', () =>
    listarProdutosDoProjeto(projeto.id),
  )
  return (
    <DecoreComoNoProjeto
      projetoId={projeto.id}
      codigo={projeto.codigoYoutube ?? projeto.codigo}
      produtos={produtos}
    />
  )
}

/** Página pública de um projeto. A ordem das seções segue a referência visual aprovada. */
export async function ProjetoView({ projeto }: { projeto: ProjetoDetalhe }) {
  const preco = exibirPreco(projeto)
  const checkoutUrl = checkoutSeguro(projeto.checkoutUrl)
  const urlDoProjeto = `${siteUrl}${hrefProjeto(projeto)}`
  const linkWhatsapp = urlWhatsapp(mensagemDuvidaProjeto(projeto.titulo, urlDoProjeto))
  // Mesmo link em todos os botões de compartilhar da página (topo e visualizadores em tela cheia).
  const compartilhar: DadosDeCompartilhamento = {
    url: urlDoProjeto,
    title: projeto.titulo,
    label: `Compartilhar ${projeto.titulo}`,
  }

  return (
    <div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: projeto.titulo,
          description: `${projeto.resumo} ${projeto.sobre.descricao.replace(/\*/g, '')}`,
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

      <ProjetoHero
        projeto={projeto}
        preco={preco}
        checkoutUrl={checkoutUrl}
        compartilhar={compartilhar}
      />
      <EspecificacoesTecnicas projeto={projeto} />
      <GlossarioEspecificacoes projeto={projeto} />
      <GaleriaPlantaHumanizada pavimentos={projeto.plantaHumanizada} compartilhar={compartilhar} />
      <SobreProjeto sobre={projeto.sobre} imagem={projeto.imagem} />
      <IncluidoNoProjeto itens={projeto.itensInclusos} />
      <PreviasDoProjeto previas={projeto.previas} compartilhar={compartilhar} />
      <DepoimentosDeClientes
        prints={projeto.depoimentos.prints}
        comentarios={projeto.depoimentos.comentarios}
        compartilhar={compartilhar}
      />
      <ObrasDeClientes obras={projeto.obras} compartilhar={compartilhar} />
      <ComplementaresDoProjeto complementares={projeto.complementares} />
      <GaleriaCompleta itens={projeto.galeria} compartilhar={compartilhar} />
      {projeto.video && (
        <VideoBanner
          title="Conheça o projeto em detalhes"
          description="Assista ao vídeo e veja todos os ambientes, medidas e diferenciais deste projeto."
          image={projeto.imagem}
          videoSrc={projeto.video.src}
        />
      )}
      <PerfilProjeto perfil={projeto.perfil} />
      <PerguntasFrequentes projeto={projeto} linkWhatsapp={linkWhatsapp} />

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

      <Suspense fallback={null}>
        <SecaoVariacoes projeto={projeto} />
      </Suspense>

      <Suspense fallback={null}>
        <SecaoDecoracao projeto={projeto} />
      </Suspense>

      <Suspense fallback={null}>
        <SecaoRelacionados projeto={projeto} />
      </Suspense>

      {/* Precisa ser o último item: `sticky` para no fim da página e não cobre o rodapé. */}
      <BarraCompraMobile preco={preco} checkoutUrl={checkoutUrl} />
    </div>
  )
}
