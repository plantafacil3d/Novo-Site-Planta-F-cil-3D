'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

import {
  CHAVE_LOCALSTORAGE_IDIOMA,
  IDIOMA_ORIGINAL,
  triggerTranslation,
  type LanguageCode,
} from '@/services/translate'

export type { LanguageCode } from '@/services/translate'

/** Tempo dado ao script do Google para carregar antes de tentar restaurar o idioma salvo. */
const ATRASO_RESTAURACAO_MS = 1500

/** Só para o `useSyncExternalStore` notar, na mesma aba, que a escolha mudou (ver `trocarIdioma`). */
const EVENTO_IDIOMA_ALTERADO = 'pf3d:idioma-alterado'

function getSnapshot(): LanguageCode {
  const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE_IDIOMA)
  return (salvo as LanguageCode | null) ?? IDIOMA_ORIGINAL
}

function getServerSnapshot(): LanguageCode {
  return IDIOMA_ORIGINAL
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENTO_IDIOMA_ALTERADO, callback)
  return () => window.removeEventListener(EVENTO_IDIOMA_ALTERADO, callback)
}

/**
 * Idioma ativo da interface, lido do localStorage com `useSyncExternalStore`: o servidor sempre
 * "vê" `pt` e o cliente sincroniza com o valor salvo assim que hidrata, sem setState em efeito (o
 * jeito recomendado pelo React para ler um valor só do navegador sem erro de hidratação).
 * `trocarIdioma` grava a escolha, avisa o store e comanda o widget do Google Translate.
 */
export function useIdioma() {
  const idiomaAtivo = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const restaurado = useRef(false)

  useEffect(() => {
    if (restaurado.current || idiomaAtivo === IDIOMA_ORIGINAL) return
    restaurado.current = true
    const restaurar = setTimeout(() => triggerTranslation(idiomaAtivo), ATRASO_RESTAURACAO_MS)
    return () => clearTimeout(restaurar)
  }, [idiomaAtivo])

  const trocarIdioma = useCallback((lang: LanguageCode) => {
    localStorage.setItem(CHAVE_LOCALSTORAGE_IDIOMA, lang)
    window.dispatchEvent(new Event(EVENTO_IDIOMA_ALTERADO))
    triggerTranslation(lang)
  }, [])

  return { idiomaAtivo, trocarIdioma }
}
