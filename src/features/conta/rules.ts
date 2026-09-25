/** Para onde levar quem acabou de entrar: administrador vai ao painel, cliente ao início. */
export function destinoAposEntrar(ehAdmin: boolean): string {
  return ehAdmin ? '/admin/projetos' : '/'
}

/** Mensagens do login com Google, escolhidas por uma chave fixa da URL (nunca texto vindo dela). */
const mensagensErroLogin = {
  falha_login: 'Não foi possível entrar com o Google. Tente novamente.',
} as const

export function mensagemErroLogin(chave: string | undefined): string | undefined {
  return chave && chave in mensagensErroLogin
    ? mensagensErroLogin[chave as keyof typeof mensagensErroLogin]
    : undefined
}

/**
 * Botão de conta do cabeçalho para quem já está logado: administrador vai ao painel, cliente aos
 * favoritos. Sem sessão, o cabeçalho mostra o menu "Entrar"/"Cadastro" em vez disto (ver `BotaoConta`).
 */
export function acaoDaConta(ehAdmin: boolean): {
  label: string
  href: string
  icone: 'dashboard' | 'heart'
} {
  return ehAdmin
    ? { label: 'Painel', href: destinoAposEntrar(true), icone: 'dashboard' }
    : { label: 'Favoritos', href: '/favoritos', icone: 'heart' }
}
