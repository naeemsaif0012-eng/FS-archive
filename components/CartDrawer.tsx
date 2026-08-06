'use client'

import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, changeQty, total, totalCount, isCartOpen, closeCart } = useCart()

  return (
    <>
      {/* Cart drawer */}
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
                        <button
                          className="px-3 py-1 text-on-surface-variant hover:text-on-surface transition-colors"
                          onClick={() => changeQty(idx, -1)}
                        >−</button>
                        <span className="px-3 py-1 font-manrope text-sm">{item.qty}</span>
                        <button
                          className="px-3 py-1 text-on-surface-variant hover:text-on-surface transition-colors"
                          onClick={() => changeQty(idx, 1)}
                        >+</button>
                      </div>
                      <p className="font-manrope text-sm font-medium text-on-background">
                        € {(item.price * item.qty).toLocaleString()}
                      </p>
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
            <span className="text-on-background font-medium">€ {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-manrope text-xs text-on-surface-variant">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div className="border-t border-outline-variant pt-4 flex justify-between font-fraunces text-lg text-on-background">
            <span>Total</span>
            <span>€ {total.toLocaleString()}</span>
          </div>
          <button className="w-full h-[52px] bg-tertiary text-on-tertiary font-manrope text-xs uppercase tracking-widest hover:bg-primary transition-colors duration-300">
            Proceed to Checkout
          </button>
          <button
            onClick={closeCart}
            className="w-full h-[40px] border border-outline-variant text-on-surface-variant font-manrope text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[80] bg-ink-plum/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
        />
      )}
    </>
  )
}
