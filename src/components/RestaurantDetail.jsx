import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { menus } from '../data/menus'
import { reviews as allReviews } from '../data/reviews'
import { useApp } from '../context/AppContext'
import './RestaurantDetail.css'

gsap.registerPlugin(useGSAP)

export default function RestaurantDetail({ restaurant, onClose }) {
  const { state, dispatch } = useApp()
  const panelRef = useRef(null)
  const bodyRef = useRef(null)
  const [addingId, setAddingId] = useState(null)

  const menuItems = menus[restaurant.id] || []
  const reviews = allReviews[restaurant.id] || []

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(panelRef.current, { x: '100%', duration: 0.5, ease: 'power3.inOut' })
    tl.from(bodyRef.current.querySelectorAll('.menu-item'), {
      x: 40, opacity: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out',
    }, '-=0.2')
    tl.from(bodyRef.current.querySelectorAll('.review-card'), {
      y: 20, opacity: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out',
    }, '-=0.1')
  }, { scope: panelRef })

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' })
  }

  const handleAddToCart = (item) => {
    setAddingId(item.id)
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        menuId: item.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        name: item.name,
        price: item.price,
        calories: item.calories,
        quantity: 1,
      },
    })
    setTimeout(() => setAddingId(null), 600)
  }

  return (
    <div className="detail-overlay">
      <div ref={panelRef} className="detail-panel">
        <div className="detail-header">
          <button className="detail-close" onClick={handleClose}>←</button>
          <div className="detail-header-info">
            <span className="detail-emoji">{restaurant.emoji}</span>
            <div>
              <h2 className="detail-name">{restaurant.name}</h2>
              <span className="detail-category">{restaurant.category}</span>
            </div>
          </div>
          <div className="detail-rating">
            <span className="detail-star">★</span>
            <span className="detail-rating-num">{restaurant.rating}</span>
          </div>
        </div>

        <div ref={bodyRef} className="detail-body">
          <section className="menu-section">
            <h3 className="section-label">菜單</h3>
            <div className="menu-list">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-left">
                    <div className="menu-item-img-wrap">
                      <img src={item.image} alt={item.name} className="menu-item-img" loading="lazy" />
                    </div>
                    <div className="menu-item-info">
                      <strong className="menu-item-name">{item.name}</strong>
                      <p className="menu-item-desc">{item.description}</p>
                      <div className="menu-item-meta">
                        <span className="menu-cal">{item.calories} kcal</span>
                        <div className="cal-bar">
                          <div className="cal-fill" style={{ width: `${Math.min(item.calories / 7, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="menu-item-right">
                    <span className="menu-price">${item.price}</span>
                    <button
                      className={`menu-add-btn ${addingId === item.id ? 'adding' : ''}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addingId === item.id ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="reviews-section">
            <h3 className="section-label">評價</h3>
            <div className="reviews-list">
              {reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{r.user}</span>
                    <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p className="review-text">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
