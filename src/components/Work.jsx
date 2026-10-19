import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Work() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // ── headline: word mask slide-up ──
      const words = containerRef.current.querySelectorAll('.ww-inner')
      if (words.length) {
        gsap.from(words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current.querySelector('h2.d'),
            start: 'top 88%',
            once: true,
          },
        })
      }

      // ── tiles: clip-path reveal from bottom, staggered ──
      const tiles = gsap.utils.toArray('.tl')
      tiles.forEach((t) => {
        gsap.from(t, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: t,
            start: 'top 90%',
            once: true,
          },
        })

        // ── inner background parallax ──
        const inner = t.querySelector('.in')
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: t,
                scrub: true,
              },
            }
          )
        }

        // ── text content slides up inside the clip ──
        const textEls = t.querySelectorAll('small, h3')
        textEls.forEach((el) => {
          gsap.from(el, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: t,
              start: 'top 88%',
              once: true,
            },
          })
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <section className="pad" id="work" ref={containerRef}>
      <h2 className="d">
        {['Work,', 'with', 'the', 'thinking', 'shown.'].map((w, idx) => (
          <span key={idx} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.26em' }}>
            <span className="ww-inner" style={{ display: 'inline-block' }}>{w}</span>
          </span>
        ))}
      </h2>
      <div className="bn">
        <a className="tl a1" href="#contact" data-v="View">
          <div className="in"></div>
          <small>Self-initiated concept · Brand + landing page</small>
          <h3 className="d">Verdant</h3>
        </a>
        <a className="tl a2" href="#contact" data-v="View">
          <div className="in"></div>
          <small>Self-initiated concept · Identity + portfolio site</small>
          <h3 className="d">Atelier Nord</h3>
        </a>
        <a className="tl a3" href="#contact" data-v="View">
          <div className="in"></div>
          <small>Self-initiated concept · Brand + launch site</small>
          <h3 className="d">Orbit</h3>
        </a>
        <a className="tl a4" href="#contact" data-v="View">
          <div className="in"></div>
          <small>Strategy before style</small>
          <h3 className="d">Systems</h3>
        </a>
        <a className="tl a5" href="#contact" data-v="Talk">
          <small>New work is in progress. Tell us what you are building.</small>
          <h3 className="d">Yours is next.</h3>
        </a>
      </div>
    </section>
  )
}
