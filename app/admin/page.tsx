'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (r.ok) router.replace('/admin/dashboard') })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const data = await res.json()
      if (data.error === 'Admin not configured') {
        router.replace('/admin/setup')
        return
      }
      setError(data.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a0a1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-fraunces text-2xl text-white tracking-[0.2em] uppercase">FS Archives</p>
          <p className="font-manrope text-[10px] uppercase tracking-[0.25em] text-white/40 mt-2">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-sm">
          <p className="font-manrope text-xs uppercase tracking-widest text-white/50 mb-6">Sign in to continue</p>

          <div className="mb-5">
            <label className="block font-manrope text-[10px] uppercase tracking-widest text-white/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 text-white font-manrope text-sm px-4 py-3 focus:outline-none focus:border-[#c9a8b8] placeholder-white/20 rounded-sm"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 font-manrope text-xs mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#c9a8b8] text-[#1a0a1e] font-manrope text-xs uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 rounded-sm"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
