import { services } from '../data'
import { Icon, useInView } from './ui'

export default function Services() {
  const [ref, on] = useInView<HTMLUListElement>(0.15)
  return (
    <section id="services" aria-labelledby="services-title" className="grain relative overflow-x-clip bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end">
          <h2 id="services-title" className="font-display text-section text-petrol">
            שלושה תחומים,
            <br />
            סטנדרט אחד
          </h2>
          <p className="max-w-[30rem] text-body text-muted">
            משומה לבנק ועד בדיקת כדאיות לפרויקט פינוי בינוי. כל חוות דעת נבנית לפי המטרה שלה, ולפי מי שיקרא אותה
            בסוף.
          </p>
        </div>

        <ul ref={ref} className="mt-16 grid gap-5 lg:grid-cols-3">
          {services.map((s, i) => (
            <li
              key={s.title}
              className={`relative overflow-hidden rounded-[18px] border border-line bg-white/55 p-7 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none md:p-9 ${
                on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* giant ghost number, cut by the card edge */}
              <span
                aria-hidden="true"
                dir="ltr"
                className="ghost-num absolute -top-3 -left-2 text-[clamp(8rem,6rem+6vw,12rem)] text-petrol/[0.07]"
              >
                0{i + 1}
              </span>
              <Icon name={s.icon} className="relative size-14 text-teal [--icon-hole:#fdfbf6]" />
              <h3 className="relative mt-8 font-display text-sub text-petrol">{s.title}</h3>
              <p className="relative mt-3 text-body text-muted">{s.intro}</p>
              <ul className="relative mt-7 divide-y divide-line border-t border-line">
                {s.items.map((it) => (
                  <li key={it.name} className="py-3.5">
                    <span className="block text-body font-medium text-ink">{it.name}</span>
                    {it.hint && <span className="block text-note text-muted">{it.hint}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
