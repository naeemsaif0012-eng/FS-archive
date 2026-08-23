'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import type { DbProduct } from '@/lib/types'

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuANMqbxmRClPeN4wqgJNK9lX_xh8qwucq78m6OK_9UjCrS0uVO6ZxxXLZ-v6mbv267Z3D_mT5hVU0eCwluNqnU7FlyFvsVE986l_Cewo03tbFtMbIfElwrIDNiDFojHXaRd_JgJHrIuF3Tv2xNqbbQnD64NIGkNk06hS4AOBwm3-KZ6ukm9iTlaWvWCAXNx3__Gbq_4XE5dNu2rNyCQDIHnM2McaKJuYlUU7Dr1P-PcZ7m6sGyeO6tQ'
const IMG_BAGS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvJ4D_HSb0qDFIU-ANm55iElbMp2HBTv2Cx5QlulNHUORFHJZxHFJKsCeS8EOjyHxsHrY8mNUXNicw7WG_5Um6bLg8fVKnz3LKJAV4OOjye13wlcFDrwcur8WGyJg_C2jOJIckgU9DWJIu-M37eNKpNLf7osS55oRkiU-2Bz5l9AyiK3P8vw3P4At1d4TRs6oMioqVvpbCb3HjnLsNj0ykk5RrAoxs2yh0lAUmjBt4-PYtLjTqb4Fn'
const IMG_JEWELRY = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0Bikepsu2EEQsFjPBGxYB0yqYAzCYhozNmzkAXhgcK87_py-tnVLO-uUB3LgaQ3SOPXMCP5VcotntBKh-NZWTlYe2HkQoGLMjPUzurQNwyZM3G6iG_EDDJLQgCgkGq8bbZEf3378Ko3ZWxOSiIO5R09vways9cBdmaU8jW8Ce088RHTzVpeIzVt5h14icSwApPkBj6CiFFodF27-TJLJo7nOdvAKHVAMtK2TZemsboMvc83tEvLVL'
const IMG_SCARVES = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfxvE5bZlw0oLwwQlTfTWvTAwJ3FC1gLfQEesaLaxDgiJouHsHqM4XsN6pGScxLYqm-0fN7rLAWrOAU1YFHcp7H-nM1YXuF9KrIw4xQ4rhzbnpZC7BdKU6JMcow4BIQVn9UXGxdXbV6e2JeVV2iAslJGDDkBDxpe2pKNOY04MCl1PopUTG4CEHM82_L6foEN5nsjl1cOmrGtcW5yrLGYN0wDEbsehiLgh-0ZTGRU--hrY_RmxYOHLd'

type FeaturedCard = Pick<DbProduct, 'id' | 'name' | 'price' | 'badge' | 'images'> & { bg_class: string }

const DEFAULT_FEATURED_PRODUCTS: FeaturedCard[] = [
  { id: 1, name: 'La Calla Tote', price: 2400, badge: 'New', images: [IMG_BAGS], bg_class: 'bg-surface-container-high' },
  { id: 7, name: "Fil d'Or Chain", price: 890, badge: 'New', images: [IMG_JEWELRY], bg_class: 'bg-surface-container' },
  { id: 13, name: 'Heritage Silk Scarf', price: 620, badge: 'New', images: [IMG_SCARVES], bg_class: 'bg-surface-container-highest' },
  { id: 18, name: 'Tourbillon No. 1', price: 18500, badge: 'Limited', images: [HERO_IMAGE], bg_class: 'bg-surface-container-high' },
]

