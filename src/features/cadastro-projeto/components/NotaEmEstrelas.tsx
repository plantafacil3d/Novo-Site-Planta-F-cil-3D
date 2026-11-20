import { Icon } from '@/components/ui/Icon'
import { cn } from '@/components/ui/cn'

const ESTRELAS = [1, 2, 3, 4, 5] as const

type NotaEmEstrelasProps = {
  /** Nome do grupo de opções (único na página). */
  name: string
  /** Texto lido pelo leitor de tela (ex.: "Estrelas do comentário 1"). */
  legenda: string
  valor: number
  aoMudar: (nota: number) => void
}

/**
 * Escolha de 1 a 5 estrelas: 5 opções de rádio escondidas, cada uma desenhada como uma estrela. Clicar
 * na 4ª acende da 1ª à 4ª; o teclado usa as setas, como em qualquer grupo de rádio.
 */
export function NotaEmEstrelas({ name, legenda, valor, aoMudar }: NotaEmEstrelasProps) {
  return (
    <fieldset className="flex items-center">
      <legend className="sr-only">{legenda}</legend>
      {ESTRELAS.map((estrela) => (
        <label
          key={estrela}
          className="flex h-11 w-8 cursor-pointer items-center justify-center rounded-sm text-rating has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
        >
          <input
            type="radio"
            name={name}
            value={estrela}
            checked={valor === estrela}
            onChange={() => aoMudar(estrela)}
            className="sr-only"
          />
          <span className="sr-only">{estrela === 1 ? '1 estrela' : `${estrela} estrelas`}</span>
          <Icon
            name="star"
            strokeWidth={1.5}
            className={cn('size-5', estrela <= valor && 'fill-current')}
          />
        </label>
      ))}
    </fieldset>
  )
}
