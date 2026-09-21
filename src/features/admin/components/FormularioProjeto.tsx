'use client'

import { useActionState, useEffect, useRef, useTransition } from 'react'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import { salvarProjeto } from '../actions'
import { centavosParaCampo, diferenciaisDeProjeto, selosDeProjeto } from '../rules'
import type { EstadoFormulario, ProjetoAdminCompleto } from '../types'

type Opcao = { valor: string; rotulo: string }

type FormularioProjetoProps = {
  /** Sem projeto = cadastro novo; com projeto = edição. */
  projeto?: ProjetoAdminCompleto
  /** Opções dos selects; vêm da tela porque o catálogo mora em `features/projetos` (código de servidor). */
  tipos: readonly Opcao[]
  estilos: readonly Opcao[]
}

const avisoSucesso =
  'rounded-md border border-notification-success-border bg-notification-success-bg px-4 py-3 text-sm text-notification-success-fg'
const avisoErro =
  'rounded-md border border-notification-error-border bg-notification-error-bg px-4 py-3 text-sm text-notification-error-fg'

/** Texto de um campo numérico opcional: vazio quando não há valor. */
const numero = (valor: number | undefined) => (valor === undefined ? '' : String(valor))

/**
 * Cadastro do projeto: etapa 1 (básico) e etapa 2 (especificações). Salva sempre como rascunho;
 * a publicação vem na etapa final. O envio é feito à mão (sem `action` no `<form>`) para o React
 * não limpar os campos quando há erro de validação.
 */
