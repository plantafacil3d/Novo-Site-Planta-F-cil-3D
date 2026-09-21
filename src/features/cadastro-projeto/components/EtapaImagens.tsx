import type { ReactNode } from 'react'

import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { Input } from '@/components/ui/Input'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_IMAGEM, LIMITES } from '../rules'
import { GradeDeImagens } from './GradeDeImagens'
import { MensagensDeArquivo } from './MensagensDeArquivo'
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

/** Aba 2: imagem principal, imagens do projeto e plantas (com nome). */
export function EtapaImagens({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe, campo, avisosDeArquivo } = form
  const principal = campo('imagemPrincipal')
  const imagens = campo('imagens')
  const plantas = campo('plantas')

  return (
    <PainelDaEtapa
      titulo="Imagens"
      descricao={`${DICA_DE_IMAGEM}. As imagens ficam só nesta tela até você salvar.`}
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

      <Grupo
        titulo="Plantas *"
        dica="Dê um nome a cada planta, como o pavimento a que ela pertence."
      >
        <FileInput
          id={plantas.id}
          name={plantas.name}
          label="Escolher plantas"
          hint={DICA_DE_IMAGEM}
          accept={ARQUIVOS_DE_IMAGEM.accept}
          multiple
          invalid={plantas.invalid}
          aria-describedby={plantas['aria-describedby']}
          onFiles={(arquivos) => form.enviarImagens('plantas', arquivos)}
        />
        <MensagensDeArquivo
          id={plantas.id}
          erro={erroDe('plantas')}
          recusas={avisosDeArquivo.plantas}
        />
        <GradeDeImagens
          imagens={dados.plantas}
          rotuloDeRemover={(planta, indice) => `Remover a planta ${planta.nome || indice + 1}`}
          aoRemover={(id) => form.removerImagem('plantas', id)}
          extra={(planta, indice) => {
            const chave = `plantas.${indice}.nome`
            const nome = campo(chave)
            return (
              <Field label="Nome da planta *" htmlFor={nome.id} error={erroDe(chave)}>
                <Input
                  {...nome}
                  value={planta.nome}
                  maxLength={LIMITES.plantaNomeMax}
                  placeholder="Ex.: Térreo"
                  autoComplete="off"
                  onChange={(evento) => form.atualizarNomeDaPlanta(planta.id, evento.target.value)}
                />
              </Field>
            )
          }}
        />
      </Grupo>
    </PainelDaEtapa>
  )
}
