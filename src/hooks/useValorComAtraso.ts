'use client'

import { useEffect, useState } from 'react'

/**
 * O `valor` só depois que ele para de mudar por `atrasoMs` (padrão 300 ms). Serve à busca ao vivo:
 * consulta o servidor quando a pessoa termina de digitar, não a cada tecla (skill `arquitetura` §3.1).
 */
export function useValorComAtraso<T>(valor: T, atrasoMs = 300): T {
  const [atrasado, setAtrasado] = useState(valor)

  useEffect(() => {
    const espera = window.setTimeout(() => setAtrasado(valor), atrasoMs)
    return () => window.clearTimeout(espera)
  }, [valor, atrasoMs])

  return atrasado
}
