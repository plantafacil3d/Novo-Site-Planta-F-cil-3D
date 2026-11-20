'use client'

import Image from 'next/image'
import { useState } from 'react'

import { SecaoDestacada } from '@/components/layout/SecaoDestacada'
import { Lightbox } from '@/components/shared/Lightbox'
import type { DadosDeCompartilhamento } from '@/components/shared/ShareButton'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/components/ui/cn'

import { iniciaisDoNome, tonsDosAvatares } from '../avatares'
import type { ComentarioDeCliente, PrintDeCliente } from '../types'
import { FAIXA_NO_CELULAR_GRADE_NO_COMPUTADOR, ITEM_DA_FAIXA } from './faixaNoCelular'

const ESTRELAS = [1, 2, 3, 4, 5]

/**
 * "O que nossos clientes dizem": uma fileira de prints de conversa (WhatsApp, SketchUp, Instagram...)
 * enviados pelo admin, cada print num cartão arredondado (só a foto, sem nome nem origem), e, abaixo,
 * cartões com comentários escritos pelo admin (estrelas, texto, nome, cidade e "Compra verificada",
 * sempre, por decisão do usuário). Clicar num print abre o visualizador em tela cheia só com os prints.
 * Dados da aba "Marketing" do cadastro.
 *
 * Sem nenhum print, a seção inteira não aparece (mesmo que haja comentários); sem comentários, só a
 * fileira de baixo some. Layout igual ao da referência enviada pelo usuário (2026-11-20).
 */
export function DepoimentosDeClientes({
  prints,
  comentarios,
  compartilhar,
}: {
  prints: PrintDeCliente[]
  comentarios: ComentarioDeCliente[]
  /** Link do projeto: ativa o botão de compartilhar dentro do visualizador. */
  compartilhar: DadosDeCompartilhamento
}) {
  const [aberto, setAberto] = useState<number | null>(null)

  if (prints.length === 0) return null

  const tonsDosComentarios = tonsDosAvatares(comentarios.map((comentario) => comentario.nome))

  return (
    <SecaoDestacada
      selo="Depoimentos"
      title="O que nossos clientes dizem"
      subtitle="Prints reais de quem comprou e já está construindo."
    >
      {/* Prints: 2 colunas já no celular (referência "versão celular (2)", 2026-11-20); 4 no computador. */}
      <ul className="mt-8 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {prints.map((print, indice) => (
          <li key={print.id}>
            {/* O cartão é o próprio print: só a foto, sem nome nem origem. 9/16 é a proporção de uma tela
                de celular; mostra o começo da conversa, e o print inteiro abre ao clicar. */}
            <button
              type="button"
              aria-label={`Ampliar ${print.imagem.alt}`}
              onClick={() => setAberto(indice)}
              className="relative block aspect-[9/16] w-full cursor-zoom-in overflow-hidden rounded-highlight border border-border bg-surface shadow-soft"
            >
              <Image
                src={print.imagem.src}
                alt=""
                fill
                sizes="(min-width: 1200px) 264px, (min-width: 768px) 40vw, 46vw"
                className="object-cover object-top"
              />
            </button>
          </li>
        ))}
      </ul>

      {comentarios.length > 0 && (
        <ul className={cn('mt-6', FAIXA_NO_CELULAR_GRADE_NO_COMPUTADOR, 'lg:grid-cols-3')}>
          {comentarios.map((comentario, indice) => (
            <li key={comentario.id} className={ITEM_DA_FAIXA}>
              <figure className="flex h-full flex-col rounded-highlight border border-border bg-surface p-5 shadow-soft">
                <div
                  role="img"
                  aria-label={`Nota ${comentario.nota} de 5`}
                  className="flex h-6 items-center text-rating"
                >
                  {ESTRELAS.map((estrela) => (
                    <Icon
                      key={estrela}
                      name="star"
                      strokeWidth={1.5}
                      className={cn('size-3.5', estrela <= comentario.nota && 'fill-current')}
                    />
                  ))}
                </div>
                <blockquote className="mt-2.5 text-comment">“{comentario.texto}”</blockquote>
                <figcaption className="mt-3.5 flex items-center gap-3">
                  <Avatar
                    size="md"
                    iniciais={iniciaisDoNome(comentario.nome)}
                    tone={tonsDosComentarios[indice]}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-label font-semibold">{comentario.nome}</p>
                    <p className="mt-0.5 truncate text-caption text-fg-muted">
                      {comentario.cidade}
                    </p>
                  </div>
                </figcaption>
                <p className="mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-verified">
                  <Icon name="check" className="size-3" />
                  Compra verificada
                </p>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        images={prints.map((print) => print.imagem)}
        index={aberto}
        onIndexChange={setAberto}
        onClose={() => setAberto(null)}
        label="Depoimentos de clientes"
        compartilhar={compartilhar}
      />
    </SecaoDestacada>
  )
}
