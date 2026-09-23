import type { ProjectSpec } from '@/components/shared/ProjectCard'

import { descreverProjeto } from '../rules'
import type { Projeto } from '../types'

/** Especificações exibidas no card de projeto (home e projetos relacionados). */
export function especificacoesDoCard(projeto: Projeto): ProjectSpec[] {
  const texto = descreverProjeto(projeto)
  const specs: ProjectSpec[] = [
    { icon: 'ruler', label: texto.medidas },
    { icon: 'bed-double', label: texto.suites },
    { icon: 'bed-single', label: texto.quartos },
    { icon: 'car', label: texto.vagas },
    { icon: 'layers', label: texto.pavimentos },
  ]
  if (projeto.diferencial) {
    const icon = projeto.diferencial.tipo === 'piscina' ? 'waves' : 'utensils'
    specs.push({ icon, label: projeto.diferencial.rotulo })
  }
  return specs
}
