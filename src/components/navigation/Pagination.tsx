import { Button } from '../ui/Button'

type PaginationProps = {
  /** Página atual, começando em 1. */
  pagina: number
  totalPaginas: number
  /** Monta o endereço de uma página (a paginação vive na URL, não em estado). */
  hrefPagina: (pagina: number) => string
}

/** Páginas a mostrar: primeira, última e as vizinhas da atual; `null` é o "…" entre saltos. */
function paginasVisiveis(pagina: number, total: number): (number | null)[] {
  const escolhidas = [...new Set([1, pagina - 1, pagina, pagina + 1, total])]
    .filter((numero) => numero >= 1 && numero <= total)
    .sort((a, b) => a - b)

  const itens: (number | null)[] = []
  escolhidas.forEach((numero, indice) => {
    const anterior = escolhidas[indice - 1]
    if (anterior !== undefined && numero - anterior === 2) itens.push(anterior + 1)
    else if (anterior !== undefined && numero - anterior > 2) itens.push(null)
    itens.push(numero)
  })
  return itens
}

/** "Anterior 1 … 4 5 6 … 40 Próxima". Cada botão é um link, então funciona sem JavaScript. */
export function Pagination({ pagina, totalPaginas, hrefPagina }: PaginationProps) {
  if (totalPaginas <= 1) return null

  return (
    <nav aria-label="Paginação">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {pagina > 1 ? (
            <Button href={hrefPagina(pagina - 1)} variant="secondary" iconLeft="chevron-left">
              Anterior
            </Button>
          ) : (
            <Button variant="secondary" iconLeft="chevron-left" disabled>
              Anterior
            </Button>
          )}
        </li>

        {paginasVisiveis(pagina, totalPaginas).map((numero, indice) => (
          <li key={numero ?? `intervalo-${indice}`}>
            {numero === null ? (
              <span aria-hidden="true" className="px-1 text-fg-muted">
                …
              </span>
            ) : (
              <Button
                href={hrefPagina(numero)}
                variant={numero === pagina ? 'primary' : 'secondary'}
                aria-label={`Página ${numero}`}
                aria-current={numero === pagina ? 'page' : undefined}
                className="min-w-11 px-3"
              >
                {numero}
              </Button>
            )}
          </li>
        ))}

        <li>
          {pagina < totalPaginas ? (
            <Button href={hrefPagina(pagina + 1)} variant="secondary" iconRight="chevron-right">
              Próxima
            </Button>
          ) : (
            <Button variant="secondary" iconRight="chevron-right" disabled>
              Próxima
            </Button>
          )}
        </li>
      </ul>
    </nav>
  )
}
