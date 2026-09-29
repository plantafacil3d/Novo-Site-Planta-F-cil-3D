import { cn } from '../ui/cn'

// `*texto*` (o negrito do WhatsApp): sem espaço logo depois do primeiro `*` nem antes do último,
// para não pegar multiplicações ou asteriscos soltos. Não atravessa linhas.
const NEGRITO = /\*(?!\s)([^*\n]*[^*\s\n])\*/g

function separarNegritos(linha: string) {
  return linha.split(NEGRITO).map((trecho, indice) =>
    // `split` com grupo de captura alterna: posições ímpares são o miolo do negrito.
    indice % 2 === 1 ? <strong key={indice}>{trecho}</strong> : trecho,
  )
}

/**
 * Texto digitado pelo administrador num campo de várias linhas: mantém as quebras de linha e os
 * parágrafos (linha em branco) e aceita negrito com `*texto*`. Nada de HTML: o conteúdo continua
 * sendo texto puro, escapado pelo React.
 */
export function TextoFormatado({
  texto,
  className,
  id,
}: {
  texto: string
  className?: string
  id?: string
}) {
  return (
    <div id={id} className={cn('whitespace-pre-line', className)}>
      {texto.split('\n').map((linha, indice, linhas) => (
        <span key={indice}>
          {separarNegritos(linha)}
          {indice < linhas.length - 1 && '\n'}
        </span>
      ))}
    </div>
  )
}
