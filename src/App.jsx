import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Work from './components/Work'
import Process from './components/Process'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

export default function App() {
  const [selectedNeed, setSelectedNeed] = useState('')

  // Initialize Lenis smooth scroll
  useLenis()

  const handleSelectPackageOrService = (need) => {
    setSelectedNeed(need)
  }

  return (
    <>
      <Preloader />
      <Nav />
      <Cursor />
      <main id="top">
        <Hero />
        <Statement />
        <Marquee />
        <Services onSelectService={handleSelectPackageOrService} />
        <Work />
        <Process />
        <Pricing onSelectPackage={handleSelectPackageOrService} />
        <Contact preselectedNeed={selectedNeed} />
      </main>
      <Footer />
    </>
  )
}

