'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

/**
 * Cache client-side para dados interativos (favoritos: um coração por card, um `fetch` só por
 * página, compartilhado entre todos eles). Conteúdo público continua vindo de Server Components;
 * isso não afeta o que já é estático/ISR.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
