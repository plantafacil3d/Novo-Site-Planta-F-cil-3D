// Vocabulário do cadastro: valores e textos exibidos. É a fonte única também para o site público
// (features/projetos importa `categoriasDoCadastro`/`estilosDoCadastro` daqui), para categoria e
// estilo nunca ficarem com listas diferentes entre o cadastro e o filtro público.

import type { IconName } from '@/components/ui/Icon'
import type { TomDoIconeEmBloco } from '@/components/ui/IconeEmBloco'

import type { EtapaId } from './types'

/** `arquivo`: como a categoria entra no nome das imagens (singular, sem acento). `singular`: o mesmo, escrito
 *  normalmente, para o texto alternativo. */
export const categoriasDoCadastro = [
  {
    valor: 'casas-terreas',
    rotulo: 'Casas Térreas',
    arquivo: 'casa-terrea',
    singular: 'Casa térrea',
  },
  { valor: 'sobrados', rotulo: 'Sobrados', arquivo: 'sobrado', singular: 'Sobrado' },
  {
    valor: 'mansoes-alto-padrao',
    rotulo: 'Mansões / Alto Padrão',
    arquivo: 'mansao',
    singular: 'Mansão',
  },
  {
    valor: 'casas-pequenas',
    rotulo: 'Casas Pequenas',
    arquivo: 'casa-pequena',
    singular: 'Casa pequena',
  },
  {
    valor: 'casas-geminadas',
    rotulo: 'Casas Geminadas',
    arquivo: 'casa-geminada',
    singular: 'Casa geminada',
  },
  {
    valor: 'casas-de-campo',
    rotulo: 'Casas de Campo',
    arquivo: 'casa-de-campo',
    singular: 'Casa de campo',
  },
  {
    valor: 'casas-de-praia',
    rotulo: 'Casas de Praia',
    arquivo: 'casa-de-praia',
    singular: 'Casa de praia',
  },
  {
    valor: 'projetos-de-fachada',
    rotulo: 'Projetos de Fachada',
    arquivo: 'fachada',
    singular: 'Fachada',
  },
  { valor: 'kitnets', rotulo: 'Kitnets', arquivo: 'kitnet', singular: 'Kitnet' },
  { valor: 'lofts', rotulo: 'Lofts', arquivo: 'loft', singular: 'Loft' },
  {
    valor: 'casas-modulares',
    rotulo: 'Casas Modulares',
    arquivo: 'casa-modular',
    singular: 'Casa modular',
  },
  { valor: 'comercial', rotulo: 'Comercial', arquivo: 'comercial', singular: 'Comercial' },
  { valor: 'chale', rotulo: 'Chalé', arquivo: 'chale', singular: 'Chalé' },
  { valor: 'loja', rotulo: 'Loja', arquivo: 'loja', singular: 'Loja' },
  { valor: 'outros', rotulo: 'Outros', arquivo: 'projeto', singular: 'Projeto' },
] as const

export type CategoriaDoCadastro = (typeof categoriasDoCadastro)[number]['valor']

export const estilosDoCadastro = [
  { valor: 'moderno', rotulo: 'Moderno' },
  { valor: 'contemporaneo', rotulo: 'Contemporâneo' },
  { valor: 'minimalista', rotulo: 'Minimalista' },
  { valor: 'industrial', rotulo: 'Industrial' },
  { valor: 'escandinavo', rotulo: 'Escandinavo' },
  { valor: 'rustico', rotulo: 'Rústico' },
  { valor: 'japandi', rotulo: 'Japandi' },
  { valor: 'biofilico', rotulo: 'Biofílico' },
  { valor: 'classico', rotulo: 'Clássico' },
  { valor: 'luxo-contemporaneo', rotulo: 'Luxo Contemporâneo' },
  { valor: 'tropical', rotulo: 'Tropical' },
  { valor: 'mid-century-modern', rotulo: 'Mid-Century Modern' },
  { valor: 'ecletico', rotulo: 'Eclético' },
  { valor: 'farmhouse', rotulo: 'Farmhouse' },
  { valor: 'loft', rotulo: 'Loft' },
  { valor: 'neoclassico', rotulo: 'Neoclássico' },
  { valor: 'wabi-sabi', rotulo: 'Wabi-Sabi' },
  { valor: 'boho', rotulo: 'Boho (Boêmio)' },
  { valor: 'coastal', rotulo: 'Coastal (Litorâneo)' },
  { valor: 'mediterraneo', rotulo: 'Mediterrâneo' },
  { valor: 'zen', rotulo: 'Zen' },
  { valor: 'vintage', rotulo: 'Vintage' },
  { valor: 'retro', rotulo: 'Retrô' },
  { valor: 'glamour', rotulo: 'Glamour' },
  { valor: 'provencal', rotulo: 'Provençal' },
  { valor: 'urbano', rotulo: 'Urbano' },
  { valor: 'japones', rotulo: 'Japonês' },
  { valor: 'art-deco', rotulo: 'Art Déco' },
  { valor: 'maximalista', rotulo: 'Maximalista' },
  { valor: 'romantico', rotulo: 'Romântico' },
  { valor: 'outros', rotulo: 'Outros' },
] as const

