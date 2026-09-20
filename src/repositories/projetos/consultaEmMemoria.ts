import type {
  CategoriaFiltravel,
  ConsultaProjetos,
  FiltrosProjetos,
  OrdenacaoProjetos,
  Projeto,
} from '@/features/projetos'
import type { Pagina } from '@/types/pagina'

// Faz em memória o que o banco fará: filtrar, ordenar e devolver só uma página. Quando existir o
// adapter Supabase, cada filtro daqui vira uma condição `where` e este arquivo sai.

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/** Significado de cada categoria da home (os cartões "Explore por categoria"). */
const pertenceACategoria: Record<CategoriaFiltravel, (projeto: Projeto) => boolean> = {
  sobrados: (projeto) => projeto.tipo === 'sobrado',
  'casas-terreas': (projeto) => projeto.tipo === 'casa-terrea',
  'casas-pequenas': (projeto) => projeto.areaConstruidaM2 <= 100,
  'casas-de-campo': (projeto) => projeto.tipo === 'casa-de-campo',
  modernas: (projeto) => projeto.estilo === 'moderno',
  'com-1-suite': (projeto) => projeto.suites === 1,
  'com-2-suites': (projeto) => projeto.suites === 2,
  'com-piscina': (projeto) => projeto.piscina,
}

function atende(projeto: Projeto, filtros: FiltrosProjetos): boolean {
  if (filtros.busca) {
    // O código também é buscado sem o hífen ("pf012" acha "PF-012").
    const alvo = normalizar(
      `${projeto.codigo} ${projeto.codigo.replace('-', '')} ${projeto.titulo}`,
    )
    const palavras = normalizar(filtros.busca).split(/\s+/).filter(Boolean)
    if (!palavras.every((palavra) => alvo.includes(palavra))) return false
  }

  if (filtros.categoria && !pertenceACategoria[filtros.categoria](projeto)) return false
  if (filtros.tipo && projeto.tipo !== filtros.tipo) return false
  if (filtros.estilo && projeto.estilo !== filtros.estilo) return false

  const totalDeQuartos = projeto.suites + projeto.quartos
  if (filtros.quartosMin !== undefined && totalDeQuartos < filtros.quartosMin) return false
  if (filtros.suitesMin !== undefined && projeto.suites < filtros.suitesMin) return false
  if (filtros.vagasMin !== undefined && projeto.vagas < filtros.vagasMin) return false

  if (filtros.areaMinM2 !== undefined && projeto.areaConstruidaM2 < filtros.areaMinM2) return false
  if (filtros.areaMaxM2 !== undefined && projeto.areaConstruidaM2 > filtros.areaMaxM2) return false

  // O projeto precisa caber no terreno informado.
  if (filtros.terrenoLarguraM !== undefined && projeto.larguraM > filtros.terrenoLarguraM) {
    return false
  }
  if (
    filtros.terrenoProfundidadeM !== undefined &&
    projeto.profundidadeM > filtros.terrenoProfundidadeM
  ) {
    return false
  }

  if (filtros.piscina && !projeto.piscina) return false
  if (filtros.areaGourmet && !projeto.areaGourmet) return false
  return true
}

const pesoDoSelo = (projeto: Projeto) =>
  projeto.selo === 'Mais vendido' ? 0 : projeto.selo === 'Lançamento' ? 1 : 2

const comparadores: Record<OrdenacaoProjetos, (a: Projeto, b: Projeto) => number> = {
  relevancia: (a, b) => pesoDoSelo(a) - pesoDoSelo(b),
  'menor-preco': (a, b) => a.precoCentavos - b.precoCentavos,
  'maior-preco': (a, b) => b.precoCentavos - a.precoCentavos,
  'maior-area': (a, b) => b.areaConstruidaM2 - a.areaConstruidaM2,
  'menor-area': (a, b) => a.areaConstruidaM2 - b.areaConstruidaM2,
}

export function consultarEmMemoria(
  catalogo: readonly Projeto[],
  { filtros, ordenacao, pagina, porPagina }: ConsultaProjetos,
): Pagina<Projeto> {
  const comparar = comparadores[ordenacao]
  // Desempate pelo código: sem ele, itens iguais podem trocar de lugar entre uma página e outra.
  const encontrados = catalogo
    .filter((projeto) => atende(projeto, filtros))
    .sort((a, b) => comparar(a, b) || a.codigo.localeCompare(b.codigo))

  const inicio = (pagina - 1) * porPagina
  return {
    itens: encontrados.slice(inicio, inicio + porPagina),
    total: encontrados.length,
    pagina,
    porPagina,
  }
}
