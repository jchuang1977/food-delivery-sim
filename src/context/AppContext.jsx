import { createContext, useContext, useReducer } from 'react'

const themes = {
  mint: {
    name: '薄荷綠',
    headerStart: '#0ea768',
    headerEnd: '#059669',
    primaryBtn: 'linear-gradient(135deg, #0ea768, #059669)',
    activeBg: '#d1fae5',
    brand: '#0ea768',
    brandDark: '#059669',
    brandLight: '#ecfdf5',
  },
  purple: {
    name: '紫色',
    headerStart: '#7c3aed',
    headerEnd: '#6d28d9',
    primaryBtn: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    activeBg: '#ede9fe',
    brand: '#7c3aed',
    brandDark: '#6d28d9',
    brandLight: '#f5f3ff',
  },
  blue: {
    name: '藍色',
    headerStart: '#2563eb',
    headerEnd: '#1d4ed8',
    primaryBtn: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    activeBg: '#dbeafe',
    brand: '#2563eb',
    brandDark: '#1d4ed8',
    brandLight: '#eff6ff',
  },
  pink: {
    name: '粉色',
    headerStart: '#ec4899',
    headerEnd: '#db2777',
    primaryBtn: 'linear-gradient(135deg, #ec4899, #db2777)',
    activeBg: '#fce7f3',
    brand: '#ec4899',
    brandDark: '#db2777',
    brandLight: '#fdf2f8',
  },
}

const initialState = {
  page: 'order',
  theme: 'mint',
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
    case 'SET_THEME':
      return { ...state, theme: action.payload }
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
      return { ...initialState, theme: state.theme }
    default:
      return state
  }
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch, themes }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
