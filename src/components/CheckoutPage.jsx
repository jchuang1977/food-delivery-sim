import { useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useApp } from '../context/AppContext'
import { restaurants } from '../data/restaurants'
import './CheckoutPage.css'

gsap.registerPlugin(useGSAP)

export default function CheckoutPage() {
  const { state, dispatch } = useApp()
  const [form, setForm] = useState({
    name: '王小明',
    phone: '0912-345-678',
    address: '台北市信義區',
    note: '',
  })
  const [payment, setPayment] = useState('card')
  const [showConfirm, setShowConfirm] = useState(false)

  const bodyRef = useRef(null)
  const totalRef = useRef(null)
  const summaryRef = useRef(null)

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = state.cart.length > 0
    ? Math.min(...state.cart.map((i) => {
        const r = restaurants.find((r) => r.id === i.restaurantId)
        return r?.deliveryFee || 30
      }))
    : 0
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + serviceFee

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.from(bodyRef.current, { autoAlpha: 0, duration: 0.3 })
    tl.from(bodyRef.current.querySelectorAll('.checkout-section'), {
      y: 20, opacity: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out',
    }, '-=0.1')

    if (summaryRef.current) {
      const numbers = summaryRef.current.querySelectorAll('.price-num')
      tl.from(numbers, { textContent: 0, duration: 0.6, ease: 'power1.out', snap: { textContent: 1 } }, '-=0.2')
    }
  }, { scope: bodyRef })

  const handleOrder = () => {
    dispatch({
      type: 'SET_ORDER_INFO',
      payload: { ...form, payment, total, deliveryFee, subtotal, serviceFee },
    })
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    dispatch({ type: 'SET_PAGE', payload: 'tracking' })
  }

  const paymentLabels = {
    card: '💳 信用卡',
    transfer: '🏦 轉帳',
    easy: '📱 行動支付',
  }

  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <button className="topbar-back" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'order' })}>
          ←
        </button>
        <h2 className="topbar-title">結帳</h2>
      </div>

      <div ref={bodyRef} className="checkout-body">
        <section className="checkout-section">
          <h3 className="section-label">訂單內容</h3>
          <div className="checkout-cart">
            {state.cart.map((item, i) => (
              <div key={i} className="checkout-cart-item">
                <div className="cci-info">
                  <span className="cci-name">{item.name}</span>
                  <span className="cci-restaurant">{item.restaurantName}</span>
                </div>
                <div className="cci-right">
                  <div className="cci-qty">
                    <button
                      className="qty-btn"
                      onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { index: i, quantity: item.quantity - 1 } })}
                    >−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { index: i, quantity: item.quantity + 1 } })}
                    >+</button>
                  </div>
                  <span className="cci-price">${item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <h3 className="section-label">外送資訊</h3>
          <div className="form-group">
            <label>姓名</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>電話</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>地址</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label>備註</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="例如：請按門鈴、放門口..."
              rows={2}
            />
          </div>
        </section>

        <section className="checkout-section">
          <h3 className="section-label">付款方式</h3>
          <div className="payment-options">
            {Object.entries(paymentLabels).map(([key, label]) => (
              <button
                key={key}
                className={`payment-opt ${payment === key ? 'active' : ''}`}
                onClick={() => setPayment(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section ref={summaryRef} className="checkout-section price-summary">
          <div className="price-row">
            <span>小計</span>
            <span className="price-num" data-target={subtotal}>${subtotal}</span>
          </div>
          <div className="price-row">
            <span>運費</span>
            <span className="price-num" data-target={deliveryFee}>${deliveryFee}</span>
          </div>
          <div className="price-row">
            <span>服務費</span>
            <span className="price-num" data-target={serviceFee}>${serviceFee}</span>
          </div>
          <div className="price-row total-row">
            <span>總計</span>
            <strong ref={totalRef} className="total-num">${total}</strong>
          </div>
        </section>
      </div>

      <div className="checkout-bar">
        <span className="checkout-bar-total">${total}</span>
        <button className="checkout-bar-btn" onClick={handleOrder}>
          下單 →
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">✓</div>
            <h3>訂單已成立！</h3>
            <div className="confirm-details">
              <p><strong>付款：</strong>{paymentLabels[payment]}</p>
              <p><strong>收件人：</strong>{form.name}</p>
              <p><strong>地址：</strong>{form.address}</p>
              <p className="confirm-total"><strong>金額：</strong>${total}</p>
            </div>
            <p className="confirm-note">這是模擬外送，不會真的送食物來 🎮</p>
            <button className="confirm-btn" onClick={handleConfirm}>
              開始追蹤 →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
