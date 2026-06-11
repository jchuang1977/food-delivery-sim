import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { restaurants } from '../data/restaurants'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { state, dispatch, themes } = useApp()
  const theme = themes[state.theme]
  const [form, setForm] = useState({
    name: '王小明',
    phone: '0912-345-678',
    address: '台北市信義區',
    note: '',
  })
  const [payment, setPayment] = useState('card')
  const [showConfirm, setShowConfirm] = useState(false)

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = state.cart.length > 0
    ? Math.min(...state.cart.map((i) => {
        const r = restaurants.find((r) => r.id === i.restaurantId)
        return r?.deliveryFee || 30
      }))
    : 0
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + serviceFee

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
    transfer: '🏦 銀行轉帳',
    easy: '📱 行動支付',
  }

  return (
    <div className="page checkout-page">
      <header className="page-header" style={{ background: theme.primaryBtn }}>
        <button className="back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'order' })}>
          ←
        </button>
        <h2>確認訂單</h2>
      </header>

      <div className="checkout-body">
        <section className="checkout-section">
          <h3>🛒 訂單內容</h3>
          {state.cart.map((item, i) => (
            <div key={i} className="cart-item">
              <div className="cart-item-info">
                <strong>{item.name}</strong>
                {item.options && <span className="cart-item-opts">{item.options}</span>}
                <span className="cart-item-restaurant">{item.restaurantName}</span>
              </div>
              <div className="cart-item-right">
                <div className="cart-qty">
                  <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { index: i, quantity: item.quantity - 1 } })}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { index: i, quantity: item.quantity + 1 } })}>+</button>
                </div>
                <strong>${item.price * item.quantity}</strong>
              </div>
            </div>
          ))}
        </section>

        <section className="checkout-section">
          <h3>📍 外送資訊</h3>
          <div className="form-group">
            <label>姓名</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>電話</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>地址</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
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
          <h3>💰 付款方式</h3>
          <div className="payment-options">
            {Object.entries(paymentLabels).map(([key, label]) => (
              <button
                key={key}
                className={`payment-btn ${payment === key ? 'active' : ''}`}
                style={payment === key ? { background: theme.primaryBtn } : {}}
                onClick={() => setPayment(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-section price-breakdown">
          <div className="price-row">
            <span>小計</span>
            <span>${subtotal}</span>
          </div>
          <div className="price-row">
            <span>運費</span>
            <span>${deliveryFee}</span>
          </div>
          <div className="price-row">
            <span>服務費</span>
            <span>${serviceFee}</span>
          </div>
          <div className="price-row total">
            <span>總計</span>
            <strong>${total}</strong>
          </div>
        </section>
      </div>

      <div className="checkout-footer" style={{ background: theme.primaryBtn }}>
        <span className="footer-total">${total}</span>
        <button className="order-btn" onClick={handleOrder}>
          確認下單 🎉
        </button>
      </div>

      {showConfirm && (
        <div className="overlay">
          <div className="confirm-modal pop-in">
            <div className="confirm-icon">✅</div>
            <h3>訂單已成立！</h3>
            <div className="confirm-details">
              <p><strong>付款方式：</strong>{paymentLabels[payment]}</p>
              <p><strong>收件人：</strong>{form.name}</p>
              <p><strong>地址：</strong>{form.address}</p>
              <p className="confirm-total"><strong>金額：</strong>${total}</p>
            </div>
            <p className="confirm-note">🎮 這是模擬外送，實際上不會送食物來喔！</p>
            <button
              className="confirm-btn"
              style={{ background: theme.primaryBtn }}
              onClick={handleConfirm}
            >
              開始追蹤外送員 🚴
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
