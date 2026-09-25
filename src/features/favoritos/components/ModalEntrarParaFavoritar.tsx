'use client'

import { BotaoGoogle } from '@/components/shared/BotaoGoogle'
import { Modal } from '@/components/ui/Modal'

type ModalEntrarParaFavoritarProps = {
  aberto: boolean
  onClose: () => void
  /** Login com Google já amarrado ao projeto (vem de `FavoriteToggle`, nunca importado aqui:
   *  arquivo client não pode importar `features/conta`, que arrasta código `server-only`). */
  action: () => Promise<void>
}

/** Aberto quando alguém deslogado clica no coração: explica o motivo e já leva o favorito junto. */
export function ModalEntrarParaFavoritar({ aberto, onClose, action }: ModalEntrarParaFavoritarProps) {
  return (
    <Modal
      open={aberto}
      onClose={onClose}
      label="Entre para favoritar"
      tone="surface"
      className="mx-auto max-w-sm p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="pr-10 text-xl">Entre para favoritar</h2>
          <p className="text-sm text-fg-muted">
            Você precisa estar logado para favoritar um projeto. Entre com sua conta Google: assim
            que o login terminar, este projeto já fica salvo nos seus favoritos.
          </p>
        </div>
        <BotaoGoogle action={action} />
      </div>
    </Modal>
  )
}
