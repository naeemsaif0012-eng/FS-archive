'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { DbProduct, DbCategory } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  reserved: 'bg-amber-100 text-amber-700',
  sold: 'bg-gray-100 text-gray-500',
}

const BADGE_COLORS: Record<string, string> = {
  New: 'bg-purple-100 text-purple-700',
  Limited: 'bg-rose-100 text-rose-700',
}

const TAB_CATS = ['all', 'bags', 'jewelry', 'accessories']
const FEATURED_SLOTS = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4']

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<DbProduct[]>([])
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [featuredIds, setFeaturedIds] = useState<number[]>([])
  const [tab, setTab] = useState<'products' | 'categories' | 'featured'>('products')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [featuredSaving, setFeaturedSaving] = useState(false)
  const [featuredError, setFeaturedError] = useState('')
  const [catForm, setCatForm] = useState({ name: '', slug: '', main_category: 'bags' })
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products')
    if (res.ok) setProducts(await res.json())
  }, [])

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    if (res.ok) setCategories(await res.json())
  }, [])

  const fetchFeatured = useCallback(async () => {
    const res = await fetch('/api/featured-products')
    if (res.ok) {
      const data = await res.json()
      setFeaturedIds(data.productIds ?? [])
    }
    setFeaturedLoading(false)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.replace('/admin') })
    Promise.all([fetchProducts(), fetchCategories(), fetchFeatured()]).then(() => setLoading(false))
  }, [router, fetchProducts, fetchCategories, fetchFeatured])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  async function changeStatus(id: number, status: string) {
    const product = products.find(p => p.id === id)
    if (!product) return
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, status }),
    })
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: status as DbProduct['status'] } : p))
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeletingId(id)
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
  }

  async function deleteCategory(id: number) {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c.id !== id))
    if (editingCategoryId === id) {
      setEditingCategoryId(null)
      setCatForm({ name: '', slug: '', main_category: 'bags' })
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    const isEditing = editingCategoryId !== null
    const res = await fetch(isEditing ? `/api/categories/${editingCategoryId}` : '/api/categories', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catForm),
    })
    if (res.ok) {
      const savedCategory = await res.json()
      setCategories(prev => {
        if (isEditing) {
          return prev.map(category => category.id === savedCategory.id ? savedCategory : category)
        }
        return [...prev, savedCategory]
      })
      setCatForm({ name: '', slug: '', main_category: 'bags' })
      setEditingCategoryId(null)
    }
  }

  function startEditCategory(category: DbCategory) {
    setEditingCategoryId(category.id)
    setCatForm({
      name: category.name,
      slug: category.slug,
      main_category: category.main_category,
    })
    setTab('categories')
  }

  function cancelEditCategory() {
    setEditingCategoryId(null)
    setCatForm({ name: '', slug: '', main_category: 'bags' })
  }

  const featuredProducts = useMemo(() => {
    const map = new Map(products.map(product => [product.id, product]))
    return featuredIds.map(id => map.get(id)).filter((product): product is DbProduct => Boolean(product))
  }, [featuredIds, products])

  async function saveFeaturedProducts() {
    setFeaturedSaving(true)
    setFeaturedError('')
    const res = await fetch('/api/featured-products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: featuredIds }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setFeaturedError(data?.error || 'Failed to save featured products')
    }
    setFeaturedSaving(false)
  }

  function updateFeaturedSlot(slotIndex: number, productId: string) {
    setFeaturedIds(prev => {
      const next = [...prev]
      next[slotIndex] = Number(productId)
      return next.slice(0, 4)
    })
  }

  const visible = products
    .filter(p => filter === 'all' || p.main_category === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: products.length,
    available: products.filter(p => p.status === 'available').length,
    reserved: products.filter(p => p.status === 'reserved').length,
    sold: products.filter(p => p.status === 'sold').length,
  }

  return (
    <div className="min-h-screen bg-[#f9f6f2] font-manrope">
      {/* Nav */}
      <nav className="bg-[#1a0a1e] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="font-fraunces text-white text-lg tracking-widest uppercase">Maison Rose</span>
          <span className="text-white/30 text-xs">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setTab('products')}
            className={`text-xs uppercase tracking-widest transition-colors ${tab === 'products' ? 'text-[#c9a8b8]' : 'text-white/50 hover:text-white'}`}
          >
            Products
          </button>
          <button
            onClick={() => setTab('featured')}
            className={`text-xs uppercase tracking-widest transition-colors ${tab === 'featured' ? 'text-[#c9a8b8]' : 'text-white/50 hover:text-white'}`}
          >
            Featured
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`text-xs uppercase tracking-widest transition-colors ${tab === 'categories' ? 'text-[#c9a8b8]' : 'text-white/50 hover:text-white'}`}
          >
            Categories
          </button>
          <Link
            href="/"
            target="_blank"
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            View Site ↗
          </Link>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-[#c9a8b8] transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.total, color: 'border-[#c9a8b8]' },
            { label: 'Available', value: stats.available, color: 'border-emerald-400' },
            { label: 'Reserved', value: stats.reserved, color: 'border-amber-400' },
            { label: 'Sold', value: stats.sold, color: 'border-gray-400' },
          ].map(s => (
            <div key={s.label} className={`bg-white border-l-4 ${s.color} p-4 rounded-sm shadow-sm`}>
              <p className="text-2xl font-fraunces text-[#1a0a1e]">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {TAB_CATS.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full border transition-all ${
                      filter === c ? 'bg-[#1a0a1e] text-white border-[#1a0a1e]' : 'border-gray-200 text-gray-400 hover:border-[#1a0a1e] hover:text-[#1a0a1e]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  placeholder="Search products…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-gray-200 px-3 py-1.5 text-xs w-44 focus:outline-none focus:border-[#c9a8b8] rounded-sm"
                />
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-1.5 h-8 px-4 bg-[#1a0a1e] text-white text-[10px] uppercase tracking-widest hover:bg-[#c9a8b8] hover:text-[#1a0a1e] transition-colors rounded-sm whitespace-nowrap"
                >
                  + New Product
                </Link>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-400 py-12 text-sm">Loading…</p>
            ) : (
              <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400">
                      <th className="text-left px-4 py-3 w-16">Image</th>
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                      <th className="text-left px-4 py-3">Price</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Qty</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Badge</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-12 text-gray-300 text-xs uppercase tracking-widest">No products found</td></tr>
                    )}
                    {visible.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden">
                            {p.images?.[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1a0a1e] text-xs">{p.name}</p>
                          {p.subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{p.subtitle}</p>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-xs text-gray-500 capitalize">{p.main_category}</p>
                          {p.category && <p className="text-[10px] text-gray-300 capitalize">{p.category}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-[#1a0a1e]">${Number(p.price).toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <p className="text-xs text-gray-500">{p.quantity}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={p.status}
                            onChange={e => changeStatus(p.id, e.target.value)}
                            className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border-0 cursor-pointer font-medium focus:outline-none ${STATUS_COLORS[p.status]}`}
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {p.badge ? (
                            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium ${BADGE_COLORS[p.badge]}`}>
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-gray-200 text-[10px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#1a0a1e] transition-colors px-2 py-1 border border-gray-200 hover:border-[#1a0a1e] rounded-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              disabled={deletingId === p.id}
                              className="text-[10px] uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors px-2 py-1 border border-red-100 hover:border-red-300 rounded-sm disabled:opacity-50"
                            >
                              {deletingId === p.id ? '…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* FEATURED TAB */}
        {tab === 'featured' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">Featured Product Section</p>
              {featuredLoading ? (
                <p className="text-xs text-gray-300">Loading featured section…</p>
              ) : (
                <div className="space-y-4">
                  {FEATURED_SLOTS.map((slot, index) => (
                    <div key={slot}>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">{slot}</label>
                      <select
                        value={featuredIds[index] ?? ''}
                        onChange={e => updateFeaturedSlot(index, e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#c9a8b8] rounded-sm"
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} · {product.main_category} · ${Number(product.price).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {featuredError && <p className="text-xs text-red-500">{featuredError}</p>}

                  <button
                    type="button"
                    onClick={saveFeaturedProducts}
                    disabled={featuredSaving}
                    className="w-full h-9 bg-[#1a0a1e] text-white text-[10px] uppercase tracking-widest hover:bg-[#c9a8b8] hover:text-[#1a0a1e] transition-colors rounded-sm disabled:opacity-50"
                  >
                    {featuredSaving ? 'Saving…' : 'Save Featured Section'}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-sm shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">Live Preview</p>
              {featuredProducts.length === 0 ? (
                <p className="text-gray-300 text-xs">No featured products selected yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {featuredProducts.map(product => (
                    <div key={product.id} className="border border-gray-100 rounded-sm overflow-hidden">
                      <div className="aspect-[3/4] bg-gray-100">
                        {product.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Maison Rose</p>
                        <p className="text-sm font-medium text-[#1a0a1e]">{product.name}</p>
                        <p className="text-xs text-gray-500">${Number(product.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === 'categories' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add category form */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </p>
              <form onSubmit={addCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Name</label>
                  <input
                    required value={catForm.name}
                    onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#c9a8b8] rounded-sm"
                    placeholder="e.g. Shoulder Bag"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Slug</label>
                  <input
                    required value={catForm.slug}
                    onChange={e => setCatForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#c9a8b8] rounded-sm"
                    placeholder="e.g. shoulder-bag"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Section</label>
                  <select
                    value={catForm.main_category}
                    onChange={e => setCatForm(f => ({ ...f, main_category: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-[#c9a8b8] rounded-sm"
                  >
                    <option value="bags">Bags</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full h-9 bg-[#1a0a1e] text-white text-[10px] uppercase tracking-widest hover:bg-[#c9a8b8] hover:text-[#1a0a1e] transition-colors rounded-sm"
                >
                  {editingCategoryId ? 'Save Changes' : 'Add Category'}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={cancelEditCategory}
                    className="w-full h-9 border border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest hover:border-[#1a0a1e] hover:text-[#1a0a1e] transition-colors rounded-sm"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Category list */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">Existing Categories</p>
              {categories.length === 0 ? (
                <p className="text-gray-300 text-xs">No categories yet.</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map(c => (
                    <li key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <span className="text-xs text-[#1a0a1e] font-medium">{c.name}</span>
                        <span className="text-[10px] text-gray-300 ml-2">· {c.slug}</span>
                        <span className="text-[10px] text-gray-300 ml-2 capitalize">({c.main_category})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEditCategory(c)}
                          className="text-[10px] text-gray-400 hover:text-[#1a0a1e] uppercase tracking-widest transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(c.id)}
                          className="text-[10px] text-red-300 hover:text-red-600 uppercase tracking-widest transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
