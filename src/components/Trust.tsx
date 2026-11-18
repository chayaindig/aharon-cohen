import { contact } from '../data'

/* Trust factors the way appraiser sites show them: licence, years, the standards, who does the work */
export default function Trust() {
  const years = new Date().getFullYear() - contact.since
  const items = [
    { big: `${years}+`, label: 'שנות ניסיון כשמאי מוסמך' },
    { big: 'רישיון', label: 'ממועצת שמאי המקרקעין, משרד המשפטים' },
    { big: 'תקן 19', label: 'שומות לבנקים למשכנתא ולאשראי' },
    { big: 'אישי', label: 'כל שומה מול השמאי עצמו, לא מול מוקד' },
  ]
  return (
    <section aria-label="למה לסמוך" className="grain bg-paper">
      <ul className="mx-auto grid max-w-[1360px] grid-cols-2 px-5 md:px-10 lg:grid-cols-4">
        {items.map((it, i) => (
          <li
            key={it.label}
            className={`flex flex-col gap-2 border-line py-9 lg:py-12 ${i % 2 === 1 ? 'border-s ps-5' : 'pe-5'} ${i < 2 ? 'border-b lg:border-b-0' : ''} lg:border-s lg:px-8 lg:first:border-s-0 lg:first:ps-0`}
          >
            <span className="font-display text-[clamp(1.9rem,1.4rem+1.6vw,2.8rem)] leading-none text-petrol">{it.big}</span>
            <span className="text-note text-muted">{it.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
