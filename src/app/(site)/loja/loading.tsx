import { LojaSkeleton } from '@/features/produtos'
import { LojaCasca } from '@/views/loja/LojaCasca'

/** Mostrada na hora do clique em "Loja", com a mesma casca e o mesmo esqueleto da página. */
export default function LojaLoading() {
  return (
    <LojaCasca>
      <LojaSkeleton />
    </LojaCasca>
  )
}
