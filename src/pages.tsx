import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { contact } from './data'
import { legalDocs, type LegalDoc } from './legal'
import { WipeButton, usePrefersReducedMotion } from './components/ui'
import { SiteFooter } from './components/SiteFooter'
import { watchOrphans } from './noOrphans'

/* The pages outside the one-pager: the three legal documents and the 404. Same header, same footer. */
const base = import.meta.env.BASE_URL

function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1360px] items-center justify-between px-5 md:px-10">
        <a href={base} aria-label="לדף הבית">
          <img src={`${base}img/logo.webp`} alt={`${contact.name}, ${contact.tagline}`} width="924" height="577" className="h-11 w-auto object-contain" />
        </a>
        <WipeButton href={base} variant="link">
          לדף הבית
        </WipeButton>
      </div>
    </header>
  )
}

function Legal({ doc }: { doc: LegalDoc }) {
  useEffect(() => {
    document.title = `${doc.title} | ${contact.name}, שמאי מקרקעין`
  }, [doc])
  return (
    <main id="main" className="grain relative bg-paper py-16 md:py-24">
      <article className="mx-auto max-w-[46rem] px-5 md:px-10">
        <span aria-hidden="true" dir="ltr" className="flex h-9 items-end gap-[4px]">
          {[67, 62, 57, 52, 81, 76, 71, 67, 100, 95, 90, 86].map((h, i) => (
            <span key={i} className="w-[4px]" style={{ height: `${h}%`, background: ['var(--color-teal)', 'var(--color-gold)', 'var(--color-petrol)'][Math.floor(i / 4)], marginLeft: i && i % 4 === 0 ? 5 : 0 }} />
          ))}
        </span>
        <h1 className="mt-8 font-display text-section text-petrol">{doc.title}</h1>
        <p className="mt-3 text-note text-muted">עודכן לאחרונה: {doc.updated}</p>
        <p className="mt-8 text-sub font-[300] text-ink">{doc.intro}</p>
        <div className="mt-12 space-y-10">
          {doc.sections.map((s, i) => (
            <section key={s.title} className="border-t border-line pt-8">
              <h2 className="flex items-baseline gap-4 font-display text-sub text-petrol">
                <span dir="ltr" className="text-note text-gold-deep tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mt-4 text-body text-muted">{p}</p>
              ))}
              {s.items && (
                <ul className="mt-4 divide-y divide-line">
                  {s.items.map((it, j) => (
                    <li key={j} className="py-2.5 text-body text-muted">{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}

/* 404: the appraiser looked it up, the page is not registered. The value counts down to zero. */
function NotFound() {
  const reduced = usePrefersReducedMotion()
  const [v, setV] = useState(reduced ? 0 : 2480000)
  useEffect(() => {
    document.title = `העמוד לא נמצא | ${contact.name}, שמאי מקרקעין`
    if (reduced) return
    let raf = 0
    const t0 = performance.now() + 500
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 2600))
      setV(2480000 * (1 - (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <main id="main" className="relative overflow-x-clip bg-night text-paper">
      <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-[1360px] items-center gap-14 px-5 py-16 md:px-10 lg:grid-cols-[7fr_5fr]">
        <div>
          <h1 className="font-display text-hero">
            <span className="block whitespace-nowrap">העמוד הזה</span>
            <span className="block whitespace-nowrap">
              לא רשום <span className="text-gold">בטאבו.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-[31rem] text-body text-paper/75">
            בדקתי בתוכניות, בשרטוטים ובנסח. הכתובת שהקלדתם פשוט לא קיימת אצלי. אבל אל דאגה, כל השאר עומד במקום ושווה ביקור.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <WipeButton href={base} variant="light">
              חזרה לדף הבית
            </WipeButton>
            <WipeButton href={contact.whatsappHref} variant="light-link" icon="whatsapp" external>
              או לשאול אותי ישר
            </WipeButton>
          </div>
        </div>

        {/* an empty plot on the drawing sheet, measured and valued */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <svg viewBox="0 0 400 420" className="w-full" aria-hidden="true">
            <g stroke="var(--color-paper)" strokeOpacity=".5" fill="none" strokeWidth="1.2">
              <rect x="60" y="60" width="280" height="300" strokeDasharray="8 7" className="plot-dash" />
              <path d="M60 390 H340 M60 382 v16 M340 382 v16 M30 60 V360 M22 60 h16 M22 360 h16" strokeOpacity=".35" />
            </g>
            <g fill="var(--color-paper)" fillOpacity=".55" fontSize="13" fontFamily="var(--font-sans)" textAnchor="middle">
              <text x="200" y="412">0.00 מ׳</text>
              <text x="14" y="214" transform="rotate(-90 14 214)">0.00 מ׳</text>
              <text x="200" y="205" fontSize="15" fillOpacity=".7">מגרש ריק</text>
              <text x="200" y="228" fontSize="12">גוש 404, חלקה לא נמצאה</text>
            </g>
            {[[60, 60], [340, 60], [60, 360], [340, 360]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="var(--color-gold)" />
            ))}
          </svg>
          <div className="absolute -bottom-6 left-2 w-[min(15.5rem,70%)] rounded-[14px] bg-paper px-5 py-4 text-ink shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)] sm:px-6 sm:py-5">
            <p className="text-note text-muted">שווי העמוד הזה</p>
            <p dir="ltr" className="mt-1 font-display text-[clamp(2.1rem,1.6rem+1.6vw,3rem)] leading-none text-petrol tabular-nums" style={{ textAlign: 'right' }}>
              {'₪' + Math.round(v).toLocaleString('en-US')}
            </p>
            <p className="mt-2 text-[0.8125rem] text-muted">שומה סופית. לא ניתן לערער.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

const root = document.getElementById('root')!
const page = root.dataset.page
const doc = legalDocs.find((d) => d.slug === page)

createRoot(root).render(
  <StrictMode>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
      דילוג לתוכן
    </a>
    <PageHeader />
    {doc ? <Legal doc={doc} /> : <NotFound />}
    <SiteFooter />
  </StrictMode>,
)

watchOrphans(root)
