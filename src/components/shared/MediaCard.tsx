import Image from 'next/image'
import Link from 'next/link'

type MediaCardProps = {
  href: string
  title: string
  image: { src: string; alt: string }
  /** Preço já formatado (ex.: "R$ 249,00"). */
  price: string
}

/** Card compacto (imagem, título e preço). O card inteiro é um único link, pelo título. */
export function MediaCard({ href, title, image, price }: MediaCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow duration-250 ease-standard hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-body text-sm font-semibold">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="text-sm font-semibold text-primary">{price}</p>
      </div>
    </article>
  )
}
