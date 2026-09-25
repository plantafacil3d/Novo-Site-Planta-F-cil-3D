import { Icon, type IconName } from '@/components/ui/Icon'

type Marco = { icon: IconName; title: string; description: string }

const marcos: Marco[] = [
  {
    icon: 'youtube',
    title: 'O canal no YouTube',
    description:
      'Depois da minha formação, criei o canal Planta Fácil 3D para facilitar o acesso à arquitetura com conteúdo educativo e projetos prontos a preços acessíveis. O canal cresceu rápido.',
  },
  {
    icon: 'house',
    title: '2021 · Nasce o site oficial',
    description:
      'Com o sucesso do canal, criamos a plataforma oficial para qualquer pessoa adquirir seu projeto com praticidade, segurança e excelente custo-benefício.',
  },
  {
    icon: 'users',
    title: 'Milhares de famílias atendidas',
    description:
      'Nosso modelo de venda digital em escala mantém os preços baixos sem abrir mão do rigor técnico e do bom design — e já alcançou milhares de famílias que sonhavam com a casa própria.',
  },
]

/** Linha do tempo da história da empresa: ícone + título + descrição, com fio conectando os marcos. */
export function Timeline() {
  return (
    <ol className="flex flex-col gap-8">
      {marcos.map((marco, index) => (
        <li key={marco.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-fg-inverse">
              <Icon name={marco.icon} className="size-5" strokeWidth={1.5} />
            </span>
            {index < marcos.length - 1 && (
              <span className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />
            )}
          </div>
          <div className="pb-2">
            <h3 className="font-body text-base font-semibold">{marco.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{marco.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
