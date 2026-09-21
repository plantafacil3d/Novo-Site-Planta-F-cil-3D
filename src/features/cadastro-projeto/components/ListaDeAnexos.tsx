import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'

import { formatarTamanho } from '../rules'
import type { AnexoProjeto } from '../types'

type ListaDeAnexosProps = {
  anexos: AnexoProjeto[]
  /** Nome acessível do botão de remover (ex.: "Remover projeto.pdf"). */
  rotuloDeRemover: (anexo: AnexoProjeto) => string
  aoRemover: (id: string) => void
}

/** Arquivos escolhidos (PDF, ZIP, RAR): nome, tamanho e botão de remover. */
export function ListaDeAnexos({ anexos, rotuloDeRemover, aoRemover }: ListaDeAnexosProps) {
  if (anexos.length === 0) return null

  return (
    <ul className="flex flex-col gap-2">
      {anexos.map((anexo) => (
        <li
          key={anexo.id}
          className="flex items-center gap-3 rounded-md border border-border bg-surface py-1 pr-1 pl-3"
        >
          <Icon name="file-text" className="text-fg-muted" />
          <span className="min-w-0 flex-1 text-sm">
            <span className="block truncate font-medium">{anexo.nomeArquivo}</span>
            <span className="text-fg-muted">{formatarTamanho(anexo.tamanho)}</span>
          </span>
          <IconButton
            icon="trash"
            label={rotuloDeRemover(anexo)}
            onClick={() => aoRemover(anexo.id)}
            className="bg-transparent shadow-none"
          />
        </li>
      ))}
    </ul>
  )
}
