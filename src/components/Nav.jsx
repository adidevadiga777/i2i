import { useEffect, useState } from 'react'

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className={isScrolled ? 'sc' : ''} aria-label="Main Navigation">
      <a className="lg" href="#top" aria-label="Idea to Identity home">
        <svg viewBox="0 0 42 86" aria-hidden="true">
          <rect width="18" height="18" fill="#FAFFF3" />
          <rect y="24" width="18" height="62" fill="#aefe14" />
          <rect x="24" width="18" height="62" fill="#aefe14" />
          <rect x="24" y="68" width="18" height="18" fill="#FAFFF3" />
        </svg>
        <span>
          IDEA TO<br />IDENTITY
        </span>
      </a>
      <div className="nl">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a href="#pricing">Pricing</a>
        <a className="nb" href="#contact">Start a project</a>
      </div>
    </nav>
  )
}
