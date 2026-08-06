'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  name: string
  price: number
  qty: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (name: string, price: number) => void
  changeQty: (idx: number, delta: number) => void
  total: number
  totalCount: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const addToCart = (name: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name)
      if (existing) {
        return prev.map((i) => i.name === name ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { name, price, qty: 1 }]
    })
    setIsCartOpen(true)
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }

  const changeQty = (idx: number, delta: number) => {
    setItems((prev) => {
      const updated = prev.map((item, i) =>
        i === idx ? { ...item, qty: item.qty + delta } : item
      ).filter((item) => item.qty > 0)
      return updated
    })
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalCount = items.reduce((s, i) => s + i.qty, 0)

  const openCart = () => {
    setIsCartOpen(true)
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }
  const closeCart = () => {
    setIsCartOpen(false)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  }
  const openSearch = () => {
    setIsSearchOpen(true)
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }
  const closeSearch = () => {
    setIsSearchOpen(false)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  }
  const openDrawer = () => {
    setIsDrawerOpen(true)
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }
  const closeDrawer = () => {
    setIsDrawerOpen(false)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  }

  return (
    <CartContext.Provider value={{
      items, addToCart, changeQty, total, totalCount,
      isCartOpen, openCart, closeCart,
      isSearchOpen, openSearch, closeSearch,
      isDrawerOpen, openDrawer, closeDrawer,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
