import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { reviews } from '../data'
import { Icon } from './ui'

/* One quote in the big box, the rest in a carousel. Picking one from the carousel swaps it into the box. */
export default function Reviews() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const track = useRef<HTMLUListElement>(null)
  const current = reviews[active]
  const others = reviews.map((r, i) => ({ ...r, i })).filter((r) => r.i !== active)

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    // RTL: the next card sits to the left, so "next" scrolls toward negative x
    el.scrollBy({ left: -dir * ((card?.clientWidth ?? 300) + 16), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="grain overflow-x-clip bg-sand py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <h2 id="reviews-title" className="font-display text-section text-petrol">
            מה כותבים
            <br />
            הלקוחות
          </h2>
          <div className="hidden gap-2 md:flex lg:hidden">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="ההמלצה הקודמת" className="grid size-12 place-items-center rounded-full border border-petrol/25 text-petrol transition-colors hover:bg-petrol hover:text-paper">
              <Icon name="arrow" className="size-5 rotate-180" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="ההמלצה הבאה" className="grid size-12 place-items-center rounded-full border border-petrol/25 text-petrol transition-colors hover:bg-petrol hover:text-paper">
              <Icon name="arrow" className="size-5" />
            </button>
          </div>
        </div>

        {/* the big box */}
        <figure className="relative mt-12 min-h-[19rem] overflow-hidden rounded-[22px] bg-petrol-deep p-8 text-paper md:min-h-[21rem] md:p-14" aria-live="polite">
          <span aria-hidden="true" className="ghost-num absolute top-6 left-8 h-[0.5em] overflow-visible text-[clamp(9rem,6rem+8vw,15rem)] leading-[0.75] text-gold/25">
            ”
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[56rem]"
            >
              <blockquote className="font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.5rem)] leading-[1.3]">{current.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-note text-paper/70">
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                {current.service}
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>

        {/* the carousel (phones and tablets); on desktop all four sit in one row */}
        <ul ref={track} className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible" aria-label="עוד המלצות">
          {others.map((r) => (
            <li key={r.i} className="w-[min(82%,22rem)] shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => setActive(r.i)}
                className="group flex h-full w-full flex-col justify-between gap-6 rounded-[18px] border border-line bg-paper p-6 text-start transition-colors hover:border-petrol/40"
                aria-label={`להציג את ההמלצה: ${r.service}`}
              >
                <span className="line-clamp-4 text-body text-ink">{r.quote}</span>
                <span className="flex w-full items-center justify-between text-note text-muted">
                  {r.service}
                  <span className="text-petrol opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                    להגדיל
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
