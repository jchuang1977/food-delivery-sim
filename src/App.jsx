import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AppProvider, useApp } from './context/AppContext'
import OrderPage from './components/OrderPage'
import CheckoutPage from './components/CheckoutPage'
import TrackingPage from './components/TrackingPage'
import CompletePage from './components/CompletePage'
import './App.css'

gsap.registerPlugin(useGSAP)

const pages = {
  order: OrderPage,
  checkout: CheckoutPage,
  tracking: TrackingPage,
  complete: CompletePage,
}

function PageRenderer({ pageKey, onTransitionEnd }) {
  const Page = pages[pageKey]
  const containerRef = useRef(null)
  const tlRef = useRef(null)

  useGSAP(() => {
    if (!containerRef.current) return
    tlRef.current = gsap.timeline({ paused: true })
    const els = containerRef.current.children
    tlRef.current.from(containerRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power3.out' })
    if (els.length > 0) {
      tlRef.current.from(els, { y: 24, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' }, '-=0.15')
    }
    tlRef.current.play()
  }, { dependencies: [pageKey], scope: containerRef })

  return (
    <div ref={containerRef} className="page-container">
      <Page />
    </div>
  )
}

function AppContent() {
  const { state } = useApp()
  return <PageRenderer key={state.page} pageKey={state.page} />
}

function App() {
  return (
    <AppProvider>
      <div className="app">
        <AppContent />
      </div>
    </AppProvider>
  )
}

export default App
