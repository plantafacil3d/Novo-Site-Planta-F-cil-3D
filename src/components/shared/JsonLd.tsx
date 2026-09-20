/**
 * Dados estruturados (schema.org) para o Google. O `<` é escapado para o conteúdo nunca
 * conseguir fechar a tag `<script>` e injetar HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
