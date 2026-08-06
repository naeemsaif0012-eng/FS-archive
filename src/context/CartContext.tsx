import { createContext, useContext, useState, type ReactNode } from 'react'

interface CartItem { name: string; price: number; qty: number }
interface CartContextType {
  items: CartItem[]; addToCart: (name: string, price: number) => void; changeQty: (index: number, delta: number) => void
  total: number; totalCount: number; isCartOpen: boolean; openCart: () => void; closeCart: () => void
  isSearchOpen: boolean; openSearch: () => void; closeSearch: () => void; isDrawerOpen: boolean; openDrawer: () => void; closeDrawer: () => void
}
const CartContext = createContext<CartContextType | null>(null)
const lock = (active: boolean) => { document.body.style.overflow = active ? 'hidden' : '' }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [isCartOpen, setCartOpen] = useState(false); const [isSearchOpen, setSearchOpen] = useState(false); const [isDrawerOpen, setDrawerOpen] = useState(false)
  const addToCart = (name: string, price: number) => { setItems(current => { const item = current.find(value => value.name === name); return item ? current.map(value => value.name === name ? { ...value, qty: value.qty + 1 } : value) : [...current, { name, price, qty: 1 }] }); setCartOpen(true); lock(true) }
  const changeQty = (index: number, delta: number) => setItems(current => current.map((item, position) => position === index ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0))
  const closeCart = () => { setCartOpen(false); lock(false) }; const closeSearch = () => { setSearchOpen(false); lock(false) }; const closeDrawer = () => { setDrawerOpen(false); lock(false) }
  return <CartContext.Provider value={{ items, addToCart, changeQty, total: items.reduce((sum, item) => sum + item.price * item.qty, 0), totalCount: items.reduce((sum, item) => sum + item.qty, 0), isCartOpen, openCart: () => { setCartOpen(true); lock(true) }, closeCart, isSearchOpen, openSearch: () => { setSearchOpen(true); lock(true) }, closeSearch, isDrawerOpen, openDrawer: () => { setDrawerOpen(true); lock(true) }, closeDrawer }}>{children}</CartContext.Provider>
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used within CartProvider'); return context }
