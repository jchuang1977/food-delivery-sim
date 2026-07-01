import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import lottie from 'lottie-web'
import cartAnimation from '../assets/cart.json'
import { restaurants } from '../data/restaurants'
import { useApp } from '../context/AppContext'
import RestaurantDetail from './RestaurantDetail'
import './OrderPage.css'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export default function OrderPage() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [showDetail, setShowDetail] = useState(null)

  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const modeRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const cartRef = useRef(null)
  const lottieRef = useRef(null)

  const totalItems = state.cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = state.cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const filtered = restaurants.filter(
    (r) => r.name.includes(search) || r.category.includes(search)
  )

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true })

    tl.set(heroRef.current, { autoAlpha: 1 })
    tl.set(titleRef.current, { visibility: 'visible' })
    tl.set(subtitleRef.current, { visibility: 'visible' })
    tl.set(modeRef.current, { autoAlpha: 1 })
    tl.set(searchRef.current, { autoAlpha: 1 })

    const split = new SplitText(titleRef.current, { type: 'chars', charsClass: 'hero-char' })
    tl.from(split.chars, {
      y: 80, rotationX: -40, opacity: 0,
      stagger: 0.04,
      duration: 0.7,
      ease: 'back.out(1.5)',
    }, 0.1)

    const subtitleText = subtitleRef.current
    const fullText = subtitleText.textContent
    subtitleText.textContent = ''
    subtitleText.style.visibility = 'visible'
    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        subtitleText.textContent += fullText[charIndex]
        charIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)
    tl.call(() => {}, [], 1.2)

    const modeBtns = modeRef.current.querySelectorAll('.mode-btn')
    tl.from(modeBtns, {
      x: (i) => i === 0 ? -60 : 60, opacity: 0,
      stagger: 0.1, duration: 0.5, ease: 'power3.out',
    }, 2.0)

    tl.from(searchRef.current, {
      scaleX: 0.9, opacity: 0, duration: 0.4, ease: 'power2.out',
      transformOrigin: 'center center',
    }, 2.6)

    tl.play()

    return () => clearInterval(typeInterval)
  }, { scope: heroRef })

  useGSAP(() => {
    const cards = listRef.current?.querySelectorAll('.restaurant-card')
    if (!cards || cards.length === 0) return

    cards.forEach((card) => {
      gsap.set(card, { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 40 })
    })

    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      end: 'bottom 20%',
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.to(batch, {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
          y: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [filtered.length])

  useGSAP(() => {
    if (!cartRef.current) return
    const bar = cartRef.current
    if (totalItems > 0) {
      gsap.to(bar, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' })
    } else {
      gsap.to(bar, { y: -10, opacity: 0, scale: 0.95, duration: 0.2 })
    }
  }, [totalItems])

  useEffect(() => {
    if (!lottieRef.current) return
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      animationData: cartAnimation,
      loop: true,
      autoplay: true,
    })
    return () => anim.destroy()
  }, [])

  const tagColors = {
    '熱門': '#ff6b35',
    '推薦': '#00d4aa',
    '快速': '#fbbf24',
    '新開': '#a78bfa',
    '健康': '#34d399',
  }

  return (
    <div className="order-page">
      <div ref={heroRef} className="order-hero">
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <div ref={lottieRef} className="hero-lottie" />
          <h1 ref={titleRef} className="hero-title" style={{ visibility: 'hidden' }}>
            食物不會來
          </h1>
          <p ref={subtitleRef} className="hero-subtitle" style={{ visibility: 'hidden' }}>
            （其實是假的啦 😆 但動畫很酷對吧？）
          </p>
        </div>
      </div>

      <div ref={modeRef} className="delivery-mode-bar">
        <button
          className={`mode-btn ${state.deliveryMode === 'rabbit' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_DELIVERY_MODE', payload: 'rabbit' })}
        >
          <span className="mode-icon">🐰</span>
          <span className="mode-label">兔兔外送</span>
        </button>
        <button
          className={`mode-btn ${state.deliveryMode === 'rocket' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_DELIVERY_MODE', payload: 'rocket' })}
        >
          <span className="mode-icon">🚀</span>
          <span className="mode-label">火箭外送</span>
        </button>
      </div>

      <div ref={searchRef} className="search-bar">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="搜尋餐廳或類別..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div ref={cartRef} className="cart-summary">
        <div className="cart-summary-left">
          <span className="cart-summary-count">{totalItems} 項</span>
          <span className="cart-summary-divider" />
          <span className="cart-summary-price">${totalPrice}</span>
        </div>
        <button className="cart-summary-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'checkout' })}>
          結帳 →
        </button>
      </div>

      <div ref={listRef} className="restaurant-list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>沒有找到「{search}」的餐廳</p>
          </div>
        )}
        {filtered.map((r) => (
          <div
            key={r.id}
            className="restaurant-card"
            onClick={() => { setShowDetail(r); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          >
            <div className="card-emoji">{r.emoji}</div>
            <div className="card-body">
              <div className="card-header">
                <h3 className="card-name">{r.name}</h3>
                <span className="card-category">{r.category}</span>
              </div>
              <div className="card-metrics">
                <span className="metric">★ {r.rating}</span>
                <span className="metric-sep" />
                <span className="metric">{r.reviews.toLocaleString()} 評論</span>
                <span className="metric-sep" />
                <span className="metric">{r.eta} 分鐘</span>
              </div>
              <div className="card-footer">
                <div className="card-tags">
                  {r.tags.map((tag) => (
                    <span key={tag} className="card-tag" style={{ color: tagColors[tag] || '#a1a1aa' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="card-delivery">${r.deliveryFee} 運費</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetail && (
        <RestaurantDetail
          restaurant={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}
    </div>
  )
}
