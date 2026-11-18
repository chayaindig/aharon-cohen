import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import logo from '../logo.svg?raw'
import { usePrefersReducedMotion } from './ui'

/*
  Opening: the bars of the logo rise one by one like a building going up, the name settles in,
  then the whole layer fades out and the site starts. Click or any key skips it.
*/
const HOLD = 2300

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const finished = useRef(false)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    setDone(true)
    onDone()
    setTimeout(() => setGone(true), 700) // remove the layer once it has faded out
  }

  // Tag the traced paths: bars of the mark rise, the lettering fades in after them
  useLayoutEffect(() => {
    const svg = ref.current?.querySelector('svg')
    if (!svg) return
    const paths = [...svg.querySelectorAll('path')]
    const bars = paths
      .map((el) => ({ el, box: el.getBBox() }))
      .filter(({ box }) => box.x > 1300 && box.y + box.height < 1000)
      .sort((a, b) => a.box.x - b.box.x)
    bars.forEach(({ el }, i) => {
      el.classList.add('logo-bar')
      el.style.animationDelay = `${120 + i * 55}ms`
    })
    paths.filter((el) => !el.classList.contains('logo-bar')).forEach((el) => {
      el.classList.add('logo-word')
      el.style.animationDelay = `${120 + bars.length * 55 + 150}ms`
    })
  }, [])

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    const t = setTimeout(finish, HOLD)
    const skip = () => finish()
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  // Keep the page still while the logo builds
  useEffect(() => {
    document.documentElement.style.overflow = done ? '' : 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [done])

  if (gone) return null

  return (
    <div
      className={`preloader grain fixed inset-0 z-[100] grid place-items-center bg-paper ${done ? 'is-done' : ''}`}
      onClick={finish}
      aria-hidden={done}
    >
      <div ref={ref} className="w-[min(70vw,420px)] [&>svg]:h-auto [&>svg]:w-full" role="img" aria-label="אהרן כהן, שמאות מקרקעין וייעוץ נדל״ן" dangerouslySetInnerHTML={{ __html: logo }} />
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-note text-muted underline-offset-4 hover:underline"
      >
        דילוג
      </button>
    </div>
  )
}
