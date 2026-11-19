import { useEffect, useRef } from 'react'

/*
  Thank-you popup after the form is sent: about a third of the screen, the logo bars rise like
  a value that was just set, a gold line runs down the 4 seconds before it closes by itself.
  X, Esc or a click outside close it earlier.
*/
const STAY = 4000
// the logo mark: three groups, each a step taller, each bar inside a group a step shorter
const BARS = [67, 62, 57, 52, 81, 76, 71, 67, 100, 95, 90, 86]
const BAR_COLORS = ['var(--color-teal)', 'var(--color-gold)', 'var(--color-petrol)']

export default function ThankYou({ name, onClose }: { name: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const timer = window.setTimeout(onClose, STAY)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      back?.focus()
    }
  }, [onClose])

  return (
    <div className="thanks fixed inset-0 z-[90] grid place-items-center bg-night/45 p-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        onClick={(e) => e.stopPropagation()}
        className="thanks__card relative w-[min(30rem,100%)] overflow-hidden rounded-[22px] bg-petrol-deep px-7 pt-9 pb-8 text-paper shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] md:px-10 md:pt-11"
      >
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="סגירה"
          className="absolute top-3 left-3 grid size-11 place-items-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <span aria-hidden="true" className="relative block size-4 before:absolute before:inset-x-0 before:top-1/2 before:h-[1.5px] before:rotate-45 before:bg-current after:absolute after:inset-x-0 after:top-1/2 after:h-[1.5px] after:-rotate-45 after:bg-current" />
        </button>

        <span aria-hidden="true" dir="ltr" className="relative flex h-14 items-end gap-[4px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="thanks__bar w-[5px] rounded-t-[1px]"
              style={{ height: `${h}%`, background: BAR_COLORS[Math.floor(i / 4)], marginLeft: i && i % 4 === 0 ? 6 : 0, animationDelay: `${120 + i * 55}ms` }}
            />
          ))}
        </span>

        <h2 id="thanks-title" className="relative mt-7 font-display text-[clamp(1.9rem,1.5rem+1.4vw,2.5rem)] leading-[1.05]">
          {name ? `תודה ${name},` : 'תודה,'} <span className="text-gold">הפרטים אצלי.</span>
        </h2>
        <p className="relative mt-3 text-body text-paper/75">
          אחזור אליכם בהקדם עם מה שצריך לשומה. דחוף? <a href="tel:+972528236186" className="underline decoration-gold underline-offset-4">אפשר גם להתקשר</a>.
        </p>
        <p className="relative mt-5 text-note text-paper/50">אהרן כהן, שמאי מקרקעין</p>
        <span aria-hidden="true" className="thanks__timer absolute inset-x-0 bottom-0 h-[3px] origin-right bg-gold" style={{ animationDuration: `${STAY}ms` }} />
      </div>
    </div>
  )
}
