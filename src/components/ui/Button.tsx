import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'

// Verde vivo com texto preto: para fundos escuros, onde o botão preto não apareceria.
const onDarkStyles = 'bg-accent text-fg hover:bg-accent-hover'

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-fg-inverse hover:bg-primary-hover',
        secondary: 'border border-border bg-surface text-fg hover:bg-subtle',
        'secondary-inverse': 'border border-fg-inverse/60 text-fg-inverse hover:bg-fg-inverse/10',
        ghost: 'text-primary hover:bg-tint',
        accent: onDarkStyles,
        whatsapp: onDarkStyles,
      },
      size: {
        md: 'min-h-11 px-4 py-3 text-sm',
        lg: 'min-h-12 px-6 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type BaseProps = VariantProps<typeof buttonStyles> & {
  iconRight?: IconName
  /** Ícone à esquerda. A variante `whatsapp` já usa o ícone do WhatsApp. */
  iconLeft?: IconName
  loading?: boolean
}

type ButtonAsButton = BaseProps & ComponentProps<'button'> & { href?: undefined }
type ButtonAsLink = BaseProps & Omit<ComponentProps<'a'>, 'href'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Botão ou link com aparência de botão (quando recebe `href`). */
export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  loading,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonStyles({ variant, size }), className)
  const leftIcon = loading
    ? 'loader'
    : (iconLeft ?? (variant === 'whatsapp' ? 'whatsapp' : undefined))
  const content = (
    <>
      {leftIcon && <Icon name={leftIcon} className={cn('size-4', loading && 'animate-spin')} />}
      {children}
      {iconRight && <Icon name={iconRight} className="size-4" />}
    </>
  )

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as Omit<ButtonAsLink, keyof BaseProps>
    if (isExternal(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    )
  }

  const { disabled, ...buttonProps } = props as Omit<ButtonAsButton, keyof BaseProps>
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
