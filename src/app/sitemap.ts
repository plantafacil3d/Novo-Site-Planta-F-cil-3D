import type { MetadataRoute } from 'next'

import { hrefProjeto, listarSlugsProjetos } from '@/features/projetos'
import { siteUrl } from '@/features/site'

// Acrescente as demais páginas públicas conforme forem criadas.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listarSlugsProjetos()

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...slugs.map((slug) => ({
      url: `${siteUrl}${hrefProjeto({ slug })}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
