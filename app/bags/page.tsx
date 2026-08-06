'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { bagsProducts } from '@/data/products'
import ProductCard from '@/components/ProductCard'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvJ4D_HSb0qDFIU-ANm55iElbMp2HBTv2Cx5QlulNHUORFHJZxHFJKsCeS8EOjyHxsHrY8mNUXNicw7WG_5Um6bLg8fVKnz3LKJAV4OOjye13wlcFDrwcur8WGyJg_C2jOJIckgU9DWJIu-M37eNKpNLf7osS55oRkiU-2Bz5l9AyiK3P8vw3P4At1d4TRs6oMioqVvpbCb3HjnLsNj0ykk5RrAoxs2yh0lAUmjBt4-PYtLjTqb4Fn'

const filters = [
  { label: 'All', tag: 'all' },
  { label: 'Totes', tag: 'tote' },
  { label: 'Clutches', tag: 'clutch' },
  { label: 'Crossbody', tag: 'crossbody' },
]

export default function BagsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('featured')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.stagger-up').forEach((el) => observer.observe(el))
    setTimeout(() => document.querySelectorAll('.stagger-up').forEach((el) => el.classList.add('in-view')), 80)
    return () => observer.disconnect()
  }, [])

  const visibleProducts = useMemo(() => {
    let list = bagsProducts.filter((p) => activeFilter === 'all' || p.category === activeFilter)
    if (sortOrder === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sortOrder === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [activeFilter, sortOrder])

  return (
    <main className="pt-[73px]">
      {/* Category hero */}
      <section className="relative w-full h-[50vh] min-h-[360px] overflow-hidden bg-ink-plum">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-plum/80 via-ink-plum/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-margin-desktop pb-12 max-w-7xl mx-auto">
          <p className="font-manrope text-[11px] uppercase tracking-[0.18em] text-primary-container mb-3 stagger-up">The Leather Edit</p>
          <h1 className="font-fraunces text-4xl md:text-6xl text-on-primary leading-tight stagger-up">Bags</h1>
        </div>
      </section>

      {/* Breadcrumb + toolbar */}
      <div className="border-b border-outline-variant bg-surface-container-lowest sticky top-[73px] z-40">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-manrope text-xs text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-on-background">Bags</span>
            <span className="ml-3 text-outline">— {visibleProducts.length} pieces</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.tag}
                  onClick={() => setActiveFilter(f.tag)}
                  className={`px-3 py-1 border rounded-full font-manrope text-[10px] uppercase tracking-widest transition-all duration-200 ${
                    activeFilter === f.tag
                      ? 'bg-primary text-white border-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="font-manrope text-[11px] uppercase tracking-widest text-on-surface-variant bg-transparent border border-outline-variant px-3 py-1 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="py-16 px-5 md:px-margin-desktop bg-bone">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {visibleProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
