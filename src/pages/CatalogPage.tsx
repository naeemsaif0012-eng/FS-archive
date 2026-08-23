import { useMemo, useState } from 'react'
import { Link } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { ProductCard } from '../components/ProductCard'
import { api } from '../lib/api'
import type { Product } from '../types'

export function CatalogPage({ category, eyebrow, heading, description }: { category: 'bags' | 'jewelry' | 'accessories' | 'home'; eyebrow: string; heading?: string; description?: string }) {
  const [active, setActive] = useState('all'); const [sort, setSort] = useState('featured')
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products', category], queryFn: () => api<Product[]>(`/products?main_category=${category}`) })
  const filters = [...new Set(products.map(item => item.category).filter(Boolean))]
  const visible = useMemo(() => { let list = products.filter(item => active === 'all' || item.category === active); if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price); if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price); return list }, [products, active, sort])
  const title = category[0].toUpperCase() + category.slice(1)
  return <main className="pt-[73px]">
    <section className="px-5 md:px-margin-desktop pt-16 pb-8 max-w-container-max mx-auto"><p className="font-manrope text-[11px] uppercase tracking-[.18em] text-on-primary-container mb-3">{eyebrow}</p><h1 className="font-fraunces text-4xl md:text-6xl text-on-background leading-tight">{heading ?? title}</h1>{description && <p className="font-manrope text-base md:text-lg text-on-surface-variant mt-6 leading-relaxed max-w-xl">{description}</p>}</section>
    <div className="border-b border-outline-variant bg-surface-container-lowest sticky top-[73px] z-40"><div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2 font-manrope text-xs text-on-surface-variant"><Link href="/" className="hover:text-primary">Home</Link><span>›</span><span className="text-on-background">{title}</span><span className="ml-3 text-on-surface-variant">— {visible.length} pieces</span></div>
      <div className="flex items-center gap-4"><div className="flex gap-2 flex-wrap"><button onClick={() => setActive('all')} className={`px-3 py-1 border rounded-full font-manrope text-[10px] uppercase tracking-widest ${active === 'all' ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors'}`}>All</button>{filters.map(filter => <button key={filter} onClick={() => setActive(filter)} className={`px-3 py-1 border rounded-full font-manrope text-[10px] uppercase tracking-widest ${active === filter ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors'}`}>{filter[0].toUpperCase() + filter.slice(1)}</button>)}</div><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products" className="font-manrope text-[11px] uppercase tracking-widest text-on-surface-variant bg-transparent border border-outline-variant px-3 py-1 focus:outline-none"><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select></div>
    </div></div>
    <section className="py-16 px-5 md:px-margin-desktop bg-bone"><div className="max-w-container-max mx-auto">
      {isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">{Array.from({ length: 6 }).map((_, index) => <div key={index}><div className="skeleton aspect-[3/4] mb-4" /><div className="skeleton h-4 w-3/4 mb-2" /><div className="skeleton h-3 w-1/3" /></div>)}</div> : visible.length === 0 ? <div className="py-24 flex flex-col items-center text-center"><h2 className="font-fraunces text-2xl md:text-3xl text-on-background mb-3">No pieces found</h2><p className="font-manrope text-sm text-on-surface-variant mb-8 max-w-sm">Nothing matches this filter right now. Try another category or explore the full archive.</p><Link href="/bags" className="inline-flex items-center h-[48px] px-8 bg-primary-container text-on-primary-container font-manrope text-xs uppercase tracking-widest border border-primary-container hover:bg-primary hover:text-on-primary transition-colors">Explore the Archive</Link></div> : <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">{visible.map((product, index) => <ProductCard key={product.id} product={product} delay={index * 80} />)}</div>}
    </div></section>
  </main>
}
