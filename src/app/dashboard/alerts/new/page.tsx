"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
        body: {
          email,
          city,
          condition_type: condition as never,
          threshold: NO_THRESHOLD.has(condition) ? 0 : parseFloat(threshold),
        },
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

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold text-white mb-6">New Alert</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="notify@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">City</label>
          <input type="text" required value={city} onChange={e => setCity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="London" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Condition</label>
          <select value={condition} onChange={e => setCondition(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
            {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {!NO_THRESHOLD.has(condition) && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Threshold</label>
            <input type="number" step="0.1" required value={threshold} onChange={e => setThreshold(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
          </div>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3 mt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-lg transition-colors">
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}
