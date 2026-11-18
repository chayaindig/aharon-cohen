import { useEffect, useRef, useState } from 'react'
import { contact } from '../data'
import { WipeButton, usePrefersReducedMotion } from './ui'

/*
  Built from the ANIMTD prompt hero-policy-scan, adapted to an appraisal:
  an abstract valuation report (bars only, no readable text) is scanned line by line,
  two comparable deals light up in gold, and the market value counts up.
*/

const ROWS = [168, 132, 196, 120, 180, 148, 204, 136, 172, 116, 188, 152]
const MATCH_ROWS = [3, 8]
const VALUE = 2480000
const LOOP = 7600
const SCAN_START = 400
const SCAN_DUR = 2600
const RESET_AT = 6200
const ROW_Y = (i: number) => 136 + i * 40
const SCAN_FROM = 88
const SCAN_TO = 616

// cubic-bezier(.45,0,.55,1) solved numerically, so rows light up exactly when the line passes them
function bezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx
  const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t
  const sy = (t: number) => ((ay * t + by) * t + cy) * t
  return (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const d = 3 * ax * t * t + 2 * bx * t + cx
      if (Math.abs(d) < 1e-6) break
      t -= (sx(t) - x) / d
    }
    return sy(Math.min(1, Math.max(0, t)))
  }
}
const scanEase = bezier(0.45, 0, 0.55, 1)
const outEase = bezier(0.22, 1, 0.36, 1)

