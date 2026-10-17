export {
  CHAVE_LOCALSTORAGE_IDIOMA,
  IDIOMA_ORIGINAL,
  IDIOMA_RESERVA,
  IDIOMAS_SUPORTADOS,
} from './config'
export type { LanguageCode } from './config'
export { idiomaPreferido } from './detectarIdioma'
export { retriggerTranslation, triggerTranslation } from './translateWidget'
