import { useState } from 'react'
import { menus } from '../data/menus'
import { reviews } from '../data/reviews'
import { useApp } from '../context/AppContext'
import './RestaurantDetail.css'

export default function RestaurantDetail({ restaurant, onClose }) {
  const { state, dispatch, themes } = useApp()
  const theme = themes[state.theme]
  const [showMenu, setShowMenu] = useState(null)
  const [showReviews, setShowReviews] = useState(false)
  const menuItems = menus[restaurant.id] || []
  const restaurantReviews = reviews[restaurant.id] || []

  const handleAddToCart = (item, options, quantity) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        menuId: item.id,
        name: item.name,
        price: item.price,
        calories: item.calories,
        options,
        quantity,
      },
    })
    setShowMenu(null)
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="bottom-sheet slide-up">
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-restaurant-info">
            <div className="sheet-emoji" style={{ background: theme.primaryBtn }}>
              {restaurant.emoji}
            </div>
            <div>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.category} · ⭐ {restaurant.rating} · 🚴 {restaurant.eta}分鐘</p>
            </div>
          </div>
          <button className="reviews-btn" onClick={() => setShowReviews(true)}>
            📝 評論
          </button>
        </div>

        <div className="menu-list">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item" onClick={() => setShowMenu(item)}>
              <div className="menu-info">
                <div className="menu-name">{item.name}</div>
                <div className="menu-desc">{item.description}</div>
                <div className="menu-calories">🔥 {item.calories} kcal</div>
                <div className="menu-price">${item.price}</div>
              </div>
              <div className="menu-img">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {showMenu && (
          <MenuCustomize
            item={showMenu}
            theme={theme}
            onConfirm={handleAddToCart}
            onClose={() => setShowMenu(null)}
          />
        )}

        {showReviews && (
          <ReviewsModal
            reviews={restaurantReviews}
            restaurantName={restaurant.name}
            onClose={() => setShowReviews(false)}
          />
        )}
      </div>
    </>
  )
}

function MenuCustomize({ item, theme, onConfirm, onClose }) {
  const [spicy, setSpicy] = useState(0)
  const [size, setSize] = useState('normal')
  const [toppings, setToppings] = useState([])
  const [qty, setQty] = useState(1)

  const sizeOptions = [
    { value: 'normal', label: '正常', price: 0 },
    { value: 'large', label: '加大', price: 20 },
  ]

  const toppingOptions = [
    { name: '加起司', price: 15 },
    { name: '加蛋', price: 10 },
    { name: '加肉', price: 25 },
    { name: '加青菜', price: 10 },
  ]

  const toggleTopping = (t) => {
    setToppings((prev) =>
      prev.find((p) => p.name === t.name)
        ? prev.filter((p) => p.name !== t.name)
        : [...prev, t]
    )
  }

  const toppingTotal = toppings.reduce((s, t) => s + t.price, 0)
  const sizeExtra = sizeOptions.find((s) => s.value === size)?.price || 0
  const unitPrice = item.price + sizeExtra + toppingTotal
  const total = unitPrice * qty

  return (
    <>
      <div className="overlay" onClick={onClose} z-index="100" />
      <div className="menu-customize slide-up">
        <div className="customize-header">
          <h3>{item.name}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="customize-body">
          <div className="customize-section">
            <label className="section-label">🌶️ 辣度</label>
            <div className="spicy-options">
              {['不辣', '小辣', '中辣', '大辣'].map((level, i) => (
                <button
                  key={level}
                  className={`spicy-btn ${spicy === i ? 'active' : ''}`}
                  style={spicy === i ? { background: theme.primaryBtn } : {}}
                  onClick={() => setSpicy(i)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-section">
            <label className="section-label">📏 尺寸</label>
            <div className="size-options">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`size-btn ${size === opt.value ? 'active' : ''}`}
                  style={size === opt.value ? { background: theme.primaryBtn } : {}}
                  onClick={() => setSize(opt.value)}
                >
                  {opt.label} {opt.price > 0 ? `+$${opt.price}` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-section">
            <label className="section-label">➕ 加料</label>
            <div className="topping-options">
              {toppingOptions.map((t) => (
                <button
                  key={t.name}
                  className={`topping-btn ${toppings.find((p) => p.name === t.name) ? 'active' : ''}`}
                  style={toppings.find((p) => p.name === t.name) ? { background: theme.primaryBtn } : {}}
                  onClick={() => toggleTopping(t)}
                >
                  {t.name} +${t.price}
                </button>
              ))}
            </div>
          </div>

          <div className="customize-section">
            <label className="section-label">🔢 數量</label>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
        </div>

        <div className="customize-footer">
          <div className="customize-total">
            <span>總計</span>
            <strong>${total}</strong>
          </div>
          <button
            className="add-btn"
            style={{ background: theme.primaryBtn }}
            onClick={() => {
              const opts = [
                spicy > 0 ? `${['不辣','小辣','中辣','大辣'][spicy]}` : null,
                size === 'large' ? '加大' : null,
                ...toppings.map((t) => t.name),
              ].filter(Boolean).join(', ')
              onConfirm(item, opts, qty)
            }}
          >
            加入購物車
          </button>
        </div>
      </div>
    </>
  )
}

function ReviewsModal({ reviews, restaurantName, onClose }) {
  return (
    <>
      <div className="overlay" onClick={onClose} z-index="100" />
      <div className="reviews-modal slide-up">
        <div className="sheet-handle" />
        <h3>📝 {restaurantName} 評論</h3>
        <div className="reviews-list">
          {reviews.map((r, i) => (
            <div key={i} className="review-item">
              <div className="review-header">
                <strong>{r.user}</strong>
                <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
