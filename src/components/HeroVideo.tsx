import { useEffect, useRef, useState } from 'react'
import { contact } from '../data'
import { WipeButton, useMotionPaused, usePrefersReducedMotion } from './ui'

/*
  Trial hero (local only): the same texts over a rotating background video.
  Opens like a screen, from the center outwards to both sides, right after the preloader.
  The veil is opaque behind the text (right side, RTL) and clearer on the left.
  Clips: Magnific stock (licensed 22.11.2026), 4K originals in ../hero-video-source.
*/

const base = import.meta.env.BASE_URL
// Licensed Magnific stock, cut to 8s: 1600px for desktop, 900px for phones
const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 800px)').matches
const CLIPS = ['ramat-sharet', 'balconies', 'pisgat-zeev', 'room-view'].map((n) => `${base}video/${n}${small ? '-sm' : ''}.mp4`)
const CLIP_MS = 6500 // each clip shows this long, then crossfades to the next

export default function HeroVideo({ start }: { start: boolean }) {
  const reduced = usePrefersReducedMotion()
  const paused = useMotionPaused()
  const still = reduced || paused
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(reduced)
  const vids = useRef<(HTMLVideoElement | null)[]>([])

  // The screen opens once the preloader is done
  useEffect(() => {
    if (start) requestAnimationFrame(() => setOpen(true))
  }, [start])

  // Rotate clips; play only the visible one (and warm up the next)
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return
      if (i === active && !still) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else if (i !== active) v.pause()
    })
    if (still) {
      vids.current[active]?.pause()
      return
    }
    const id = setTimeout(() => setActive((a) => (a + 1) % CLIPS.length), CLIP_MS)
    return () => clearTimeout(id)
  }, [active, still])

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip bg-night text-paper lg:min-h-[calc(100svh-var(--header-h))]"
    >
      {/* the screen: videos + veil, revealed from the center outwards */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
        style={{
          clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 50% 0 50%)',
          transition: reduced ? 'none' : 'clip-path 1.6s cubic-bezier(.76,0,.24,1)',
        }}
      >
        {CLIPS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              vids.current[i] = el
            }}
            src={src}
            muted
            playsInline
            loop
            preload={i === active || i === (active + 1) % CLIPS.length ? 'auto' : 'metadata'}
            className="absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: i === active ? 1 : 0, transform: open ? 'scale(1)' : 'scale(1.08)', transitionProperty: 'opacity, transform', transitionDuration: '1400ms, 2200ms' }}
          />
        ))}
        {/* veil: opaque behind the text (right), clearer on the left */}
        {/* phone: the text spans the full width, so the veil is even */}
        <div className="absolute inset-0 bg-night/80 lg:hidden" />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(to left, rgb(4 46 52 / 0.94) 0%, rgb(4 46 52 / 0.86) 34%, rgb(4 46 52 / 0.55) 62%, rgb(4 46 52 / 0.22) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night/80 to-transparent" />
        {/* gold seam lines at the opening edges */}
        <span
          className="absolute inset-y-0 w-px bg-gold/70 shadow-[0_0_14px_2px_rgb(194_159_94/0.55)] transition-[left,opacity] duration-[1600ms] ease-[cubic-bezier(.76,0,.24,1)]"
          style={{ left: open ? '0%' : '50%', opacity: open ? 0 : 1 }}
        />
        <span
          className="absolute inset-y-0 w-px bg-gold/70 shadow-[0_0_14px_2px_rgb(194_159_94/0.55)] transition-[right,opacity] duration-[1600ms] ease-[cubic-bezier(.76,0,.24,1)]"
          style={{ right: open ? '0%' : '50%', opacity: open ? 0 : 1 }}
        />
      </div>

      <div className="relative mx-auto flex max-w-[1360px] items-center px-5 pt-16 pb-24 md:px-10 lg:min-h-[calc(100svh-var(--header-h))] lg:py-20">
        <div
          className="max-w-[40rem] transition-[opacity,transform] duration-1000 ease-out"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(18px)',
            transitionDelay: reduced ? '0ms' : '900ms',
          }}
        >
          <h1 id="hero-title" className="font-display text-hero">
            <span className="block whitespace-nowrap">כמה הנכס</span>
            <span className="block whitespace-nowrap">
              <span className="text-gold">באמת</span> שווה?
            </span>
          </h1>
          <p className="mt-7 max-w-[31rem] text-body text-paper/85">
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

        {/* clip progress, bottom-left */}
        <div className="absolute bottom-8 left-5 flex gap-2 md:left-10" aria-hidden="true">
          {CLIPS.map((src, i) => (
            <span key={src} className="h-[2px] w-8 overflow-hidden rounded-full bg-paper/25">
              <span
                className="block h-full origin-right bg-gold"
                style={{
                  transform: `scaleX(${i === active ? 1 : 0})`,
                  transition: i === active && !still ? `transform ${CLIP_MS}ms linear` : 'none',
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
