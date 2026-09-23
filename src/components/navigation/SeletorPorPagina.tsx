'use client'

import { useId } from 'react'
import { useRouter } from 'next/navigation'

import { Select } from '../ui/Select'

type OpcaoPorPagina = { valor: number; href: string }

type SeletorPorPaginaProps = {
  porPagina: number
  /** Cada opção já traz o endereço pronto (quem usa monta; funções não cruzam para um Client Component). */
  opcoes: OpcaoPorPagina[]
}

/** "Itens por página: [20 ▾]". Ao trocar, navega direto (sem botão "aplicar"). */
export function SeletorPorPagina({ porPagina, opcoes }: SeletorPorPaginaProps) {
  const router = useRouter()
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm whitespace-nowrap text-fg-muted">
        Itens por página
      </label>
      <Select
        id={id}
        value={porPagina}
        onChange={(evento) => {
          const opcao = opcoes.find((item) => item.valor === Number(evento.target.value))
          if (opcao) router.push(opcao.href)
        }}
        className="w-auto"
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.valor}
          </option>
        ))}
      </Select>
    </div>
  )
}