export type EstiloDoCadastro = (typeof estilosDoCadastro)[number]['valor']

/** Opções de "Perfil do terreno" (aba 1). `descricao` vira dica (tooltip) na opção. */
export const perfisDeTerrenoDoCadastro = [
  { valor: 'Plano', rotulo: 'Plano', descricao: 'Terreno sem inclinação perceptível.' },
  { valor: 'Aclive', rotulo: 'Aclive', descricao: 'Terreno sobe a partir da rua.' },
  { valor: 'Declive', rotulo: 'Declive', descricao: 'Terreno desce a partir da rua.' },
  {
    valor: 'Aclive acentuado',
    rotulo: 'Aclive acentuado',
    descricao: 'Subida forte: pode exigir fundação e acesso diferenciados.',
  },
  {
    valor: 'Declive acentuado',
    rotulo: 'Declive acentuado',
    descricao: 'Descida forte: pode exigir fundação e acesso diferenciados.',
  },
  {
    valor: 'Irregular',
    rotulo: 'Irregular',
    descricao: 'Relevo variado, sem um padrão único de subida ou descida.',
  },
  { valor: 'Outros', rotulo: 'Outros', descricao: 'Não se encaixa nas opções acima.' },
] as const

/** Faixa aceita para "Família indicada" (aba 1): capacidade de pessoas, vira "Até N pessoas". */
export const FAMILIA_CAPACIDADE = { min: 1, max: 20 } as const

/** Faixa "N clientes já compraram este projeto" (aba Marketing): quantidade e nota aceitas. A nota
 *  tem uma casa decimal (ex.: 4,9). Os mesmos limites estão no banco (migration `marketing_prova_social`). */
export const PROVA_SOCIAL = {
  clientes: { min: 1, max: 999999 },
  nota: { min: 1, max: 5 },
} as const

/** Situação da obra de um cliente (aba Marketing, "Obras de clientes"): valor gravado e texto do selo
 *  na foto. Fonte única também para a página pública, que mostra o `rotulo`. */
export const etapasDaObra = [
  { valor: 'em_obra', rotulo: 'Em obra' },
  { valor: 'acabamento', rotulo: 'Acabamento' },
  { valor: 'concluida', rotulo: 'Concluída' },
] as const

export type EtapaDaObra = (typeof etapasDaObra)[number]['valor']

/** Texto do selo de uma situação gravada; `null` para vazio ou valor desconhecido. */
export const rotuloDaEtapaDaObra = (valor: unknown): string | null =>
  etapasDaObra.find((etapa) => etapa.valor === valor)?.rotulo ?? null

/**
 * Ícones que o admin escolhe para cada projeto complementar (aba Complementares): o valor gravado, o
 * nome que o cadastro mostra, o desenho e a cor do quadrado. Fonte única também para a página
 * pública. Acrescentar um ícone aqui não precisa de migration (o banco guarda só o `valor`).
 */
