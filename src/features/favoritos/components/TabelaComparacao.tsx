import type { CardFavorito } from '../types'

/**
 * Compara favoritos selecionados lado a lado. Só apresentação: os valores já vêm formatados
 * (`CardFavorito.comparacao`, montado em `PainelFavoritosView`) — nunca importa `features/projetos`
 * aqui, para este componente continuar seguro de usar dentro de `GradeFavoritos` (client).
 */
export function TabelaComparacao({ itens }: { itens: Pick<CardFavorito, 'id' | 'titulo' | 'comparacao'>[] }) {
  const rotulos = itens[0]?.comparacao.map((item) => item.rotulo) ?? []

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <caption className="sr-only">Comparação entre os projetos favoritados selecionados</caption>
        <thead>
          <tr className="border-b border-border bg-subtle">
            <th scope="col" className="p-3 text-left font-medium text-fg-muted">
              Característica
            </th>
            {itens.map((item) => (
              <th key={item.id} scope="col" className="p-3 text-left font-heading font-semibold">
                {item.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rotulos.map((rotulo, indice) => (
            <tr key={rotulo} className="border-b border-border last:border-0">
              <th scope="row" className="p-3 text-left font-medium text-fg-muted">
                {rotulo}
              </th>
              {itens.map((item) => (
                <td key={item.id} className="p-3">
                  {item.comparacao[indice]?.valor}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
