import { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, MotionToggle, useInView, usePrefersReducedMotion } from './ui'
import PixelField from './PixelField'

/*
  The bar mark of the logo, built from square pixels on a faint grid.
  It assembles from the ground up, then never stops: a light wave climbs the bars, a few grid cells
  spark, and on desktop the pixels near the cursor lift.
*/
const COLS = 38
const ROWS = 44
// three groups of four bars, each bar one step shorter than the one before, like the logo
const GROUPS = [
  { color: 'var(--color-teal)', top: 16 },
  { color: 'var(--color-gold)', top: 10 },
  { color: 'var(--color-petrol)', top: 2 },
]
const rand = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1

function PixelMark() {
  const [ref, on] = useInView<SVGSVGElement>(0.25)
  const [live, setLive] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const { cells, sparks } = useMemo(() => {
    const cells: { x: number; y: number; color: string; d: number }[] = []
    GROUPS.forEach((g, gi) => {
      for (let b = 0; b < 4; b++) {
        const x0 = (gi * 4 + b) * 3 + gi
        for (let y = g.top + b * 2; y < ROWS; y++) {
          for (const x of [x0, x0 + 1]) {
            const i = cells.length
            cells.push({ x, y, color: g.color, d: Math.round((ROWS - y) * 24 + gi * 120 + rand(i) * 260) })
          }
        }
      }
    })
    const filled = new Set(cells.map((c) => `${c.x},${c.y}`))
    const sparks: { x: number; y: number; d: number; t: number }[] = []
    for (let i = 0; sparks.length < 36 && i < 4000; i++) {
      const x = Math.floor(rand(i + 7) * COLS)
      const y = Math.floor(rand(i + 911) * ROWS)
      if (!filled.has(`${x},${y}`)) sparks.push({ x, y, d: Math.round(rand(i + 3) * 6000), t: 2600 + Math.round(rand(i + 5) * 3200) })
    }
    return { cells, sparks }
  }, [])

  // keep moving only while on screen
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const svg = svgRef.current
    if (!svg || e.pointerType !== 'mouse') return
    const r = svg.getBoundingClientRect()
    svg.style.setProperty('--mx', String(((e.clientX - r.left) / r.width) * COLS))
    svg.style.setProperty('--my', String(((e.clientY - r.top) / r.height) * ROWS))
  }
  const onLeave = () => svgRef.current?.style.setProperty('--mx', '-99')

  return (
    <div className="h-full" onPointerMove={onMove} onPointerLeave={onLeave}>
      <svg
        ref={(n) => {
          svgRef.current = n
          ref.current = n
        }}
        viewBox={`0 0 ${COLS} ${ROWS}`}
        className={`pixel-mark h-full w-auto ${on ? 'is-on' : ''} ${live ? 'is-live' : ''}`}
        aria-hidden="true"
      >
        {/* the faint grid the mark is drawn on */}
        <defs>
          <pattern id="px-grid" width="1" height="1" patternUnits="userSpaceOnUse">
            <rect x="0.12" y="0.12" width="0.76" height="0.76" rx="0.08" fill="var(--color-petrol)" fillOpacity="0.07" />
          </pattern>
        </defs>
        <rect width={COLS} height={ROWS} fill="url(#px-grid)" className="px-grid" />
        {sparks.map((s, i) => (
          <rect key={`s${i}`} className="px-spark" x={s.x + 0.12} y={s.y + 0.12} width="0.76" height="0.76" rx="0.08" style={{ animationDelay: `${s.d}ms`, animationDuration: `${s.t}ms` }} />
        ))}
        {Array.from({ length: ROWS }, (_, y) => (
          <g key={y} className="px-row" style={{ animationDelay: `${(ROWS - y) * 70}ms` }}>
            {cells
              .filter((c) => c.y === y)
              .map((c) => (
                <rect
                  key={c.x}
                  className="px"
                  x={c.x + 0.1}
                  y={c.y + 0.1}
                  width="0.8"
                  height="0.8"
                  rx="0.08"
                  fill={c.color}
                  style={{ ['--d' as string]: `${c.d}ms`, ['--x' as string]: c.x, ['--y' as string]: c.y }}
                />
              ))}
          </g>
        ))}
      </svg>
    </div>
  )
}

const LEAD =
  'אני שמאי מקרקעין מוסמך משנת 2015, ומלווה כל לקוח באופן אישי לאורך כל העסקה. יש לי ניסיון מעשי בשומות למגורים, בבדיקות היתכנות כלכלית ובהערכות שווי לסוגים שונים של נכסים ולמטרות שונות.'

function BlurWords({ text }: { text: string }) {
  const [ref, on] = useInView<HTMLParagraphElement>(0.4)
  // the last two words travel together, so the paragraph never ends on a lone word
  const split = text.split(' ')
  const words = [...split.slice(0, -2), split.slice(-2).join(' ')]
  return (
    <p ref={ref} className="text-sub font-[300] text-ink">
      {words.map((w, i) => (
        <span key={i}>
          <span
            className="inline-block transition-[filter,opacity,transform] duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none"
            style={{
              transitionDelay: `${i * 35}ms`,
              filter: on ? 'blur(0)' : 'blur(8px)',
              opacity: on ? 1 : 0.15,
              transform: on ? 'none' : 'translateY(6px)',
            }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

// Desktop with a mouse gets the live canvas field; phones and tablets keep the SVG mark
function useDesktopField() {
  const q = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setOn(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return on
}

export default function About() {
  const desktop = useDesktopField()
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const portraitRef = useRef<HTMLImageElement>(null)
  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="grain relative overflow-x-clip bg-sand pt-24 md:pt-32">
      {desktop && (
        <PixelField
          anchor={portraitRef}
          area={sectionRef}
          reduced={reduced}
          className="pixel-field pointer-events-none absolute inset-0 size-full"
        />
      )}
      <div className="mx-auto grid max-w-[1360px] items-end gap-12 px-5 md:px-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div className="relative pb-4 md:pb-28">
          <h2 id="about-title" className="font-display text-section text-petrol">
            ליווי אישי, מהשיחה
            <br />
            הראשונה ועד הדוח
          </h2>
          <div className="mt-10 max-w-[38rem] space-y-6">
            <BlurWords text={LEAD} />
            <p className="text-body text-muted">
              כל חוות דעת נכתבת בקפידה, <Marker>לפי התקינה השמאית והקווים המנחים</Marker>, בסטנדרט שלא מתפשר.
              ואת המספרים אני מסביר בגובה העיניים, כדי שתדעו בדיוק על מה אתם חותמים.
            </p>
          </div>
        </div>

        <figure className="relative mx-auto h-[min(118vw,560px)] w-full max-w-[480px] lg:h-[640px] lg:max-w-none">
          {!desktop && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 py-2">
              <PixelMark />
            </div>
          )}
          <img
            ref={portraitRef}
            src={`${import.meta.env.BASE_URL}img/aharon.webp`}
            alt="אהרן כהן, שמאי מקרקעין"
            width="798"
            height="1500"
            loading="lazy"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-[58%] drop-shadow-[0_30px_40px_rgb(5_58_65/0.28)]"
          />
          <MotionToggle className="absolute top-0 left-0 z-[3]" />
        </figure>
      </div>
    </section>
  )
}
