import { useState } from 'react'
import { restaurants } from '../data/restaurants'
import { useApp } from '../context/AppContext'
import RestaurantDetail from './RestaurantDetail'
import './OrderPage.css'

export default function OrderPage() {
  const { state, dispatch, themes } = useApp()
  const theme = themes[state.theme]
  const [search, setSearch] = useState('')
  const [showDetail, setShowDetail] = useState(null)

  const totalItems = state.cart.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = state.cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const filtered = restaurants.filter(
    (r) => r.name.includes(search) || r.category.includes(search)
  )

  const tagColors = {
    '熱門': '#fee2e2',
    '推薦': '#dbeafe',
    '快速': '#d1fae5',
    '新開': '#fef9c3',
    '健康': '#ecfdf5',
  }

  return (
    <div className="page order-page">
      <header className="app-header" style={{ background: theme.primaryBtn }}>
        <div className="header-top">
          <h1 className="app-title">🍽️ 食物不會來</h1>
          <div className="header-actions">
            <div className="theme-dots">
              {Object.entries(themes).map(([key, t]) => (
                <button
                  key={key}
                  className={`theme-dot ${state.theme === key ? 'active' : ''}`}
                  style={{ background: t.headerStart }}
                  onClick={() => dispatch({ type: 'SET_THEME', payload: key })}
                  title={t.name}
                />
              ))}
            </div>
            <button className="cart-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'checkout' })}>
              🛒
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
        <div className="demo-banner">🎮 DEMO 模式 — 這是模擬外送，實際上不會送食物來喔！</div>
      </header>

      <div className="delivery-mode-bar">
        <button
          className={`mode-btn ${state.deliveryMode === 'rabbit' ? 'active' : ''}`}
          style={state.deliveryMode === 'rabbit' ? { background: theme.primaryBtn } : {}}
          onClick={() => dispatch({ type: 'SET_DELIVERY_MODE', payload: 'rabbit' })}
        >
          🐰 兔兔外送
        </button>
        <button
          className={`mode-btn ${state.deliveryMode === 'rocket' ? 'active' : ''}`}
          style={state.deliveryMode === 'rocket' ? { background: theme.primaryBtn } : {}}
          onClick={() => dispatch({ type: 'SET_DELIVERY_MODE', payload: 'rocket' })}
        >
          🚀 火箭外送
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 搜尋餐廳或類別..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="restaurant-list">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="restaurant-card"
            onClick={() => setShowDetail(r)}
          >
            <div className="restaurant-emoji" style={{ background: theme.primaryBtn }}>
              {r.emoji}
            </div>
            <div className="restaurant-info">
              <div className="restaurant-name">{r.name}</div>
              <div className="restaurant-meta">
                <span>⭐ {r.rating}</span>
                <span>📝 {r.reviews}</span>
                <span>⏱️ {r.eta}分鐘</span>
              </div>
              <div className="restaurant-tags">
                {r.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    style={{ background: tagColors[tag] || '#f3f4f6' }}
                  >
                    {tag}
                  </span>
                ))}
                <span className="delivery-fee">運費 ${r.deliveryFee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="cart-summary" style={{ background: theme.primaryBtn }}>
          <span>共 {totalItems} 項 ${totalPrice}</span>
          <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'checkout' })}>
            去結帳 →
          </button>
        </div>
      )}

      {showDetail && (
        <RestaurantDetail
          restaurant={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}
    </div>
  )
}
