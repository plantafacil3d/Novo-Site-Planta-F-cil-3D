import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import { camposDeCaracteristicas } from '../catalogo'
import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 3: medidas, cômodos, vagas, pavimentos e Sim/Não de piscina e área gourmet. Tudo obrigatório. */
export function EtapaCaracteristicas({ form }: { form: FormularioProjetoApi }) {
  const { erroDe, campoNumero, campoTexto } = form

  return (
    <PainelDaEtapa
      titulo="Características"
      descricao="Todos os campos são obrigatórios. Use 0 quando o projeto não tiver."
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {camposDeCaracteristicas.map((item) => (
          <Field
            key={item.chave}
            label={`${item.rotulo} *`}
            htmlFor={`campo-${item.chave}`}
            error={erroDe(item.chave)}
          >
            <Input {...campoNumero(item.chave, item.decimal)} />
          </Field>
        ))}

        <Field label="Piscina *" htmlFor="campo-piscina" error={erroDe('piscina')}>
          <Select {...campoTexto('piscina')}>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </Select>
        </Field>

        <Field label="Closet *" htmlFor="campo-closet" error={erroDe('closet')}>
          <Select {...campoTexto('closet')}>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </Select>
        </Field>

        <Field label="Área Gourmet *" htmlFor="campo-areaGourmet" error={erroDe('areaGourmet')}>
          <Select {...campoTexto('areaGourmet')}>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </Select>
        </Field>
      </div>
    </PainelDaEtapa>
  )
}
