import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useRoute } from 'wouter'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import type { Product } from '../types'

const whatsappNumber = () => import.meta.env.VITE_WHATSAPP_NUMBER || '923299615669'

function buyOnWhatsApp(product: Product) {
  const lines = `• ${product.name} – rs. ${product.price.toLocaleString()}`
  window.open(`https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(`Hi! I'm interested in purchasing:\n\n${lines}\n\nMy Name: \nMy City: `)}`, '_blank')
}

export function ProductDetailPage() {
  const [, params] = useRoute<{ id: string }>('/product/:id')
  const id = Number(params?.id)
  const { addToCart } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const { data: product, isLoading, isError } = useQuery({ queryKey: ['product', id], queryFn: () => api<Product>(`/products/${id}`), enabled: Number.isFinite(id) })

  if (isLoading) return <main className="pt-[73px] min-h-screen bg-surface-container-lowest"><div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16"><div className="grid lg:grid-cols-2 gap-10 lg:gap-16"><div><div className="skeleton aspect-[3/4]" /></div><div className="space-y-4"><div className="skeleton h-3 w-24" /><div className="skeleton h-8 w-2/3" /><div className="skeleton h-5 w-1/3" /><div className="skeleton h-6 w-24" /><div className="skeleton h-24 w-full" /><div className="flex gap-3"><div className="skeleton h-[58px] w-full" /><div className="skeleton h-[58px] w-full" /></div></div></div></div></main>
  if (isError || !product) return <main className="pt-[73px] min-h-screen bg-surface-container-lowest"><div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16 font-manrope text-sm text-on-surface-variant">This piece could not be found. <Link href="/bags" className="text-primary underline">Back to the collection</Link></div></main>

  const images = product.images.filter(Boolean)
  const sold = product.status === 'sold'
  const reserved = product.status === 'reserved'
  const overlay = sold ? ['Sold', 'bg-gray-800/90 text-white'] : reserved ? ['Reserved', 'bg-amber-500/90 text-white'] : null

  return (
    <main className="pt-[73px] bg-surface-container-lowest min-h-screen">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-8 md:py-12">
        <nav className="flex items-center gap-2 font-manrope text-[11px] uppercase tracking-widest text-on-surface-variant mb-8">
          <Link href="/" className="hover:text-primary">Home</Link><span>›</span>
          <Link href={`/${product.main_category}`} className="hover:text-primary">{product.main_category}</Link><span>›</span>
          <span className="text-on-background">{product.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="max-w-lg lg:max-w-none w-full">
            <div className={`relative overflow-hidden aspect-[3/4] ${product.bg_class}`}>
              {images[activeImage] ? <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover object-center" /> : null}
              {overlay && <div className={`absolute inset-0 flex items-center justify-center ${overlay[1]}`}><span className="font-manrope text-xs uppercase tracking-[0.2em] font-medium">{overlay[0]}</span></div>}
              {product.badge && !overlay && <div className="absolute top-4 left-4"><span className={product.badge === 'New' ? 'px-2 py-1 bg-tertiary text-on-tertiary font-manrope text-[9px] uppercase tracking-widest' : 'px-2 py-1 bg-surface-container text-on-surface-variant font-manrope text-[9px] uppercase tracking-widest border border-outline-variant'}>{product.badge}</span></div>}
            </div>
            {images.length > 1 && <div className="flex gap-3 mt-4">{images.map((image, index) => <button key={image + index} onClick={() => setActiveImage(index)} aria-label={`View image ${index + 1} of ${images.length}`} aria-current={index === activeImage} className={`w-20 aspect-[3/4] overflow-hidden border ${index === activeImage ? 'border-primary' : 'border-outline-variant'}`}><img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover object-center" /></button>)}</div>}
          </div>
          <div className="max-w-lg">
            <p className="font-manrope text-[11px] uppercase tracking-[.18em] text-on-surface-variant mb-3">{product.category}</p>
            <h1 className="font-fraunces text-3xl md:text-5xl text-on-background leading-tight mb-4">{product.name}</h1>
            {product.subtitle && <p className="font-fraunces text-lg md:text-xl text-on-surface-variant mb-6">{product.subtitle}</p>}
            <p className="font-manrope text-2xl text-on-background font-medium mb-8">rs. {product.price.toLocaleString()}</p>
            <div className="border-t border-outline-variant pt-8 mb-8">
              <h3 className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Description</h3>
              <p className="font-manrope text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => buyOnWhatsApp(product)} disabled={sold} className="flex-1 h-[58px] bg-whatsapp text-white font-manrope text-xs uppercase tracking-widest hover:bg-whatsapp-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Buy Now — WhatsApp</button>
              <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: images[activeImage], url: `/product/${product.id}` })} disabled={sold} className="flex-1 h-[58px] border border-primary text-primary font-manrope text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Add to Bag</button>
            </div>
            {reserved && <p className="font-manrope text-xs text-amber-700 mt-4">This piece is currently reserved — contact us to place a hold.</p>}
            {sold && <p className="font-manrope text-xs text-on-surface-variant mt-4">This piece has been sold. Explore the rest of the collection for similar finds.</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
