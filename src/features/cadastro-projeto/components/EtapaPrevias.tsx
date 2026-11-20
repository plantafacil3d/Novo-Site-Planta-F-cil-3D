import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { FileInput } from '@/components/ui/FileInput'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_IMAGEM } from '../rules'
import { GradeDeImagens } from './GradeDeImagens'
import { PainelDaEtapa } from './PainelDaEtapa'

/**
 * Aba "Prévias do Projeto" (opcional): fotos de plantas e detalhamentos que a página do projeto mostra
 * antes da compra. Sem nenhuma foto, a seção não aparece no site. Mesmo caminho das demais imagens:
 * reduzidas e convertidas para WebP ao escolher (2400 px, como a planta humanizada, por causa do texto
 * pequeno dos desenhos) e enviadas quando o usuário clica em Salvar.
 */
export function EtapaPrevias({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe, campo, avisosDeArquivo } = form
  const previas = campo('imagensPrevia')

  return (
    <PainelDaEtapa
      titulo="Prévias do Projeto"
      descricao="Opcional. Fotos de plantas e detalhamentos que aparecem na página do projeto antes da compra; sem nenhuma, a seção não aparece no site. A ordem daqui é a ordem no site. As imagens são enviadas quando você clicar em Salvar."
    >
      <FileInput
        id={previas.id}
        name={previas.name}
        label="Escolher imagens"
        hint="JPG, PNG ou WEBP, até 20 MB cada. Ao escolher, reduzimos para 2400 px e convertemos para WebP. Envie quantas quiser."
        accept={ARQUIVOS_DE_IMAGEM.accept}
        multiple
        invalid={previas.invalid}
        aria-describedby={previas['aria-describedby']}
        onFiles={(arquivos) => form.enviarImagens('imagensPrevia', arquivos)}
      />
      <MensagensDeArquivo
        id={previas.id}
        erro={erroDe('imagensPrevia')}
        recusas={avisosDeArquivo.imagensPrevia}
      />
      <GradeDeImagens
        imagens={dados.imagensPrevia}
        rotuloDeRemover={(_imagem, indice) => `Remover a prévia ${indice + 1}`}
        aoRemover={(id) => form.removerImagem('imagensPrevia', id)}
        aoReordenar={(origem, destino) => form.reordenarImagens(origem, destino, 'imagensPrevia')}
        aoMoverParaInicio={(ids) => form.moverImagensParaInicio(ids, 'imagensPrevia')}
      />
    </PainelDaEtapa>
  )
}
