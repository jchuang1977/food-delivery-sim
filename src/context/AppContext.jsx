import { createContext, useContext, useReducer } from 'react'

const initialState = {
  page: 'order',
  deliveryMode: 'rabbit',
  cart: [],
  selectedRestaurant: null,
  orderInfo: null,
  trackingProgress: 0,
  trackingComplete: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'SET_DELIVERY_MODE':
      return { ...state, deliveryMode: action.payload }
    case 'SET_RESTAURANT':
      return { ...state, selectedRestaurant: action.payload }
    case 'ADD_TO_CART': {
      const existing = state.cart.findIndex(
        (i) => i.menuId === action.payload.menuId && i.options === action.payload.options
      )
      if (existing >= 0) {
        const newCart = [...state.cart]
        newCart[existing] = { ...newCart[existing], quantity: newCart[existing].quantity + action.payload.quantity }
        return { ...state, cart: newCart }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((_, i) => i !== action.payload) }
    case 'UPDATE_CART_QTY': {
      const newCart = [...state.cart]
      if (action.payload.quantity <= 0) {
        newCart.splice(action.payload.index, 1)
      } else {
        newCart[action.payload.index] = { ...newCart[action.payload.index], quantity: action.payload.quantity }
      }
      return { ...state, cart: newCart }
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SET_ORDER_INFO':
      return { ...state, orderInfo: action.payload }
    case 'SET_TRACKING_PROGRESS':
      return { ...state, trackingProgress: action.payload }
    case 'SET_TRACKING_COMPLETE':
      return { ...state, trackingComplete: true }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
