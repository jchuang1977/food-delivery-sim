import { useApp } from '../context/AppContext'
import './CompletePage.css'

export default function CompletePage() {
  const { state, dispatch, themes } = useApp()
  const theme = themes[state.theme]
  const config = state.deliveryMode === 'rabbit'
    ? { emoji: '🐰', label: '兔兔外送' }
    : { emoji: '🚀', label: '火箭外送' }

  const totalCalories = state.cart.reduce((s, i) => s + i.calories * i.quantity, 0)
  const deliveryFeeSaved = state.cart.length > 0
    ? Math.min(...state.cart.map(() => {
        const fees = [30, 40, 20, 50]
        return fees[Math.floor(Math.random() * fees.length)]
      }))
    : 30

  const handleRestart = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="page complete-page">
      <div className="complete-celebration" style={{ background: theme.primaryBtn }}>
        <div className="celebration-emoji pop-animation">{config.emoji}</div>
        <h2>{config.label} 送達！</h2>
        <p className="celebration-subtitle">（其實是假的外送啦 😆）</p>
      </div>

      <div className="complete-content">
        <div className="savings-card calories-card">
          <div className="savings-icon">🔥</div>
          <div className="savings-info">
            <div className="savings-label">儲存的熱量</div>
            <div className="savings-value">{totalCalories.toLocaleString()}<span>kcal</span></div>
            <div className="savings-desc">因為你沒有真的點餐，所以節省了這些熱量！</div>
          </div>
        </div>

        <div className="savings-card money-card">
          <div className="savings-icon">💰</div>
          <div className="savings-info">
            <div className="savings-label">節省的運費</div>
            <div className="savings-value">${deliveryFeeSaved}</div>
            <div className="savings-desc">省下來的運費可以拿去買其他東西！</div>
          </div>
        </div>

        <div className="savings-card time-card">
          <div className="savings-icon">⏱️</div>
          <div className="savings-info">
            <div className="savings-label">省下的等待時間</div>
            <div className="savings-value">15<span>分鐘</span></div>
            <div className="savings-desc">不需要等外送員，時間是你的！</div>
          </div>
        </div>

        <div className="fun-fact">
          <h3>🎯 有趣小知識</h3>
          <p>
            根據研究，平均每次外送會產生 52g 的碳足迹。
            你今天「假裝」點餐，為地球減少了 {Math.round(totalCalories * 0.12)}g 的碳足跡！
          </p>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{state.cart.length}</span>
            <span className="stat-label">品項</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{state.cart.reduce((s, i) => s + i.quantity, 0)}</span>
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
                title: '食物不會來 - 省下運費與熱量的假外送員',
                text: `我剛用「食物不會來」模擬點餐，節省了 ${totalCalories}kcal 熱量！`,
              })
            } else {
              alert('🎮 這是模擬分享功能')
            }
          }}>
            📤 分享成果
          </button>
        </div>

        <button
          className="restart-btn"
          style={{ background: theme.primaryBtn }}
          onClick={handleRestart}
        >
          🔄 再玩一次
        </button>
      </div>
    </div>
  )
}
