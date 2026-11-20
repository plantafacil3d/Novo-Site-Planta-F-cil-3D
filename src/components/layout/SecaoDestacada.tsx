import { useId, type ReactNode } from 'react'

type SecaoDestacadaProps = {
  /** Texto do selo sobre a borda, no canto esquerdo (ex.: "Prévias do projeto"). */
  selo: string
  title: string
  subtitle?: string
  children: ReactNode
}

/**
 * Seção da página dentro de uma moldura tracejada com um selo sobre a borda. Mesma ideia do `Section`
 * (título h2, subtítulo e conteúdo), mas a moldura envolve também o título, por isso é um componente à
 * parte. Nasceu na "Prévias do projeto" e passou para cá quando a seção de depoimentos pediu o mesmo.
 */
export function SecaoDestacada({ selo, title, subtitle, children }: SecaoDestacadaProps) {
  const idDoTitulo = useId()

  return (
    <section aria-labelledby={idDoTitulo} className="bg-page py-12 text-fg md:py-16">
      <div className="mx-auto max-w-content px-4">
        <div className="relative rounded-highlight border-2 border-dashed border-highlight p-4 md:p-6">
          {/*
            Selo centrado na linha da borda (`-top-px` = meio dos 2px da borda; `-translate-y-1/2`
            funciona com qualquer altura). Padding simétrico de propósito: com a Poppins real o texto
            já fica no centro (medido). Só no `localhost` sem a fonte carregada (fonte reserva, tipo
            Arial) ele parece ~1px alto; não "corrija" com padding assimétrico.
          */}
          <span
            aria-hidden="true"
            className="absolute -top-px left-4 -translate-y-1/2 rounded-full bg-highlight px-3 py-0.5 font-heading text-xs font-bold tracking-wide text-highlight-fg uppercase"
          >
            {selo}
          </span>

          <h2 id={idDoTitulo} className="text-2xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-fg-muted">{subtitle}</p>}

          {children}
        </div>
      </div>
    </section>
  )
}
