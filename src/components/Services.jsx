import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Services({ onSelectService }) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // ── headline: word mask slide-up ──
      const words = containerRef.current.querySelectorAll('.sw-inner')
      if (words.length) {
        gsap.from(words, {
          yPercent: 105,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: containerRef.current.querySelector('h2.d'),
            start: 'top 88%',
            once: true,
          },
        })
      }

      // ── each row: clip-path wipe from bottom ──
      const rows = gsap.utils.toArray('.rw')
      gsap.from(rows, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: rows[0],
          start: 'top 82%',
          once: true,
        },
      })

      // ── arrow nudge on hover ──
      rows.forEach((row) => {
        const arrow = row.querySelector('.rw-arrow')
        if (!arrow) return
        row.addEventListener('mouseenter', () => {
          gsap.to(arrow, { x: 5, y: -5, duration: 0.35, ease: 'power2.out' })
        })
        row.addEventListener('mouseleave', () => {
          gsap.to(arrow, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.55)' })
        })
      })
    },
    { scope: containerRef }
  )

  const handleServiceClick = (serviceName) => {
    onSelectService?.(serviceName)
  }

  return (
    <section className="pad" id="services" ref={containerRef}>
      <h2 className="d">
        {['One', 'process.', 'Three', 'ways', 'in.'].map((w, idx) => (
          <span key={idx} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.26em' }}>
            <span className="sw-inner" style={{ display: 'inline-block' }}>{w}</span>
          </span>
        ))}
      </h2>
      <a className="rw" href="#contact" onClick={() => handleServiceClick('Brand identity')}>
        <h3 className="d">Brand identity</h3>
        <p>
          A refined visual foundation: logo, colour, typography and clear usage guidelines, built around your positioning.
          <b>From ₹20,000 · 2–3 weeks</b>
        </p>
        <span className="rw-arrow" aria-hidden="true">↗</span>
      </a>
      <a className="rw" href="#contact" onClick={() => handleServiceClick('Website design + development')}>
        <h3 className="d">Website design + build</h3>
        <p>
          A responsive website designed in Figma and developed to the approved design, structured around what visitors need to do.
          <b>From ₹45,000 · 3–5 weeks</b>
        </p>
        <span className="rw-arrow" aria-hidden="true">↗</span>
      </a>
      <a className="rw" href="#contact" onClick={() => handleServiceClick('Brand + website')}>
        <h3 className="d">Brand + website</h3>
        <p>
          Identity and website developed together, so strategy, visual direction and digital experience stay aligned from day one.
          <b>From ₹60,000 · 5–7 weeks</b>
        </p>
        <span className="rw-arrow" aria-hidden="true">↗</span>
      </a>
    </section>
  )
}
