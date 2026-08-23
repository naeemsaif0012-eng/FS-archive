import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'wouter'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import type { Product } from '../types'

const BRAND = 'FS ARCHIVES'
const publicLinks = [{ label: 'Home', href: '/' }, { label: 'Bags', href: '/bags' }, { label: 'Jewelry', href: '/jewelry' }, { label: 'Accessories', href: '/accessories' }, { label: 'Home Décor', href: '/home' }, { label: 'About', href: '/contact' }]

export function Navbar() {
  const [path] = useLocation(); const { totalCount, openCart, openSearch, openDrawer } = useCart()
  useEffect(() => { const header = document.querySelector('.main-header'); const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 60); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  return <header className="main-header fixed top-0 w-full z-50 bg-bone"><div className="flex items-center px-5 md:px-margin-desktop py-5 w-full">
    <div className="flex-1 flex items-center">
      <button className="md:hidden active:scale-95 transition-transform" onClick={openDrawer} aria-label="Open menu"><span className="material-symbols-outlined font-light text-[24px]">menu</span></button>
      <nav className="hidden md:flex gap-8 items-center" aria-label="Primary">{publicLinks.map(link => <Link key={link.label} href={link.href} className={`font-manrope text-xs uppercase tracking-widest transition-all duration-300 ${path === link.href ? 'text-primary font-semibold opacity-100' : 'text-on-background opacity-70 hover:opacity-100 hover:text-primary'}`}>{link.label}</Link>)}</nav>
    </div>
    <div className="flex-shrink-0 px-4"><Link href="/" className="font-fraunces text-xl md:text-2xl tracking-widest text-on-background uppercase whitespace-nowrap">{BRAND}</Link></div>
    <div className="flex-1 flex items-center justify-end gap-6"><div className="flex gap-3 items-center">
      <button onClick={openSearch} aria-label="Open search"><span className="material-symbols-outlined font-light text-[22px]">search</span></button>
      <button onClick={openCart} className="relative" aria-label="Open bag">{totalCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary text-on-tertiary text-[9px] flex items-center justify-center font-manrope font-semibold">{totalCount}</span>}<span className="material-symbols-outlined font-light text-[24px]">shopping_bag</span></button>
    </div></div>
  </div></header>
}

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useCart(); const [, navigate] = useLocation(); const input = useRef<HTMLInputElement>(null); const [query, setQuery] = useState('')
  const { data: products = [] } = useQuery({ queryKey: ['search-products'], queryFn: () => api<Product[]>('/products'), enabled: isSearchOpen })
  useEffect(() => { if (isSearchOpen) { setQuery(''); window.setTimeout(() => input.current?.focus(), 300) } }, [isSearchOpen])
  const q = query.trim().toLowerCase(); const results = q ? products.filter(product => [product.name, product.subtitle, product.category, product.main_category].some(field => field.toLowerCase().includes(q))).slice(0, 8) : []
  const go = (path: string) => { closeSearch(); navigate(path) }
  return <div role="dialog" aria-modal="true" aria-label="Search" className={`search-overlay fixed inset-0 z-[100] bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center px-6 ${isSearchOpen ? 'open' : ''}`}>
    <button onClick={closeSearch} aria-label="Close search" className="absolute top-6 right-6 md:right-16"><span className="material-symbols-outlined text-on-surface text-[28px]">close</span></button>
    <p className="font-manrope text-[11px] uppercase tracking-[.18em] text-on-surface-variant mb-6">Search {BRAND}</p>
    <div className="w-full max-w-2xl border-b border-on-surface flex items-center gap-4 pb-3"><span className="material-symbols-outlined text-on-surface-variant text-[22px]">search</span><input ref={input} type="text" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && results[0]) go(`/product/${results[0].id}`); if (event.key === 'Escape') closeSearch() }} placeholder="Bags, Jewelry, Accessories…" aria-label="Search products" className="flex-1 bg-transparent font-fraunces text-3xl text-on-background placeholder-on-surface-variant/40 focus:outline-none" /></div>
    {q ? <div className="w-full max-w-2xl mt-8 max-h-[60vh] overflow-y-auto">{results.length === 0 ? <p className="font-manrope text-sm text-on-surface-variant text-center mt-4">No products match "{query}".</p> : <div className="bg-surface-container-lowest border border-outline-variant divide-y divide-outline-variant">{results.map(product => <button key={product.id} onClick={() => go(`/product/${product.id}`)} className="w-full flex items-center gap-4 p-3 hover:bg-primary-container transition-colors text-left"><div className="w-14 h-[70px] shrink-0 overflow-hidden bg-surface-container"><img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center" /></div><div className="flex-1 min-w-0"><p className="font-fraunces text-base text-on-background truncate">{product.name}</p><p className="font-manrope text-xs text-on-surface-variant capitalize">{product.main_category}{product.category ? ` · ${product.category}` : ''}</p></div><p className="font-manrope text-sm text-on-background font-medium">rs. {product.price.toLocaleString()}</p></button>)}</div>}</div> : <div className="mt-10 flex flex-wrap gap-3 justify-center">{publicLinks.map(item => <button key={item.label} onClick={() => go(item.href)} className="px-4 py-2 rounded-full border border-outline-variant font-manrope text-xs tracking-widest uppercase text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer">{item.label}</button>)}</div>}
  </div>
}

export function CartDrawer() {
  const { items, changeQty, removeItem, total, isCartOpen, closeCart } = useCart(); const [, navigate] = useLocation()
  useEffect(() => { if (!isCartOpen) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeCart() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [isCartOpen, closeCart])
  const whatsapp = () => { if (!items.length) return; const lines = items.map(item => `• ${item.name} – rs. ${item.price.toLocaleString()}${item.qty > 1 ? ` × ${item.qty}` : ''}`); window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '923299615669'}?text=${encodeURIComponent(`Hi! I'm interested in purchasing the following products:\n\n${lines.join('\n')}\n\nTotal: rs. ${total.toLocaleString()}\n\nMy Name: \nMy City: `)}`, '_blank') }
  return <>{isCartOpen && <div className="fixed inset-0 z-[80] bg-on-surface/30 backdrop-blur-sm" onClick={closeCart} />}<div role="dialog" aria-modal="true" aria-label="Your bag" className={`cart-drawer fixed top-0 right-0 h-full w-full max-w-md z-[90] bg-surface-container-lowest shadow-2xl flex flex-col ${isCartOpen ? 'open' : ''}`}>
    <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant"><h3 className="font-fraunces text-xl text-on-background">Your Bag</h3><button onClick={closeCart} aria-label="Close bag"><span className="material-symbols-outlined text-[22px]">close</span></button></div>
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">{items.length === 0 ? <p className="font-manrope text-sm text-on-surface-variant text-center mt-12">Your bag is empty.</p> : items.map((item, index) => <div key={item.id}><div className="flex gap-4">
      <button onClick={() => { closeCart(); navigate(item.url) }} className="w-16 h-20 shrink-0 overflow-hidden bg-surface-container border border-outline-variant" aria-label={`View ${item.name}`}>{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" /> : null}</button>
      <div className="flex-1"><button onClick={() => { closeCart(); navigate(item.url) }} className="font-fraunces text-base text-on-background mb-2 text-left hover:text-primary transition-colors">{item.name}</button>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-outline-variant" role="group" aria-label={`Quantity for ${item.name}`}><button className="px-3 py-1" onClick={() => changeQty(index, -1)} aria-label={`Decrease quantity of ${item.name}`}>−</button><span className="px-3 py-1 font-manrope text-sm" aria-live="polite">{item.qty}</span><button className="px-3 py-1" onClick={() => changeQty(index, 1)} aria-label={`Increase quantity of ${item.name}`}>+</button></div>
          <p className="font-manrope text-sm font-medium text-on-background">rs. {(item.price * item.qty).toLocaleString()}</p>
        </div>
        <button onClick={() => removeItem(index)} className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary mt-2">Remove</button>
      </div>
    </div>{index < items.length - 1 && <div className="border-t border-outline-variant mt-6" />}</div>)}</div>
    <div className="px-8 py-6 border-t border-outline-variant space-y-4">
      <div className="flex justify-between font-manrope text-sm text-on-surface-variant"><span>Subtotal</span><span className="text-on-background font-medium">rs. {total.toLocaleString()}</span></div>
      <div className="flex justify-between font-manrope text-xs text-on-surface-variant"><span>Shipping</span><span>Complimentary</span></div>
      <div className="border-t border-outline-variant pt-4 flex justify-between font-fraunces text-lg text-on-background"><span>Total</span><span>rs. {total.toLocaleString()}</span></div>
      <button onClick={whatsapp} disabled={!items.length} className="w-full h-[52px] bg-whatsapp text-white font-manrope text-xs uppercase tracking-widest hover:bg-whatsapp-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Order on WhatsApp</button>
      <button onClick={closeCart} className="w-full h-[40px] border border-outline-variant text-on-surface-variant font-manrope text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">Continue Shopping</button>
    </div>
  </div></>
}

export function MobileDrawer() {
  const [path] = useLocation(); const { isDrawerOpen, closeDrawer } = useCart()
  useEffect(() => { if (!isDrawerOpen) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeDrawer() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [isDrawerOpen, closeDrawer])
  return <><div className={`drawer-overlay fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm ${isDrawerOpen ? 'open' : ''}`} onClick={closeDrawer} /><div role="dialog" aria-modal="true" aria-label="Menu" className={`mobile-drawer fixed top-0 left-0 h-full w-4/5 max-w-xs z-[70] bg-surface-container-lowest flex flex-col shadow-2xl ${isDrawerOpen ? 'open' : ''}`}>
    <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant"><Link href="/" onClick={closeDrawer} className="font-fraunces text-lg tracking-widest uppercase text-on-background">{BRAND}</Link><button onClick={closeDrawer} aria-label="Close menu"><span className="material-symbols-outlined text-[22px]">close</span></button></div>
    <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1" aria-label="Mobile">{publicLinks.map(link => <Link key={link.label} href={link.href} onClick={closeDrawer} className={`block py-4 border-b border-outline-variant/40 font-manrope text-sm uppercase tracking-widest ${path === link.href ? 'text-primary font-semibold' : 'text-on-background hover:text-primary'}`}>{link.label}</Link>)}</nav>
  </div></>
}

export function Footer() {
  const shopLinks = [['Bags', '/bags'], ['Jewelry', '/jewelry'], ['Accessories', '/accessories'], ['Home Décor', '/home'], ['Contact & FAQs', '/contact']]
  return <footer className="bg-tertiary border-t border-on-tertiary/10"><div className="max-w-container-max mx-auto px-5 md:px-margin-desktop pt-16 pb-8">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">
      <div className="col-span-2 md:col-span-2"><Link href="/"><h2 className="font-fraunces text-2xl md:text-3xl text-on-tertiary mb-4 uppercase tracking-widest">{BRAND}</h2></Link><p className="font-manrope text-xs text-on-tertiary/70 max-w-xs leading-relaxed">A Parisian atelier dedicated to the art of quiet luxury.</p></div>
      <div><h4 className="font-manrope text-[10px] uppercase tracking-widest text-on-tertiary font-semibold mb-6">Shop</h4><ul className="space-y-3">{shopLinks.map(([label, href]) => <li key={label}><Link href={href} className="font-manrope text-sm text-on-tertiary/70 hover:text-on-tertiary transition-colors">{label}</Link></li>)}</ul></div>
      <div><h4 className="font-manrope text-[10px] uppercase tracking-widest text-on-tertiary font-semibold mb-6">Support</h4><ul className="space-y-3"><li><Link href="/contact" className="font-manrope text-sm text-on-tertiary/70 hover:text-on-tertiary transition-colors">Contact & FAQs</Link></li></ul></div>
    </div>
    <div className="border-t border-on-tertiary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="font-manrope text-xs text-on-tertiary/50">© 2025 {BRAND}. All rights reserved.</p>
      <div className="flex gap-6"><Link href="/contact" className="font-manrope text-xs text-on-tertiary/50 hover:text-on-tertiary transition-colors">Terms</Link><Link href="/contact" className="font-manrope text-xs text-on-tertiary/50 hover:text-on-tertiary transition-colors">Cookies</Link><Link href="/contact" className="font-manrope text-xs text-on-tertiary/50 hover:text-on-tertiary transition-colors">Accessibility</Link></div>
    </div>
  </div></footer>
}
