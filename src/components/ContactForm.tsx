import { useCallback, useState, type FormEvent } from 'react'
import { contact } from '../data'
import ThankYou from './ThankYou'

const base = import.meta.env.BASE_URL
type Errors = Partial<Record<'name' | 'phone' | 'email' | 'consent', string>>

const phoneOk = (v: string) => /^0\d{8,9}$/.test(v.replace(/[\s-]/g, '')) || /^\+972\d{8,9}$/.test(v.replace(/[\s-]/g, ''))
const emailOk = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [thanks, setThanks] = useState<string | null>(null)
  const close = useCallback(() => setThanks(null), [])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const next: Errors = {}
    if (!data.name?.trim()) next.name = 'איך קוראים לכם?'
    if (!phoneOk(data.phone ?? '')) next.phone = 'מספר טלפון ישראלי, למשל 050-1234567'
    if (!emailOk(data.email ?? '')) next.email = 'כתובת המייל לא נראית תקינה'
    if (!data.consent) next.consent = 'צריך לאשר את מדיניות הפרטיות כדי לשלוח'
    setErrors(next)
    setFailed(false)
    const first = Object.keys(next)[0]
    if (first) {
      ;(form.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }

    setSending(true)
    try {
      if (contact.formEndpoint) {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, consent: 'אושר', _subject: `פנייה חדשה מהאתר: ${data.name}` }),
        })
        if (!res.ok) throw new Error(String(res.status))
      }
      form.reset()
      setThanks(data.name.trim().split(' ')[0])
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span id={`${k}-err`} className="mt-1.5 block text-note text-[#f1b6a6]">
        {errors[k]}
      </span>
    ) : null
  const aria = (k: keyof Errors) => ({ 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  return (
    <>
      <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-[20px] border border-paper/12 bg-petrol-deep/70 p-6 md:p-8" aria-labelledby="form-title">
        <h3 id="form-title" className="font-display text-sub">השאירו פרטים, אחזור אליכם</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-note text-paper/70">שם מלא *</span>
            <input name="name" autoComplete="name" className="field" {...aria('name')} />
            {err('name')}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-note text-paper/70">טלפון *</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="field text-right" {...aria('phone')} />
            {err('phone')}
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-note text-paper/70">אימייל (לא חובה)</span>
          <input name="email" type="email" autoComplete="email" dir="ltr" className="field text-right" {...aria('email')} />
          {err('email')}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-note text-paper/70">במה מדובר?</span>
          <select name="topic" className="field" defaultValue={contact.formTopics[0]}>
            {contact.formTopics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-note text-paper/70">כמה מילים על הנכס (לא חובה)</span>
          <textarea name="message" rows={3} className="field min-h-[96px] resize-y" placeholder="למשל: דירת 4 חדרים באפרת, צריך שומה לבנק עד סוף החודש" />
        </label>

        <p className="text-note text-paper/55">
          מסירת הפרטים היא מרצון. הם ישמשו רק כדי לחזור אליכם בעניין הפנייה, עוברים דרך שירות שליחת טפסים ותיבת דוא"ל שמאוחסנים בחו"ל, ואפשר לבקש לעיין בהם או למחוק אותם בכל עת.
        </p>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-note text-paper/80">
            <input name="consent" type="checkbox" value="1" className="mt-0.5 size-5 shrink-0 accent-[var(--color-gold)]" {...aria('consent')} />
            <span>
              קראתי ואני מסכים/ה ל<a href={`${base}privacy/`} target="_blank" rel="noopener" className="underline decoration-gold underline-offset-4 hover:text-gold">מדיניות הפרטיות</a>, כולל העברת הפרטים לשירותים שמאוחסנים בחו"ל.
            </span>
          </label>
          {err('consent')}
        </div>

        <button type="submit" disabled={sending} className="wipe wipe--btn wipe--light mt-2 w-full justify-center disabled:opacity-60 sm:w-auto sm:justify-self-start">
          <span className="wipe__label">{sending ? 'שולח…' : 'שליחה'}</span>
        </button>
        <p role="status" aria-live="polite" className="text-note text-[#f1b6a6] empty:hidden">
          {failed ? 'משהו נתקע בשליחה. אפשר לנסות שוב, או פשוט לשלוח לי וואטסאפ.' : ''}
        </p>
      </form>
      {thanks !== null && <ThankYou name={thanks} onClose={close} />}
    </>
  )
}
