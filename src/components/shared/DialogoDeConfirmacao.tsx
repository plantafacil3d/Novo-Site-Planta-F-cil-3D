'use client'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

type DialogoDeConfirmacaoProps = {
  aberto: boolean
  /** Pergunta curta, também o nome acessível do diálogo (ex.: "Excluir 3 projetos?"). */
  titulo: string
  /** O que vai acontecer, e que não há como desfazer. */
  descricao: string
  /** O que será afetado, nome por nome. Lista longa rola dentro da moldura. */
  itens?: string[]
  rotuloConfirmar: string
  carregando?: boolean
  aoConfirmar: () => void
  aoCancelar: () => void
}

/**
 * Última parada antes de uma ação sem volta. Pergunta, mostra exatamente o que será afetado e
 * separa cancelar de confirmar. "Cancelar" vem antes no HTML, então é o botão que recebe o foco
 * ao abrir: quem só aperta Enter sai sem estragar nada.
 */
export function DialogoDeConfirmacao({
  aberto,
  titulo,
  descricao,
  itens,
  rotuloConfirmar,
  carregando,
  aoConfirmar,
  aoCancelar,
}: DialogoDeConfirmacaoProps) {
  return (
    <Modal
      open={aberto}
      onClose={aoCancelar}
      label={titulo}
      tone="surface"
      className="mx-auto max-w-md p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {/* Espaço à direita para não passar por baixo do "Fechar" do Modal. */}
          <h2 className="pr-10 text-xl">{titulo}</h2>
          <p className="text-sm text-fg-muted">{descricao}</p>
        </div>

        {itens && itens.length > 0 && (
          <ul className="max-h-40 overflow-y-auto rounded-md border border-border bg-subtle px-4 py-3 text-sm">
            {itens.map((item, indice) => (
              <li key={`${indice}-${item}`} className="py-0.5">
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={aoCancelar} disabled={carregando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={aoConfirmar} loading={carregando}>
            {rotuloConfirmar}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
