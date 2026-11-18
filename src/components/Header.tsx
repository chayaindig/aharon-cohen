import { useEffect, useState } from 'react'
import { contact, nav } from '../data'
import { WipeButton } from './ui'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header-h)] border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line bg-paper' : 'border-transparent bg-paper'
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-6 px-5 md:px-10">
        <a href="#top" className="shrink-0" aria-label={`${contact.name}, ${contact.tagline}. לראש העמוד`}>
          <img src={`${import.meta.env.BASE_URL}img/logo.webp`} alt="" width="924" height="577" className="h-[46px] w-auto md:h-[52px]" />
        </a>

        <nav aria-label="ניווט ראשי" className="ms-auto hidden lg:block">
          <ul className="flex items-center gap-8 text-[1.0625rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="relative py-2 text-ink/80 transition-colors hover:text-petrol after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-3 lg:ms-0">
          <WipeButton href={contact.whatsappHref} icon="whatsapp" external className="!min-h-[44px] !px-4 text-[0.95rem] sm:!px-5">
            לתיאום שומה
          </WipeButton>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className={`absolute inset-x-0 top-0 h-[1.5px] bg-petrol transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-petrol transition-transform duration-300 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="ניווט ראשי"
        hidden={!open}
        className="border-b border-line bg-paper px-5 pb-6 lg:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((n) => (
            <li key={n.href} className="border-t border-line">
              <a href={n.href} onClick={() => setOpen(false)} className="block py-4 font-display text-sub font-bold text-petrol">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
