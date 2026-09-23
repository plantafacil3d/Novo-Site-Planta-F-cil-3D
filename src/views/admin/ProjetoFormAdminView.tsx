import { FormularioProjeto, type DadosProjeto } from '@/features/cadastro-projeto'

type ProjetoFormAdminViewProps = {
  /** Id do projeto em edição. Sem ele, a tela é de cadastro (novo projeto). */
  projetoId?: string
  projetoInicial?: DadosProjeto
  /** Endereço público já gravado do projeto em edição (fixo desde a criação). */
  slugAtual?: string
}

/** Tela de cadastro ou edição de projeto do painel (o mesmo formulário serve para os dois). */
export function ProjetoFormAdminView({
  projetoId,
  projetoInicial,
  slugAtual,
}: ProjetoFormAdminViewProps) {
  const editando = projetoId !== undefined

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">{editando ? 'Editar projeto' : 'Cadastrar projeto'}</h1>
        <p className="mt-2 text-fg-muted">
          {editando
            ? 'Altere os dados do projeto e salve para atualizar.'
            : 'Preencha as 7 etapas. Para salvar como rascunho, basta o título.'}
        </p>
      </div>

      <FormularioProjeto
        projetoId={projetoId}
        projetoInicial={projetoInicial}
        slugAtual={slugAtual}
      />
    </div>
  )
}
