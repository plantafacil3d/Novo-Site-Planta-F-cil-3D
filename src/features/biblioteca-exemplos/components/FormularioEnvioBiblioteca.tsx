'use client'

import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { Alert } from '@/components/ui/Alert'
import { FileInput } from '@/components/ui/FileInput'

import { useEnvioBiblioteca } from '../hooks/useEnvioBiblioteca'
import { ARQUIVOS_DA_BIBLIOTECA } from '../rules'

/** Envia arquivos para o acervo do administrador: imagem, PDF ou DWG, até 20 MB cada. Cada arquivo
 *  escolhido sobe direto — não existe um "Salvar" à parte para o upload. */
export function FormularioEnvioBiblioteca() {
  const { enviar, enviando, progresso, recusas, erroGeral } = useEnvioBiblioteca()

  return (
    <div className="flex flex-col gap-3">
      <FileInput
        id="envio-biblioteca"
        label={enviando ? (progresso ?? 'Enviando…') : 'Enviar arquivos para a biblioteca'}
        hint="Imagem (JPG, PNG, WEBP), PDF ou DWG, até 20 MB cada"
        accept={ARQUIVOS_DA_BIBLIOTECA.accept}
        multiple
        disabled={enviando}
        invalid={recusas.length > 0}
        aria-describedby={recusas.length > 0 ? 'envio-biblioteca-erro' : undefined}
        onFiles={enviar}
      />
      {erroGeral && <Alert variant="error">{erroGeral}</Alert>}
      <MensagensDeArquivo id="envio-biblioteca" recusas={recusas} />
    </div>
  )
}
