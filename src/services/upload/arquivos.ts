// Utilidades genéricas sobre metadados de arquivo, promovidas de `cadastro-projeto/rules.ts`:
// também servem a biblioteca de arquivos de exemplo (skill `arquitetura` §2: só promover com reuso
// real). Continuam puras, sem depender de nenhum limite específico de feature.

const MB = 1024 * 1024
const numeroPtBr = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** 1536 → "1,5 KB"; 2411724 → "2,3 MB". */
export function formatarTamanho(bytes: number): string {
  if (bytes < MB) return `${numeroPtBr.format(bytes / 1024)} KB`
  return `${numeroPtBr.format(bytes / MB)} MB`
}

export const extensaoDe = (nome: string) => nome.split('.').pop()?.toLowerCase() ?? ''
