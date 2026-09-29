'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import {
  CHAVE_LOCALSTORAGE_IDIOMA,
  IDIOMA_ORIGINAL,
  retriggerTranslation,
  type LanguageCode,
} from '@/services/translate'

/** Tempo dado ao React para renderizar a rota nova antes de tentar traduzir o conteúdo dela. */
const ATRASO_RENDER_MS = 200

/**
 * O Next troca de rota sem recarregar a página, então o Google só traduziu o HTML da rota anterior.
 * A cada mudança de caminho ou busca, reaplica o idioma salvo ao conteúdo novo. Ignora a primeira
 * montagem (a restauração inicial já é feita por `useIdioma`).
 */
export function useReaplicarTraducaoNaRota() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE_IDIOMA) as LanguageCode | null
    if (!salvo || salvo === IDIOMA_ORIGINAL) return
    const tentar = setTimeout(() => retriggerTranslation(salvo), ATRASO_RENDER_MS)
    return () => clearTimeout(tentar)
  }, [pathname, searchParams])
}
