'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

import { acaoDaConta } from '../rules'

type BotaoContaProps = {
  /** `icone`: só o ícone (cabeçalho); `texto`: botão com nome (menu do celular). */
  variante: 'icone' | 'texto'
  className?: string
}

/**
 * Botão de conta do cabeçalho. Nasce como "Minha conta" (igual ao HTML do servidor, sem piscar) e vira
 * "Painel" se a sessão for de administrador. A sessão é lida aqui, no navegador, para as páginas
 * do site continuarem estáticas.
 */
export function BotaoConta({ variante, className }: BotaoContaProps) {
  const [ehAdmin, setEhAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const controle = new AbortController()
    fetch('/auth/sessao', { signal: controle.signal, cache: 'no-store' })
      .then((resposta) => (resposta.ok ? resposta.json() : null))
      .then((dados: { ehAdmin: boolean | null } | null) => setEhAdmin(dados?.ehAdmin ?? null))
      .catch(() => {})
    return () => controle.abort()
  }, [])

  const { label, href, icone } = acaoDaConta(ehAdmin)

  if (variante === 'icone') {
    return (
      <Link href={href} aria-label={label} title={label} className={className}>
        <Icon name={icone} />
      </Link>
    )
  }
  return (
    <Button href={href} iconLeft={icone} className={className}>
      {label}
    </Button>
  )
}
