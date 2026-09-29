import { IDIOMA_ORIGINAL, type LanguageCode } from './config'

const MAX_TENTATIVAS_INICIAIS = 10
const MAX_TENTATIVAS_NA_ROTA = 8
const INTERVALO_INICIAL_MS = 400
const INTERVALO_NA_ROTA_MS = 300

function buscarCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo')
}

function selecionarNoCombo(combo: HTMLSelectElement, lang: LanguageCode) {
  combo.value = lang
  combo.dispatchEvent(new Event('change'))
}

/**
 * Aciona o widget escondido do Google Translate para trocar de idioma. O `<select>` que ele injeta
 * (`.goog-te-combo`) só existe depois do script `element.js` carregar, então tenta de novo por até
 * ~4s caso ainda não exista.
 */
export function triggerTranslation(lang: LanguageCode, tentativa = 0): void {
  const combo = buscarCombo()
  if (combo) {
    if (lang === IDIOMA_ORIGINAL) {
      // Restaurar o original é menos confiável só com o combo; clicar no item do próprio menu do
      // Google (quando ele já foi aberto uma vez) é o caminho que ele espera para "desfazer".
      const item = document
        .querySelector<HTMLIFrameElement>('.goog-te-menu-frame')
        ?.contentDocument?.querySelector<HTMLElement>('a.goog-te-menu2-item span')
      item?.click()
    }
    selecionarNoCombo(combo, lang)
    return
  }
  if (tentativa < MAX_TENTATIVAS_INICIAIS) {
    setTimeout(() => triggerTranslation(lang, tentativa + 1), INTERVALO_INICIAL_MS)
  }
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
