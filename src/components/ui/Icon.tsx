import {
  ArrowRight,
  BedDouble,
  BedSingle,
  Building,
  Building2,
  Car,
  CloudDownload,
  FileText,
  Headphones,
  Heart,
  House,
  LayoutGrid,
  Layers,
  LoaderCircle,
  Menu,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingCart,
  Target,
  Trees,
  Utensils,
  Warehouse,
  Waves,
  X,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { cn } from './cn'
import { Facebook, Instagram, WhatsApp, YouTube } from './icons/brand'

// Único ponto que conhece a biblioteca de ícones: trocar de biblioteca muda só este arquivo.
const icons = {
  'arrow-right': ArrowRight,
  'bed-double': BedDouble,
  'bed-single': BedSingle,
  building: Building,
  building2: Building2,
  car: Car,
  cart: ShoppingCart,
  'cloud-download': CloudDownload,
  'file-text': FileText,
  headphones: Headphones,
  heart: Heart,
  house: House,
  'layout-grid': LayoutGrid,
  layers: Layers,
  loader: LoaderCircle,
  menu: Menu,
  ruler: Ruler,
  search: Search,
  'shield-check': ShieldCheck,
  target: Target,
  trees: Trees,
  utensils: Utensils,
  warehouse: Warehouse,
  waves: Waves,
  close: X,
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: WhatsApp,
  youtube: YouTube,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>

export type IconName = keyof typeof icons

type IconProps = { name: IconName } & Omit<SVGProps<SVGSVGElement>, 'name'>

/** Ícone decorativo (aria-hidden). Tamanho padrão 20px; sobrescreva com `className="size-6"`. */
export function Icon({ name, className, ...props }: IconProps) {
  const Component = icons[name]
  return <Component aria-hidden="true" className={cn('size-5 shrink-0', className)} {...props} />
}
