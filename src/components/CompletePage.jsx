import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useApp } from '../context/AppContext'
import './CompletePage.css'

gsap.registerPlugin(useGSAP)

export default function CompletePage() {
  const { state, dispatch } = useApp()
  const heroRef = useRef(null)
  const cardsRef = useRef(null)
  const statsRef = useRef(null)
  const funRef = useRef(null)

  const config = state.deliveryMode === 'rabbit'
    ? { emoji: '🐰', label: '兔兔外送' }
    : { emoji: '🚀', label: '火箭外送' }

  const totalCalories = state.cart.reduce((s, i) => s + i.calories * i.quantity, 0)
  const deliveryFeeSaved = 30
  const carbonSaved = Math.round(totalCalories * 0.12)
  const totalItems = state.cart.length
  const totalQty = state.cart.reduce((s, i) => s + i.quantity, 0)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from(heroRef.current, { y: -40, opacity: 0, duration: 0.5, ease: 'power3.out' })
    tl.from(heroRef.current.querySelector('.complete-hero-emoji'), { scale: 0, rotation: -30, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
    tl.from(heroRef.current.querySelectorAll('.complete-hero-title'), { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')

    const cards = cardsRef.current?.querySelectorAll('.stat-card')
    if (cards) {
      tl.from(cards, { y: 40, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.1')
      cards.forEach((card) => {
        const num = card.querySelector('.stat-num')
        const target = parseInt(num?.getAttribute('data-target') || '0', 10)
        if (num && target) {
          tl.from(num, {
            textContent: 0, duration: 0.8, ease: 'power1.out',
            snap: { textContent: 1 },
            onUpdate: () => {
              const current = parseInt(num.textContent || '0', 10)
              num.textContent = target > 1000 ? current.toLocaleString() : current
            },
          }, '-=0.4')
        }
      })
    }

    tl.from(funRef.current, { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')

    const statsItems = statsRef.current?.querySelectorAll('.stat-item')
    if (statsItems) {
      tl.from(statsItems, { y: 20, opacity: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' }, '-=0.1')
    }

    tl.from(statsRef.current?.querySelector('.share-section'), { y: 20, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1')
    tl.from(statsRef.current?.querySelector('.restart-btn'), { y: 20, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1')

  }, { scope: heroRef })

  const handleRestart = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="complete-page">
      <div ref={heroRef} className="complete-hero">
        <div className="complete-hero-bg" />
        <div className="complete-hero-content">
          <span className="complete-hero-emoji">{config.emoji}</span>
          <h1 className="complete-hero-title">{config.label} 送達！</h1>
          <p className="complete-hero-sub">（其實是假的外送啦 😆）</p>
        </div>
      </div>

      <div ref={cardsRef} className="stats-cards">
        <div className="stat-card wide calories">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <span className="stat-label">儲存熱量</span>
            <span className="stat-num" data-target={totalCalories}>0</span>
            <span className="stat-unit">kcal</span>
            <p className="stat-desc">因為你沒有真的點餐</p>
          </div>
        </div>
        <div className="stat-card money">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-label">節省運費</span>
            <span className="stat-num" data-target={deliveryFeeSaved}>0</span>
            <span className="stat-unit">元</span>
            <p className="stat-desc">省下來買別的東西！</p>
          </div>
        </div>
        <div className="stat-card time">
          <span className="stat-icon">⏱️</span>
          <div className="stat-info">
            <span className="stat-label">節省時間</span>
            <span className="stat-num" data-target={15}>0</span>
            <span className="stat-unit">分鐘</span>
            <p className="stat-desc">不用等的感覺真好</p>
          </div>
        </div>
        <div className="stat-card carbon">
          <span className="stat-icon">🌱</span>
          <div className="stat-info">
            <span className="stat-label">減少碳排</span>
            <span className="stat-num" data-target={carbonSaved}>0</span>
            <span className="stat-unit">g</span>
            <p className="stat-desc">為地球盡一份心力</p>
          </div>
        </div>
      </div>

      <div ref={funRef} className="fun-section">
        <h3 className="fun-title">🎯 有趣小知識</h3>
        <p className="fun-text">
          根據研究，平均每次外送會產生 <strong>52g</strong> 的碳足跡。
          你今天「假裝」點餐，為地球減少了 <strong className="highlight">{carbonSaved}g</strong> 的碳排放！
        </p>
      </div>

      <div ref={statsRef} className="bottom-section">
        <div className="mini-stats">
          <div className="stat-item">
            <span className="stat-number">{totalItems}</span>
            <span className="stat-label">品項</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{totalQty}</span>
            <span className="stat-label">數量</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">${state.orderInfo?.total || 0}</span>
            <span className="stat-label">模擬金額</span>
          </div>
        </div>

        <div className="share-section">
          <p>覺得有趣嗎？分享給朋友！</p>
          <button className="share-btn" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: '食物不會來 - 模擬外送',
                text: `我剛用「食物不會來」模擬點餐，節省了 ${totalCalories}kcal 熱量！`,
              })
            } else {
              alert('🎮 這是模擬分享功能')
            }
          }}>
            ⤴ 分享成果
          </button>
        </div>

        <button className="restart-btn" onClick={handleRestart}>
          再玩一次 →
        </button>
      </div>
    </div>
  )
}
