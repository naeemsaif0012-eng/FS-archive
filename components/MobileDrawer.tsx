'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const navLinks = [
  { label: 'Bags', href: '/bags' },
  { label: 'Jewelry', href: '/jewelry' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Heritage', href: '#' },
  { label: 'Atelier', href: '#' },
]

export default function MobileDrawer() {
  const { isDrawerOpen, closeDrawer } = useCart()
  const pathname = usePathname()

  return (
    <>
      <div
        className={`drawer-overlay fixed inset-0 z-[60] bg-ink-plum/40 backdrop-blur-sm ${isDrawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      />
      <div className={`mobile-drawer fixed top-0 left-0 h-full w-4/5 max-w-xs z-[70] bg-surface-container-lowest flex flex-col shadow-2xl ${isDrawerOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-outline-variant">
          <Link href="/" onClick={closeDrawer} className="font-fraunces text-lg tracking-widest uppercase text-on-background">
            MAISON ROSE
          </Link>
          <button onClick={closeDrawer}>
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">close</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeDrawer}
                className={`block py-4 border-b border-outline-variant/40 font-manrope text-sm uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-tertiary font-semibold'
                    : 'text-on-background hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 py-6 border-t border-outline-variant space-y-4">
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-manrope text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">person</span> My Account
          </button>
          <div className="flex gap-5 pt-2">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
