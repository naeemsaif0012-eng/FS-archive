'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useCart()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) closeSearch()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isSearchOpen, closeSearch])

  const goTo = (path: string) => {
    closeSearch()
    router.push(path)
  }

  return (
    <div className={`search-overlay fixed inset-0 z-[100] bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center px-6 ${isSearchOpen ? 'open' : ''}`}>
      <button onClick={closeSearch} className="absolute top-6 right-6 md:right-16">
        <span className="material-symbols-outlined text-on-surface text-[28px]">close</span>
      </button>
      <p className="font-manrope text-[11px] uppercase tracking-[0.18em] text-on-surface-variant mb-6">Search Maison Rose</p>
      <div className="w-full max-w-2xl border-b border-on-surface flex items-center gap-4 pb-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[22px]">search</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Bags, Jewelry, Accessories…"
          className="flex-1 bg-transparent font-fraunces text-3xl text-on-background placeholder-on-surface-variant/40 focus:outline-none"
        />
      </div>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        {[
          { label: 'Bags', path: '/bags' },
          { label: 'Jewelry', path: '/jewelry' },
          { label: 'Accessories', path: '/accessories' },
          { label: 'Watches', path: '/accessories' },
          { label: 'Silk Scarves', path: '/accessories' },
          { label: 'New Arrivals', path: '/' },
        ].map((item) => (
          <span
            key={item.label}
            onClick={() => goTo(item.path)}
            className="px-4 py-2 rounded-full border border-outline-variant font-manrope text-xs tracking-widest uppercase text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer transition-colors"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
