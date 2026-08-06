'use client'

import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, changeQty, total, isCartOpen, closeCart } = useCart()

  function handleWhatsApp() {
    if (items.length === 0) return
    const lines = items.map(item =>
      `• ${item.name} – $${item.price.toLocaleString()}${item.qty > 1 ? ` × ${item.qty}` : ''}`
    )
    const message =
      `Hi! I'm interested in purchasing the following products:\n\n` +
      `${lines.join('\n')}\n\n` +
      `Total: $${total.toLocaleString()}\n\n` +
      `My Name: \n` +
      `My City: `
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923299615669'
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <div className={`cart-drawer fixed top-0 right-0 h-full w-full max-w-md z-[90] bg-surface-container-lowest shadow-2xl flex flex-col ${isCartOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant">
          <h3 className="font-fraunces text-xl text-on-background">Your Bag</h3>
          <button onClick={closeCart} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <p className="font-manrope text-sm text-on-surface-variant text-center mt-12">Your bag is empty.</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="font-manrope text-xs uppercase tracking-widest text-on-surface-variant mb-1">Maison Rose</p>
                    <p className="font-fraunces text-base text-on-background mb-2">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-outline-variant">
                        <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface transition-colors" onClick={() => changeQty(idx, -1)}>−</button>
                        <span className="px-3 py-1 font-manrope text-sm">{item.qty}</span>
                        <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface transition-colors" onClick={() => changeQty(idx, 1)}>+</button>
                      </div>
                      <p className="font-manrope text-sm font-medium text-on-background">$ {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                {idx < items.length - 1 && <div className="border-t border-outline-variant mt-6" />}
              </div>
            ))
          )}
        </div>

        <div className="px-8 py-6 border-t border-outline-variant space-y-4">
          <div className="flex justify-between font-manrope text-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span className="text-on-background font-medium">$ {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-manrope text-xs text-on-surface-variant">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div className="border-t border-outline-variant pt-4 flex justify-between font-fraunces text-lg text-on-background">
            <span>Total</span>
            <span>$ {total.toLocaleString()}</span>
          </div>

          {/* WhatsApp Order Button */}
          <button
            onClick={handleWhatsApp}
            disabled={items.length === 0}
            className="w-full h-[52px] bg-[#25D366] text-white font-manrope text-xs uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order on WhatsApp
          </button>

          <button
            onClick={closeCart}
            className="w-full h-[40px] border border-outline-variant text-on-surface-variant font-manrope text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-[80] bg-ink-plum/30 backdrop-blur-sm transition-opacity duration-300" onClick={closeCart} />
      )}
    </>
  )
}
