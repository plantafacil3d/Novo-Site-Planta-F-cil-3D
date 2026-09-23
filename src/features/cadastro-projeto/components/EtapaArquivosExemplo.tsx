import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { extensaoDe, formatarTamanho } from '../rules'
import type { ArquivoDeExemplo } from '../types'
import { PainelDaEtapa } from './PainelDaEtapa'

/** "Imagem" / "PDF" / "DWG" / "Arquivo". DWG grava o MIME genérico `octet-stream` (sem padrão entre
 *  navegadores), então a extensão do nome original desempata esse caso. */
function rotuloDoTipo(nomeArquivo: string, tipoMime: string): string {
  if (tipoMime.startsWith('image/')) return 'Imagem'
  if (tipoMime === 'application/pdf') return 'PDF'
  if (extensaoDe(nomeArquivo) === 'dwg') return 'DWG'
  return 'Arquivo'
}

type EtapaArquivosExemploProps = {
  form: FormularioProjetoApi
  /** Arquivos da biblioteca de exemplos do arquiteto. */
  biblioteca: ArquivoDeExemplo[]
  /** Página onde o arquiteto envia arquivos para a biblioteca. */
  hrefEnviarArquivos: string
}

/** Aba 5 (opcional): marca quais arquivos da biblioteca ficam para download na página do projeto. */
export function EtapaArquivosExemplo({
  form,
  biblioteca,
  hrefEnviarArquivos,
}: EtapaArquivosExemploProps) {
  const { dados } = form

  function alternar(id: string, marcado: boolean) {
    const restantes = dados.arquivosExemplo.filter((atual) => atual !== id)
    form.atualizar({ arquivosExemplo: marcado ? [...restantes, id] : restantes })
  }

  return (
    <PainelDaEtapa
      titulo="Arquivos de Exemplo"
      descricao="Opcional. Os arquivos marcados ficam disponíveis para download na página do projeto."
    >
      {biblioteca.length === 0 ? (
        <Alert variant="warning">
          <p className="font-medium">Sua biblioteca de exemplos está vazia.</p>
          <p className="mt-1">Envie arquivos para poder oferecê-los neste projeto.</p>
          <Button href={hrefEnviarArquivos} variant="secondary" className="mt-3">
            Enviar arquivos
          </Button>
        </Alert>
      ) : (
        <>
          <fieldset className="flex flex-col">
            <legend className="sr-only">Arquivos de exemplo disponíveis</legend>
            {biblioteca.map((arquivo) => (
              <Checkbox
                key={arquivo.id}
                label={`${arquivo.nome} · ${rotuloDoTipo(arquivo.nome, arquivo.tipoMime)}, ${formatarTamanho(arquivo.tamanhoBytes)}`}
                checked={dados.arquivosExemplo.includes(arquivo.id)}
                onChange={(evento) => alternar(arquivo.id, evento.target.checked)}
              />
            ))}
          </fieldset>
          <Button href={hrefEnviarArquivos} variant="secondary" className="mt-3 self-start">
            Gerenciar biblioteca
          </Button>
        </>
      )}
    </PainelDaEtapa>
  )
}
