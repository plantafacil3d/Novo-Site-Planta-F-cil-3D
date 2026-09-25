import Image from 'next/image'

import { Section } from '@/components/layout/Section'

import { cenasBonus } from '../data'

/**
 * 3 cenas bônus inclusas no curso. Não reaproveita `MediaCard`: ele exige `href` e `price`, e aqui
 * não há link nem preço individual (as cenas vêm junto da matrícula).
 */
export function BonusScenesSection() {
  return (
    <Section
      title="Cenas bônus inclusas"
      subtitle="Três cenas prontas para você estudar e já sair aplicando o que aprender."
    >
      <ul className="grid gap-6 sm:grid-cols-3">
        {cenasBonus.map((cena) => (
          <li
            key={cena.title}
            className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
          >
            <div className="relative aspect-4/3">
              <Image
                src={cena.image.src}
                alt={cena.image.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-body text-sm font-semibold">{cena.title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{cena.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
