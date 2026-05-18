"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, MapPin, Activity, ArrowLeft } from "lucide-react"
import { authFetch } from "@/lib/auth"

const CONDITIONS = [
  { value: "temp_above", label: "Temperature above (°C)" },
  { value: "temp_below", label: "Temperature below (°C)" },
  { value: "wind_above", label: "Wind speed above (m/s)" },
  { value: "rain",       label: "Rain" },
  { value: "snow",       label: "Snow" },
]
const NO_THRESHOLD = new Set(["rain", "snow"])

export default function NewAlertPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [condition, setCondition] = useState("temp_above")
  const [threshold, setThreshold] = useState("30")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error: err } = await authFetch(c => c.POST("/api/alerts", {
        body: { email, city, condition_type: condition as never, threshold: NO_THRESHOLD.has(condition) ? 0 : parseFloat(threshold) },
      }))
      if (err) throw new Error((err as { detail?: string }).detail ?? "Failed to create alert")
      router.push("/dashboard/alerts")
    } catch (e) {
      if (e instanceof Error && e.message === "session_expired") { router.push("/login"); return }
      setError(e instanceof Error ? e.message : "Failed to create alert")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
  const inputSty = { background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }
  const labelSty = { color: "var(--muted)", letterSpacing: "0.05em" }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = "var(--accent)")
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.target.style.borderColor = "var(--border)")

  return (
    <div className="max-w-md animate-fade-up">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm mb-6 transition-all"
        style={{ color: "var(--muted)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h2 className="text-xl font-bold mb-1 tracking-tight" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
        New Alert
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Set up a weather condition to monitor</p>

      <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5 uppercase" style={labelSty}>
              <Mail className="h-3 w-3" /> Notification email
            </label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className={inputCls} style={inputSty} placeholder="notify@example.com" onFocus={focus} onBlur={blur} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5 uppercase" style={labelSty}>
              <MapPin className="h-3 w-3" /> City
            </label>
            <input type="text" required value={city} onChange={e => setCity(e.target.value)}
              className={inputCls} style={inputSty} placeholder="London" onFocus={focus} onBlur={blur} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5 uppercase" style={labelSty}>
              <Activity className="h-3 w-3" /> Condition
            </label>
            <select value={condition} onChange={e => setCondition(e.target.value)}
              className={inputCls} style={inputSty} onFocus={focus} onBlur={blur}>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {!NO_THRESHOLD.has(condition) && (
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase" style={labelSty}>Threshold</label>
              <input type="number" step="0.1" required value={threshold} onChange={e => setThreshold(e.target.value)}
                className={inputCls + " font-mono"} style={inputSty} onFocus={focus} onBlur={blur} />
            </div>
          )}

          {error && (
            <div className="text-xs px-3.5 py-2.5 rounded-xl" style={{
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171",
            }}>{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--accent)", color: "white", boxShadow: "0 2px 12px var(--accent-shadow)" }}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating…" : "Create alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
