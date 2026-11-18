import { useEffect, useRef, useState, type ReactNode } from 'react'
import appraisal from '../icons/appraisal.svg?raw'
import consult from '../icons/consult.svg?raw'
import opinion from '../icons/opinion.svg?raw'
import whatsapp from '../icons/whatsapp.svg?raw'
import phone from '../icons/phone.svg?raw'
import arrow from '../icons/arrow.svg?raw'

// Icons from Magnific (Chaya's licence): appraisal 9470368, consult 13390829,
// opinion 9875211, whatsapp 4406172, phone 2549905, arrow 17927915
const icons = { appraisal, consult, opinion, whatsapp, phone, arrow }
export type IconName = keyof typeof icons

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 [&>svg]:h-full [&>svg]:w-full ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  )
}

/** True once the element has entered the viewport (or right away on reduced motion). */
export function useInView<T extends Element>(threshold = 0.3, once = true) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])
  return [ref, inView] as const
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Marker that draws itself when it scrolls into view */
export function Marker({ children }: { children: ReactNode }) {
  const [ref, on] = useInView<HTMLSpanElement>(0.8)
  return (
    <span ref={ref} className={`marker ${on ? 'is-on' : ''}`}>
      {children}
    </span>
  )
}

/* ANIMTD wipe-arrow-button: fill wipes in from the start edge, arrow swaps out and in */
type WipeProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'link' | 'light' | 'light-link'
  icon?: IconName
  className?: string
  external?: boolean
}

export function WipeButton({ href, children, variant = 'primary', icon, className = '', external }: WipeProps) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const isLink = variant === 'link' || variant === 'light-link'
  return (
    <a href={href} {...ext} className={`wipe wipe--${variant} ${isLink ? '' : 'wipe--btn'} ${className}`}>
      {icon && <Icon name={icon} className="wipe__lead size-5" />}
      <span className="wipe__label">{children}</span>
      <span className="wipe__arrow" aria-hidden="true">
        <Icon name="arrow" className="wipe__a1" />
        <Icon name="arrow" className="wipe__a2" />
      </span>
    </a>
  )
}
