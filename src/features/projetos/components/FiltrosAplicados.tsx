import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'

import type { FiltroAplicado } from '../rules'

/** Filtros ativos em etiquetas removíveis, mais um "Limpar tudo". Sem filtro, não mostra nada. */
export function FiltrosAplicados({ filtros }: { filtros: FiltroAplicado[] }) {
  if (filtros.length === 0) return null

  return (
    <ul aria-label="Filtros aplicados" className="flex flex-wrap items-center gap-2">
      {filtros.map((filtro) => (
        <li key={filtro.campo}>
          <Chip href={filtro.href} label={filtro.rotulo} removeLabel="Remover filtro" />
        </li>
      ))}
      <li>
        <Button href="/projetos" variant="ghost">
          Limpar tudo
        </Button>
      </li>
    </ul>
  )
}
