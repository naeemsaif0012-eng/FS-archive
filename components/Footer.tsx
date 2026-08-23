import Link from 'next/link'

const socialIcons = [
  {
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X / Twitter',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z',
  },
  {
    label: 'Pinterest',
    path: 'M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z',
  },
  {
    label: 'TikTok',
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.36a8.21 8.21 0 0 0 4.8 1.53V5.02a4.85 4.85 0 0 1-1.02-.33z',
  },
]

export default function Footer() {
  return (
    <footer className="bg-tertiary border-t border-champagne">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/">
              <h2 className="font-fraunces text-2xl md:text-3xl text-secondary-fixed mb-4 uppercase tracking-widest">
                FS ARCHIVES
              </h2>
            </Link>
            <p className="font-manrope text-sm text-secondary-fixed-dim/70 leading-relaxed mb-8 max-w-xs">
              A Parisian atelier dedicated to the art of quiet luxury. Crafting heirlooms for those who understand that true elegance is timeless.
            </p>
            <div className="flex gap-5">
              {socialIcons.map((icon) => (
                <a key={icon.label} href="#" aria-label={icon.label} className="text-secondary-fixed-dim/60 hover:text-secondary-fixed transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-manrope text-[10px] uppercase tracking-widest text-secondary-fixed font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'Bags', href: '/bags' },
                { label: 'Jewelry', href: '/jewelry' },
                { label: 'Accessories', href: '/accessories' },
                { label: 'New Arrivals', href: '/' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-manrope text-sm text-secondary-fixed-dim/70 hover:text-secondary-fixed hover:opacity-100 transition-all">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archives */}
          <div>
            <h4 className="font-manrope text-[10px] uppercase tracking-widest text-secondary-fixed font-semibold mb-6">Archives</h4>
            <ul className="space-y-3">
              {['Our Heritage', 'The Atelier', 'Journal', 'Events'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-manrope text-sm text-secondary-fixed-dim/70 hover:text-secondary-fixed hover:opacity-100 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-manrope text-[10px] uppercase tracking-widest text-secondary-fixed font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {['Client Services', 'Care & Repair', 'Shipping & Returns', 'Privacy Policy', 'Legal'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-manrope text-sm text-secondary-fixed-dim/70 hover:text-secondary-fixed hover:opacity-100 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-champagne/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-manrope text-xs text-secondary-fixed-dim/50">© 2025 FS ARCHIVES. All rights reserved.</p>
          <div className="flex gap-6">
            {['Terms', 'Cookies', 'Accessibility'].map((item) => (
              <a key={item} href="#" className="font-manrope text-xs text-secondary-fixed-dim/50 hover:text-secondary-fixed/80 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
