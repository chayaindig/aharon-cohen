import { useEffect, useRef, useState } from 'react'
import { contact } from '../data'
import { WipeButton, usePrefersReducedMotion } from './ui'

/*
  The appraisal, in one shot: the building starts as a blueprint, a scan line runs down it and turns
  it into the real building, measurements pin themselves on the way, and the value counts up to the
  final number. Runs once on opening. Afterwards a lens shows the plan under the cursor.
  Images: Magnific (photo + blueprint generated from the same frame).
*/

const VALUE = 2480000
const DURATION = 3400
const base = import.meta.env.BASE_URL

// Example measurements, pinned where the scan passes them (y is % from the top of the frame)
const TAGS = [
  { y: 16, x: 8, label: 'קומה 5 מתוך 6' },
  { y: 38, x: 52, label: '118 מ״ר, 4 חדרים' },
  { y: 58, x: 10, label: 'מרפסת 14 מ״ר' },
  { y: 72, x: 30, label: '12 עסקאות השוואה בסביבה' },
]

const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const fmt = (n: number) => '₪' + Math.round(n).toLocaleString('en-US')

export default function Hero({ start }: { start: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [p, setP] = useState(reduced ? 1 : 0)
  const frameRef = useRef<HTMLDivElement>(null)
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (reduced) {
      setP(1)
      return
    }
    if (!start) return
    let raf = 0
    const t0 = performance.now() + 250
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / DURATION))
      setP(k)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, reduced])

  const scan = ease(p) * 100 // % of the frame already turned into the real building
  const done = p >= 1

  // Touch screens have no cursor: the lens glides over the building by itself, a tap moves it there
  const tapAt = useRef<{ x: number; y: number; t: number } | null>(null)
  useEffect(() => {
    if (!done || reduced || !window.matchMedia('(hover: none)').matches) return
    const frame = frameRef.current
    if (!frame) return
    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(frame)
    const t0 = performance.now()
    const tick = (now: number) => {
      if (visible) {
        const t = now - t0
        const tap = tapAt.current
        if (tap && now - tap.t < 2200) setLens({ x: tap.x, y: tap.y })
        else setLens({ x: 50 + 30 * Math.sin(t / 2300), y: 48 + 30 * Math.sin(t / 3700 + 1) })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [done, reduced])

  const onTap = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    const r = frameRef.current!.getBoundingClientRect()
    tapAt.current = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, t: performance.now() }
  }

  const onMove = (e: React.PointerEvent) => {
    if (!done || e.pointerType !== 'mouse') return
    const r = frameRef.current!.getBoundingClientRect()
    setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip bg-night text-paper">
      <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(60% 70% at 25% 40%, rgb(25 135 150 / 0.22), transparent 70%)' }}
      />

      <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 px-5 pt-12 pb-24 md:px-10 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[7fr_5fr] lg:gap-16 lg:py-16">
        <div>
          <h1 id="hero-title" className="font-display text-hero">
            <span className="block whitespace-nowrap">כמה הנכס</span>
            <span className="block whitespace-nowrap">
              <span className="text-gold">באמת</span> שווה?
            </span>
          </h1>
          <p className="mt-7 max-w-[31rem] text-body text-paper/75">
            שמאי מקרקעין מוסמך משנת {contact.since}. אני בודק כל נכס עד הפרט האחרון, ומחזיר לכם מספר שאפשר לסמוך
            עליו, עם עדכון שלי בכל שלב.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <WipeButton href={contact.whatsappHref} variant="light" icon="whatsapp" external>
              לתיאום שומה
            </WipeButton>
            <WipeButton href="#services" variant="light-link">
              מה אני בודק
            </WipeButton>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div
            ref={frameRef}
            onPointerMove={onMove}
            onPointerDown={onTap}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setLens(null)}
            className="relative aspect-[1200/1490] overflow-hidden rounded-[4px] ring-1 ring-paper/15"
            role="img"
            aria-label="בניין מגורים מאבן שהופך משרטוט לבניין אמיתי בזמן הסריקה, לדוגמה"
          >
            <picture>
              <source media="(max-width: 700px)" srcSet={`${base}img/building-plan-sm.webp`} />
              <img src={`${base}img/building-plan.webp`} alt="" className="absolute inset-0 size-full object-cover" fetchPriority="high" />
            </picture>
            <picture>
              <source media="(max-width: 700px)" srcSet={`${base}img/building-sm.webp`} />
              <img
                src={`${base}img/building.webp`}
                alt=""
                className="absolute inset-0 size-full object-cover"
                style={{ clipPath: `inset(0 0 ${100 - scan}% 0)` }}
                fetchPriority="high"
              />
            </picture>

            {/* lens: the plan under the cursor, once the scan is done */}
            {done && (
              <img
                src={`${base}img/building-plan.webp`}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-cover transition-[clip-path] duration-300 ease-out"
                style={{ clipPath: lens ? `circle(90px at ${lens.x}% ${lens.y}%)` : `circle(0px at 50% 50%)` }}
              />
            )}

            {/* scan line */}
            {!done && p > 0 && (
              <div className="pointer-events-none absolute inset-x-0" style={{ top: `${scan}%` }} aria-hidden="true">
                <div className="h-16 -translate-y-full bg-gradient-to-b from-transparent to-gold/25" />
                <div className="h-[2px] -translate-y-16 bg-gold shadow-[0_0_18px_4px_rgb(194_159_94/0.7)]" />
              </div>
            )}

            {TAGS.map((t) => (
              <span
                key={t.label}
                aria-hidden="true"
                className={`hero-tag absolute flex items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-petrol-deep shadow-[0_8px_24px_-8px_rgb(0_0_0/0.45)] ${scan >= t.y + 3 ? 'is-on' : ''}`}
                style={{ top: `${t.y}%`, right: `${t.x}%` }}
              >
                <span className="size-1.5 rounded-full bg-teal" />
                {t.label}
              </span>
            ))}

            {/* corner ticks, like a drawing sheet */}
            {['top-2 right-2 border-t border-r', 'top-2 left-2 border-t border-l', 'bottom-2 right-2 border-b border-r', 'bottom-2 left-2 border-b border-l'].map((c) => (
              <span key={c} className={`pointer-events-none absolute size-4 border-paper/60 ${c}`} aria-hidden="true" />
            ))}
          </div>

          {/* the value, counting up with the scan */}
          <div className="absolute -bottom-16 left-3 z-[2] w-[min(15.5rem,66%)] rounded-[14px] bg-paper px-5 py-4 sm:-bottom-8 sm:px-6 sm:py-5 text-ink shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)] lg:left-auto lg:-right-14">
            <p className="text-note text-muted">שווי שוק מוערך</p>
            <p dir="ltr" aria-hidden="true" className="mt-1 font-display text-[clamp(2.1rem,1.6rem+1.6vw,3rem)] leading-none text-petrol tabular-nums" style={{ textAlign: 'right' }}>
              {fmt(VALUE * ease(p))}
            </p>
            <span className="mt-3 block h-[3px] origin-right rounded-full bg-gold" style={{ transform: `scaleX(${ease(p)})` }} aria-hidden="true" />
            <p className="mt-2 text-[0.8125rem] text-muted">דוגמה להמחשה</p>
            <span className="sr-only">דוגמה להמחשה: שווי שוק מוערך של 2,480,000 שקלים</span>
          </div>
        </div>
      </div>
    </section>
  )
}
