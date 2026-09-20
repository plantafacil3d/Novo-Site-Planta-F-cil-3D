/** Para onde levar quem acabou de entrar: administrador vai ao painel, cliente ao início. */
export function destinoAposEntrar(ehAdmin: boolean): string {
  return ehAdmin ? '/admin/projetos' : '/'
}
