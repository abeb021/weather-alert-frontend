"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { register } from "@/lib/auth"

const fieldStyle = {
  background: "rgba(7,19,12,0.62)",
  borderColor: "rgba(74,222,128,0.16)",
  color: "#e9f8ee",
}

export default function RegisterPage() {
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
      await register(email, password)
      router.push("/dashboard/weather")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-1" style={{ color: "#e9f8ee", letterSpacing: "-0.02em" }}>
        Create account
      </h2>
      <p className="text-sm mb-6" style={{ color: "#6f8f77" }}>Start monitoring weather</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "#6f8f77", letterSpacing: "0.06em" }}>
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#6f8f77" }} />
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={fieldStyle}
              placeholder="you@example.com"
              onFocus={e => e.target.style.borderColor = "rgba(74,222,128,0.50)"}
              onBlur={e => e.target.style.borderColor = "rgba(74,222,128,0.16)"}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: "#6f8f77", letterSpacing: "0.06em" }}>
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#6f8f77" }} />
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={fieldStyle}
              placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = "rgba(74,222,128,0.50)"}
              onBlur={e => e.target.style.borderColor = "rgba(74,222,128,0.16)"}
            />
          </div>
        </div>

        {error && (
          <div className="text-xs rounded-xl px-3 py-2.5" style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all mt-1 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #16803a, #22c55e)", color: "white", boxShadow: "0 4px 16px rgba(34,197,94,0.30)" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(74,222,128,0.10)" }}>
        <p className="text-center text-xs" style={{ color: "#6f8f77" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "#4ade80" }}>
            Sign in
          </Link>
        </p>
      </div>
    </>
  )
}
