'use client'

import { useCart } from '@/context/CartContext'
import type { DbProduct } from '@/lib/types'

interface ProductCardProps {
  product: DbProduct
  delay?: number
}

const STATUS_OVERLAY: Record<string, { label: string; cls: string }> = {
  reserved: { label: 'Reserved', cls: 'bg-amber-500/90 text-white' },
  sold: { label: 'Sold', cls: 'bg-gray-800/90 text-white' },
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const image = product.images?.[0] ?? ''
  const isSold = product.status === 'sold'
  const overlay = STATUS_OVERLAY[product.status]

  return (
    <div className="product-card group cursor-pointer stagger-up" style={{ transitionDelay: `${delay}ms` }}>
      <div className={`overflow-hidden mb-4 relative ${product.bg_class} aspect-[3/4]`}>
        {image && (
          <div className="product-img w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
        )}

        {/* Status overlay for reserved/sold */}
        {overlay && (
          <div className={`absolute inset-0 flex items-center justify-center ${overlay.cls}`}>
            <span className="font-manrope text-xs uppercase tracking-[0.2em] font-medium">{overlay.label}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            className="product-cta w-full h-10 bg-surface/90 backdrop-blur-sm text-on-surface font-manrope text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => !isSold && addToCart(product.name, Number(product.price))}
            disabled={isSold}
          >
            {isSold ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>

        {product.badge && !overlay && (
          <div className="absolute top-3 left-3">
            {product.badge === 'New' ? (
              <span className="px-2 py-1 bg-tertiary text-on-tertiary font-manrope text-[9px] uppercase tracking-widest">New</span>
            ) : (
              <span className="px-2 py-1 bg-surface-container text-on-surface-variant font-manrope text-[9px] uppercase tracking-widest border border-outline-variant">Limited</span>
            )}
          </div>
        )}
      </div>
      <p className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">FS Archives</p>
      <p className="font-fraunces text-base md:text-lg text-on-background mb-1 leading-tight">{product.name}</p>
      {product.subtitle && (
        <p className="font-manrope text-xs text-on-surface-variant mb-1">{product.subtitle}</p>
      )}
      <p className="font-manrope text-sm text-on-background font-medium">$ {Number(product.price).toLocaleString()}</p>
    </div>
  )
}
