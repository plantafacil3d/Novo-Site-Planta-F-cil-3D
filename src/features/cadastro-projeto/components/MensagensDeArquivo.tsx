type MensagensDeArquivoProps = {
  /** Id do campo; a mensagem de erro ganha o id `<id>-erro` (o campo aponta para ela). */
  id: string
  erro?: string
  /** Arquivos que o usuário escolheu e foram recusados, já no formato "nome: motivo". */
  recusas?: string[]
}

/** Erro do campo de arquivos e a lista do que foi recusado na última escolha. */
export function MensagensDeArquivo({ id, erro, recusas = [] }: MensagensDeArquivoProps) {
  return (
    <div aria-live="polite" className="flex flex-col gap-1 text-sm text-danger-fg">
      {erro && <p id={`${id}-erro`}>{erro}</p>}
      {recusas.length > 0 && (
        <>
          <p>Estes arquivos não foram adicionados:</p>
          <ul className="list-disc pl-5">
            {recusas.map((recusa) => (
              <li key={recusa}>{recusa}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
