'use client'

import { useState } from 'react'

import { FavoriteButton } from '@/components/shared/FavoriteButton'

import { useAlternarFavorito } from '../hooks/useAlternarFavorito'
import { useFavoritoIds } from '../hooks/useFavoritoIds'
import { ModalEntrarParaFavoritar } from './ModalEntrarParaFavoritar'

type FavoriteToggleProps = {
  projetoId: string
  label: string
  variant?: 'icon' | 'button'
  /**
   * Login com Google já amarrado a este projeto (`entrarComGoogle.bind(null, projetoId)`), montado
   * por quem chama este componente (sempre um Server Component ou dado já pronto — este arquivo é
   * client e não pode importar `features/conta`, que arrasta código `server-only`).
   */
  entrarComGoogleAction: () => Promise<void>
}

/**
 * Coração de favoritar ligado ao backend: mostra o estado real (via `useFavoritoIds`, uma única
 * busca compartilhada por todos os corações da página) e favorita/desfavorita ao clicar. Sem
 * sessão, a Action recusa e abre o modal de login em vez de favoritar.
 */
export function FavoriteToggle({
  projetoId,
  label,
  variant = 'icon',
  entrarComGoogleAction,
}: FavoriteToggleProps) {
  const { data: ids } = useFavoritoIds()
  const mutation = useAlternarFavorito()
  const [modalAberto, setModalAberto] = useState(false)

  const active = ids?.includes(projetoId) ?? false

  async function alternar() {
    const resultado = await mutation.mutateAsync({ projetoId, proximoEstado: !active })
    if (!resultado.ok && resultado.motivo === 'nao_autenticado') setModalAberto(true)
  }

  return (
    <>
      <FavoriteButton
        label={label}
        variant={variant}
        active={active}
        pending={mutation.isPending}
        onToggle={alternar}
      />
      <ModalEntrarParaFavoritar
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        action={entrarComGoogleAction}
      />
    </>
  )
}
