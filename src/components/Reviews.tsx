import { reviews } from '../data'
import { useInView } from './ui'

export default function Reviews() {
  const [first, ...rest] = reviews
  const [ref, on] = useInView<HTMLDivElement>(0.2)
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-paper py-24 md:py-36">
      <div ref={ref} className="mx-auto max-w-[1360px] px-5 md:px-10">
        <h2 id="reviews-title" className="font-display text-section font-bold text-petrol">
          מה כותבים
          <br />
          הלקוחות
        </h2>

        <figure className="mt-14 grid gap-8 border-t border-petrol/25 pt-12 lg:grid-cols-[1fr_4fr]">
          <span aria-hidden="true" className="font-display text-[clamp(6rem,4rem+6vw,10rem)] leading-[0.7] font-bold text-gold">
            ”
          </span>
          <div>
            <blockquote
              className={`font-display text-[clamp(1.7rem,1.2rem+1.8vw,2.9rem)] leading-[1.2] font-[200] text-ink transition-[opacity,filter] duration-1000 motion-reduce:transition-none ${
                on ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
              }`}
            >
              {first.quote}
            </blockquote>
            <figcaption className="mt-6 text-note text-muted">{first.service}</figcaption>
          </div>
        </figure>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((r, i) => (
            <li
              key={r.quote}
              className={`flex flex-col justify-between gap-8 bg-paper p-7 transition-[opacity,transform] duration-700 motion-reduce:transition-none md:p-8 ${
                on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <blockquote className="text-body text-ink">{r.quote}</blockquote>
              <p className="flex items-center gap-2 text-note text-muted">
                <span className="h-[2px] w-4 bg-gold" aria-hidden="true" />
                {r.service}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
