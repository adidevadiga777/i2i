import { useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { packages } from '../data/packages'

gsap.registerPlugin(ScrollTrigger)

export default function Pricing({ onSelectPackage }) {
  const [cur, setCur] = useState(0)
  const [displayPrice, setDisplayPrice] = useState('₹20,000')
  const priceObj = useRef({ n: 20000 })
  const containerRef = useRef(null)

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

  const handleTabChange = (index) => {
    setCur(index)
    const targetN = packages[index].n
    gsap.to(priceObj.current, {
      n: targetN,
      duration: 0.9,
      ease: 'expo.out',
      onUpdate: () => {
        setDisplayPrice(fmt(priceObj.current.n))
      },
    })
    // Panel snap scale on tab switch
    gsap.fromTo('.panel', { scale: 0.975, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'expo.out' })
  }

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // ── headline entrance ──
      const h2 = containerRef.current.querySelector('h2.d')
      if (h2) {
        gsap.from(h2, {
          y: 48,
          opacity: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: { trigger: h2, start: 'top 86%', once: true },
        })
      }

      // ── package tabs: pop up staggered ──
      gsap.from('.tab', {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.seg', start: 'top 88%', once: true },
      })

      // ── panel: slide up from below ──
      gsap.from('.panel', {
        y: 50,
        opacity: 0,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.panel', start: 'top 86%', once: true },
      })

      // ── payment schedule: each bar scaleX wipe from left ──
      gsap.from('.pay i', {
        scaleX: 0,
        transformOrigin: 'left center',
        stagger: 0.18,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pay', start: 'top 85%', once: true },
      })

      // ── assurances: stagger from bottom ──
      gsap.from('.as p', {
        y: 22,
        opacity: 0,
        stagger: 0.09,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.as', start: 'top 90%', once: true },
      })
    },
    { scope: containerRef }
  )

  const activePkg = packages[cur]

  const handleCtaClick = () => {
    onSelectPackage?.(activePkg.v)
    const contactEl = document.querySelector('#contact')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="pad" id="pricing" ref={containerRef}>
      <h2 className="d">Thoughtful design. Transparent investment.</h2>
      <p className="lab">Choose a package</p>
      <div className="seg" role="tablist" aria-label="Packages" id="tabs">
        {packages.map((pkg, idx) => (
          <button
            key={pkg.v}
            className={`tab ${cur === idx ? 'on' : ''}`}
            role="tab"
            aria-selected={cur === idx}
            type="button"
            onClick={() => handleTabChange(idx)}
          >
            <b>{pkg.v}</b>
            <small>from {fmt(pkg.n)}</small>
          </button>
        ))}
      </div>

      <div className="panel" aria-live="polite">
        <div>
          <p className="lab">Starting at</p>
          <div className="pn d" id="pn">
            {displayPrice}
          </div>
          <div className="tm">
            <span>Typical timeline</span>
            <b id="pw">{activePkg.w}</b>
          </div>
          <div className="bar">
            <i id="pbar" style={{ width: `${activePkg.b}%` }}></i>
          </div>
          <p className="pb2" id="pbest">
            {activePkg.t}
          </p>
        </div>
        <div>
          <p className="lab">What's included</p>
          <ul className="pl" id="pl">
            {activePkg.l.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <button className="btn" id="pcta" type="button" onClick={handleCtaClick}>
            Start with this package
          </button>
        </div>
      </div>

      <div className="pay">
        <p>Suggested payment schedule</p>
        <div>
          <i style={{ flex: 50 }}>
            <b className="d">50%</b>
            <small>to book the project</small>
          </i>
          <i style={{ flex: 30 }}>
            <b className="d">30%</b>
            <small>after design approval</small>
          </i>
          <i style={{ flex: 20 }}>
            <b className="d">20%</b>
            <small>before launch</small>
          </i>
        </div>
      </div>

      <div className="as">
        <p>You provide final copy and images unless content creation is agreed in writing.</p>
        <p>Domain, hosting, paid plugins, premium fonts and maintenance are separate.</p>
        <p>Extra pages, integrations or revision rounds may change price and timeline.</p>
        <p>Timelines start once the proposal is approved and the first payment is received.</p>
      </div>
    </section>
  )
}
