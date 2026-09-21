import { FormularioProjeto } from '@/features/cadastro-projeto'

/** Tela de cadastro de projeto do painel. */
export function ProjetoFormAdminView() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">Cadastrar projeto</h1>
        <p className="mt-2 text-fg-muted">
          Preencha as 7 etapas. Para salvar como rascunho, basta o título.
        </p>
      </div>

      <FormularioProjeto />
    </div>
  )
}
