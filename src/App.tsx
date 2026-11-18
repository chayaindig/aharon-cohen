import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Process from './components/Process'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import { Icon } from './components/ui'
import { contact, nav } from './data'

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-full focus:bg-petrol focus:px-5 focus:py-3 focus:text-paper">
        דילוג לתוכן
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Process />
        <Reviews />
        <Contact />
      </main>

      <footer className="bg-paper py-12">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-10">
          <img src={`${import.meta.env.BASE_URL}img/logo.webp`} alt={`${contact.name}, ${contact.tagline}`} width="924" height="577" loading="lazy" className="h-14 w-auto" />
          <nav aria-label="ניווט תחתון">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-note text-muted">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-petrol">
                    {n.label}
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
        className="fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full bg-petrol text-paper shadow-[0_12px_30px_-10px_rgb(5_58_65/0.6)] transition-transform hover:scale-105 md:right-6 md:bottom-6"
      >
        <Icon name="whatsapp" className="size-7" />
      </a>
    </>
  )
}
