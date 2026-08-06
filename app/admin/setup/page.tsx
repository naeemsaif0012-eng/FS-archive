'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSetupPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (r.ok) router.replace('/admin/dashboard') })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      return
    }

    const data = await res.json()
    setError(data.error || 'Setup failed')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a0a1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-fraunces text-2xl text-white tracking-[0.2em] uppercase">Maison Rose</p>
          <p className="font-manrope text-[10px] uppercase tracking-[0.25em] text-white/40 mt-2">Admin Setup</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-sm">
          <p className="font-manrope text-xs uppercase tracking-widest text-white/50 mb-6">Create the first admin password</p>

          <div className="mb-5">
            <label className="block font-manrope text-[10px] uppercase tracking-widest text-white/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-white/10 border border-white/20 text-white font-manrope text-sm px-4 py-3 focus:outline-none focus:border-[#c9a8b8] placeholder-white/20 rounded-sm"
              placeholder="Create a password"
              autoFocus
            />
          </div>

          <div className="mb-5">
            <label className="block font-manrope text-[10px] uppercase tracking-widest text-white/50 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-white/10 border border-white/20 text-white font-manrope text-sm px-4 py-3 focus:outline-none focus:border-[#c9a8b8] placeholder-white/20 rounded-sm"
              placeholder="Confirm password"
            />
          </div>

          {error && <p className="text-red-400 font-manrope text-xs mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#c9a8b8] text-[#1a0a1e] font-manrope text-xs uppercase tracking-widest hover:bg-white transition-colors duration-200 disabled:opacity-50 rounded-sm"
          >
            {loading ? 'Creating…' : 'Create Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}