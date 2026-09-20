export const siteConfig = {
  nome: 'Planta Fácil 3D',
  tagline: 'Projetos que tornam sonhos reais',
  localizacao: 'Caxias - MA | Brasil',
}

export type LinkNavegacao = { label: string; href: string }

export const navegacaoPrincipal: LinkNavegacao[] = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Complementares', href: '/complementares' },
  { label: 'Interiores', href: '/interiores' },
  { label: '3D / Unreal', href: '/3d-unreal' },
  { label: 'Sobre', href: '/sobre' },
]

export const navegacaoRodape: LinkNavegacao[] = [
  ...navegacaoPrincipal,
  { label: 'Contato', href: '/contato' },
]

// PROVISÓRIO: URLs genéricas das redes. Trocar pelos perfis reais.
export const redesSociais = [
  { icone: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { icone: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
  { icone: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
] as const

/** Link do WhatsApp com mensagem pronta. Sem número configurado, cai para a página de contato. */
export function urlWhatsapp(mensagem: string): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')
  if (!numero) return '/contato'
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

export function textoDireitosAutorais(ano = new Date().getFullYear()): string {
  return `© ${ano} ${siteConfig.nome}. Todos os direitos reservados.`
}
