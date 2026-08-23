'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { DbCategory } from '@/lib/types'

const BG_OPTIONS = [
  'bg-surface-container',
  'bg-surface-container-high',
  'bg-surface-container-highest',
  'bg-surface-container-lowest',
  'bg-bone',
]

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    price: '',
    main_category: 'bags',
    category: '',
    status: 'available',
    badge: '',
    quantity: '1',
    bg_class: 'bg-surface-container',
  })

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.replace('/admin') })
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [router])

  const filteredCats = categories.filter(c => c.main_category === form.main_category)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function uploadFile(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      return url as string
    }
    throw new Error('Upload failed')
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadFile))
      setImages(prev => [...prev, ...urls])
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), images, badge: form.badge || null }),
    })
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Failed to save product.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f6f2] font-manrope">
      <nav className="bg-[#1a0a1e] px-6 py-4 flex items-center justify-between">
        <span className="font-fraunces text-white text-lg tracking-widest uppercase">FS Archives</span>
        <Link href="/admin/dashboard" className="text-xs uppercase tracking-widest text-white/50 hover:text-[#c9a8b8] transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="font-fraunces text-2xl text-[#1a0a1e] mb-8">Add New Product</p>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column — product details */}
            <div className="space-y-5">
              <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Product Info</p>
                <Field label="Name *" required>
                  <input required value={form.name} onChange={e => set('name', e.target.value)}
                    className="input" placeholder="La Calla Tote" />
                </Field>
                <Field label="Subtitle">
                  <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                    className="input" placeholder="Ivory Calfskin" />
                </Field>
                <Field label="Description">
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    rows={3} className="input resize-none" placeholder="Product description…" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price ($) *">
                    <input required type="number" step="0.01" min="0" value={form.price}
                      onChange={e => set('price', e.target.value)} className="input" placeholder="0.00" />
                  </Field>
                  <Field label="Quantity">
                    <input required type="number" min="0" value={form.quantity}
                      onChange={e => set('quantity', e.target.value)} className="input" />
                  </Field>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Classification</p>
                <Field label="Section *">
                  <select value={form.main_category} onChange={e => { set('main_category', e.target.value); set('category', '') }} className="input">
                    <option value="bags">Bags</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </Field>
                <Field label="Subcategory">
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
                    <option value="">— select —</option>
                    {filteredCats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status">
                    <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </Field>
                  <Field label="Badge">
                    <select value={form.badge} onChange={e => set('badge', e.target.value)} className="input">
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </Field>
                </div>
                <Field label="Card Background">
                  <select value={form.bg_class} onChange={e => set('bg_class', e.target.value)} className="input">
                    {BG_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Right column — images */}
            <div>
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Product Images</p>

                {/* Upload area */}
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-[#c9a8b8] transition-colors">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
                  {uploading ? (
                    <p className="text-xs text-gray-400">Uploading…</p>
                  ) : (
                    <>
                      <span className="text-gray-300 text-3xl mb-2">↑</span>
                      <p className="text-xs text-gray-400">Click to upload images</p>
                      <p className="text-[10px] text-gray-300 mt-1">JPG, PNG, WEBP</p>
                    </>
                  )}
                </label>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {images.map((url, i) => (
                      <div key={i} className="relative group aspect-square bg-gray-100 rounded-sm overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-8 bg-[#1a0a1e] text-white text-xs uppercase tracking-widest hover:bg-[#c9a8b8] hover:text-[#1a0a1e] transition-colors disabled:opacity-50 rounded-sm"
            >
              {saving ? 'Saving…' : 'Save Product'}
            </button>
            <Link
              href="/admin/dashboard"
              className="h-11 px-8 border border-gray-200 text-gray-400 text-xs uppercase tracking-widest hover:border-[#1a0a1e] hover:text-[#1a0a1e] transition-colors flex items-center rounded-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
        {label}{required && <span className="text-[#c9a8b8]"> *</span>}
      </label>
      {children}
    </div>
  )
}

// Add global input style via a style tag trick — just apply directly
// We inject the .input class via the global CSS approach below
