import type { ReactNode } from 'react'

import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { Button } from '@/components/ui/Button'
import { Dica } from '@/components/ui/Dica'
import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import { etapasDaObra } from '../catalogo'
import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_IMAGEM, LIMITES } from '../rules'
import type { ComentarioDoCadastro } from '../types'
import { GradeDeImagens } from './GradeDeImagens'
import { NotaEmEstrelas } from './NotaEmEstrelas'
import { PainelDaEtapa } from './PainelDaEtapa'

// Pedido do usuário: nesta aba, pouco texto à vista. Toda explicação fica no ícone "i" (`Dica`); só os
// erros aparecem em texto, porque precisam estar sempre visíveis.

/** Bloco da aba: título com a explicação no "i" e o que vier dentro. */
function Grupo({ titulo, dica, children }: { titulo: string; dica: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-base">
        {titulo}
        <Dica texto={dica} />
      </h3>
      {children}
    </section>
  )
}

/** Um comentário, compacto: estrelas e remover em cima, o texto, e nome + cidade lado a lado. Os
 *  rótulos ficam só para o leitor de tela; à vista, o que diz o que é cada campo é o placeholder. */
function CartaoComentario({
  form,
  comentario,
  indice,
}: {
  form: FormularioProjetoApi
  comentario: ComentarioDoCadastro
  indice: number
}) {
  const { erroDe, campo } = form
  const chave = (nome: 'texto' | 'nome' | 'cidade') => `comentariosClientes.${indice}.${nome}`
  const mudar = (patch: Partial<Omit<ComentarioDoCadastro, 'id'>>) =>
    form.atualizarComentario(comentario.id, patch)

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <NotaEmEstrelas
          name={`nota-${comentario.id}`}
          legenda={`Estrelas do comentário ${indice + 1}`}
          valor={comentario.nota}
          aoMudar={(nota) => mudar({ nota })}
        />
        <IconButton
          icon="trash"
          tone="quiet"
          label={`Remover o comentário ${indice + 1}`}
          onClick={() => form.removerComentario(comentario.id)}
        />
      </div>

      <Field
        label={`Comentário ${indice + 1}`}
        hideLabel
        htmlFor={campo(chave('texto')).id}
        error={erroDe(chave('texto'))}
      >
        <Textarea
          {...campo(chave('texto'))}
          value={comentario.texto}
          rows={2}
          maxLength={LIMITES.comentarioTextoMax}
          placeholder="Comentário do cliente"
          onChange={(evento) => mudar({ texto: evento.target.value })}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label={`Nome do comentário ${indice + 1}`}
          hideLabel
          htmlFor={campo(chave('nome')).id}
          error={erroDe(chave('nome'))}
        >
          <Input
            {...campo(chave('nome'))}
            value={comentario.nome}
            maxLength={LIMITES.comentarioNomeMax}
            autoComplete="off"
            placeholder="Nome"
            onChange={(evento) => mudar({ nome: evento.target.value })}
          />
        </Field>
        <Field
          label={`Cidade e estado do comentário ${indice + 1}`}
          hideLabel
          htmlFor={campo(chave('cidade')).id}
          error={erroDe(chave('cidade'))}
        >
          <Input
            {...campo(chave('cidade'))}
            value={comentario.cidade}
            maxLength={LIMITES.comentarioCidadeMax}
            autoComplete="off"
            placeholder="Cidade-UF"
            onChange={(evento) => mudar({ cidade: evento.target.value })}
          />
        </Field>
      </div>
    </li>
  )
}

/** Situação e cidade de uma foto de obra, compactos sob a miniatura. Os dois são opcionais; os
 *  rótulos ficam só para o leitor de tela. */
