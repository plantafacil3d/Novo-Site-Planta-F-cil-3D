import {
  CHAVE_LOCALSTORAGE_IDIOMA,
  IDIOMA_ORIGINAL,
  IDIOMA_RESERVA,
  IDIOMAS_SUPORTADOS,
  type LanguageCode,
} from './config'

/** Robôs de busca (e navegadores automatizados) sempre veem o original, para o Google indexar em português. */
const PADRAO_ROBO = /bot|crawl|spider|slurp|googlebot|bingpreview|lighthouse/i

function ehCodigoSuportado(valor: string | null): valor is LanguageCode {
  return IDIOMAS_SUPORTADOS.some((codigo) => codigo === valor)
}

/** `pt-PT` → `pt`, `en-GB` → `en`, `zh-TW`/`zh-Hans` → `zh-CN`; `null` se o site não oferece. */
function paraIdiomaSuportado(tag: string): LanguageCode | null {
  const base = tag.toLowerCase().split('-')[0] ?? ''
  if (base === 'zh') return 'zh-CN'
  return ehCodigoSuportado(base) ? base : null
}

/**
 * Idioma que o navegador da pessoa prefere, entre os que o site oferece. Percorre a lista de
 * preferências em ordem e fica com o primeiro idioma oferecido; se nenhum for, usa o inglês.
 */
export function idiomaDoNavegador(): LanguageCode {
  if (PADRAO_ROBO.test(navigator.userAgent) || navigator.webdriver) return IDIOMA_ORIGINAL
  const preferencias = navigator.languages?.length ? navigator.languages : [navigator.language]
  const tags = preferencias.filter(Boolean)
  if (tags.length === 0) return IDIOMA_ORIGINAL
  for (const tag of tags) {
    const idioma = paraIdiomaSuportado(tag)
    if (idioma) return idioma
  }
  return IDIOMA_RESERVA
}

/**
 * Idioma ativo da interface: a escolha manual salva (inclusive `pt`) sempre vence; sem escolha,
 * vale o idioma do navegador. Não grava nada: só o seletor grava, assim mudar o idioma do
 * navegador reflete na visita seguinte. Só roda no navegador (usa localStorage e `navigator`).
 */
export function idiomaPreferido(): LanguageCode {
  const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE_IDIOMA)
  return ehCodigoSuportado(salvo) ? salvo : idiomaDoNavegador()
}
