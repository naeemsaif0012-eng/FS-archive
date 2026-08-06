'use client'

import { useCart } from '@/context/CartContext'
import { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  delay?: number
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="product-card group cursor-pointer stagger-up" style={{ transitionDelay: `${delay}ms` }}>
      <div className={`overflow-hidden mb-4 relative ${product.bgClass} aspect-[3/4]`}>
        <div
          className="product-img w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            className="product-cta w-full h-10 bg-surface/90 backdrop-blur-sm text-on-surface font-manrope text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary transition-colors duration-200"
            onClick={() => addToCart(product.name, product.price)}
          >
            Add to Bag
          </button>
        </div>
        {product.badge && (
          <div className="absolute top-3 left-3">
            {product.badge === 'New' ? (
              <span className="px-2 py-1 bg-tertiary text-on-tertiary font-manrope text-[9px] uppercase tracking-widest">
                New
              </span>
            ) : (
              <span className="px-2 py-1 bg-surface-container text-on-surface-variant font-manrope text-[9px] uppercase tracking-widest border border-outline-variant">
                Limited
              </span>
            )}
          </div>
        )}
      </div>
      <p className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Maison Rose</p>
      <p className="font-fraunces text-base md:text-lg text-on-background mb-1 leading-tight">{product.name}</p>
      {product.subtitle && (
        <p className="font-manrope text-xs text-on-surface-variant mb-1">{product.subtitle}</p>
      )}
      <p className="font-manrope text-sm text-on-background font-medium">€ {product.price.toLocaleString()}</p>
    </div>
  )
}
