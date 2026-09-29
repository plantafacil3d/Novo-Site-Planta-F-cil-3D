import { IDIOMA_ORIGINAL, type LanguageCode } from './config'

const MAX_TENTATIVAS_INICIAIS = 25
const MAX_TENTATIVAS_NA_ROTA = 8
const INTERVALO_INICIAL_MS = 400
const INTERVALO_NA_ROTA_MS = 300

/** Último idioma pedido; as repetições de um pedido antigo se cancelam sozinhas. */
let pedidoAtual: LanguageCode | null = null

function buscarCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo')
}

/** O `<select>` do Google pode existir antes de receber a lista de idiomas (comum em celular lento). */
function comboTemIdioma(combo: HTMLSelectElement, lang: LanguageCode): boolean {
  return Array.from(combo.options).some((opcao) => opcao.value === lang)
}

function selecionarNoCombo(combo: HTMLSelectElement, lang: LanguageCode) {
  combo.value = lang
  combo.dispatchEvent(new Event('change', { bubbles: true }))
}

/** O Google marca o `<html>` com `translated-ltr`/`translated-rtl` quando a página foi traduzida. */
function paginaTraduzida(): boolean {
  const classes = document.documentElement.classList
  return classes.contains('translated-ltr') || classes.contains('translated-rtl')
}

/**
 * Aciona o widget escondido do Google Translate para trocar de idioma. O `<select>` que ele injeta
 * (`.goog-te-combo`) só existe, e só tem a lista de idiomas, depois do script `element.js` carregar,
 * então tenta de novo por até ~10s. Depois de acionar, confere se a tradução realmente aconteceu:
 * em celular o primeiro comando às vezes é ignorado, então repete até dar certo.
 */
export function triggerTranslation(lang: LanguageCode, tentativa = 0): void {
  if (tentativa === 0) pedidoAtual = lang
  // Um pedido mais novo (outro idioma) cancela as repetições do anterior.
  if (pedidoAtual !== lang || tentativa >= MAX_TENTATIVAS_INICIAIS) return
  const combo = buscarCombo()
  if (combo && comboTemIdioma(combo, lang)) {
    if (lang === IDIOMA_ORIGINAL) {
      // Restaurar o original é menos confiável só com o combo; clicar no item do próprio menu do
      // Google (quando ele já foi aberto uma vez) é o caminho que ele espera para "desfazer".
      const item = document
        .querySelector<HTMLIFrameElement>('.goog-te-menu-frame')
        ?.contentDocument?.querySelector<HTMLElement>('a.goog-te-menu2-item span')
      item?.click()
    }
    selecionarNoCombo(combo, lang)
    setTimeout(() => {
      const aplicado = lang === IDIOMA_ORIGINAL ? !paginaTraduzida() : paginaTraduzida()
      if (!aplicado) triggerTranslation(lang, tentativa + 1)
    }, INTERVALO_INICIAL_MS * 2)
    return
  }
  setTimeout(() => triggerTranslation(lang, tentativa + 1), INTERVALO_INICIAL_MS)
}

/**
 * Reaplica o idioma escolhido depois de uma navegação sem reload (o Google só traduziu o HTML da
 * rota anterior). Silencioso: o widget é de terceiro e uma falha aqui nunca deve travar a navegação.
 */
export function retriggerTranslation(lang: LanguageCode | null, tentativa = 0): void {
  if (!lang || lang === IDIOMA_ORIGINAL) return
  try {
    const combo = buscarCombo()
    if (combo) {
      if (combo.value !== lang) selecionarNoCombo(combo, lang)
      return
    }
    if (tentativa < MAX_TENTATIVAS_NA_ROTA) {
      setTimeout(() => retriggerTranslation(lang, tentativa + 1), INTERVALO_NA_ROTA_MS)
    }
  } catch {
    // widget de terceiro: nunca deixar um erro dele quebrar a navegação
  }
}
