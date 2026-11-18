import { steps } from '../data'

/* Scroll Stack: each step is a sticky card that settles on top of the previous one */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-petrol-deep py-24 text-paper md:py-36">
      <div className="mx-auto grid max-w-[1360px] gap-14 px-5 md:px-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+64px)] lg:self-start">
          <h2 id="process-title" className="font-display text-section font-bold">
            איך זה עובד,
            <br />
            <span className="text-gold">צעד אחר צעד</span>
          </h2>
          <p className="mt-6 max-w-[26rem] text-body text-paper/75">
            ארבעה שלבים ברורים. אתם יודעים בכל רגע איפה השומה עומדת, ולא צריכים לרדוף אחרי אף אחד.
          </p>
        </div>

        <ol className="relative">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="sticky mb-6 last:mb-0"
              style={{ top: `calc(var(--header-h) + 32px + ${i * 22}px)` }}
            >
              <article className="flex min-h-[15rem] flex-col justify-between gap-10 rounded-[18px] border border-paper/10 bg-[#0a4850] p-7 shadow-[0_-20px_40px_-24px_rgb(0_0_0/0.5)] md:min-h-[17rem] md:p-10">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="font-display text-sub font-bold text-paper">{s.title}</h3>
                  <span className="font-display text-[clamp(3rem,2rem+3vw,5rem)] leading-[0.8] font-[200] text-gold" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <p className="max-w-[34rem] text-body text-paper/80">{s.text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
