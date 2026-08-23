import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem { id: number; name: string; price: number; qty: number; image?: string; url: string }
export interface AddToCartInput { id: number; name: string; price: number; image?: string; url: string }
interface CartContextType {
  items: CartItem[]; addToCart: (product: AddToCartInput) => void; changeQty: (index: number, delta: number) => void; removeItem: (index: number) => void
  total: number; totalCount: number; isCartOpen: boolean; openCart: () => void; closeCart: () => void
  isSearchOpen: boolean; openSearch: () => void; closeSearch: () => void; isDrawerOpen: boolean; openDrawer: () => void; closeDrawer: () => void
}
const CartContext = createContext<CartContextType | null>(null)
const lock = (active: boolean) => { document.body.style.overflow = active ? 'hidden' : '' }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [isCartOpen, setCartOpen] = useState(false); const [isSearchOpen, setSearchOpen] = useState(false); const [isDrawerOpen, setDrawerOpen] = useState(false)
  const addToCart = (product: AddToCartInput) => { setItems(current => { const item = current.find(value => value.id === product.id); return item ? current.map(value => value.id === product.id ? { ...value, qty: value.qty + 1 } : value) : [...current, { id: product.id, name: product.name, price: product.price, image: product.image, url: product.url, qty: 1 }] }); setCartOpen(true); lock(true) }
  const changeQty = (index: number, delta: number) => setItems(current => current.map((item, position) => position === index ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0))
  const removeItem = (index: number) => setItems(current => current.filter((_, position) => position !== index))
  const closeCart = () => { setCartOpen(false); lock(false) }; const closeSearch = () => { setSearchOpen(false); lock(false) }; const closeDrawer = () => { setDrawerOpen(false); lock(false) }
  return <CartContext.Provider value={{ items, addToCart, changeQty, removeItem, total: items.reduce((sum, item) => sum + item.price * item.qty, 0), totalCount: items.reduce((sum, item) => sum + item.qty, 0), isCartOpen, openCart: () => { setCartOpen(true); lock(true) }, closeCart, isSearchOpen, openSearch: () => { setSearchOpen(true); lock(true) }, closeSearch, isDrawerOpen, openDrawer: () => { setDrawerOpen(true); lock(true) }, closeDrawer }}>{children}</CartContext.Provider>
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used within CartProvider'); return context }
