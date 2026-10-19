import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ heroMarkRef }) {
  const heroRef = useRef(null)
  const localMarkRef = useRef(null)
  const blkRef = useRef(null)
  const markRef = heroMarkRef || localMarkRef

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const lines = gsap.utils.toArray('#hl span i')
      const hm = markRef.current
      const b = blkRef.current
      const pre = document.getElementById('pre')
      const preText = pre ? pre.querySelector('small') : null

      function getTargetScale() {
        if (!b) return 30
        const r = b.getBoundingClientRect()
        const sX = (window.innerWidth * 1.4) / (r.width || 1)
        const sY = (window.innerHeight * 1.4) / (r.height || 1)
        return Math.max(sX, sY, 25)
      }

      function getDeltaX() {
        if (!b) return 0
        const r = b.getBoundingClientRect()
        const bx = r.left + r.width / 2
        return (window.innerWidth / 2) - bx
      }

      function getDeltaY() {
        if (!b) return 0
        const r = b.getBoundingClientRect()
        const by = r.top + r.height / 2
        return (window.innerHeight / 2) - by
      }

      function initScrollTrigger() {
        const isMobile = window.innerWidth <= 768

        const h = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: isMobile ? '+=95%' : '+=120%',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        h.fromTo(
          '#hl, #sub, .fx',
          { opacity: 1, y: 0 },
          { opacity: 0, y: isMobile ? -30 : -60, duration: 0.35, immediateRender: false },
          0
        )
          .fromTo(
            '#hm .mk-a, #hm .mk-b, #hm .mk-d',
            { opacity: 1 },
            { opacity: 0, duration: 0.35, immediateRender: false },
            0
          )
          .to(
            '#hf',
            {
              opacity: 1,
              ease: 'power2.in',
              duration: 0.85,
            },
            0.1
          )
          .to(
            hm,
            {
              x: () => {
                const r = hm.getBoundingClientRect()
                return (window.innerWidth / 2) - (r.left + r.width / 2)
              },
              y: () => {
                const r = hm.getBoundingClientRect()
                return (window.innerHeight / 2) - (r.top + r.height / 2)
              },
              duration: 0.9,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            b,
            {
              scale: () => {
                const r = b.getBoundingClientRect()
                const sX = (window.innerWidth * 1.5) / (r.width || 1)
                const sY = (window.innerHeight * 1.5) / (r.height || 1)
                return Math.max(sX, sY, 35)
              },
              backgroundColor: '#aefe14',
              ease: 'power2.in',
              duration: 1,
            },
            0
          )
      }

      if (isReduced) {
        if (pre) pre.style.display = 'none'
        gsap.set(lines, { yPercent: 0, display: 'block' })
        gsap.set('#sub', { opacity: 1, y: 0 })
        gsap.set(hm, { opacity: 1, zIndex: 2 })
        gsap.set('.fx', { opacity: 1 })
        initScrollTrigger()
        return
      }

      // Ensure starting at top of viewport for exact layout coordinates
      window.scrollTo(0, 0)

      if (!hm) return

      // Measure exact rendered geometry of hm
      const r = hm.getBoundingClientRect()
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const hmCenterX = r.left + r.width / 2
      const hmCenterY = r.top + r.height / 2
      const dx = cx - hmCenterX
      const dy = cy - hmCenterY

      // Initial center scale (targeting ~96px width in center)
      const w0 = Math.min(window.innerWidth * 0.22, 96)
      const initScale = w0 / (r.width || 1)

      // Set initial positions with pure GPU transforms
      gsap.set(hm, {
        x: dx,
        y: dy,
        scale: initScale,
        transformOrigin: '50% 50%',
        zIndex: 102,
        opacity: 1,
      })

      // The 4 blocks assemble from outside
      gsap.set('#hm .mk-a', { xPercent: -140, yPercent: -120, opacity: 0 })
      gsap.set('#hm .mk-b', { xPercent: -100, yPercent: 160, opacity: 0 })
      gsap.set('#hm .mk-c', { xPercent: 140, yPercent: -160, opacity: 0 })
      gsap.set('#hm .mk-d', { xPercent: 100, yPercent: 140, opacity: 0 })

      // Hero text hidden initially
      gsap.set(lines, { yPercent: 115, display: 'block' })
      gsap.set('#sub', { opacity: 0, y: 24 })
      gsap.set('.fx', { opacity: 0 })
      if (preText) gsap.set(preText, { opacity: 0, y: 12 })

      // Lock scroll during intro animation
      document.body.style.overflow = 'hidden'

      const introTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          gsap.set(hm, { zIndex: 2 })
          if (pre) pre.style.display = 'none'
          initScrollTrigger()
          ScrollTrigger.refresh()
        },
      })

      // 1. Assemble 4 blocks in center
      introTl
        .to('#hm .mk-a', { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' })
        .to('#hm .mk-b', { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '<0.08')
        .to('#hm .mk-c', { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '<0.08')
        .to('#hm .mk-d', { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '<0.08')

      if (preText) {
        introTl.to(preText, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<0.15')
      }

      // 2. Pause briefly, then flight
      introTl.addLabel('flight', '+=0.35')

      if (preText) {
        introTl.to(preText, { opacity: 0, y: -8, duration: 0.35, ease: 'power2.in' }, 'flight')
      }

      // Fade out dark preloader screen to reveal the hero background
      if (pre) {
        introTl.to(pre, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 'flight+=0.05')
      }

      // Smooth flight of the mark to its hero position
      introTl.to(
        hm,
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.25,
          ease: 'power3.inOut',
        },
        'flight'
      )

      // 3. Staggered headline reveal overlapping with flight completion
      introTl
        .to('.fx', { opacity: 1, duration: 1.0, ease: 'power2.out' }, 'flight+=0.4')
        .to(lines, { yPercent: 0, duration: 1.05, stagger: 0.08, ease: 'power4.out' }, 'flight+=0.45')
        .to('#sub', { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 'flight+=0.7')
    },
    { scope: heroRef }
  )

  return (
    <header className="hero pad" id="top" ref={heroRef}>
      <div className="hero-fill" id="hf" aria-hidden="true" />
      <div className="pill fx">Independent studio for brand identity and web design</div>
      <div className="mark" id="hm" ref={markRef} aria-hidden="true">
        <i className="mk-a"></i>
        <i className="mk-b"></i>
        <i className="mk-c" id="blk" ref={blkRef}></i>
        <i className="mk-d"></i>
      </div>
      <div className="bw fx" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="cp" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text>
            <textPath href="#cp" textLength="284" lengthAdjust="spacing">
              Designing Ideas · Building Identities ·{' '}
            </textPath>
          </text>
          <rect x="54" y="54" width="12" height="12" fill="#aefe14" />
        </svg>
      </div>
      <h1 className="d" id="hl">
        <span><i>From a great</i></span>
        <span><i>idea to a</i></span>
        <span><i>brand people</i></span>
        <span><i>remember.</i></span>
      </h1>
      <div className="sub" id="sub">
        <p>
          We create thoughtful brand identities and high-performing websites that help businesses communicate their value and earn customer trust.
        </p>
        <a className="btn" href="#contact">Start a project</a>
      </div>
      <div className="cue fx" aria-hidden="true">Scroll</div>
    </header>
  )
}
