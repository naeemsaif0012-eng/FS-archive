'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import type { DbCategory, DbProduct } from '@/lib/types'

const BG_OPTIONS = [
  'bg-surface-container',
  'bg-surface-container-high',
  'bg-surface-container-highest',
  'bg-surface-container-lowest',
  'bg-bone',
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<DbCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
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
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then((p: DbProduct) => {
        setForm({
          name: p.name,
          subtitle: p.subtitle || '',
          description: p.description || '',
          price: String(p.price),
          main_category: p.main_category,
          category: p.category || '',
          status: p.status,
          badge: p.badge || '',
          quantity: String(p.quantity),
          bg_class: p.bg_class,
        })
        setImages(p.images || [])
        setLoading(false)
      })
  }, [id, router])

  const filteredCats = categories.filter(c => c.main_category === form.main_category)
  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })) }

  async function uploadFile(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) return (await res.json()).url as string
    throw new Error('Upload failed')
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadFile))
      setImages(prev => [...prev, ...urls])
    } catch { setError('Image upload failed.') }
    finally { setUploading(false); e.target.value = '' }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), images, badge: form.badge || null }),
    })
    if (res.ok) { router.push('/admin/dashboard') }
    else { setError('Failed to save.'); setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f9f6f2] flex items-center justify-center">
      <p className="text-gray-400 font-manrope text-sm">Loading…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f9f6f2] font-manrope">
      <nav className="bg-[#1a0a1e] px-6 py-4 flex items-center justify-between">
        <span className="font-fraunces text-white text-lg tracking-widest uppercase">FS Archives</span>
        <Link href="/admin/dashboard" className="text-xs uppercase tracking-widest text-white/50 hover:text-[#c9a8b8] transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="font-fraunces text-2xl text-[#1a0a1e] mb-8">Edit Product</p>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Product Info</p>
                <F label="Name *"><input required value={form.name} onChange={e => set('name', e.target.value)} className="input" /></F>
                <F label="Subtitle"><input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} className="input" /></F>
                <F label="Description"><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="input resize-none" /></F>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Price ($) *"><input required type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} className="input" /></F>
                  <F label="Quantity"><input required type="number" min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} className="input" /></F>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Classification</p>
                <F label="Section *">
                  <select value={form.main_category} onChange={e => { set('main_category', e.target.value); set('category', '') }} className="input">
                    <option value="bags">Bags</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </F>
                <F label="Subcategory">
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
                    <option value="">— select —</option>
                    {filteredCats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </F>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Status">
                    <select value={form.status} onChange={e => set('status', e.target.value)} className="input">
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </F>
                  <F label="Badge">
                    <select value={form.badge} onChange={e => set('badge', e.target.value)} className="input">
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </F>
                </div>
                <F label="Card Background">
                  <select value={form.bg_class} onChange={e => set('bg_class', e.target.value)} className="input">
                    {BG_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </F>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Product Images</p>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-[#c9a8b8] transition-colors">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
                {uploading ? <p className="text-xs text-gray-400">Uploading…</p> : (
                  <><span className="text-gray-300 text-3xl mb-2">↑</span><p className="text-xs text-gray-400">Click to upload images</p></>
                )}
              </label>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative group aspect-square bg-gray-100 rounded-sm overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving}
              className="h-11 px-8 bg-[#1a0a1e] text-white text-xs uppercase tracking-widest hover:bg-[#c9a8b8] hover:text-[#1a0a1e] transition-colors disabled:opacity-50 rounded-sm">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/admin/dashboard"
              className="h-11 px-8 border border-gray-200 text-gray-400 text-xs uppercase tracking-widest hover:border-[#1a0a1e] hover:text-[#1a0a1e] transition-colors flex items-center rounded-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
