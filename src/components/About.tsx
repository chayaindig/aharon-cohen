import { useMemo } from 'react'
import pixelLogo from '../pixelLogo.json'
import { Marker, useInView } from './ui'

const COLORS: Record<string, string> = { t: 'var(--color-teal)', g: 'var(--color-gold)', p: 'var(--color-petrol)' }

/* The bar mark of the logo, rebuilt from square pixels that assemble from the ground up */
function PixelMark() {
  const [ref, on] = useInView<SVGSVGElement>(0.25)
  const { cols, rows, cells } = pixelLogo as { cols: number; rows: number; cells: [number, number, string][] }
  // stable pseudo-random order so it looks hand placed, rising from the bottom
  const items = useMemo(
    () =>
      cells.map(([x, y, c], i) => {
        const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
        return { x, y, c, d: Math.round((rows - y) * 22 + r * 380), o: 0.55 + r * 0.45 }
      }),
    [cells, rows],
  )
  return (
    <svg ref={ref} viewBox={`0 0 ${cols} ${rows}`} className={`h-full w-auto ${on ? 'is-on' : ''}`} aria-hidden="true">
      {items.map((it, i) => (
        <rect
          key={i}
          className="px"
          x={it.x + 0.08}
          y={it.y + 0.08}
          width="0.84"
          height="0.84"
          fill={COLORS[it.c]}
          style={{ ['--d' as string]: `${it.d}ms`, ['--o' as string]: it.o }}
        />
      ))}
    </svg>
  )
}

const LEAD =
  'אני שמאי מקרקעין מוסמך משנת 2015, ומלווה כל לקוח באופן אישי לאורך כל העסקה. יש לי ניסיון מעשי בשומות למגורים, בבדיקות היתכנות כלכלית ובהערכות שווי לסוגים שונים של נכסים ולמטרות שונות.'

function BlurWords({ text }: { text: string }) {
  const [ref, on] = useInView<HTMLParagraphElement>(0.4)
  const words = text.split(' ')
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

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="grain relative overflow-x-clip bg-sand pt-24 md:pt-32">
      <div className="mx-auto grid max-w-[1360px] items-end gap-12 px-5 md:px-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div className="pb-4 md:pb-28">
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
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 py-2">
            <PixelMark />
          </div>
          <img
            src={`${import.meta.env.BASE_URL}img/aharon.webp`}
            alt="אהרן כהן, שמאי מקרקעין"
            width="798"
            height="1500"
            loading="lazy"
            className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-[58%] drop-shadow-[0_30px_40px_rgb(5_58_65/0.28)]"
          />
        </figure>
      </div>
    </section>
  )
}