export const iconesDeComplementar = [
  { valor: 'eletrico', rotulo: 'Elétrico', icone: 'zap', tom: 'amber' },
  { valor: 'hidrossanitario', rotulo: 'Hidrossanitário', icone: 'droplet', tom: 'blue' },
  { valor: 'estrutural', rotulo: 'Estrutural', icone: 'landmark', tom: 'slate' },
  { valor: 'cobertura', rotulo: 'Cobertura', icone: 'house', tom: 'red' },
  { valor: 'modelo-3d', rotulo: 'Modelo 3D e renders', icone: 'box', tom: 'violet' },
  { valor: 'luminotecnico', rotulo: 'Luminotécnico', icone: 'lightbulb', tom: 'orange' },
  { valor: 'paisagismo', rotulo: 'Paisagismo', icone: 'trees', tom: 'green' },
  { valor: 'interiores', rotulo: 'Interiores', icone: 'sofa', tom: 'pink' },
  { valor: 'climatizacao', rotulo: 'Climatização', icone: 'snowflake', tom: 'cyan' },
  { valor: 'gas', rotulo: 'Gás', icone: 'flame', tom: 'orange' },
  { valor: 'orcamento', rotulo: 'Orçamento', icone: 'calculator', tom: 'teal' },
  { valor: 'documento', rotulo: 'Documento', icone: 'file-text', tom: 'slate' },
] as const satisfies readonly {
  valor: string
  rotulo: string
  icone: IconName
  tom: TomDoIconeEmBloco
}[]

export type IconeDeComplementar = (typeof iconesDeComplementar)[number]

/** Ícone de um complementar pelo valor gravado; vazio ou desconhecido = documento (o padrão). */
export function iconeDoComplementar(valor: unknown): IconeDeComplementar {
  return (
    iconesDeComplementar.find((item) => item.valor === valor) ??
    (iconesDeComplementar[iconesDeComplementar.length - 1] as IconeDeComplementar)
  )
}

/** As 10 abas, na ordem do menu. `opcional`: não bloqueia o "Salvar". */
export const etapasDoCadastro: readonly { id: EtapaId; rotulo: string; opcional: boolean }[] = [
  { id: 'informacoes', rotulo: 'Informações Gerais', opcional: false },
  { id: 'imagens', rotulo: 'Imagens', opcional: false },
  { id: 'plantaHumanizada', rotulo: 'Planta Humanizada', opcional: true },
  { id: 'caracteristicas', rotulo: 'Características', opcional: false },
  { id: 'itens', rotulo: 'Itens Incluídos', opcional: false },
  { id: 'exemplos', rotulo: 'Arquivos de Exemplo', opcional: true },
  { id: 'previas', rotulo: 'Prévias do Projeto', opcional: true },
  { id: 'marketing', rotulo: 'Marketing', opcional: true },
  { id: 'complementares', rotulo: 'Complementares', opcional: true },
  { id: 'variacoes', rotulo: 'Variações', opcional: true },
  { id: 'decoracao', rotulo: 'Produtos', opcional: true },
  { id: 'entrega', rotulo: 'Entrega do Projeto', opcional: false },
]

/** Campos numéricos da aba Características: rótulo, se aceita decimais e a faixa permitida. */
export const camposDeCaracteristicas = [
  { chave: 'larguraTerreno', rotulo: 'Largura do terreno (m)', decimal: true, min: 1, max: 1000 },
  {
    chave: 'profundidadeTerreno',
    rotulo: 'Profundidade do terreno (m)',
    decimal: true,
    min: 1,
    max: 1000,
  },
  { chave: 'areaConstruida', rotulo: 'Área construída (m²)', decimal: false, min: 1, max: 5000 },
  { chave: 'quartos', rotulo: 'Quartos', decimal: false, min: 0, max: 20 },
  { chave: 'suites', rotulo: 'Suítes', decimal: false, min: 0, max: 20 },
  { chave: 'suiteMaster', rotulo: 'Suíte master', decimal: false, min: 0, max: 20 },
  { chave: 'banheiros', rotulo: 'Banheiros', decimal: false, min: 0, max: 30 },
  { chave: 'lavabo', rotulo: 'Lavabo', decimal: false, min: 0, max: 10 },
  { chave: 'vagas', rotulo: 'Vagas de garagem', decimal: false, min: 0, max: 20 },
  { chave: 'pavimentos', rotulo: 'Pavimentos', decimal: false, min: 1, max: 5 },
] as const

export type ChaveDeCaracteristica = (typeof camposDeCaracteristicas)[number]['chave']
