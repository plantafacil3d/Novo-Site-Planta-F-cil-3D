export const siteConfig = {
  nome: 'Planta Fácil 3D',
  tagline: 'Projetos que tornam sonhos reais',
  localizacao: 'Caxias - MA | Brasil',
}

/** Endereço público do site, sem barra no final. Usado em sitemap, robots, metadados e JSON-LD. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export type LinkNavegacao = { label: string; href: string }

/** Selos de confiança exibidos no hero da home e na página do projeto. */
export const selosDeConfianca = [
  { icon: 'shield-check', title: 'Compra segura', description: 'Seus dados protegidos' },
  { icon: 'cloud-download', title: 'Entrega imediata', description: 'Acesso rápido após a compra' },
  {
    icon: 'headphones',
    title: 'Suporte especializado',
    description: 'Tire suas dúvidas com a gente',
  },
] as const

export const navegacaoPrincipal: LinkNavegacao[] = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Curso Unreal 5', href: '/curso-unreal-engine' },
  { label: 'Sobre', href: '/sobre' },
]

export const navegacaoRodape: LinkNavegacao[] = [...navegacaoPrincipal]

/** WhatsApp oficial, só dígitos com DDI e DDD. A variável de ambiente, se existir, tem prioridade. */
const whatsappPadrao = '559992076875'

/** Link do WhatsApp com mensagem pronta. */
export function urlWhatsapp(mensagem: string): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || whatsappPadrao
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

export const redesSociais = [
  {
    icone: 'whatsapp',
    label: 'WhatsApp',
    href: urlWhatsapp('Olá! Vim pelo site e gostaria de tirar uma dúvida sobre os projetos.'),
  },
  { icone: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/plantafacil3d/' },
  { icone: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@plantafacil3d' },
  {
    icone: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Planta-F%C3%A1cil-3D/100063632335156/?locale=pt_BR',
  },
] as const

export function textoDireitosAutorais(ano = new Date().getFullYear()): string {
  return `© ${ano} ${siteConfig.nome}. Todos os direitos reservados.`
}
