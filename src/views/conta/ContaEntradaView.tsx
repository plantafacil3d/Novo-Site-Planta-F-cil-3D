import Link from 'next/link'

import { BotaoGoogle } from '@/components/shared/BotaoGoogle'
import { Logo } from '@/components/shared/Logo'
import { entrarComGoogle } from '@/features/conta'
import { siteConfig } from '@/features/site'

type ContaEntradaViewProps = {
  variante: 'entrar' | 'cadastro'
  erro?: string
}

const textos = {
  entrar: {
    titulo: 'Entrar',
    descricao: 'Entre com sua conta Google para acessar e comparar seus projetos favoritos.',
    linkLabel: 'Ainda não tem conta?',
    linkAcao: 'Cadastre-se',
    linkHref: '/cadastro' as const,
  },
  cadastro: {
    titulo: 'Cadastro',
    descricao: 'O cadastro é só com sua conta Google: rápido, sem senha nova para lembrar.',
    linkLabel: 'Já tem conta?',
    linkAcao: 'Entrar',
    linkHref: '/entrar' as const,
  },
} as const

/**
 * Tela de entrada do cliente (login e cadastro), só com Google — sem conta nem senha próprias.
 * Sem cabeçalho nem rodapé do site (mesmo padrão de `LoginAdminView`): a página vive fora do grupo
 * `(site)`, então centraliza a própria altura de tela.
 */
export function ContaEntradaView({ variante, erro }: ContaEntradaViewProps) {
  const texto = textos[variante]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-subtle p-4">
      <Logo nome={siteConfig.nome} tone="default" />
      <main className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-md">
        <h1 className="text-center text-2xl">{texto.titulo}</h1>
        <p className="mt-2 mb-6 text-center text-fg-muted">{texto.descricao}</p>
        {erro && (
          <p role="alert" className="mb-4 text-sm text-danger-fg">
            {erro}
          </p>
        )}
        <BotaoGoogle action={entrarComGoogle} />
        <p className="mt-4 text-center text-sm text-fg-muted">
          {texto.linkLabel}{' '}
          <Link href={texto.linkHref} className="font-semibold text-primary hover:underline">
            {texto.linkAcao}
          </Link>
        </p>
      </main>
    </div>
  )
}
