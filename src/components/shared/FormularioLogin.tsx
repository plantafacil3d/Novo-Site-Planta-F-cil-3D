'use client'

import { useActionState, useId } from 'react'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export type EstadoFormularioLogin = { erro?: string }

type FormularioLoginProps = {
  /** Ação do servidor que faz o login (quem usa a passa pronta). Devolve o erro a mostrar, se houver. */
  action: (estado: EstadoFormularioLogin, formData: FormData) => Promise<EstadoFormularioLogin>
}

/** E-mail e senha. O erro é sempre genérico: nunca revela se o e-mail existe. */
export function FormularioLogin({ action }: FormularioLoginProps) {
  const [estado, acao, pendente] = useActionState(action, {})
  const idEmail = useId()
  const idSenha = useId()
  const idErro = useId()

  return (
    <form action={acao} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={idEmail} className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id={idEmail}
          name="email"
          type="email"
          autoComplete="username"
          required
          invalid={!!estado.erro}
          aria-describedby={estado.erro ? idErro : undefined}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={idSenha} className="text-sm font-medium">
          Senha
        </label>
        <Input
          id={idSenha}
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          invalid={!!estado.erro}
          aria-describedby={estado.erro ? idErro : undefined}
        />
      </div>

      {estado.erro && (
        <p id={idErro} role="alert" className="text-sm text-danger-fg">
          {estado.erro}
        </p>
      )}

      <Button type="submit" loading={pendente}>
        Entrar
      </Button>
    </form>
  )
}
