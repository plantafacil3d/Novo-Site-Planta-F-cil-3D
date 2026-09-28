'use client'

import Image from 'next/image'
import { motion } from 'motion/react'

import { Icon } from '@/components/ui/Icon'

import { blocosDeAprendizado } from '../data'

export function WhatYoullLearnSection() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-content px-4">
        <div className="flex justify-center">
          <span className="curso-btn-brilho inline-flex size-12 items-center justify-center rounded-[20%]">
            <Icon name="monitor-play" className="size-6 text-white" strokeWidth={1.5} />
          </span>
        </div>

        <h2 className="mx-auto mt-6 max-w-2xl text-center font-heading text-2xl md:text-3xl">
          O que você vai aprender no novo curso{' '}
          <strong className="font-bold text-[var(--course-accent)]">Unreal Engine 5.6</strong> para
          Archviz?
        </h2>

        <div className="mt-12 flex flex-col gap-12">
          {blocosDeAprendizado.map((bloco, index) => (
            <div
              key={bloco.title}
              className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="relative">
                <motion.div
                  className="curso-imagem-brilho absolute -inset-6 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--course-bg-elevated)]">
                  <Image
                    src={bloco.image}
                    alt={bloco.title}
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="curso-btn-brilho mb-3 inline-flex size-10 items-center justify-center rounded-xl">
                  <Icon name={bloco.icon} className="size-5 text-white" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading text-xl font-bold">{bloco.title}</h3>
                <p className="mt-3 text-sm text-[var(--course-fg-muted)]">{bloco.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
