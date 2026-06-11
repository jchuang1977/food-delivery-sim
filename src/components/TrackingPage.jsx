import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import './TrackingPage.css'

const RABBIT_CONFIG = {
  label: '兔兔外送員',
  emoji: '🐰',
  totalSteps: 20,
  intervalMs: 800,
}

const ROCKET_CONFIG = {
  label: '火箭外送員',
  emoji: '🚀',
  totalSteps: 15,
  intervalMs: 600,
}

const STATUS_MESSAGES = [
  '外送員正在準備美味的食物...',
  '外送員剛從餐廳出發！',
  '外送員正在趕路中...',
  '外送員油門催到底了！',
  '外送員快到了！',
  '外送員已經到了！',
]

export default function TrackingPage() {
  const { state, dispatch, themes } = useApp()
  const theme = themes[state.theme]
  const config = state.deliveryMode === 'rabbit' ? RABBIT_CONFIG : ROCKET_CONFIG
  const [progress, setProgress] = useState(0)
  const [pos, setPos] = useState({ x: 15, y: 20 })
  const [statusIdx, setStatusIdx] = useState(0)
  const [eta, setEta] = useState(Math.ceil(config.totalSteps * config.intervalMs / 1000))
  const [complete, setComplete] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const stepMs = config.intervalMs
    const totalSteps = config.totalSteps

    const run = () => {
      let step = 0
      const tick = () => {
        step++
        setProgress(step)
        setEta(Math.max(0, Math.ceil((totalSteps - step) * stepMs / 1000)))

        const x = 15 + (75 * (step / totalSteps))
        const y = 20 + (60 * (step / totalSteps))
        setPos({ x, y })

        const msgIdx = Math.min(
          STATUS_MESSAGES.length - 1,
          Math.floor((step / totalSteps) * STATUS_MESSAGES.length)
        )
        setStatusIdx(msgIdx)

        if (step >= totalSteps) {
          setComplete(true)
          dispatch({ type: 'SET_TRACKING_COMPLETE' })
          return
        }
        timerRef.current = setTimeout(tick, stepMs)
      }
      timerRef.current = setTimeout(tick, stepMs)
    }
    run()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [config.totalSteps, config.intervalMs, dispatch])

  const progressPercent = Math.min(100, (progress / config.totalSteps) * 100)

  const stages = [
    { label: '訂單已接收', done: progress >= 0 },
    { label: '取餐中', done: progress >= 5 },
    { label: '外送中', done: progress >= 8 },
    { label: '送達', done: complete },
  ]

  const handleFinish = () => {
    dispatch({ type: 'SET_PAGE', payload: 'complete' })
  }

  return (
    <div className="page tracking-page">
      <header className="page-header" style={{ background: theme.primaryBtn }}>
        <h2>追蹤外送員</h2>
      </header>

      <div className="tracking-demo-banner">
        🎮 DEMO 模式 — 這是模擬外送，實際上不會送食物來喔！
      </div>

      <div className="map-container">
        <div className="map-grid">
          <div className="map-roads">
            <div className="road road-h" style={{ top: '30%' }} />
            <div className="road road-h" style={{ top: '60%' }} />
            <div className="road road-v" style={{ left: '25%' }} />
            <div className="road road-v" style={{ left: '55%' }} />
            <div className="road road-h" style={{ top: '45%' }} />
            <div className="road road-v" style={{ left: '75%' }} />
          </div>

          <div className="map-marker marker-restaurant" style={{ left: '8%', top: '10%' }}>
            <span className="marker-icon">🏪</span>
            <span className="marker-label">餐廳</span>
          </div>

          <div className="map-marker marker-customer" style={{ right: '8%', bottom: '10%' }}>
            <span className="marker-icon">🏠</span>
            <span className="marker-label">你家</span>
          </div>

          <div className="delivery-path">
            <svg className="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 15 20 C 30 20, 40 50, 50 50 S 70 70, 85 80"
                fill="none"
                stroke={theme.brand}
                strokeWidth="0.8"
                strokeDasharray="3,2"
                opacity="0.5"
              />
            </svg>
          </div>

          <div
            className="map-marker marker-delivery floating"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            <span className="marker-icon delivery-icon">{config.emoji}</span>
          </div>
        </div>
      </div>

      <div className="tracking-info">
        <div className="tracking-eta">
          <span className="eta-number">{complete ? '🎉' : eta}</span>
          <span className="eta-label">{complete ? '送達！' : '秒後送達'}</span>
        </div>

        <div className="tracking-status">
          <span className="status-icon" style={{ background: theme.primaryBtn }}>
            {complete ? '✅' : '🚴'}
          </span>
          <span className="status-text">
            {complete ? '外送完成！' : STATUS_MESSAGES[statusIdx]}
          </span>
        </div>
      </div>

      <div className="tracking-progress">
        {stages.map((stage, i) => (
          <div key={i} className={`progress-stage ${stage.done ? 'done' : ''}`}>
            <div className="progress-dot">
              {stage.done ? '✅' : i + 1}
            </div>
            <span>{stage.label}</span>
          </div>
        ))}
      </div>

      <div className="delivery-person-card">
        <div className="person-avatar" style={{ background: theme.primaryBtn }}>
          {config.emoji}
        </div>
        <div className="person-info">
          <strong>{config.label}</strong>
          <span>⭐ 4.9 · 評論 120 則</span>
        </div>
        <button className="call-btn" onClick={() => alert('🎮 這是模擬電話，實際上打不通喔！')}>
          📞 致電
        </button>
      </div>

      <div className="tracking-order-info">
        <div className="info-row">
          <span>📍 外送地址</span>
          <span>{state.orderInfo?.address || '台北市信義區'}</span>
        </div>
        <div className="info-row">
          <span>💰 付款方式</span>
          <span>{state.orderInfo?.payment === 'card' ? '信用卡' : state.orderInfo?.payment === 'transfer' ? '銀行轉帳' : '行動支付'}</span>
        </div>
        <div className="info-row">
          <span>🚴 外送模式</span>
          <span>{config.label}</span>
        </div>
        <div className="info-row">
          <span>💵 訂單金額</span>
          <strong>${state.orderInfo?.total || 0}</strong>
        </div>
      </div>

      <div className="tracking-footer">
        {complete ? (
          <button
            className="finish-btn"
            style={{ background: theme.primaryBtn }}
            onClick={handleFinish}
          >
            查看節省成果 🎉
          </button>
        ) : (
          <button className="cancel-btn" onClick={() => {
            if (confirm('🎮 這是模擬取消，確定要取消嗎？')) {
              dispatch({ type: 'RESET' })
            }
          }}>
            取消訂單
          </button>
        )}
      </div>
    </div>
  )
}
