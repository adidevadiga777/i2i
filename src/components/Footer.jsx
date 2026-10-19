import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)
  const wmarkRef = useRef(null)

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // ── column stagger slide-up ──
      const cols = footerRef.current.querySelectorAll('.fg > div')
      gsap.from(cols, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.fg',
          start: 'top 88%',
          once: true,
        },
      })

      // ── watermark parallax scrub ──
      if (wmarkRef.current) {
        gsap.to(wmarkRef.current, {
          xPercent: -9,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        })
      }

      // ── bottom bar fade-up ──
      gsap.from('.fb', {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.fb',
          start: 'top 97%',
          once: true,
        },
      })
    },
    { scope: footerRef }
  )

  return (
    <footer className="ft pad" ref={footerRef}>
      <div className="fg">
        <div>
          <b className="d" style={{ fontSize: '30px' }}>
            Designing Ideas.<br />Building Identities.
          </b>
          <p>
            An independent studio creating brand identities and websites for ambitious founders and small businesses.
          </p>
        </div>
        <div>
          <h4>Studio</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="#pricing">Brand identity</a></li>
            <li><a href="#pricing">Website design + development</a></li>
            <li><a href="#pricing">Brand + website</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><a href="mailto:hello@ideatoidentity.com">hello@ideatoidentity.com</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Behance</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="fw d" aria-hidden="true" ref={wmarkRef}>
        Idea to Identity
      </div>
      <div className="fb">
        <span>© 2026 Idea to Identity. All rights reserved.</span>
        <span>We use the details you share only to respond to your enquiry.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
