import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Statement() {
  const containerRef = useRef(null)
  const stmtRef = useRef(null)

  const words = 'Good design earns trust before you say a word.'.split(' ')

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) {
        gsap.set('.st .w', { opacity: 1 })
        return
      }

      // ── kinetic word-scrub: each word illuminates as it scrolls into frame ──
      gsap.to('.st .w', {
        opacity: 1,
        color: 'var(--ink)',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: stmtRef.current,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 0.5,
        },
      })

      // ── sub-text slides up after statement is visible ──
      const small = containerRef.current.querySelector('small')
      if (small) {
        gsap.from(small, {
          y: 28,
          opacity: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: small,
            start: 'top 90%',
            once: true,
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section className="st pad" ref={containerRef}>
      <p id="stmt" ref={stmtRef}>
        {words.map((w, idx) => (
          <span key={idx} className="w">
            {w}{idx < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
      <small>
        People judge a business quickly. A clear identity and a well-built website make you easier to understand, easier to trust and easier to choose.
      </small>
    </section>
  )
}
