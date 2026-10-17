/** Idiomas que o site oferece no seletor (e que o widget do Google Translate comanda). */
export const IDIOMAS_SUPORTADOS = ['pt', 'en', 'es', 'fr', 'it', 'de', 'ru', 'ja', 'zh-CN'] as const

export type LanguageCode = (typeof IDIOMAS_SUPORTADOS)[number]

/** Idioma nativo do conteúdo do site; o Google Translate usa como referência para traduzir e para "desfazer". */
export const IDIOMA_ORIGINAL: LanguageCode = 'pt'

/** Idioma usado quando o navegador está num idioma que o site não oferece (ex.: árabe). */
export const IDIOMA_RESERVA: LanguageCode = 'en'

export const CHAVE_LOCALSTORAGE_IDIOMA = 'pf3d_idioma'
