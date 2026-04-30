import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CartItem } from "../types"

const getCartStorageKey = (userId?: string) => `cart_${userId ?? "guest"}`

const loadCartFromStorage = (userId?: string): CartItem[] => {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(getCartStorageKey(userId))
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items: CartItem[], userId?: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getCartStorageKey(userId), JSON.stringify(items))
}

const initialState = {
  items: loadCartFromStorage(),
  userId: null as string | null,
  message: "",
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart: (
      state,
      action: PayloadAction<{ items: CartItem[]; userId?: string }>,
    ) => {
      const { items, userId } = action.payload
      if (
        userId &&
        !state.userId &&
        state.items.length > 0 &&
        items.length === 0
      ) {
        // Preserve guest cart when a user logs in and the server cart is empty.
        state.userId = userId
      } else {
        state.items = items
        state.userId = userId ?? state.userId
      }
      saveCartToStorage(state.items, state.userId ?? userId)
    },
    addToCart: (
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>,
    ) => {
      const { productId, quantity = 1 } = action.payload
      const existingItem = state.items.find(
        item => item.productId === productId,
      )
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ productId, quantity })
      }
      saveCartToStorage(state.items, state.userId)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.productId !== action.payload,
      )
      saveCartToStorage(state.items, state.userId)
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload)
      if (item) {
        item.quantity += 1
        saveCartToStorage(state.items, state.userId)
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload)
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1)
        saveCartToStorage(state.items, state.userId)
      }
    },
    clearCart: state => {
      state.items = []
      saveCartToStorage(state.items, state.userId)
    },
  },
})

export const {
  loadCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
