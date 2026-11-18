import logo from '../logo.svg?raw'
import { contact } from '../data'
import { WipeButton } from './ui'

// Only the bar mark: the same traced logo, framed on the bars so the lettering falls outside the view
const mark = logo.replace(/viewBox="[^"]*"/, 'viewBox="1376 60 602 894"')

/* Closing band from the ANIMTD wipe-arrow-button prompt: the mark as a ghost skyline rising from the bottom edge, 8/4 grid */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-x-clip bg-night text-paper">
      <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[4%] h-[62%] opacity-[0.09] md:left-[6%] md:h-[86%] [&_path]:fill-paper [&>svg]:h-full [&>svg]:w-auto"
        dangerouslySetInnerHTML={{ __html: mark }}
      />
      <div className="relative mx-auto grid max-w-[1360px] gap-x-16 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[8fr_4fr]">
        <div>
          <h2 id="contact-title" className="font-display text-section">
            לפני שחותמים,
            <br />
            <span className="text-gold">יודעים כמה זה שווה.</span>
          </h2>
          <p className="mt-6 max-w-[32rem] text-body text-paper/75">
            שלחו לי הודעה על הנכס. אחזור אליכם עם מה שצריך, כמה זה עולה ומתי חוות הדעת אצלכם.
          </p>
          <p className="mt-6 text-note text-paper/55">
            {contact.address} · זמין {contact.hours}
          </p>
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
