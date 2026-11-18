import { contact } from '../data'
import { WipeButton } from './ui'

/* Closing band from the ANIMTD wipe-arrow-button prompt: ghost number cut by the edge, 8/4 grid */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-x-clip bg-petrol-deep text-paper">
      <div className="mx-auto grid max-w-[1360px] gap-x-16 px-5 pt-20 pb-20 md:px-10 md:pt-24 md:pb-28 lg:grid-cols-[8fr_4fr]">
        <p
          aria-hidden="true"
          dir="ltr"
          className="pointer-events-none -ms-[clamp(20px,6vw,120px)] font-display text-[clamp(9rem,5rem+16vw,19rem)] leading-[0.8] font-bold text-gold/[0.12] select-none lg:col-span-2"
          style={{ textAlign: 'left' }}
        >
          2015
        </p>
        <div className="-mt-[clamp(2.5rem,1rem+5vw,6rem)]">
          <h2 id="contact-title" className="font-display text-section font-bold">
            צריכים שומה?
            <br />
            <span className="text-gold">בואו נדבר.</span>
          </h2>
          <p className="mt-6 max-w-[32rem] text-body text-paper/75">
            כתבו לי בוואטסאפ או התקשרו, בין {contact.hours}. אחזור אליכם עם כל מה שצריך לדעת לפני שמתחילים.
          </p>
          <p className="mt-6 text-note text-paper/60">משרד: {contact.address}</p>
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 lg:mt-0 lg:self-end">
          <WipeButton href={contact.whatsappHref} variant="light" icon="whatsapp" external className="w-full justify-center sm:w-auto">
            לשיחה בוואטסאפ
          </WipeButton>
          <WipeButton href={contact.phoneHref} variant="light-link" icon="phone">
            <bdi dir="ltr">{contact.phoneDisplay}</bdi>
          </WipeButton>
          <WipeButton href={`mailto:${contact.email}`} variant="light-link">
            <bdi dir="ltr">{contact.email}</bdi>
          </WipeButton>
        </div>
      </div>
    </section>
  )
}
