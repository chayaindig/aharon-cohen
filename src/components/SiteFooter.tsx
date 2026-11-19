import { contact, nav } from '../data'
import { Icon } from './ui'

const base = import.meta.env.BASE_URL
const legal = [
  { label: 'הצהרת נגישות', href: `${base}accessibility/` },
  { label: 'מדיניות פרטיות', href: `${base}privacy/` },
  { label: 'תקנון האתר', href: `${base}terms/` },
]

/* Footer + floating WhatsApp, shared by the home page and the inner pages */
export function SiteFooter() {
  return (
    <>
      <footer className="bg-paper py-12">
        <div className="mx-auto grid max-w-[1360px] gap-8 px-5 md:px-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-14">
          <img src={`${base}img/logo.webp`} alt={`${contact.name}, ${contact.tagline}`} width="924" height="577" loading="lazy" className="h-14 w-auto self-start object-contain" />
          <nav aria-label="ניווט תחתון" className="grid gap-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-note text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={`${base}${n.href}`} className="hover:text-petrol">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${base}#faq`} className="hover:text-petrol">
                  שאלות נפוצות
                </a>
              </li>
            </ul>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-note text-muted/80">
              {legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="underline decoration-line underline-offset-4 hover:text-petrol">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-note text-muted">
            © {new Date().getFullYear()} {contact.name}, {contact.tagline}
          </p>
        </div>
      </footer>

      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שליחת הודעה בוואטסאפ"
        className="fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 md:right-6 md:bottom-6"
      >
        <Icon name="whatsapp" className="size-8" />
      </a>
    </>
  )
}
