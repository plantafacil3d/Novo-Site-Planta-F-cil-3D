// Vocabulário do cadastro: valores e textos exibidos. Só o cadastro usa estas listas; o site público
// tem as suas (features/projetos/catalogo.ts). Unificar as duas fica para a etapa do banco.

import type { EtapaId } from './types'

export const categoriasDoCadastro = [
  { valor: 'casas-terreas', rotulo: 'Casas Térreas' },
  { valor: 'sobrados', rotulo: 'Sobrados' },
  { valor: 'mansoes-alto-padrao', rotulo: 'Mansões / Alto Padrão' },
  { valor: 'casas-pequenas', rotulo: 'Casas Pequenas' },
  { valor: 'casas-geminadas', rotulo: 'Casas Geminadas' },
  { valor: 'casas-de-campo', rotulo: 'Casas de Campo' },
  { valor: 'casas-de-praia', rotulo: 'Casas de Praia' },
  { valor: 'projetos-de-fachada', rotulo: 'Projetos de Fachada' },
  { valor: 'kitnets', rotulo: 'Kitnets' },
  { valor: 'lofts', rotulo: 'Lofts' },
  { valor: 'casas-modulares', rotulo: 'Casas Modulares' },
  { valor: 'comercial', rotulo: 'Comercial' },
  { valor: 'chale', rotulo: 'Chalé' },
  { valor: 'loja', rotulo: 'Loja' },
  { valor: 'outros', rotulo: 'Outros' },
] as const

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

/** As 7 abas, na ordem do menu. `opcional`: não bloqueia o "Salvar". */
export const etapasDoCadastro: readonly { id: EtapaId; rotulo: string; opcional: boolean }[] = [
  { id: 'informacoes', rotulo: 'Informações Gerais', opcional: false },
  { id: 'imagens', rotulo: 'Imagens', opcional: false },
  { id: 'caracteristicas', rotulo: 'Características', opcional: false },
  { id: 'itens', rotulo: 'Itens Incluídos', opcional: false },
  { id: 'exemplos', rotulo: 'Arquivos de Exemplo', opcional: true },
  { id: 'complementares', rotulo: 'Complementares', opcional: true },
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
