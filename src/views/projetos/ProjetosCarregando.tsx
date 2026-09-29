import { ListagemEsqueleto, ProjetosCasca } from './ListagemEsqueleto'

/** Mostrada na hora do clique em "Projetos", enquanto o servidor monta a página. Mesma casca e
 *  mesmo esqueleto que `ProjetosView` usa por dentro, para não trocar de layout duas vezes. */
export function ProjetosCarregando() {
  return (
    <ProjetosCasca>
      <ListagemEsqueleto />
    </ProjetosCasca>
  )
}
