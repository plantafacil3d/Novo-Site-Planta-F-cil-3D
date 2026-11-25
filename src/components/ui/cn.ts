import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * Ensina ao tailwind-merge os valores próprios do design system (tokens.css). Sem isto, `text-label`
 * era tomado por cor e apagava a cor do elemento (ex.: `text-fg-inverse` de um botão). Ao criar um
 * token de fonte (`--text-*`) ou de espaçamento entre letras (`--tracking-*`), acrescente aqui.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['caption', 'label', 'comment'],
      tracking: ['eyebrow', 'eyebrow-light'],
    },
  },
})

/** Junta classes condicionais e resolve conflitos do Tailwind (a última vence). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
