import { AppProvider, useApp } from './context/AppContext'
import OrderPage from './components/OrderPage'
import CheckoutPage from './components/CheckoutPage'
import TrackingPage from './components/TrackingPage'
import CompletePage from './components/CompletePage'
import './App.css'

function AppContent() {
  const { state } = useApp()

  switch (state.page) {
    case 'order':
      return <OrderPage />
    case 'checkout':
      return <CheckoutPage />
    case 'tracking':
      return <TrackingPage />
    case 'complete':
      return <CompletePage />
    default:
      return <OrderPage />
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
