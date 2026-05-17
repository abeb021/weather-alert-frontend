"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { login } from "@/lib/auth"

const fieldStyle = {
  background: "rgba(8,14,26,0.6)",
  borderColor: "rgba(56,189,248,0.15)",
  color: "#e8f0f8",
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/dashboard/weather")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-1" style={{ color: "#e8f0f8", letterSpacing: "-0.02em" }}>
        Sign in
      </h2>
      <p className="text-sm mb-6" style={{ color: "#4a6580" }}>Welcome back</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "#4a6580", letterSpacing: "0.06em" }}>
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#4a6580" }} />
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={fieldStyle}
              placeholder="you@example.com"
              onFocus={e => e.target.style.borderColor = "rgba(56,189,248,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(56,189,248,0.15)"}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "#4a6580", letterSpacing: "0.06em" }}>
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#4a6580" }} />
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={fieldStyle}
              placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = "rgba(56,189,248,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(56,189,248,0.15)"}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs rounded-xl px-3 py-2.5" style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all mt-1 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #0284c7, #0ea5e9)", color: "white", boxShadow: "0 4px 16px rgba(14,165,233,0.3)" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}>
        <p className="text-center text-xs" style={{ color: "#4a6580" }}>
          No account?{" "}
          <Link href="/register" className="font-medium transition-colors" style={{ color: "#38bdf8" }}>
            Create one
          </Link>
        </p>
      </div>
    </>
  )
}
