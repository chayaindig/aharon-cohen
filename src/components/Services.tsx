import { services } from '../data'
import { Icon, useInView } from './ui'

export default function Services() {
  const [ref, on] = useInView<HTMLUListElement>(0.15)
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end">
          <h2 id="services-title" className="font-display text-section font-bold text-petrol">
            שלושה תחומים,
            <br />
            סטנדרט אחד
          </h2>
          <p className="max-w-[30rem] text-body text-muted">
            משומה פשוטה לבנק ועד בדיקת כדאיות לפרויקט פינוי בינוי. כל חוות דעת נבנית לפי המטרה שלה, ומי שיקרא
            אותה בסוף.
          </p>
        </div>

        <ul ref={ref} className="mt-16 grid border-t border-petrol/25 lg:grid-cols-3">
          {services.map((s, i) => (
            <li
              key={s.title}
              className={`border-b border-line py-10 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none lg:border-b-0 lg:px-10 lg:py-12 lg:first:ps-0 lg:last:pe-0 lg:[&:not(:first-child)]:border-s ${
                on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between">
                <Icon name={s.icon} className="size-14 text-teal" />
                <span className="font-display text-sub font-[200] text-gold-deep" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-8 font-display text-sub font-bold text-petrol">{s.title}</h3>
              <p className="mt-3 text-body text-muted">{s.intro}</p>
              <ul className="mt-8 space-y-4">
                {s.items.map((it) => (
                  <li key={it.name} className="flex gap-3">
                    <span className="mt-[0.7em] h-[2px] w-4 shrink-0 bg-gold" aria-hidden="true" />
                    <span className="text-body">
                      <span className="text-ink">{it.name}</span>
                      {it.hint && <span className="block text-note text-muted">{it.hint}</span>}
                    </span>
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
