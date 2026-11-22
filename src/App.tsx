import { useState } from 'react'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/HeroVideo'
import Trust from './components/Trust'
import About from './components/About'
import Services from './components/Services'
import Process from './components/Process'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Faq from './components/Faq'
import { SiteFooter } from './components/SiteFooter'

export default function App() {
  const [ready, setReady] = useState(false)
  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-full focus:bg-petrol focus:px-5 focus:py-3 focus:text-paper">
        דילוג לתוכן
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero start={ready} />
        <Trust />
        <About />
        <Services />
        <Process />
        <Reviews />
        <Faq />
        <Contact />
      </main>

      <SiteFooter />
    </>
  )
}
