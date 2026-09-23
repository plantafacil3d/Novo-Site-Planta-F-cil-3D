import type { ProjectSpec } from '@/components/shared/ProjectCard'

import { descreverProjeto } from '../rules'
import type { Projeto } from '../types'

/** Especificações exibidas no card de projeto (home e projetos relacionados). */
export function especificacoesDoCard(projeto: Projeto): ProjectSpec[] {
  const texto = descreverProjeto(projeto)
  return [
    { icon: 'ruler', label: texto.terreno },
    { icon: 'house', label: texto.areaConstruida },
    { icon: 'bed-double', label: texto.quartos },
    { icon: 'bath', label: texto.banheiros },
    { icon: 'car', label: texto.vagas },
    { icon: 'waves', label: texto.piscina },
  ]
}
