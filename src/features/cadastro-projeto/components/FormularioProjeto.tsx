'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { Tabs } from '@/components/navigation/Tabs'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

import { etapasDoCadastro } from '../catalogo'
import { useFormularioProjeto } from '../hooks/useFormularioProjeto'
import type { ArquivoDeExemplo, DadosProjeto, EtapaId } from '../types'
import { EtapaArquivosExemplo } from './EtapaArquivosExemplo'
import { EtapaCaracteristicas } from './EtapaCaracteristicas'
import { EtapaComplementares } from './EtapaComplementares'
import { EtapaEntrega } from './EtapaEntrega'
import { EtapaImagens } from './EtapaImagens'
import { EtapaInformacoesGerais } from './EtapaInformacoesGerais'
import { EtapaItensIncluidos } from './EtapaItensIncluidos'
import { EtapaPlantaHumanizada } from './EtapaPlantaHumanizada'

type FormularioProjetoProps = {
  /** Projeto para editar: o formulário já vem preenchido. Sem ele, cadastro novo, tudo vazio. */
  projetoInicial?: DadosProjeto
  /** Id do projeto em edição, junto de `projetoInicial`: sem ele, "Salvar" cria um projeto novo. */
  projetoId?: string
  /** Endereço público já gravado do projeto em edição (fixo desde a criação). */
  slugAtual?: string
  /** Arquivos da biblioteca de exemplos do arquiteto (aba 5). Vazia por enquanto. */
  biblioteca?: ArquivoDeExemplo[]
  /** Página onde o arquiteto envia arquivos para a biblioteca. */
  hrefEnviarArquivos?: string
}

/**
 * Cadastro de projeto em 7 abas (menu ao lado, só a aba escolhida aparece), com Anterior, Próxima
 * etapa, Salvar rascunho e Salvar. O mesmo formulário serve para criar e para editar.
 */
export function FormularioProjeto({
  projetoInicial,
  projetoId,
  slugAtual,
  biblioteca = [],
  hrefEnviarArquivos = '/admin/biblioteca',
}: FormularioProjetoProps) {
  const form = useFormularioProjeto({ projetoInicial, projetoIdInicial: projetoId, slugAtual })
  const avisoRef = useRef<HTMLDivElement>(null)

  // Aviso de sucesso recebe o foco (leitor de tela). O de erro leva o foco ao campo com problema.
  useEffect(() => {
    if (form.aviso?.tipo === 'sucesso') avisoRef.current?.focus()
  }, [form.aviso])

  const conteudos: Record<EtapaId, ReactNode> = {
    informacoes: <EtapaInformacoesGerais form={form} />,
    imagens: <EtapaImagens form={form} />,
    plantaHumanizada: <EtapaPlantaHumanizada form={form} />,
    caracteristicas: <EtapaCaracteristicas form={form} />,
    itens: <EtapaItensIncluidos form={form} />,
    exemplos: (
      <EtapaArquivosExemplo
        form={form}
        biblioteca={biblioteca}
        hrefEnviarArquivos={hrefEnviarArquivos}
      />
    ),
    complementares: <EtapaComplementares form={form} />,
    entrega: <EtapaEntrega form={form} />,
  }

  const abas = etapasDoCadastro.map((etapa, indice) => ({
    id: etapa.id,
    label: `${indice + 1}. ${etapa.rotulo}`,
    status: form.situacoes[etapa.id],
    content: conteudos[etapa.id],
  }))

  const ocupado = form.salvando !== null

  const rodape = (
    <div className="mt-6 flex flex-col gap-4">
      {form.resumoDePendencias && <Alert variant="error">{form.resumoDePendencias}</Alert>}
      {form.progresso && <Alert variant="info">{form.progresso}</Alert>}
      {form.aviso && (
        <Alert
          ref={avisoRef}
          tabIndex={-1}
          variant={form.aviso.tipo === 'sucesso' ? 'success' : 'error'}
        >
          {form.aviso.mensagem}
        </Alert>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            iconLeft="chevron-left"
            onClick={form.etapaAnterior}
            disabled={form.primeiraEtapa}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            iconRight="chevron-right"
            onClick={form.proximaEtapa}
            disabled={form.ultimaEtapa}
          >
            Próxima etapa
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => form.salvar('rascunho')}
            loading={form.salvando === 'rascunho'}
            disabled={ocupado}
          >
            Salvar rascunho
          </Button>
          <Button
            iconLeft="check"
            onClick={() => form.salvar('completo')}
            loading={form.salvando === 'completo'}
            disabled={ocupado}
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    // O envio é sempre pelos botões: Enter dentro de um campo não deve enviar nem recarregar a página.
    <form noValidate onSubmit={(evento) => evento.preventDefault()}>
      <Tabs
        label="Etapas do cadastro do projeto"
        orientation="vertical"
        items={abas}
        value={form.etapaAtual}
        onValueChange={(id) => {
          const etapa = etapasDoCadastro.find((item) => item.id === id)
          if (etapa) form.irParaEtapa(etapa.id)
        }}
        footer={rodape}
      />
    </form>
  )
}
