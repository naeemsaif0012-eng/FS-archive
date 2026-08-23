'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const leftLinks = [
  { label: 'Bags', href: '/bags' },
  { label: 'Jewelry', href: '/jewelry' },
  { label: 'Accessories', href: '/accessories' },
]
const rightLinks = [
  { label: 'Heritage', href: '#' },
  { label: 'Atelier', href: '#' },
]

export default function Navbar() {
  const { totalCount, openCart, openSearch, openDrawer } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`main-header fixed top-0 w-full z-50 bg-bone ${scrolled ? 'scrolled' : ''}`}>
      <div className="flex items-center px-5 md:px-margin-desktop py-5 w-full">

        {/* Left: hamburger / desktop left nav */}
        <div className="flex-1 flex items-center">
          <button
            className="md:hidden active:scale-95 transition-transform"
            onClick={openDrawer}
          >
            <span className="material-symbols-outlined font-light text-[24px]">menu</span>
          </button>
          <nav className="hidden md:flex gap-8 items-center">
            {leftLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-manrope text-xs uppercase tracking-widest transition-all duration-300 ${
                  pathname === link.href
                    ? 'text-tertiary font-semibold opacity-100'
                    : 'text-on-background opacity-70 hover:opacity-100 hover:text-tertiary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centre: Logo */}
        <div className="flex-shrink-0 px-4">
          <Link
            href="/"
            className="font-fraunces text-xl md:text-2xl tracking-widest text-on-background uppercase whitespace-nowrap"
          >
            FS ARCHIVES
          </Link>
        </div>

        {/* Right: desktop right nav + icons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <nav className="hidden md:flex gap-8 items-center">
            {rightLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-manrope text-xs uppercase tracking-widest text-on-background opacity-70 hover:opacity-100 hover:text-tertiary transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3 items-center">
            <button
              onClick={openSearch}
              className="active:scale-95 transition-transform text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined font-light text-[22px]">search</span>
            </button>
            <button
              onClick={openCart}
              className="relative active:scale-95 transition-transform text-on-surface hover:text-tertiary"
            >
              <span className="material-symbols-outlined font-light text-[24px]">shopping_bag</span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary text-on-tertiary text-[9px] flex items-center justify-center font-manrope font-semibold">
                  {totalCount}
                </span>
              )}
            </button>
            <button className="active:scale-95 transition-transform hidden md:block text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined font-light text-[24px]">person</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  )
}
