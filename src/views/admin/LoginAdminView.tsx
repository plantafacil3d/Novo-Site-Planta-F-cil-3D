import { Logo } from '@/components/shared/Logo'
import { FormularioLogin } from '@/components/shared/FormularioLogin'
import { entrarNaConta } from '@/features/conta'
import { siteConfig } from '@/features/site'

/** Tela de entrada do painel do administrador. */
export function LoginAdminView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-subtle p-4">
      <Logo nome={siteConfig.nome} tone="default" />
      <main className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-md">
        <h1 className="text-2xl">Entrar no painel</h1>
        <p className="mt-2 mb-6 text-fg-muted">Acesso restrito a administradores.</p>
        <FormularioLogin action={entrarNaConta} />
      </main>
    </div>
  )
}
