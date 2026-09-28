'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'motion/react'

import { Icon } from '@/components/ui/Icon'
import { Lightbox } from '@/components/shared/Lightbox'

import { imagensMosaico, secaoProjetosAprender } from '../data'

const fotos = imagensMosaico.map((src) => ({
  src,
  alt: 'Projeto renderizado em tempo real no curso',
}))

/**
 * Mosaico "tijolinho" em 3 colunas (`columns-*`, não grid): cada foto mantém a proporção
 * original, sem corte, e a coluna seguinte se ajusta à altura da anterior. Clique abre o
 * `Lightbox` compartilhado. Sem componente de masonry pronto no projeto ainda; nasce aqui,
 * local à página (regra da skill `design-system`: componente novo só quando um novo screen
 * realmente pede).
 */
export function ProjectsMosaicSection() {
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null)

  return (
    <section className="bg-page py-12 text-fg md:py-16">
      <div className="mx-auto max-w-content px-4 text-center">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          {secaoProjetosAprender.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-fg-muted">{secaoProjetosAprender.description}</p>
      </div>

      <div className="relative mt-10">
        <div className="columns-1 gap-2 px-2 md:columns-3">
          {fotos.map((foto, index) => (
            <motion.button
              key={foto.src}
              type="button"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onClick={() => setIndiceAberto(index)}
              className="mb-2 block w-full break-inside-avoid overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--course-accent)]"
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                width={600}
                height={600}
                sizes="33vw"
                className="h-auto w-full transition-transform duration-500 hover:scale-105"
              />
            </motion.button>
          ))}
        </div>

        <div className="absolute top-4 left-4 hidden max-w-64 rounded-lg bg-[var(--course-bg-elevated)] p-5 text-[var(--course-fg)] shadow-lg md:block">
          <span className="curso-btn-brilho -mt-8 mb-3 inline-flex size-9 items-center justify-center rounded-xl">
            <Icon name="box" className="size-4 text-white" strokeWidth={1.5} />
          </span>
          <p className="font-heading font-bold">{secaoProjetosAprender.overlay.title}</p>
          <p className="mt-1 text-sm text-[var(--course-fg-muted)]">
            {secaoProjetosAprender.overlay.description}
          </p>
        </div>
      </div>

      <Lightbox
        images={fotos}
        index={indiceAberto}
        onIndexChange={setIndiceAberto}
        onClose={() => setIndiceAberto(null)}
        label="Projetos que você vai aprender no curso"
      />
    </section>
  )
}
