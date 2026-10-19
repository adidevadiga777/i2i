import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact({ preselectedNeed }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    need: '',
    bud: '',
    name: '',
    email: '',
    biz: '',
    msg: '',
  })
  const [statusMsg, setStatusMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      // Headline word-mask slide-up
      const wordInners = containerRef.current?.querySelectorAll('.ct-w-inner')
      if (wordInners?.length) {
        gsap.from(wordInners, {
          yPercent: 110,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: containerRef.current.querySelector('h2.d'), start: 'top 86%', once: true },
        })
      }

      // Left column text elements stagger
      gsap.from(['.ct .lead', '.ct .nx li', '.ct .em'], {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ct .lead', start: 'top 88%', once: true },
      })

      // Form card slides up
      gsap.from('.fc', {
        y: 44,
        opacity: 0,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.fc', start: 'top 86%', once: true },
      })
    },
    { scope: containerRef }
  )

  useEffect(() => {
    if (preselectedNeed) {
      setFormData((prev) => ({ ...prev, need: preselectedNeed }))
      setStep(1)
    }
  }, [preselectedNeed])

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setStatusMsg('')
    if (step < 2) {
      setTimeout(() => {
        setStep((s) => s + 1)
      }, 240)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = async (e) => {
    e?.preventDefault()
    if (step === 0) {
      if (!formData.need) {
        setStatusMsg('Choose an option to continue.')
        return
      }
      setStep(1)
      setStatusMsg('')
    } else if (step === 1) {
      if (!formData.bud) {
        setStatusMsg('Choose an option to continue.')
        return
      }
      setStep(2)
      setStatusMsg('')
    } else if (step === 2) {
      const { name, email, msg } = formData
      if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !msg.trim()) {
        setStatusMsg('Please add your name, a valid email and a few words about your project.')
        return
      }

      setIsSubmitting(true)
      setStatusMsg('Sending enquiry...')

      try {
        const response = await fetch('https://formspree.io/f/mqkenjyw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          setIsDone(true)
          setStatusMsg(
            'Thank you! Your enquiry has been sent. We review every brief personally and will be in touch within 24 hours.'
          )
        } else {
          // If endpoint is not configured yet or fails, fallback to mailto
          throw new Error('Fallback')
        }
      } catch {
        const mailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nBusiness: ${
          formData.biz || '-'
        }\nNeed: ${formData.need || '-'}\nBudget: ${formData.bud || '-'}\n\nProject:\n${formData.msg}`
        setIsDone(true)
        setStatusMsg(
          'Thank you! Your enquiry is ready. If your email app does not open automatically, please send your notes to hello@ideatoidentity.com.'
        )
        window.location.href = `mailto:hello@ideatoidentity.com?subject=${encodeURIComponent(
          'Project enquiry from ' + formData.name
        )}&body=${encodeURIComponent(mailBody)}`
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <section className="ct pad" id="contact" ref={containerRef}>
      <div className="cg">
        <div>
          <h2 className="d">
            {['Tell', 'us', 'what', 'you', 'are', 'building.'].map((w, idx) => (
              <span key={idx} className="ct-w-outer">
                <span className="ct-w-inner">{w}</span>
              </span>
            ))}
          </h2>
          <p className="lead">
            You do not need a perfect brief. Three quick steps, and we will let you know honestly whether we are the right fit.
          </p>
          <ul className="nx">
            <li>We review your enquiry.</li>
            <li>If it looks aligned, we ask follow-up questions or arrange a short call.</li>
            <li>We send a proposal with scope, timeline, investment and payment milestones.</li>
          </ul>
          <a className="em" href="mailto:hello@ideatoidentity.com">
            Prefer email? hello@ideatoidentity.com
          </a>
        </div>

        <form id="cf" className={`fc ${isDone ? 'done' : ''}`} noValidate onSubmit={handleNext}>
          <div className="prog">
            <i className={step >= 0 ? 'on' : ''}></i>
            <i className={step >= 1 ? 'on' : ''}></i>
            <i className={step >= 2 ? 'on' : ''}></i>
          </div>
          <p className="stp" id="stp">
            Step {step + 1} of 3
          </p>

          {/* Step 1: Need */}
          <div className={`pane ${step === 0 ? 'on' : ''}`}>
            <h3>What do you need?</h3>
            <div className="opts">
              {[
                { val: 'Brand identity', title: 'Brand identity', sub: 'Logo, colour, typography, guidelines' },
                { val: 'Website design + development', title: 'Website design + development', sub: 'Figma design and responsive build' },
                { val: 'Brand + website', title: 'Brand + website', sub: 'One connected project' },
                { val: 'Not sure yet', title: 'Not sure yet', sub: 'We will recommend a starting point' },
              ].map((opt) => (
                <label key={opt.val} className="op">
                  <input
                    type="radio"
                    name="need"
                    value={opt.val}
                    checked={formData.need === opt.val}
                    onChange={() => handleRadioChange('need', opt.val)}
                  />
                  <span>
                    <b>{opt.title}</b>
                    <small>{opt.sub}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Budget */}
          <div className={`pane ${step === 1 ? 'on' : ''}`}>
            <h3>What is your estimated budget?</h3>
            <div className="opts">
              {[
                'Below ₹20,000',
                '₹20,000–₹50,000',
                '₹50,000–₹1,00,000',
                'Above ₹1,00,000',
                'Need guidance',
              ].map((b) => (
                <label key={b} className="op">
                  <input
                    type="radio"
                    name="bud"
                    value={b}
                    checked={formData.bud === b}
                    onChange={() => handleRadioChange('bud', b)}
                  />
                  <span>
                    <b>{b}</b>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Details */}
          <div className={`pane ${step === 2 ? 'on' : ''}`}>
            <h3>Tell us about you and the project</h3>
            <div className="g2">
              <label className="fl">
                <span>Your name</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
              <label className="fl">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <label className="fl">
                <span>Business or brand name (optional)</span>
                <input
                  name="biz"
                  placeholder="Your business"
                  value={formData.biz}
                  onChange={handleInputChange}
                />
              </label>
              <label className="fl">
                <span>What are you building?</span>
                <textarea
                  name="msg"
                  rows="3"
                  placeholder="Your business, audience and goals"
                  value={formData.msg}
                  onChange={handleInputChange}
                ></textarea>
              </label>
            </div>
          </div>

          <div className="act">
            <button
              className="bk"
              id="bk"
              type="button"
              style={{ visibility: step > 0 ? 'visible' : 'hidden' }}
              onClick={() => {
                setStep((s) => Math.max(0, s - 1))
                setStatusMsg('')
              }}
            >
              Back
            </button>
            <button className="btn" id="nxt" type="button" onClick={handleNext} disabled={isSubmitting}>
              {step === 2 ? (isSubmitting ? 'Sending...' : 'Send enquiry') : 'Next'}
            </button>
          </div>

          <p id="fm" role="status">
            {statusMsg}
          </p>
        </form>
      </div>
    </section>
  )
}
