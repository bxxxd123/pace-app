import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './ui.css'

export function Card({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`ui-card ${className}`} onClick={onClick}>
      {children}
    </Tag>
  )
}

export function PrimaryButton({ children, ...rest }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="ui-btn-primary" {...rest}>
      {children}
    </button>
  )
}

export function GhostButton({ children, ...rest }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="ui-btn-ghost" {...rest}>
      {children}
    </button>
  )
}

export function Chip({ children, selected, onClick }: { children: ReactNode; selected?: boolean; onClick?: () => void }) {
  return (
    <button className={`ui-chip${selected ? ' ui-chip-selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
