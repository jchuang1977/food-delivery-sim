import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useApp } from '../context/AppContext'
import './TrackingPage.css'

gsap.registerPlugin(useGSAP)

const statusSteps = [
  { emoji: '📋', text: '訂單已接收', time: '0:00' },
  { emoji: '👨‍🍳', text: '餐廳正在準備', time: '0:45' },
  { emoji: '📦', text: '餐點已打包', time: '1:30' },
  { emoji: '🛵', text: '外送員已出發', time: '2:15' },
  { emoji: '📍', text: '外送員即將抵達', time: '3:00' },
  { emoji: '📸', text: '外送員抵達，拍照確認', time: '3:30' },
]

export default function TrackingPage() {
  const { state, dispatch } = useApp()
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const fillRef = useRef(null)
  const characterRef = useRef(null)
  const questRef = useRef(null)
  const completeRef = useRef(null)
  const particlesRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const config = state.deliveryMode === 'rabbit'
    ? { emoji: '🐰', name: '兔兔', trail: '🐾' }
    : { emoji: '🚀', name: '火箭', trail: '💫' }

  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 1 })

    const totalSteps = statusSteps.length
    let stepIndex = 0

    const showStep = (idx) => {
      if (idx >= totalSteps) {
        finish()
        return
      }
      const step = statusSteps[idx]
      setCurrentStep(idx)

      const logItem = document.createElement('div')
      logItem.className = 'quest-item'
      logItem.innerHTML = `
        <span class="quest-check">${idx > 0 ? '✓' : '◉'}</span>
        <span class="quest-emoji">${step.emoji}</span>
        <span class="quest-text">${step.text}</span>
        <span class="quest-time">${step.time}</span>
      `
      questRef.current.appendChild(logItem)

      gsap.from(logItem, { x: -20, opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' })

      const progress = ((idx + 0.5) / totalSteps) * 100
      gsap.to(fillRef.current, { width: `${progress}%`, duration: 0.6, ease: 'power2.out' })

      if (characterRef.current) {
        gsap.to(characterRef.current, {
          left: `${progress}%`,
          duration: 1.2,
          ease: 'power2.inOut',
        })
      }

      stepIndex++
      const delay = idx === 0 ? 800 : 2000
      setTimeout(() => showStep(stepIndex), delay)
    }

    const finish = () => {
      setIsComplete(true)
      gsap.to(fillRef.current, { width: '100%', duration: 0.5, ease: 'power2.out' })
      if (characterRef.current) {
        gsap.to(characterRef.current, { left: '100%', duration: 0.6, ease: 'power1.in' })
      }
      gsap.to(completeRef.current, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
      spawnParticles()
      setTimeout(() => dispatch({ type: 'SET_TRACKING_COMPLETE' }), 800)
    }

    const spawnParticles = () => {
      const container = particlesRef.current
      if (!container) return
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        p.style.setProperty('--x', `${Math.random() * 200 - 100}px`)
        p.style.setProperty('--y', `${Math.random() * -200 - 50}px`)
        p.style.background = `hsl(${Math.random() * 60 + 10}, 100%, 60%)`
        container.appendChild(p)
        gsap.to(p, {
          x: `+=${Math.random() * 100 - 50}`,
          y: `+=${Math.random() * -150 - 50}`,
          opacity: 0,
          scale: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => p.remove(),
        })
      }
    }

    showStep(0)

    return () => {
      gsap.killTweensOf('*')
    }
  }, { scope: containerRef })

  const handleComplete = () => {
    dispatch({ type: 'SET_PAGE', payload: 'complete' })
  }

  return (
    <div ref={containerRef} className="tracking-page" style={{ visibility: 'hidden' }}>
      <div className="game-hud-top">
        <div className="hud-corner left">
          <span className="hud-label">{config.name}</span>
          <span className="hud-value">{config.emoji}</span>
        </div>
        <div className="hud-center">
          <div className="game-title">外送任務</div>
          <div ref={progressRef} className="boss-bar">
            <div ref={fillRef} className="boss-fill" />
            <div className="boss-segments">
              {statusSteps.map((_, i) => (
                <div key={i} className="boss-seg" />
              ))}
            </div>
            <div ref={characterRef} className="boss-character">
              {config.emoji}
            </div>
          </div>
        </div>
        <div className="hud-corner right">
          <span className="hud-label">狀態</span>
          <span className="hud-value pulsing">{isComplete ? '✓' : '▶'}</span>
        </div>
      </div>

      <div className="game-world">
        <div className="road-bg">
          <div className="road-lines" />
          <div className="road-lines second" />
        </div>
        <div className="world-grid" />
      </div>

      <div ref={questRef} className="quest-log" />

      <div ref={completeRef} className="quest-complete" style={{ visibility: 'hidden' }}>
        <div className="complete-glow" />
        <span className="complete-icon">🏆</span>
        <h2 className="complete-title">任務完成！</h2>
        {state.deliveryMode === 'rabbit'
          ? <p className="complete-desc">兔兔外送成功送達！🐰</p>
          : <p className="complete-desc">火箭外送成功送達！🚀</p>
        }
      </div>

      <div ref={particlesRef} className="particles-container" />

      <div className="game-footer">
        <button className="game-btn secondary" onClick={() => dispatch({ type: 'RESET' })}>
          取消訂單
        </button>
        <button
          className={`game-btn primary ${isComplete ? 'active' : ''}`}
          onClick={handleComplete}
          disabled={!isComplete}
        >
          {isComplete ? '查看成果 →' : '運送中...'}
        </button>
      </div>
    </div>
  )
}
