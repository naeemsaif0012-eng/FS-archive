import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'wouter'

const whatsappNumber = () => import.meta.env.VITE_WHATSAPP_NUMBER || '923299615669'
const EMAIL = 'hello@fsarchive.com'
const INSTAGRAM_URL = 'https://www.instagram.com/fsarchive'

const faqs = [
  { q: 'How do I place an order?', a: 'Simply add your chosen pieces to your bag and place your order. You can also use the "Buy Now" button on any product page to send your order directly to us on WhatsApp — we confirm availability and complete the order for you personally.' },
  { q: 'How do I pay for my order?', a: 'Payments are arranged privately through WhatsApp after your order is confirmed. We share secure payment details with you directly, and no payment information is ever stored on our website.' },
  { q: 'Do you offer international shipping?', a: 'Yes. We ship worldwide with complimentary insured delivery on every order. Delivery times and costs vary by destination and are confirmed with you when your order is placed.' },
  { q: 'How long does delivery take?', a: 'Orders are dispatched within 1–2 business days. Domestic deliveries typically arrive in 2–4 days, while international orders arrive within 5–10 business days. You will receive tracking details as soon as your order ships.' },
  { q: 'What is your return policy?', a: 'We offer a 14-day return policy on unworn pieces in their original condition and packaging. Please contact us within 14 days of receiving your order to arrange a return or exchange.' },
  { q: 'How can I be sure my piece is authentic?', a: 'Every piece in the archive is individually verified and arrives with a certificate of authenticity. Details of each item\'s provenance are available on request.' },
  { q: 'How do I care for my piece?', a: 'We include a care guide with every order. For most pieces, storing in the provided dust bag away from direct sunlight and moisture will keep them pristine for years.' },
  { q: 'Can I reserve or hold a piece?', a: 'Yes. Certain pieces can be reserved for a short period. Message us on WhatsApp or email us and we will place a hold on the piece while you decide.' },
]

const contactCards = [
  { icon: MessageCircle, title: 'WhatsApp', handle: `+92 ${whatsappNumber().slice(3)}`, description: 'The fastest way to reach us. Chat with our team for orders, holds, and questions about any piece in the archive.', href: `https://wa.me/${whatsappNumber()}`, cta: 'Chat on WhatsApp', buttonClass: 'bg-[#25D366] text-white hover:bg-[#1da851]' },
  { icon: Instagram, title: 'Instagram', handle: '@fsarchive', description: 'Follow the archive for new arrivals, behind-the-scenes looks, and early access to exclusive pieces.', href: INSTAGRAM_URL, cta: 'Follow Us', buttonClass: 'bg-primary text-on-primary hover:bg-primary/90' },
  { icon: Mail, title: 'Email', handle: EMAIL, description: 'For detailed enquiries, bespoke requests, and after-sales support — we reply within one business day.', href: `mailto:${EMAIL}`, cta: 'Send an Email', buttonClass: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90' },
]

export function ContactPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <main className="pt-[73px] bg-surface-container-lowest min-h-screen">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-12 md:py-16">
        <nav className="flex items-center gap-2 font-manrope text-[11px] uppercase tracking-widest text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary">Home</Link><span>›</span><span className="text-on-background">Contact & FAQs</span>
        </nav>
        <div className="max-w-2xl mb-14">
          <p className="font-manrope text-[11px] uppercase tracking-[.18em] text-on-surface-variant mb-4">We're Here to Help</p>
          <h1 className="font-fraunces text-4xl md:text-5xl text-on-background leading-tight mb-5">Contact & FAQs</h1>
          <p className="font-manrope text-sm md:text-base text-on-surface-variant leading-relaxed">Every enquiry is handled personally by our team. Reach out through whichever channel suits you best — we typically respond within one business day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-20">
          {contactCards.map(card => { const Icon = card.icon; return (
            <div key={card.title} className="bg-surface-container-low border border-outline-variant p-8 flex flex-col">
              <div className="w-12 h-12 bg-primary-container flex items-center justify-center mb-6"><Icon className="w-5 h-5 text-on-primary-container" strokeWidth={1.5} /></div>
              <h3 className="font-fraunces text-2xl text-on-background mb-2">{card.title}</h3>
              <p className="font-manrope text-sm text-on-background mb-1">{card.handle}</p>
              <p className="font-manrope text-xs text-on-surface-variant leading-relaxed mb-8 flex-1">{card.description}</p>
              <a href={card.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center h-[48px] px-6 font-manrope text-xs uppercase tracking-widest transition-colors ${card.buttonClass}`}>{card.cta}</a>
            </div>
          ) })}
        </div>
        <div className="max-w-3xl">
          <p className="font-manrope text-[11px] uppercase tracking-[.18em] text-on-surface-variant mb-4">FAQ</p>
          <h2 className="font-fraunces text-3xl md:text-4xl text-on-background leading-tight mb-10">Frequently Asked Questions</h2>
          <div>{faqs.map((item, index) => { const active = open === index; return (
            <div key={item.q} className="border-b border-outline-variant">
              <button onClick={() => setOpen(active ? null : index)} className="w-full flex items-center justify-between gap-6 py-6 text-left">
                <span className={`font-fraunces text-lg md:text-xl ${active ? 'text-primary' : 'text-on-background'}`}>{item.q}</span>
                <span className={`material-symbols-outlined text-[22px] text-on-surface-variant transition-transform duration-300 ${active ? 'rotate-45' : ''}`}>add</span>
              </button>
              <div className={`grid transition-all duration-300 ${active ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="font-manrope text-sm text-on-surface-variant leading-relaxed max-w-2xl">{item.a}</p></div></div>
            </div>
          ) })}
          </div>
        </div>
      </div>
    </main>
  )
}