function fmt(n: number) {
  return '₪' + Math.round(n).toLocaleString('en-US')
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const scanRef = useRef<SVGGElement>(null)
  const [scanned, setScanned] = useState(reduced ? ROWS.length : 0)
  const [resetting, setResetting] = useState(false)
  const [value, setValue] = useState(reduced ? VALUE : 0)
  const [pulse, setPulse] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const firstLoop = useRef(true)
  const elapsed = useRef(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) {
      setScanned(ROWS.length)
      setValue(VALUE)
      return
    }
    if (paused || !visible) return
    let raf = 0
    let last = performance.now()
    let lastScanned = -1
    let lastReset = false
    const tick = (now: number) => {
      if (document.hidden) {
        last = now
        raf = requestAnimationFrame(tick)
        return
      }
      elapsed.current += now - last
      last = now
      const t = elapsed.current % LOOP
      if (elapsed.current >= LOOP) firstLoop.current = false

      // scan line position
      const p = Math.min(1, Math.max(0, (t - SCAN_START) / SCAN_DUR))
      const y = SCAN_FROM + (SCAN_TO - SCAN_FROM) * scanEase(p)
      const g = scanRef.current
      if (g) {
        g.style.transform = `translateY(${y}px)`
        g.style.opacity = t > SCAN_START && p < 1 ? '1' : '0'
      }
      const count = t < RESET_AT ? ROWS.filter((_, i) => ROW_Y(i) + 14 <= y + 28).length : 0
      if (count !== lastScanned) {
        lastScanned = count
        setScanned(count)
      }
      const isReset = t >= RESET_AT
      if (isReset !== lastReset) {
        lastReset = isReset
        setResetting(isReset)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, visible, reduced])

  // count the value up when a comparable deal lights up (first loop only)
  const matchesLit = MATCH_ROWS.filter((r) => scanned > r).length
  useEffect(() => {
    if (reduced || matchesLit === 0) return
    setPulse((n) => n + 1)
    if (!firstLoop.current) return
    const from = (VALUE / MATCH_ROWS.length) * (matchesLit - 1)
    const to = (VALUE / MATCH_ROWS.length) * matchesLit
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 700)
      setValue(from + (to - from) * outEase(k))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [matchesLit, reduced])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="hero relative overflow-clip bg-paper"
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="hero__grid relative mx-auto max-w-[1360px] px-5 md:px-10">
        <h1 id="hero-title" className="hero__title font-display text-hero font-bold text-petrol">
          <span className="block whitespace-nowrap">כמה הנכס</span>
          <span className="block whitespace-nowrap">
            <span className="text-teal">באמת</span> שווה?
          </span>
        </h1>

        <p className="hero__lead max-w-[30rem] text-body text-muted">
          שמאי מקרקעין מוסמך משנת {contact.since}. חוות דעת מדויקת לפי התקינה השמאית, מהר, ועם עדכון שלי
          בכל שלב בדרך.
        </p>

        <div className="hero__cta flex flex-wrap items-center gap-x-6 gap-y-3">
          <WipeButton href={contact.whatsappHref} icon="whatsapp" external>
            לתיאום שומה
          </WipeButton>
          <WipeButton href="#services" variant="link">
            מה אני בודק
          </WipeButton>
        </div>

        {/* the badge that crosses the edge of the report */}
        <div className="hero__value relative z-[2] rounded-2xl border border-line bg-white px-6 py-5 shadow-[0_24px_60px_-28px_rgb(5_58_65/0.45)]">
          <p aria-hidden="true" dir="ltr" className="font-display text-[clamp(2.4rem,1.6rem+2vw,3.5rem)] leading-none font-bold text-petrol tabular-nums [unicode-bidi:isolate]" style={{ textAlign: 'right' }}>
            {fmt(value)}
          </p>
          <span
            key={pulse}
            className="hero__line mt-3 block h-[3px] w-12 origin-right rounded-full bg-gold"
            aria-hidden="true"
          />
          <p className="mt-2 text-note text-muted">שווי שוק מוערך, בחוות דעת לדוגמה</p>
          <span className="sr-only">דוגמה לשווי שוק מוערך: 2,480,000 שקלים</span>
        </div>

        <div className="hero__doc relative">
          <svg
            viewBox="0 0 448 700"
            role="img"
            aria-label="דוח שמאות לדוגמה שבו שתי עסקאות השוואה מסומנות"
            className={`block h-auto w-full rounded-[14px] border border-line bg-white shadow-[0_40px_90px_-40px_rgb(5_58_65/0.5)] ${resetting ? 'is-resetting' : ''}`}
          >
            <g aria-hidden="true">
              {/* the mark of the logo as the letterhead */}
              <g transform="translate(372 36)">
                {[0, 1, 2].map((gi) =>
                  [0, 1, 2].map((bi) => (
                    <rect
                      key={`${gi}-${bi}`}
                      x={gi * 11 + bi * 4.4}
                      y={14 - gi * 7 + bi * 3}
                      width="2.6"
                      height={28 - (14 - gi * 7 + bi * 3) + 14}
                      fill={gi === 0 ? '#198796' : gi === 1 ? '#c29f5e' : '#06535d'}
                    />
                  )),
                )}
              </g>
              <rect x="176" y="44" width="176" height="14" rx="3" fill="rgb(6 83 93 / 0.8)" />
              <rect x="240" y="70" width="112" height="8" rx="3" fill="rgb(6 83 93 / 0.25)" />
              <line x1="40" x2="408" y1="104" y2="104" stroke="rgb(6 83 93 / 0.12)" />

              {ROWS.map((w, i) => {
                const y = ROW_Y(i)
                const isScanned = scanned > i
                const isMatch = MATCH_ROWS.includes(i) && isScanned
                return (
                  <g key={i} className={`row ${isScanned ? 'is-scanned' : ''} ${isMatch ? 'is-match' : ''}`} style={{ ['--d' as string]: `${(ROWS.length - i) * 20}ms` }}>
                    <rect className="row__bg" x="24" y={y} width="400" height="28" rx="6" />
                    <rect className="row__label" x={408 - w} y={y + 10} width={w} height="8" rx="4" />
                    <rect className="row__sum" x="40" y={y + 10} width="56" height="8" rx="4" />
                    <g transform={`translate(68 ${y + 14})`}>
                      <g className="row__tag">
                        <rect x="-30" y="-11" width="60" height="22" rx="11" />
                        <text x="0" y="4.5" textAnchor="middle">השוואה</text>
                      </g>
                    </g>
                  </g>
                )
              })}

              <line x1="40" x2="408" y1="616" y2="616" stroke="rgb(6 83 93 / 0.12)" />
              <rect x="312" y="636" width="96" height="10" rx="4" fill="rgb(6 83 93 / 0.5)" />

              {!reduced && (
                <g ref={scanRef} className="scan" style={{ opacity: 0 }}>
                  <rect x="0" y="-28" width="448" height="28" fill="#c8e4e7" opacity="0.6" />
                  <rect x="0" y="-2" width="448" height="2" fill="#198796" />
                </g>
              )}
            </g>
          </svg>
        </div>

        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'הפעלת הסריקה' : 'עצירת הסריקה'}
            className="hero__pause grid size-9 place-items-center rounded-full border border-line bg-white/90 text-petrol transition-colors hover:border-petrol"
          >
            {/* two bars / a triangle, drawn as shapes, not an icon set */}
            {paused ? (
              <span className="ms-0.5 size-0 border-y-[6px] border-s-[9px] border-y-transparent border-s-current" />
            ) : (
              <span className="flex gap-[3px]">
                <span className="h-3 w-[2px] rounded bg-current" />
                <span className="h-3 w-[2px] rounded bg-current" />
              </span>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