function LegendaDaFoto({
  form,
  imagemId,
  indice,
}: {
  form: FormularioProjetoApi
  imagemId: string
  indice: number
}) {
  const { erroDe, campo } = form
  const legenda = form.dados.legendasObra[imagemId] ?? { etapa: '', cidade: '' }
  const chave = (nome: 'etapa' | 'cidade') => `legendasObra.${imagemId}.${nome}`

  return (
    <div className="grid grid-cols-2 gap-2">
      <Field
        label={`Situação da obra ${indice + 1}`}
        hideLabel
        htmlFor={campo(chave('etapa')).id}
        error={erroDe(chave('etapa'))}
      >
        <Select
          {...campo(chave('etapa'))}
          value={legenda.etapa}
          onChange={(evento) => form.atualizarLegendaObra(imagemId, { etapa: evento.target.value })}
        >
          <option value="">Situação</option>
          {etapasDaObra.map((etapa) => (
            <option key={etapa.valor} value={etapa.valor}>
              {etapa.rotulo}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        label={`Cidade e estado da obra ${indice + 1}`}
        hideLabel
        htmlFor={campo(chave('cidade')).id}
        error={erroDe(chave('cidade'))}
      >
        <Input
          {...campo(chave('cidade'))}
          value={legenda.cidade}
          maxLength={LIMITES.obraCidadeMax}
          autoComplete="off"
          placeholder="Cidade-UF"
          onChange={(evento) =>
            form.atualizarLegendaObra(imagemId, { cidade: evento.target.value })
          }
        />
      </Field>
    </div>
  )
}

/**
 * Aba "Marketing" (opcional): alimenta a seção "O que nossos clientes dizem" da página do projeto.
 * Prints de conversa enviados como foto (reduzidos no navegador para 800 px de largura e convertidos
 * para WebP, enviados ao Salvar) e comentários escritos aqui. Sem nenhum print, a seção inteira não
 * aparece no site; sem comentários, só a fileira deles some. Também monta a seção "Do projeto à obra":
 * até 5 fotos de obras de clientes (reduzidas como as fotos do projeto), cada uma com situação e
 * cidade opcionais. Sem fotos, essa seção não aparece.
 */
export function EtapaMarketing({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe, campo, avisosDeArquivo } = form
  const prints = campo('imagensDepoimento')
  const obras = campo('imagensObra')
  const limiteAtingido = dados.comentariosClientes.length >= LIMITES.comentariosMax
  const obrasCompletas = dados.imagensObra.length >= LIMITES.obrasMax

  return (
    <PainelDaEtapa
      titulo="Marketing"
      dica="Opcional. Monta a faixa de clientes no topo da página e as seções “O que nossos clientes dizem” e “Do projeto à obra”. Cada parte só aparece se for preenchida. As imagens sobem quando você clicar em Salvar."
    >
      <Grupo
        titulo="Clientes que compraram"
        dica="Faixa no topo da página do projeto: “★★★★★ 4,9 · 128 clientes já compraram este projeto”, com avatares de cores sorteadas. Sem a quantidade de clientes, a faixa não aparece. A nota é opcional, de 1 a 5."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Quantidade de clientes"
            hideLabel
            htmlFor={campo('provaSocialClientes').id}
            error={erroDe('provaSocialClientes')}
          >
            <Input
              {...form.campoNumero('provaSocialClientes', false)}
              placeholder="Clientes (ex.: 128)"
            />
          </Field>
          <Field
            label="Nota de 1 a 5"
            hideLabel
            htmlFor={campo('provaSocialNota').id}
            error={erroDe('provaSocialNota')}
          >
            <Input {...form.campoNumero('provaSocialNota', true)} placeholder="Nota (ex.: 4,9)" />
          </Field>
        </div>
      </Grupo>

      <Grupo
        titulo="Prints de clientes"
        dica="Prints do WhatsApp, do SketchUp ou do Instagram, em JPG, PNG ou WEBP. Cada um vira um cartão, na ordem daqui. Imagens grandes são reduzidas sozinhas."
      >
        <FileInput
          id={prints.id}
          name={prints.name}
          label="Escolher prints"
          accept={ARQUIVOS_DE_IMAGEM.accept}
          multiple
          invalid={prints.invalid}
          aria-describedby={prints['aria-describedby']}
          onFiles={(arquivos) => form.enviarImagens('imagensDepoimento', arquivos)}
        />
        <MensagensDeArquivo
          id={prints.id}
          erro={erroDe('imagensDepoimento')}
          recusas={avisosDeArquivo.imagensDepoimento}
        />
        <GradeDeImagens
          imagens={dados.imagensDepoimento}
          rotuloDeRemover={(_imagem, indice) => `Remover o print ${indice + 1}`}
          aoRemover={(id) => form.removerImagem('imagensDepoimento', id)}
          aoReordenar={(origem, destino) =>
            form.reordenarImagens(origem, destino, 'imagensDepoimento')
          }
          aoMoverParaInicio={(ids) => form.moverImagensParaInicio(ids, 'imagensDepoimento')}
        />
      </Grupo>

      <Grupo
        titulo="Comentários"
        dica="Aparecem abaixo dos prints, com as estrelas e “Compra verificada”. Sem nenhum, essa parte não aparece."
      >
        {dados.comentariosClientes.length > 0 && (
          <ul className="flex flex-col gap-3">
            {dados.comentariosClientes.map((comentario, indice) => (
              <CartaoComentario
                key={comentario.id}
                form={form}
                comentario={comentario}
                indice={indice}
              />
            ))}
          </ul>
        )}
        <MensagensDeArquivo
          id={campo('comentariosClientes').id}
          erro={erroDe('comentariosClientes')}
        />
        <div>
          <Button
            variant="secondary"
            iconLeft="plus"
            onClick={form.adicionarComentario}
            disabled={limiteAtingido}
          >
            Adicionar comentário
          </Button>
        </div>
      </Grupo>

      <Grupo
        titulo="Obras de clientes"
        dica={`Fotos de obras de quem construiu este modelo, até ${LIMITES.obrasMax}. A primeira aparece grande. Situação e cidade são opcionais e aparecem num selo sobre a foto.`}
      >
        <FileInput
          id={obras.id}
          name={obras.name}
          label={obrasCompletas ? `Limite de ${LIMITES.obrasMax} fotos` : 'Escolher fotos'}
          accept={ARQUIVOS_DE_IMAGEM.accept}
          multiple
          disabled={obrasCompletas}
          invalid={obras.invalid}
          aria-describedby={obras['aria-describedby']}
          onFiles={(arquivos) => form.enviarImagens('imagensObra', arquivos)}
        />
        <MensagensDeArquivo
          id={obras.id}
          erro={erroDe('imagensObra')}
          recusas={avisosDeArquivo.imagensObra}
        />
        <GradeDeImagens
          imagens={dados.imagensObra}
          rotuloDeRemover={(_imagem, indice) => `Remover a foto de obra ${indice + 1}`}
          aoRemover={(id) => form.removerImagem('imagensObra', id)}
          aoReordenar={(origem, destino) => form.reordenarImagens(origem, destino, 'imagensObra')}
          extra={(imagem, indice) => (
            <LegendaDaFoto form={form} imagemId={imagem.id} indice={indice} />
          )}
        />
      </Grupo>
    </PainelDaEtapa>
  )
}
