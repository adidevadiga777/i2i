import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Marquee() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  const words = [
    'Brand identity',
    'Websites',
    'Strategy',
    'Figma',
    'Development',
    'Art Direction',
    'Systems',
  ]

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      const track = trackRef.current
      if (!track) return

      // Continuous infinite scroll
      const loop = gsap.to(track, {
        xPercent: -50,
        ease: 'none',
        duration: 24,
        repeat: -1,
      })

      // Dynamic scroll velocity reactivity
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity()
          const boost = 1 + Math.abs(v) / 450
          const direction = v < 0 ? -1 : 1
          gsap.to(loop, {
            timeScale: boost * (v < 0 ? -1 : 1),
            duration: 0.35,
            overwrite: 'auto',
            onComplete: () => {
              gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
            },
          })
        },
      })
    },
    { scope: containerRef }
  )

  const segment = (
    <div className="mq-segment">
      {words.map((w, idx) => (
        <span key={idx} className="mq-item">
          {w} <b>/</b>
        </span>
      ))}
    </div>
  )

  return (
    <div className="mq d" ref={containerRef} aria-hidden="true">
      <div className="mq-track" ref={trackRef}>
        {segment}
        {segment}
        {segment}
        {segment}
      </div>
    </div>
  )
}
