import { BotaoGoogle } from '@/components/shared/BotaoGoogle'
import { Logo } from '@/components/shared/Logo'
import { entrarComGoogle } from '@/features/conta'
import { siteConfig } from '@/features/site'

// Login com e-mail e senha desativado por enquanto (só Google, por decisão do time).
// `FormularioLogin` e `entrarNaConta` (@/components/shared/FormularioLogin, @/features/conta)
// continuam prontos: para reativar, reimporte os dois e coloque de volta o divisor "ou" + o form
// entre o `BotaoGoogle` e o parágrafo de instrução abaixo.

/** Tela de entrada do painel do administrador. */
export function LoginAdminView({ erro }: { erro?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-subtle p-4">
      <Logo nome={siteConfig.nome} tone="default" />
      <main className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl">Entrar no painel</h1>
        {erro && (
          <p role="alert" className="mb-4 text-sm text-danger-fg">
            {erro}
          </p>
        )}
        <BotaoGoogle action={entrarComGoogle} />
        <p className="mt-4 text-center text-sm text-fg-muted">
          Use a conta Google autorizada para acessar o painel.
        </p>
      </main>
    </div>
  )
}
