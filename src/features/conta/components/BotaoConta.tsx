'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
import { Icon } from '@/components/ui/Icon'

import { acaoDaConta } from '../rules'

type BotaoContaProps = {
  /** `icone`: só o ícone (cabeçalho); `texto`: botão com nome (menu do celular). */
  variante: 'icone' | 'texto'
  className?: string
}

const itemStyles =
  'flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-fg transition-colors duration-150 ease-standard hover:bg-subtle'

/** Largura do painel "Entrar"/"Cadastro" (`w-44`), usada para calcular a posição antes de abrir. */
const LARGURA_DO_PAINEL = 176

/** Menu "Entrar"/"Cadastro": abre ao passar o mouse (desktop) ou ao tocar/focar (celular, teclado). */
function MenuEntrarOuCadastrar({ className }: { className?: string }) {
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fecharTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  function posicionar() {
    const wrapper = wrapperRef.current
    const painel = panelRef.current
    if (!wrapper || !painel) return
    const rect = wrapper.getBoundingClientRect()
    painel.style.top = `${rect.bottom + 4}px`
    painel.style.left = `${Math.max(8, rect.right - LARGURA_DO_PAINEL)}px`
  }

  function abrir() {
    clearTimeout(fecharTimeout.current)
    const painel = panelRef.current
    if (!painel || painel.matches(':popover-open')) return
    posicionar()
    try {
      // Hover, foco e o clique nativo do `popoverTarget` podem pedir para abrir quase juntos; o
      // navegador recusa um `showPopover()` chamado no meio de outro já em andamento.
      painel.showPopover()
    } catch {}
  }

  function fecharComAtraso() {
    fecharTimeout.current = setTimeout(() => panelRef.current?.hidePopover(), 150)
  }

  return (
    <div
      ref={wrapperRef}
      className="inline-block"
      onMouseEnter={abrir}
      onMouseLeave={fecharComAtraso}
      onFocus={abrir}
      onBlur={fecharComAtraso}
    >
      <button
        type="button"
        aria-label="Minha conta"
        aria-haspopup="true"
        popoverTarget={panelId}
        popoverTargetAction="show"
        className={className}
      >
        <Icon name="user" />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        aria-label="Minha conta"
        onMouseEnter={() => clearTimeout(fecharTimeout.current)}
        onMouseLeave={fecharComAtraso}
        className="fixed m-0 w-44 rounded-md border border-border bg-surface p-1 shadow-md"
      >
        <Link href="/entrar" className={itemStyles}>
          <Icon name="user" className="size-4 shrink-0" />
          Entrar
        </Link>
        <Link href="/cadastro" className={itemStyles}>
          <Icon name="plus" className="size-4 shrink-0" />
          Cadastro
        </Link>
      </div>
    </div>
  )
}

/**
 * Botão de conta do cabeçalho. Sem sessão, mostra o menu "Entrar"/"Cadastro" (ícone: some ao passar
 * o mouse; menu do celular: os dois botões já abertos, sem popover dentro de popover). Com sessão,
 * vira o link direto ("Painel"/"Favoritos"). A sessão é lida aqui, no navegador, para as páginas do
 * site continuarem estáticas.
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

  if (ehAdmin === null) {
    if (variante === 'icone') return <MenuEntrarOuCadastrar className={className} />
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <Button href="/entrar" variant="secondary" iconLeft="user">
          Entrar
        </Button>
        <Button href="/cadastro" iconLeft="plus">
          Cadastro
        </Button>
      </div>
    )
  }

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
