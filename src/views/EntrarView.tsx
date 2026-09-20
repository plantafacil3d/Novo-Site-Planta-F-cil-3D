import { Tabs } from '@/components/navigation/Tabs'
import { FormularioLogin } from '@/components/shared/FormularioLogin'
import { entrarNaConta } from '@/features/conta'

/** Página `/entrar`: abas Entrar (funciona) e Cadastrar (fechado por enquanto). */
export function EntrarView() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-16">
      <h1 className="text-3xl">Entrar ou cadastrar</h1>
      <p className="mt-2 mb-6 text-fg-muted">Acesse sua conta para acompanhar seus projetos.</p>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
        <Tabs
          label="Entrar ou cadastrar"
          items={[
            {
              id: 'entrar',
              label: 'Entrar',
              content: (
                <div className="pt-6">
                  <FormularioLogin action={entrarNaConta} />
                </div>
              ),
            },
            {
              id: 'cadastrar',
              label: 'Cadastrar',
              content: (
                <div className="flex flex-col gap-2 pt-6">
                  <p className="font-heading text-lg font-bold">Cadastro em breve</p>
                  <p className="text-fg-muted">
                    Ainda não estamos abrindo novas contas. Enquanto isso, você pode ver todos os
                    projetos sem precisar de cadastro.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
