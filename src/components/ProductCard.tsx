import { useLocation } from 'wouter'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { addToCart } = useCart(); const navigate = useLocation()[1]; const overlay = product.status === 'reserved' ? ['Reserved', 'bg-amber-500/90 text-white'] : product.status === 'sold' ? ['Sold', 'bg-gray-800/90 text-white'] : null
  return <div className="product-card group cursor-pointer stagger-up" style={{ transitionDelay: `${delay}ms` }} onClick={() => navigate(`/product/${product.id}`)}><div className={`overflow-hidden mb-4 relative ${product.bg_class} aspect-[3/4]`}>
    {product.images[0] && <img src={product.images[0]} alt={product.name} loading="lazy" className="product-img image-fill" />}
    {overlay && <div className={`absolute inset-0 flex items-center justify-center ${overlay[1]}`}><span className="font-manrope text-xs uppercase tracking-[0.2em] font-medium">{overlay[0]}</span></div>}
    <div className="absolute bottom-0 left-0 right-0 p-3"><button className="product-cta w-full h-10 bg-surface/90 backdrop-blur-sm text-on-surface font-manrope text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed" onClick={event => { event.stopPropagation(); if (product.status !== 'sold') addToCart(product.name, product.price) }} disabled={product.status === 'sold'}>{product.status === 'sold' ? 'Sold Out' : 'Add to Bag'}</button></div>
    {product.badge && !overlay && <div className="absolute top-3 left-3"><span className={product.badge === 'New' ? 'px-2 py-1 bg-tertiary text-on-tertiary font-manrope text-[9px] uppercase tracking-widest' : 'px-2 py-1 bg-surface-container text-on-surface-variant font-manrope text-[9px] uppercase tracking-widest border border-outline-variant'}>{product.badge}</span></div>}
  </div><p className="font-fraunces text-base md:text-lg text-on-background mb-1 leading-tight">{product.name}</p>{product.subtitle && <p className="font-manrope text-xs text-on-surface-variant mb-1">{product.subtitle}</p>}<p className="font-manrope text-sm text-on-background font-medium">rs. {product.price.toLocaleString()}</p></div>
}
