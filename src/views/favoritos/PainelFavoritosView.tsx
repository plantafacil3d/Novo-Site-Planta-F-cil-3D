import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/navigation/Pagination'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { entrarComGoogle } from '@/features/conta'
import { GradeFavoritos, sairDoUsuario, type CardFavorito } from '@/features/favoritos'
import {
  especificacoesDoCard,
  exibirPreco,
  formatarArea,
  hrefProjeto,
  simNao,
  totalDePaginas,
  ProjetosDestaque,
  type Projeto,
} from '@/features/projetos'
import type { Pagina } from '@/types/pagina'

type PainelFavoritosViewProps = {
  usuario: { nome: string; email: string } | null
  favoritos: Pagina<Projeto>
  sugestoes: Projeto[]
}

/** Linhas da tabela de comparação: mesma ordem para todo card, montadas aqui (servidor). */
function montarComparacao(projeto: Projeto): CardFavorito['comparacao'] {
  return [
    { rotulo: 'Preço', valor: exibirPreco(projeto).atual },
    { rotulo: 'Área construída', valor: formatarArea(projeto.areaConstruidaM2) },
    { rotulo: 'Quartos', valor: String(projeto.quartos + projeto.suites + projeto.suiteMaster) },
    { rotulo: 'Suítes', valor: String(projeto.suites + projeto.suiteMaster) },
    { rotulo: 'Banheiros', valor: String(projeto.banheiros + projeto.lavabo) },
    { rotulo: 'Vagas de garagem', valor: String(projeto.vagas) },
    { rotulo: 'Pavimentos', valor: String(projeto.pavimentos) },
    { rotulo: 'Piscina', valor: simNao(projeto.piscina) },
    { rotulo: 'Área gourmet', valor: simNao(projeto.areaGourmet) },
    { rotulo: 'Estilo', valor: projeto.estilo ?? '—' },
  ]
}

/** Projeto favoritado pronto para `GradeFavoritos` (client): tudo formatado aqui, no servidor. */
function montarCard(projeto: Projeto): CardFavorito {
  const preco = exibirPreco(projeto)
  return {
    id: projeto.id,
    titulo: projeto.titulo,
    href: hrefProjeto(projeto),
    code: projeto.codigoYoutube,
    projectCode: projeto.codigo,
    image: projeto.imagem,
    specs: especificacoesDoCard(projeto),
    price: preco.atual,
    priceOriginal: preco.original,
    priceDiscount: preco.desconto,
    entrarComGoogleAction: entrarComGoogle.bind(null, projeto.id),
    comparacao: montarComparacao(projeto),
  }
}

/** Painel do cliente: quem é, a grade de favoritos (com comparação) e sugestões. */
export function PainelFavoritosView({ usuario, favoritos, sugestoes }: PainelFavoritosViewProps) {
  if (!usuario) {
    return (
      <div className="mx-auto max-w-content px-4 py-12">
        <EmptyState
          icon="heart"
          title="Entre para ver seus favoritos"
          description="Faça login com sua conta Google para guardar e comparar os projetos que você mais gostou. É só clicar no coração de qualquer projeto."
          action={{ label: 'Ver vitrine', href: '/' }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 py-8">
      <header className="mx-auto flex w-full max-w-content flex-wrap items-center justify-between gap-4 border-b border-border px-4 pb-6">
        <div>
          <h1 className="text-2xl">Meus favoritos</h1>
          <p className="text-fg-muted">
            {usuario.nome} · {usuario.email}
          </p>
        </div>
        <form action={sairDoUsuario}>
          <Button type="submit" variant="secondary" iconLeft="log-out">
            Sair
          </Button>
        </form>
      </header>

      <div className="mx-auto w-full max-w-content px-4">
        {favoritos.total === 0 ? (
          <EmptyState
            icon="heart"
            title="Você ainda não favoritou nenhum projeto"
            description="Clique no coração de um projeto para guardá-lo aqui e comparar com outros depois."
            action={{ label: 'Ver vitrine', href: '/' }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <GradeFavoritos cards={favoritos.itens.map(montarCard)} />
            <Pagination
              pagina={favoritos.pagina}
              totalPaginas={totalDePaginas(favoritos.total, favoritos.porPagina)}
              hrefPagina={(pagina) => `/favoritos?pagina=${pagina}`}
            />
          </div>
        )}
      </div>

      {sugestoes.length > 0 && (
        <Section
          title="Outros projetos que você pode gostar"
          subtitle="Sugestões entre os projetos em destaque que você ainda não favoritou."
        >
          <ProjetosDestaque projetos={sugestoes} />
        </Section>
      )}
    </div>
  )
}
