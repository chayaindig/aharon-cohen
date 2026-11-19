import { useEffect } from 'react'
import { faq } from '../data'

/* Questions people actually type into Google, answered in Aharon's voice. FAQPage schema from the same list. */
export default function Faq() {
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
    document.head.appendChild(el)
    return () => el.remove()
  }, [])

  return (
    <section id="faq" aria-labelledby="faq-title" className="grain relative overflow-x-clip bg-paper py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-5 md:px-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <h2 id="faq-title" className="font-display text-section text-petrol">
            שאלות
            <br />
            שכדאי לשאול
          </h2>
          <p className="mt-6 max-w-[26rem] text-body text-muted">
            מה זו שומה, כמה זמן זה לוקח ומה צריך להכין. ואם השאלה שלכם לא כאן, <a href="#contact" className="text-petrol underline decoration-gold underline-offset-4">פשוט תשאלו אותי</a>.
          </p>
        </div>

        <div className="border-t border-line">
          {faq.map((f, i) => (
            <details key={f.q} className="faq group border-b border-line" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-5 py-6 text-sub text-ink [&::-webkit-details-marker]:hidden">
                <span dir="ltr" aria-hidden="true" className="mt-2 w-7 shrink-0 font-display text-note text-gold-deep tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-display">{f.q}</span>
                <span aria-hidden="true" className="faq__plus relative mt-2.5 size-4 shrink-0 text-teal" />
              </summary>
              <p className="faq__a max-w-[40rem] pr-12 pb-7 text-body text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
