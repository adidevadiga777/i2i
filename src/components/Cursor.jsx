import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const isPointerFine = window.matchMedia('(pointer: fine)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isPointerFine || isReduced) return

    const cu = cursorRef.current
    if (!cu) return

    const qx = gsap.quickTo(cu, 'x', { duration: 0.35, ease: 'power3' })
    const qy = gsap.quickTo(cu, 'y', { duration: 0.35, ease: 'power3' })

    const handlePointerMove = (e) => {
      qx(e.clientX)
      qy(e.clientY)
    }

    const attachTileListeners = () => {
      const tiles = document.querySelectorAll('.tl')
      const enterHandlers = []
      const leaveHandlers = []

      tiles.forEach((t) => {
        const onEnter = () => {
          cu.textContent = t.dataset.v || ''
          gsap.to(cu, {
            width: 84,
            height: 84,
            margin: '-42px 0 0 -42px',
            duration: 0.4,
          })
        }
        const onLeave = () => {
          cu.textContent = ''
          gsap.to(cu, {
            width: 16,
            height: 16,
            margin: '-8px 0 0 -8px',
            duration: 0.4,
          })
        }

        t.addEventListener('pointerenter', onEnter)
        t.addEventListener('pointerleave', onLeave)
        enterHandlers.push({ t, onEnter, onLeave })
      })

      return () => {
        enterHandlers.forEach(({ t, onEnter, onLeave }) => {
          t.removeEventListener('pointerenter', onEnter)
          t.removeEventListener('pointerleave', onLeave)
        })
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    const cleanupTiles = attachTileListeners()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      cleanupTiles()
    }
  }, [])

  return <div className="cur" id="cur" ref={cursorRef} aria-hidden="true" />
}
