import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { Alert } from '@/components/ui/Alert'
import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { Input } from '@/components/ui/Input'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_ENTREGA, LIMITES, formatarTamanho, somarTamanhos } from '../rules'
import { ListaDeAnexos } from './ListaDeAnexos'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 7: como o cliente recebe o projeto: arquivos diretos, link externo, ou os dois. */
export function EtapaEntrega({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe, campo, campoTexto, avisosDeArquivo } = form
  const arquivos = campo('entregaArquivos')
  const usado = somarTamanhos(dados.entregaArquivos)

  return (
    <PainelDaEtapa
      titulo="Entrega do Projeto"
      descricao="Como o cliente recebe os arquivos depois da compra."
    >
      <Alert variant="info">
        Preencha pelo menos uma das opções. Se preencher as duas, o cliente recebe as duas.
      </Alert>

      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-base">Opção 1: enviar arquivos</h3>
          <p className="text-sm text-fg-muted">
            PDF, ZIP ou RAR. Até 20 MB no total, somando todos os arquivos.
          </p>
        </div>
        <FileInput
          id={arquivos.id}
          name={arquivos.name}
          label="Escolher arquivos"
          hint="PDF, ZIP ou RAR"
          accept={ARQUIVOS_DE_ENTREGA.accept}
          multiple
          invalid={arquivos.invalid}
          aria-describedby={arquivos['aria-describedby']}
          onFiles={form.enviarArquivosDeEntrega}
        />
        <MensagensDeArquivo
          id={arquivos.id}
          erro={erroDe('entregaArquivos')}
          recusas={avisosDeArquivo.entregaArquivos}
        />
        {dados.entregaArquivos.length > 0 && (
          <p className="text-sm text-fg-muted">
            Usado: {formatarTamanho(usado)} de {formatarTamanho(LIMITES.anexoMaxBytes)}
          </p>
        )}
        <ListaDeAnexos
          anexos={dados.entregaArquivos}
          rotuloDeRemover={(anexo) => `Remover ${anexo.nomeArquivo}`}
          aoRemover={form.removerArquivoDeEntrega}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-base">Opção 2: link externo</h3>
          <p className="text-sm text-fg-muted">Google Drive, Dropbox ou outro serviço.</p>
        </div>
        <Field
          label="Link de entrega"
          htmlFor="campo-entregaLink"
          error={erroDe('entregaLink')}
          hint="O endereço precisa começar com https://"
        >
          <Input
            {...campoTexto('entregaLink')}
            type="url"
            inputMode="url"
            maxLength={LIMITES.linkMax}
            placeholder="https://"
          />
        </Field>
      </section>
    </PainelDaEtapa>
  )
}
