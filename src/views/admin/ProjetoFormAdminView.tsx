import { FormularioProjeto, type ProjetoAdminCompleto } from '@/features/admin'
import { estilosArquitetonicos, tiposDeProjeto } from '@/features/projetos'

type ProjetoFormAdminViewProps = {
  /** Sem projeto = cadastro novo. */
  projeto?: ProjetoAdminCompleto
  /** Chegou aqui logo depois de criar o projeto. */
  recemCriado?: boolean
}

/** Tela de cadastro e edição de projeto do painel. */
export function ProjetoFormAdminView({ projeto, recemCriado }: ProjetoFormAdminViewProps) {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl">{projeto ? 'Editar projeto' : 'Cadastrar projeto'}</h1>
        <p className="mt-2 text-fg-muted">
          {projeto
            ? `${projeto.codigo} · o projeto continua como rascunho até ser publicado.`
            : 'O projeto é salvo como rascunho e só aparece no site depois de publicado.'}
        </p>
      </div>

      {recemCriado && (
        <p
          role="status"
          className="rounded-md border border-notification-success-border bg-notification-success-bg px-4 py-3 text-sm text-notification-success-fg"
        >
          Projeto criado como rascunho. Continue preenchendo abaixo.
        </p>
      )}

      <FormularioProjeto projeto={projeto} tipos={tiposDeProjeto} estilos={estilosArquitetonicos} />
    </div>
  )
}
