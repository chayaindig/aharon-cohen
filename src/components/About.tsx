import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'
import { contact } from '../data'
import { Marker, useInView } from './ui'

// The bars of the logo: teal, gold, petrol, each a group of four that steps down
const GROUPS = [
  { color: 'var(--color-teal)', top: 0.42 },
  { color: 'var(--color-gold)', top: 0.22 },
  { color: 'var(--color-petrol)', top: 0.04 },
]

function Bar({ progress, delay, color, height }: { progress: MotionValue<number>; delay: number; color: string; height: number }) {
  const scaleY = useTransform(progress, [delay, delay + 0.35], [0, 1])
  return (
    <motion.span
      className="block w-[clamp(8px,1.1vw,14px)] origin-bottom rounded-t-[2px]"
      style={{ height: `${height * 100}%`, background: color, scaleY }}
    />
  )
}

function Skyline() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const still = useTransform(scrollYProgress, () => 1)
  const progress = reduce ? still : scrollYProgress
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[4%] flex items-end justify-between">
      {GROUPS.map((g, gi) => (
        <div key={gi} className="flex h-full items-end gap-[clamp(5px,0.8vw,10px)]">
          {[0, 1, 2, 3].map((b) => (
            <Bar key={b} progress={progress} delay={gi * 0.12 + b * 0.04} color={g.color} height={1 - g.top - b * 0.045} />
          ))}
        </div>
      ))}
    </div>
  )
}

const LEAD =
  'אני שמאי מקרקעין מוסמך משנת 2015, ומלווה כל לקוח באופן אישי לאורך כל העסקה. יש לי ניסיון מעשי בשומות למגורים, בבדיקות היתכנות כלכלית ובהערכות שווי לסוגים שונים של נכסים ולמטרות שונות.'

function BlurWords({ text }: { text: string }) {
  const [ref, on] = useInView<HTMLParagraphElement>(0.4)
  const words = text.split(' ')
  return (
    <p ref={ref} className="text-sub font-[400] text-ink">
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
  const years = new Date().getFullYear() - contact.since
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-x-clip bg-sand py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] items-end gap-14 px-5 md:px-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <h2 id="about-title" className="font-display text-section font-bold text-petrol">
            ליווי אישי, מהשיחה
            <br />
            הראשונה ועד הדוח
          </h2>
          <div className="mt-10 max-w-[38rem] space-y-6">
            {/* Words breaking apart one by one need spaces kept, so the paragraph uses inline-block words */}
            <BlurWords text={LEAD} />
            <p className="text-body text-muted">
              כל חוות דעת נכתבת בקפידה, <Marker>לפי התקינה השמאית והקווים המנחים</Marker>, בסטנדרט שלא מתפשר.
              ואת המספרים אני מסביר בגובה העיניים, כדי שתדעו בדיוק על מה אתם חותמים.
            </p>
          </div>

          <dl className="mt-14 grid max-w-[38rem] grid-cols-2 border-t border-line sm:grid-cols-3">
            <div className="border-b border-line py-5 sm:border-b-0">
              <dt className="text-note text-muted">ותק בשמאות</dt>
              <dd className="mt-1 font-display text-sub font-bold text-petrol">{years} שנים</dd>
            </div>
            <div className="border-b border-s border-line py-5 ps-5 sm:border-b-0">
              <dt className="text-note text-muted">זמין בטלפון</dt>
              <dd className="mt-1 font-display text-sub font-bold text-petrol" dir="ltr" style={{ textAlign: 'right' }}>
                {contact.hours}
              </dd>
            </div>
            <div className="col-span-2 py-5 sm:col-span-1 sm:border-s sm:border-line sm:ps-5">
              <dt className="text-note text-muted">המשרד</dt>
              <dd className="mt-1 font-display text-sub font-bold text-petrol">אפרת</dd>
            </div>
          </dl>
        </div>

        <figure className="relative mx-auto aspect-[4/5] w-full max-w-[460px] lg:max-w-none">
          <Skyline />
          <img
            src={`${import.meta.env.BASE_URL}img/aharon.webp`}
            alt="אהרן כהן, שמאי מקרקעין"
            width="798"
            height="1500"
            loading="lazy"
            className="absolute bottom-0 left-1/2 h-[96%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_30px_40px_rgb(5_58_65/0.25)]"
          />
          <span className="absolute inset-x-0 bottom-0 h-px bg-petrol/30" aria-hidden="true" />
        </figure>
      </div>
    </section>
  )
}
