import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  const containerRef = useRef(null)

  const steps = [
    { num: '01', title: 'Discover', desc: 'Understand the business and the brief: goals, audience, timeline and budget.' },
    { num: '02', title: 'Define', desc: 'Agree the direction, deliverables, milestones and terms before designing.' },
    { num: '03', title: 'Design', desc: 'Develop the identity or Figma layouts, shared at planned review points.' },
    { num: '04', title: 'Build', desc: 'Turn approved designs into a working, responsive website.' },
    { num: '05', title: 'Refine', desc: 'Check responsive behaviour, links, forms, browsers and accessibility.' },
    { num: '06', title: 'Launch', desc: 'Hand over agreed files and access, with a walkthrough of what was delivered.' },
  ]

  const words = ['Idea', 'to', 'launch,', 'in', 'six', 'moves.']

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // ── kicker badge ──
      const kicker = containerRef.current.querySelector('.ps-kicker')
      if (kicker) {
        gsap.from(kicker, {
          y: -14,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: kicker,
            start: 'top 90%',
            once: true,
          },
        })
      }

      // ── headline word mask slide-up ──
      const wordInners = containerRef.current.querySelectorAll('.ps-w-inner')
      if (wordInners.length) {
        gsap.from(wordInners, {
          yPercent: 110,
          duration: 0.95,
          ease: 'power4.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current.querySelector('.ps-header h2'),
            start: 'top 88%',
            once: true,
          },
        })
      }

      // ── step rows reveal choreography ──
      const rows = gsap.utils.toArray('.sp')
      if (rows.length) {
        gsap.from(rows, {
          y: 35,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: rows[0],
            start: 'top 82%',
            once: true,
          },
        })

        // ── active illumination as user scrolls past each step ──
        rows.forEach((row) => {
          ScrollTrigger.create({
            trigger: row,
            start: 'top 58%',
            end: 'bottom 42%',
            toggleClass: { targets: row, className: 'on' },
          })
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section className="ps pad" id="process" ref={containerRef}>
      <div className="ps-header">
        <div className="ps-kicker">
          <span className="ps-dot"></span>
          <span>The Process</span>
        </div>
        <h2 className="d">
          {words.map((w, idx) => (
            <span key={idx} className="ps-w-outer">
              <span className="ps-w-inner">{w}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="ps-list">
        {steps.map((s) => (
          <div key={s.num} className="sp">
            <em>{s.num}</em>
            <h3 className="d">{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