export function FormularioProjeto({ projeto, tipos, estilos }: FormularioProjetoProps) {
  const [estado, salvar] = useActionState<EstadoFormulario, FormData>(
    salvarProjeto.bind(null, projeto?.id ?? null),
    null,
  )
  const [pendente, iniciar] = useTransition()
  const avisoRef = useRef<HTMLParagraphElement>(null)
  const erros = estado?.erros ?? {}

  // Leva o foco para o aviso de erro, para leitor de tela e para quem está no fim do formulário.
  useEffect(() => {
    if (estado && !estado.ok) avisoRef.current?.focus()
  }, [estado])

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    iniciar(() => salvar(dados))
  }

  /** Propriedades comuns de um campo: id, nome, erro e ligação com a mensagem de erro. */
  const campo = (nome: string) => ({
    id: nome,
    name: nome,
    invalid: Boolean(erros[nome]),
    'aria-describedby': erros[nome] ? `${nome}-erro` : undefined,
  })

  return (
    <form onSubmit={aoEnviar} noValidate className="flex flex-col gap-10">
      {estado && (
        <p
          ref={avisoRef}
          tabIndex={-1}
          role={estado.ok ? 'status' : 'alert'}
          className={estado.ok ? avisoSucesso : avisoErro}
        >
          {estado.mensagem}
        </p>
      )}

      <section aria-labelledby="etapa-basico" className="flex flex-col gap-5">
        <h2 id="etapa-basico" className="text-xl">
          1. Básico
        </h2>

        <Field label="Título do projeto" htmlFor="titulo" error={erros.titulo}>
          <Input
            {...campo('titulo')}
            required
            maxLength={200}
            defaultValue={projeto?.titulo}
            placeholder="Ex.: Sobrado Pequeno, Moderno e Inteligente"
          />
        </Field>

        <Field
          label="Endereço do projeto (slug)"
          htmlFor="slug"
          error={erros.slug}
          hint="Parte final do link do projeto. Deixe em branco para gerar a partir do título."
        >
          <Input
            {...campo('slug')}
            maxLength={100}
            defaultValue={projeto?.slug}
            placeholder="sobrado-pequeno-moderno-e-inteligente"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tipo" htmlFor="tipo" error={erros.tipo}>
            <Select {...campo('tipo')} defaultValue={projeto?.tipo ?? ''} required>
              <option value="" disabled>
                Escolha o tipo
              </option>
              {tipos.map((tipo) => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.rotulo}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Estilo" htmlFor="estilo" error={erros.estilo}>
            <Select {...campo('estilo')} defaultValue={projeto?.estilo ?? ''}>
              <option value="">Não informado</option>
              {estilos.map((estilo) => (
                <option key={estilo.valor} value={estilo.valor}>
                  {estilo.rotulo}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Preço (R$)" htmlFor="preco" error={erros.preco}>
            <Input
              {...campo('preco')}
              inputMode="decimal"
              defaultValue={centavosParaCampo(projeto?.precoCentavos ?? 0)}
              placeholder="399,90"
            />
          </Field>

          <Field label="Selo" htmlFor="selo" error={erros.selo}>
            <Select {...campo('selo')} defaultValue={projeto?.selo ?? ''}>
              <option value="">Sem selo</option>
              {selosDeProjeto.map((selo) => (
                <option key={selo.valor} value={selo.valor}>
                  {selo.rotulo}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field
          label="Link de compra (checkout)"
          htmlFor="checkoutUrl"
          error={erros.checkoutUrl}
          hint="Link da plataforma de vendas. Precisa começar com https://"
        >
          <Input
            {...campo('checkoutUrl')}
            type="url"
            inputMode="url"
            maxLength={500}
            defaultValue={projeto?.checkoutUrl}
            placeholder="https://pay.hotmart.com/..."
          />
        </Field>

        <Field
          label="Resumo"
          htmlFor="resumo"
          error={erros.resumo}
          hint="Frase curta que aparece no topo da página do projeto."
        >
          <Textarea {...campo('resumo')} rows={2} maxLength={300} defaultValue={projeto?.resumo} />
        </Field>

        <Field label="Descrição" htmlFor="descricao" error={erros.descricao}>
          <Textarea
            {...campo('descricao')}
            rows={5}
            maxLength={1500}
            defaultValue={projeto?.descricao}
          />
        </Field>
      </section>

      <section aria-labelledby="etapa-especificacoes" className="flex flex-col gap-5">
        <h2 id="etapa-especificacoes" className="text-xl">
          2. Especificações
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Largura (m)" htmlFor="larguraM" error={erros.larguraM}>
            <Input
              {...campo('larguraM')}
              inputMode="decimal"
              defaultValue={numero(projeto?.larguraM)}
              placeholder="10"
            />
          </Field>
          <Field label="Profundidade (m)" htmlFor="profundidadeM" error={erros.profundidadeM}>
            <Input
              {...campo('profundidadeM')}
              inputMode="decimal"
              defaultValue={numero(projeto?.profundidadeM)}
              placeholder="20"
            />
          </Field>
          <Field
            label="Área construída (m²)"
            htmlFor="areaConstruidaM2"
            error={erros.areaConstruidaM2}
          >
            <Input
              {...campo('areaConstruidaM2')}
              inputMode="numeric"
              defaultValue={numero(projeto?.areaConstruidaM2)}
              placeholder="120"
            />
          </Field>
          <Field label="Suítes" htmlFor="suites" error={erros.suites}>
            <Input
              {...campo('suites')}
              inputMode="numeric"
              defaultValue={numero(projeto?.suites)}
              placeholder="1"
            />
          </Field>
          <Field label="Quartos (além das suítes)" htmlFor="quartos" error={erros.quartos}>
            <Input
              {...campo('quartos')}
              inputMode="numeric"
              defaultValue={numero(projeto?.quartos)}
              placeholder="2"
            />
          </Field>
          <Field label="Banheiros" htmlFor="banheiros" error={erros.banheiros}>
            <Input
              {...campo('banheiros')}
              inputMode="numeric"
              defaultValue={numero(projeto?.banheiros)}
              placeholder="3"
            />
          </Field>
          <Field label="Vagas de garagem" htmlFor="vagas" error={erros.vagas}>
            <Input
              {...campo('vagas')}
              inputMode="numeric"
              defaultValue={numero(projeto?.vagas)}
              placeholder="2"
            />
          </Field>
          <Field label="Pavimentos" htmlFor="pavimentos" error={erros.pavimentos}>
            <Input
              {...campo('pavimentos')}
              inputMode="numeric"
              defaultValue={numero(projeto?.pavimentos)}
              placeholder="2"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-x-8">
          <Checkbox name="piscina" label="Tem piscina" defaultChecked={projeto?.piscina} />
          <Checkbox name="closet" label="Tem closet" defaultChecked={projeto?.closet} />
          <Checkbox
            name="areaGourmet"
            label="Tem área gourmet"
            defaultChecked={projeto?.areaGourmet}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Diferencial em destaque"
            htmlFor="diferencialTipo"
            error={erros.diferencialTipo}
          >
            <Select {...campo('diferencialTipo')} defaultValue={projeto?.diferencialTipo ?? ''}>
              <option value="">Nenhum</option>
              {diferenciaisDeProjeto.map((diferencial) => (
                <option key={diferencial.valor} value={diferencial.valor}>
                  {diferencial.rotulo}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Texto do diferencial"
            htmlFor="diferencialRotulo"
            error={erros.diferencialRotulo}
            hint="Aparece no card do projeto. Ex.: Piscina opcional."
          >
            <Input
              {...campo('diferencialRotulo')}
              maxLength={80}
              defaultValue={projeto?.diferencialRotulo}
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" iconLeft="check" loading={pendente}>
          Salvar rascunho
        </Button>
        <Button variant="secondary" href="/admin/projetos">
          Voltar para a lista
        </Button>
      </div>
    </form>
  )
}
