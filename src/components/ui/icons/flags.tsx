import type { SVGProps } from 'react'

// Bandeiras não existem no Lucide e não usam `currentColor`: cor própria, como o ícone
// do Google em brand.tsx. viewBox 3:2 (proporção usual de bandeira) para não distorcer.
type FlagIconProps = SVGProps<SVGSVGElement>

export function FlagUS(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={(y * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3C3B6E" />
    </svg>
  )
}

export function FlagBR(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#009739" />
      <polygon points="15,2 28,10 15,18 2,10" fill="#FEDD00" />
      <circle cx="15" cy="10" r="5" fill="#012169" />
    </svg>
  )
}

export function FlagES(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </svg>
  )
}

export function FlagFR(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="10" height="20" fill="#0055A4" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#EF4135" />
    </svg>
  )
}

export function FlagIT(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </svg>
  )
}

export function FlagDE(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#FFCE00" />
      <rect width="30" height="13.34" fill="#DD0000" />
      <rect width="30" height="6.67" fill="#000" />
    </svg>
  )
}

export function FlagJP(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  )
}

export function FlagCN(props: FlagIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" {...props}>
      <rect width="30" height="20" fill="#DE2910" />
      <polygon
        points="7,3 8.2,6.4 11.8,6.4 8.9,8.6 10,12 7,9.8 4,12 5.1,8.6 2.2,6.4 5.8,6.4"
        fill="#FFDE00"
      />
    </svg>
  )
}
