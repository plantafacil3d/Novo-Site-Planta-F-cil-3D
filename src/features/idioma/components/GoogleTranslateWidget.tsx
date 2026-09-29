import Script from 'next/script'

/**
 * Widget gratuito do Google Translate ("Website Translator"), escondido: só o `<select>` que ele
 * injeta (`.goog-te-combo`) é usado, comandado pelo `SeletorDeIdioma`. A interface visual dele
 * (banner, balão, destaque de texto) fica escondida em `styles/globals.css`.
 */
export function GoogleTranslateWidget() {
  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        style={{ display: 'none', position: 'absolute', top: -9999, left: -9999 }}
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'pt',autoDisplay:false,multilanguagePage:false},'google_translate_element');}`}
      </Script>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}
