import { useEffect, useRef, type RefObject } from 'react'
import { useMotionPaused } from './ui'

/*
  Desktop version of the pixel mark: a live value chart on a pixel field that bleeds to the page edge.
  The twelve logo bars stand behind the portrait and breathe like a market graph. Every few seconds a
  gold scan (the same one as the hero) sweeps across and each bar it passes locks to its exact height,
  with a gold value pixel on top. The cursor lights the field in gold and pulls the nearest bars up,
  a click sends a ripple. Canvas, desktop only (phones keep the SVG version).
*/

const CELL = 14
const FILL = 0.78 // share of the cell the square fills
const TEAL = '#198796'
const GOLD = '#c29f5e'
const PETROL = '#06535d'
// three groups of four bars, tops in a 44-row unit, each bar two rows lower than the one before (as in the logo)
const GROUPS = [
  { color: TEAL, top: 16 },
  { color: GOLD, top: 10 },
  { color: PETROL, top: 2 },
]
const SCAN_EVERY = 7 // s
const SCAN_TIME = 2.4 // s to cross the field
const LOCK_HOLD = 2.6 // s a bar stays exact after the scan passes

const rand = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

type Bar = { col: number; h: number; color: string; g: number; b: number; lift: number }

export default function PixelField({
  anchor,
  area,
  reduced,
  className = '',
}: {
  anchor: RefObject<HTMLElement | null>
  area: RefObject<HTMLElement | null>
  reduced: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paused = useMotionPaused()

  useEffect(() => {
    const canvas = canvasRef.current
    const sectionEl = area.current
    if (!canvas || !sectionEl) return
    const ctx = canvas.getContext('2d')!
    let cols = 0
    let rows = 0
    let w = 0
    let h = 0
    let bars: Bar[] = []
    let raf = 0
    let visible = false
    let t0 = -1 // intro start, set the first time the field is seen
    let last = performance.now()
    let clock = 0 // seconds of motion, frozen while paused
    const mouse = { x: -1e4, y: -1e4, on: false }
    const ripples: { x: number; y: number; at: number }[] = []

    const layout = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rows = Math.ceil(h / CELL)
      // the mark stands on the bottom edge, centred on the portrait
      const a = anchor.current?.getBoundingClientRect()
      // the field fades out before the text: only draw up to where the fade ends
      const fadeFrom = a ? a.right - r.left + 140 : w * 0.5
      const fadeTo = fadeFrom + 320
      canvas.style.setProperty('--f1', `${fadeFrom}px`)
      canvas.style.setProperty('--f2', `${fadeTo}px`)
      cols = Math.min(Math.ceil(w / CELL), Math.ceil(fadeTo / CELL))
      const centre = a ? (a.left + a.width / 2 - r.left) / CELL : cols / 2
      const markRows = Math.min(rows - 2, Math.round(((a?.height ?? h * 0.8) * 1.02) / CELL))
      const start = Math.round(centre - 18.5)
      bars = []
      for (let b = 0; b < 12; b++) {
        const g = Math.floor(b / 4)
        const i = b % 4
        bars.push({
          col: start + b * 3 + g,
          h: markRows - Math.round((markRows * (GROUPS[g].top + i * 2)) / 44),
          color: GROUPS[g].color,
          g,
          b,
          lift: 0,
        })
      }
    }

    // paused or reduced motion: a plain still mark, nothing glows or moves
    const still = reduced || paused
    const draw = (t: number, intro: number) => {
      ctx.clearRect(0, 0, w, h)
      const period = t % SCAN_EVERY
      const scanX = !still && period < SCAN_TIME ? (period / SCAN_TIME) * (w + 6 * CELL) - 3 * CELL : -1e4
      const mx = mouse.on && !still ? mouse.x / CELL : -1e4
      const my = mouse.on && !still ? mouse.y / CELL : -1e4
      const gridIn = clamp01(intro / 0.9)

      // bar heights this frame
      const heights = new Map<number, { bar: Bar; top: number; lock: number }>()
      for (const bar of bars) {
        const x = (bar.col + 1) * CELL
        // time since the scan passed this bar in the current cycle
        const passAt = ((x + 3 * CELL) / (w + 6 * CELL)) * SCAN_TIME
        const since = period >= passAt ? period - passAt : period + SCAN_EVERY - passAt
        const lock = still ? 1 : clamp01(1 - (since - LOCK_HOLD) / 0.8)
        const breath = still ? 0 : 1.8 * Math.sin(t * 0.7 + bar.b * 0.8) + 0.8 * Math.sin(t * 1.9 + bar.b * 2.1)
        const pull = Math.max(0, 1 - Math.abs(mx - bar.col - 0.5) / 5)
        const want = mouse.on && my > 0 ? pull * Math.min(6, Math.max(0, rows - my - bar.h)) : 0
        bar.lift = still ? 0 : bar.lift + (want - bar.lift) * 0.12
        const top = bar.h + breath * (1 - lock) + bar.lift
        heights.set(bar.col, { bar, top, lock })
        heights.set(bar.col + 1, { bar, top, lock })
      }

      for (let c = 0; c < cols; c++) {
        const col = heights.get(c)
        const x = c * CELL
        const dScan = Math.abs(x + CELL / 2 - scanX) / CELL
        for (let r = 0; r < rows; r++) {
          // r counts from the bottom
          const y = h - (r + 1) * CELL
          const i = c * 997 + r
          const dm = Math.hypot(c + 0.5 - mx, rows - r - 0.5 - my)
          const near = dm < 7 ? (1 - dm / 7) ** 2 : 0
          let ring = 0
          for (const rp of ripples) {
            const age = t - rp.at
            const d = Math.abs(Math.hypot(c + 0.5 - rp.x / CELL, rows - r - 0.5 - rp.y / CELL) - age * 26)
            if (d < 1.4) ring = Math.max(ring, (1 - d / 1.4) * (1 - age / 1.6))
          }

          const inBar = col && r < Math.ceil(col.top)
          if (inBar) {
            const bar = col.bar
            const appear = clamp01((intro - (r * 0.022 + bar.g * 0.12 + rand(i) * 0.25)) / 0.35)
            if (appear <= 0) continue
            const frac = r === Math.ceil(col.top) - 1 ? col.top - Math.floor(col.top) || 1 : 1
            const wave = still ? 1 : 0.5 + 0.5 * Math.sin(t * 1.6 - r * 0.22 + bar.b * 0.15)
            ctx.globalAlpha = appear * frac * (0.62 + 0.38 * wave)
            ctx.fillStyle = dScan < 1.5 ? GOLD : bar.color
            const s = CELL * FILL * (1 + 0.35 * near + 0.25 * ring) * (0.4 + 0.6 * appear)
            ctx.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s)
            continue
          }

          // the gold value pixel that sits on a locked bar
          if (!still && col && r === Math.ceil(col.top) && col.lock > 0 && intro > 1.4) {
            ctx.globalAlpha = col.lock * (0.75 + 0.25 * Math.sin(t * 5))
            ctx.fillStyle = GOLD
            const s = CELL * FILL
            ctx.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s)
            continue
          }

          // the field
          let a = 0.07 * gridIn
          let gold = 0
          if (dScan < 3) gold = Math.max(gold, 0.42 * (1 - dScan / 3))
          gold = Math.max(gold, 0.5 * near, 0.6 * ring)
          if (gold > 0.02) {
            ctx.globalAlpha = gold * gridIn
            ctx.fillStyle = GOLD
            const s = CELL * FILL * (1 + 0.4 * near)
            ctx.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s)
          } else {
            ctx.globalAlpha = a
            ctx.fillStyle = PETROL
            const s = CELL * FILL
            ctx.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s)
          }
        }
      }
      ctx.globalAlpha = 1
      while (ripples.length && t - ripples[0].at > 1.6) ripples.shift()
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      if (t0 < 0) t0 = clock
      draw(clock, reduced ? 9 : clock - t0)
      raf = visible && !paused && !reduced ? requestAnimationFrame(frame) : 0
    }
    const kick = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    layout()
    // paused or reduced motion: one finished still frame, nothing moves
    if (paused || reduced) {
      if (t0 < 0) t0 = -9
      draw(clock, 9)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) kick()
    }, { threshold: 0.15 })
    io.observe(canvas)
    const ro = new ResizeObserver(() => {
      layout()
      if (!raf) draw(clock, 9)
    })
    ro.observe(canvas)

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX < r.right }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const p = toLocal(e)
      mouse.x = p.x
      mouse.y = p.y
      mouse.on = p.inside
    }
    const onLeave = () => (mouse.on = false)
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || paused || reduced) return
      const p = toLocal(e)
      if (p.inside) ripples.push({ x: p.x, y: p.y, at: clock })
    }
    sectionEl.addEventListener('pointermove', onMove)
    sectionEl.addEventListener('pointerleave', onLeave)
    sectionEl.addEventListener('pointerdown', onDown)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      sectionEl.removeEventListener('pointermove', onMove)
      sectionEl.removeEventListener('pointerleave', onLeave)
      sectionEl.removeEventListener('pointerdown', onDown)
    }
  }, [anchor, area, paused, reduced])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
