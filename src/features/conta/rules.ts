/** Para onde levar quem acabou de entrar: administrador vai ao painel, cliente ao início. */
export function destinoAposEntrar(ehAdmin: boolean): string {
  return ehAdmin ? '/admin/projetos' : '/'
}

/** Mensagens do login com Google, escolhidas por uma chave fixa da URL (nunca texto vindo dela). */
const mensagensErroLogin = {
  acesso_negado: 'Esta conta não tem acesso ao painel.',
  falha_login: 'Não foi possível entrar com o Google. Tente novamente.',
} as const

export function mensagemErroLogin(chave: string | undefined): string | undefined {
  return chave && chave in mensagensErroLogin
    ? mensagensErroLogin[chave as keyof typeof mensagensErroLogin]
    : undefined
}

/** Botão de conta do cabeçalho: `null` = ainda não sabemos (ou sem sessão) → "Minha conta". */
export function acaoDaConta(ehAdmin: boolean | null): {
  label: string
  href: string
  icone: 'user' | 'dashboard'
} {
  return ehAdmin
    ? { label: 'Painel', href: destinoAposEntrar(true), icone: 'dashboard' }
    : { label: 'Minha conta', href: '/admin/entrar', icone: 'user' }
}