export default function HomePage() {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState(DEFAULT_FEATURED_PRODUCTS)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.stagger-up').forEach((el) => observer.observe(el))
    setTimeout(() => document.querySelectorAll('.stagger-up').forEach((el) => el.classList.add('in-view')), 80)
    fetch('/api/featured-products')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.items?.length === 4) {
          setFeaturedProducts(data.items)
        }
      })
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      {/* ── 1. HERO ── */}
      <section className="relative w-full h-screen min-h-[640px] flex items-center justify-start overflow-hidden bg-ink-plum">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-80 ken-burns"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-plum/70 via-ink-plum/30 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-margin-desktop grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-7 flex flex-col justify-center items-start">
            <p className="stagger-up font-manrope text-[11px] uppercase tracking-[0.18em] text-primary-container mb-7" style={{ transitionDelay: '0ms' }}>
              The Heritage Collection — 2025
            </p>
            <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-on-primary mb-7 max-w-xl leading-[1.0]">
              <span className="block stagger-up" style={{ transitionDelay: '100ms' }}>THE WEIGHT</span>
              <span className="block stagger-up" style={{ transitionDelay: '250ms' }}>OF TIME</span>
            </h1>
            <p className="font-manrope text-[13px] md:text-sm text-on-primary/65 max-w-xs leading-[1.75] tracking-wide stagger-up" style={{ transitionDelay: '400ms' }}>
              Where precision mechanics meet undeniable artistry. Discover timepieces crafted for those who understand that true luxury cannot be rushed.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
          <span className="font-manrope text-[10px] uppercase tracking-widest text-on-primary/50">Scroll</span>
          <span className="material-symbols-outlined text-on-primary/50 text-[18px]">arrow_downward</span>
        </div>
      </section>

      {/* ── 2. FEATURED PRODUCTS ── */}
      <section className="py-24 md:py-36 px-5 md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="quote-rule" />
                <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant">Curated Selection</p>
              </div>
              <h2 className="stagger-up font-fraunces text-4xl md:text-5xl text-on-background leading-tight">Featured Products</h2>
            </div>
            <Link href="/bags" className="stagger-up font-manrope text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors border-b border-outline-variant hover:border-primary pb-1 self-start md:self-auto whitespace-nowrap">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p, i) => (
              <div key={p.name} className="product-card group cursor-pointer stagger-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`overflow-hidden mb-4 relative ${p.bg_class} aspect-[3/4]`}>
                  <div className="product-img w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${p.images?.[0] ?? ''}')` }} />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <button
                      className="product-cta w-full h-10 bg-surface/90 backdrop-blur-sm text-on-surface font-manrope text-[10px] uppercase tracking-widest hover:bg-tertiary hover:text-on-tertiary transition-colors duration-200"
                      onClick={() => addToCart(p.name, Number(p.price))}
                    >
                      Add to Bag
                    </button>
                  </div>
                  {p.badge && (
                    <div className="absolute top-3 left-3">
                      {p.badge === 'New' ? (
                        <span className="px-2 py-1 bg-tertiary text-on-tertiary font-manrope text-[9px] uppercase tracking-widest">New</span>
                      ) : (
                        <span className="px-2 py-1 bg-surface-container text-on-surface-variant font-manrope text-[9px] uppercase tracking-widest border border-outline-variant">Limited</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="font-manrope text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">FS Archives</p>
                <p className="font-fraunces text-base md:text-lg text-on-background mb-1 leading-tight">{p.name}</p>
                <p className="font-manrope text-sm text-on-surface-variant">€ {Number(p.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BAGS EDITORIAL ── */}
      <section className="py-24 md:py-36 px-5 md:px-margin-desktop overflow-hidden bg-bone">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
          <div className="md:col-span-7 order-2 md:order-1 glint-container h-[60vh] md:h-[80vh] w-full">
            <div className="w-full h-full bg-cover bg-center parallax-bg" style={{ backgroundImage: `url('${IMG_BAGS}')` }} />
          </div>
          <div className="md:col-span-5 order-1 md:order-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="quote-rule" />
              <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant">The Edit</p>
            </div>
            <h2 className="stagger-up font-fraunces text-4xl md:text-5xl text-on-background mb-6 leading-tight">The Leather Edit</h2>
            <p className="stagger-up font-manrope text-base md:text-lg text-on-surface-variant mb-10 leading-relaxed">
              Sculptural silhouettes crafted from full-grain calfskin. A masterclass in quiet luxury, designed for the modern muse who commands attention without saying a word.
            </p>
            <Link href="/bags" className="stagger-up inline-flex items-center h-[52px] px-8 bg-primary-container text-on-primary-container font-manrope text-xs uppercase tracking-widest border border-primary-container hover:bg-primary hover:text-on-primary transition-colors duration-300">
              Shop Bags
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. JEWELRY EDITORIAL ── */}
      <section className="py-24 md:py-36 px-5 md:px-margin-desktop overflow-hidden bg-background">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
          <div className="md:col-span-5 order-1 flex flex-col items-start md:items-end md:text-right">
            <div className="flex items-center gap-3 mb-6 md:flex-row-reverse">
              <div className="quote-rule" />
              <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant">Fine Jewelry</p>
            </div>
            <h2 className="stagger-up font-fraunces text-4xl md:text-5xl text-on-background mb-6 leading-tight">The Jewelry Collection</h2>
            <p className="stagger-up font-manrope text-base md:text-lg text-on-surface-variant mb-10 leading-relaxed md:ml-auto">
              Delicate chains, ethically sourced stones, and heirloom-quality craftsmanship. Adorn yourself in timeless radiance that captures the essence of FS Archives.
            </p>
            <Link href="/jewelry" className="stagger-up inline-flex items-center h-[52px] px-8 bg-primary-container text-on-primary-container font-manrope text-xs uppercase tracking-widest border border-primary-container hover:bg-primary hover:text-on-primary transition-colors duration-300">
              Shop Jewelry
            </Link>
          </div>
          <div className="md:col-span-7 order-2 glint-container h-[60vh] md:h-[80vh] w-full">
            <div className="w-full h-full bg-cover bg-center parallax-bg" style={{ backgroundImage: `url('${IMG_JEWELRY}')` }} />
          </div>
        </div>
      </section>

      {/* ── 5. ACCESSORIES EDITORIAL ── */}
      <section className="py-24 md:py-36 px-5 md:px-margin-desktop overflow-hidden bg-bone">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
          <div className="md:col-span-7 order-2 md:order-1 glint-container h-[60vh] md:h-[80vh] w-full">
            <div className="w-full h-full bg-cover bg-center parallax-bg" style={{ backgroundImage: `url('${IMG_SCARVES}')` }} />
          </div>
          <div className="md:col-span-5 order-1 md:order-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="quote-rule" />
              <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant">Accessories</p>
            </div>
            <h2 className="stagger-up font-fraunces text-4xl md:text-5xl text-on-background mb-6 leading-tight">Timeless Accessories</h2>
            <p className="stagger-up font-manrope text-base md:text-lg text-on-surface-variant mb-10 leading-relaxed">
              Elevate the everyday. From silk scarves to meticulously engineered timepieces, discover the finishing touches that redefine elegance.
            </p>
            <Link href="/accessories" className="stagger-up inline-flex items-center h-[52px] px-8 bg-primary-container text-on-primary-container font-manrope text-xs uppercase tracking-widest border border-primary-container hover:bg-primary hover:text-on-primary transition-colors duration-300">
              Shop Accessories
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
