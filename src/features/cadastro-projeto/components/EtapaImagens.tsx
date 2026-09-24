import type { ReactNode } from 'react'

import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { FileInput } from '@/components/ui/FileInput'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_IMAGEM } from '../rules'
import { GradeDeImagens } from './GradeDeImagens'
import { PainelDaEtapa } from './PainelDaEtapa'

const DICA_DE_IMAGEM = 'JPG, PNG ou WEBP, até 2 MB cada'

/** Bloco de uma pergunta da aba: título, explicação e o que vier dentro. */
function Grupo({ titulo, dica, children }: { titulo: string; dica: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-base">{titulo}</h3>
        <p className="text-sm text-fg-muted">{dica}</p>
      </div>
      {children}
    </section>
  )
}

/** Aba 2: imagem principal e imagens do projeto. As plantas têm aba própria ("Planta Humanizada"). */
export function EtapaImagens({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe, campo, avisosDeArquivo } = form
  const principal = campo('imagemPrincipal')
  const imagens = campo('imagens')

  return (
    <PainelDaEtapa
      titulo="Imagens"
      descricao={`${DICA_DE_IMAGEM}. As imagens são enviadas quando você clicar em Salvar.`}
    >
      <Grupo titulo="Imagem principal *" dica="Aparece no card e no topo da página do projeto.">
        {dados.imagemPrincipal ? (
          <GradeDeImagens
            imagens={[dados.imagemPrincipal]}
            rotuloDeRemover={() => 'Remover a imagem principal'}
            aoRemover={() => form.removerImagem('imagemPrincipal', dados.imagemPrincipal?.id ?? '')}
          />
        ) : (
          <FileInput
            id={principal.id}
            name={principal.name}
            label="Escolher a imagem principal"
            hint={`${DICA_DE_IMAGEM}. Só 1 imagem.`}
            accept={ARQUIVOS_DE_IMAGEM.accept}
            invalid={principal.invalid}
            aria-describedby={principal['aria-describedby']}
            onFiles={(arquivos) => form.enviarImagens('imagemPrincipal', arquivos)}
          />
        )}
        <MensagensDeArquivo
          id={principal.id}
          erro={erroDe('imagemPrincipal')}
          recusas={avisosDeArquivo.imagemPrincipal}
        />
      </Grupo>

      <Grupo titulo="Imagens do projeto *" dica="Fotos e renders da casa. Envie quantas quiser.">
        <FileInput
          id={imagens.id}
          name={imagens.name}
          label="Escolher imagens"
          hint={DICA_DE_IMAGEM}
          accept={ARQUIVOS_DE_IMAGEM.accept}
          multiple
          invalid={imagens.invalid}
          aria-describedby={imagens['aria-describedby']}
          onFiles={(arquivos) => form.enviarImagens('imagens', arquivos)}
        />
        <MensagensDeArquivo
          id={imagens.id}
          erro={erroDe('imagens')}
          recusas={avisosDeArquivo.imagens}
        />
        <GradeDeImagens
          imagens={dados.imagens}
          rotuloDeRemover={(_imagem, indice) => `Remover a imagem ${indice + 1}`}
          aoRemover={(id) => form.removerImagem('imagens', id)}
        />
      </Grupo>
    </PainelDaEtapa>
  )
}
