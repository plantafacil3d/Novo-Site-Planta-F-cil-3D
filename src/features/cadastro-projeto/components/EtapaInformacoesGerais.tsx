import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import { categoriasDoCadastro, estilosDoCadastro } from '../catalogo'
import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { LIMITES, gerarSlug } from '../rules'
import { CampoTags } from './CampoTags'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 1: título, preços, categoria, estilo, descrições, tags e vídeo. */
export function EtapaInformacoesGerais({ form }: { form: FormularioProjetoApi }) {
  const { dados, slugAtual, erroDe, campoTexto, campoPreco, campoCodigoYoutube } = form
  // Num projeto novo, o slug ainda não existe: mostra a prévia de como vai nascer. Num projeto já
  // existente, o endereço é fixo desde a criação (editar o título não muda o link) — mostra o real
  // gravado, não um recálculo, para a tela nunca sugerir uma mudança que não vai acontecer.
  const slug = slugAtual ?? gerarSlug(dados.titulo)
  const resumoAbaixoDoMinimo = dados.resumo.length < LIMITES.resumoMin

  return (
    <PainelDaEtapa
      titulo="Informações Gerais"
      descricao="Os dados principais que o cliente vê no card e no topo da página do projeto."
    >
      <Field
        label="Título do projeto *"
        htmlFor="campo-titulo"
        error={erroDe('titulo')}
        counter={`${dados.titulo.length}/${LIMITES.tituloMax}`}
      >
        <Input {...campoTexto('titulo')} maxLength={LIMITES.tituloMax} autoComplete="off" />
      </Field>

      <Field
        label="Código do projeto"
        htmlFor="campo-codigoYoutube"
        error={erroDe('codigoYoutube')}
        hint="Opcional. Código que você usa para identificar este projeto nos vídeos do YouTube. Sempre em maiúsculas."
        counter={`${dados.codigoYoutube.length}/${LIMITES.codigoYoutubeMax}`}
      >
        <Input
          {...campoCodigoYoutube()}
          maxLength={LIMITES.codigoYoutubeMax}
          placeholder="EX.: CASA-010"
        />
      </Field>

      <Field
        label="Endereço do projeto (slug)"
        htmlFor="campo-slug"
        hint={
          slugAtual
            ? 'Definido quando o projeto foi criado. Não muda se você editar o título — assim, links já compartilhados continuam funcionando.'
            : 'Gerado automaticamente a partir do título. É a parte final do link do projeto.'
        }
      >
        <Input id="campo-slug" value={slug} readOnly className="bg-subtle text-fg-muted" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Preço normal (R$) *"
          htmlFor="campo-precoNormal"
          error={erroDe('precoNormal')}
        >
          <Input {...campoPreco('precoNormal')} placeholder="0,00" />
        </Field>
        <Field
          label="Preço promocional (R$)"
          htmlFor="campo-precoPromocional"
          error={erroDe('precoPromocional')}
          hint="Opcional. Precisa ser menor que o preço normal."
        >
          <Input {...campoPreco('precoPromocional')} placeholder="0,00" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Categoria" htmlFor="campo-categoria" error={erroDe('categoria')}>
          <Select {...campoTexto('categoria')}>
            <option value="">Selecione</option>
            {categoriasDoCadastro.map((categoria) => (
              <option key={categoria.valor} value={categoria.valor}>
                {categoria.rotulo}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estilo arquitetônico" htmlFor="campo-estilo" error={erroDe('estilo')}>
          <Select {...campoTexto('estilo')}>
            <option value="">Selecione</option>
            {estilosDoCadastro.map((estilo) => (
              <option key={estilo.valor} value={estilo.valor}>
                {estilo.rotulo}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Breve descrição *"
        htmlFor="campo-resumo"
        error={erroDe('resumo')}
        hint={`Aparece no topo da página do projeto. Mínimo de ${LIMITES.resumoMin} caracteres.`}
        counter={
          resumoAbaixoDoMinimo
            ? `${dados.resumo.length}/${LIMITES.resumoMin} (mínimo)`
            : `${dados.resumo.length}/${LIMITES.resumoMax}`
        }
      >
        <Textarea {...campoTexto('resumo')} rows={3} maxLength={LIMITES.resumoMax} />
      </Field>

      <Field
        label="Descrição detalhada"
        htmlFor="campo-descricao"
        error={erroDe('descricao')}
        hint="Opcional."
        counter={`${dados.descricao.length}/${LIMITES.descricaoMax}`}
      >
        <Textarea {...campoTexto('descricao')} rows={8} maxLength={LIMITES.descricaoMax} />
      </Field>

      <Field
        label="Ambientes"
        htmlFor="campo-ambientes"
        icon="layout-grid"
        error={erroDe('ambientes')}
        hint="Opcional. Aparece na página do projeto."
        counter={`${dados.ambientes.length}/${LIMITES.ambientesMax}`}
      >
        <Textarea {...campoTexto('ambientes')} rows={3} maxLength={LIMITES.ambientesMax} />
      </Field>

      <Field
        label="Indicado para"
        htmlFor="campo-indicadoPara"
        icon="users"
        error={erroDe('indicadoPara')}
        hint="Opcional. Aparece na página do projeto."
        counter={`${dados.indicadoPara.length}/${LIMITES.indicadoParaMax}`}
      >
        <Textarea {...campoTexto('indicadoPara')} rows={3} maxLength={LIMITES.indicadoParaMax} />
      </Field>

      <Field
        label="Aplicações"
        htmlFor="campo-aplicacoes"
        icon="building2"
        error={erroDe('aplicacoes')}
        hint="Opcional. Aparece na página do projeto."
        counter={`${dados.aplicacoes.length}/${LIMITES.aplicacoesMax}`}
      >
        <Textarea {...campoTexto('aplicacoes')} rows={3} maxLength={LIMITES.aplicacoesMax} />
      </Field>

      <CampoTags
        id="campo-tags"
        tags={dados.tags}
        onChange={(tags) => form.atualizar({ tags })}
        error={erroDe('tags')}
      />

      <Field
        label="Link de vídeo ou tour virtual"
        htmlFor="campo-videoUrl"
        error={erroDe('videoUrl')}
        hint="Opcional. Link do YouTube ou do Vimeo."
      >
        <Input {...campoTexto('videoUrl')} type="url" inputMode="url" placeholder="https://" />
      </Field>
    </PainelDaEtapa>
  )
}
