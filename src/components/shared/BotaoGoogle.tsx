'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '../ui/Button'

function Enviar() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="secondary"
      iconLeft="google"
      loading={pending}
      className="w-full"
    >
      Entrar com Google
    </Button>
  )
}

type BotaoGoogleProps = {
  /** Ação do servidor que inicia o login com Google (quem usa a passa pronta). */
  action: () => Promise<void>
}

/** Botão "Entrar com Google". Funciona como formulário: a ação do servidor leva ao Google. */
export function BotaoGoogle({ action }: BotaoGoogleProps) {
  return (
    <form action={action}>
      <Enviar />
    </form>
  )
}
