/** Primeiro item da tab: leva direto ao conteúdo. Só aparece quando recebe foco. */
export function SkipLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-fg focus:shadow-md"
    >
      {children}
    </a>
  )
}
