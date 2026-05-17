"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { authFetch } from "@/lib/auth"

const CONDITIONS = [
  { value: "temp_above", label: "Temperature above (°C)" },
  { value: "temp_below", label: "Temperature below (°C)" },
  { value: "wind_above", label: "Wind speed above (m/s)" },
  { value: "rain",       label: "Rain" },
  { value: "snow",       label: "Snow" },
]

const NO_THRESHOLD = new Set(["rain", "snow"])

export default function EditAlertPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [condition, setCondition] = useState("temp_above")
  const [threshold, setThreshold] = useState("30")
  const [active, setActive] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    authFetch(c => c.GET("/api/alerts/{id}", { params: { path: { id } } }))
      .then(({ data, error: err }) => {
        if (err) throw new Error("Failed to load alert")
        if (data) {
          setEmail(data.email ?? "")
          setCity(data.city ?? "")
          setCondition(data.condition_type ?? "temp_above")
          setThreshold(String(data.threshold ?? 30))
          setActive(data.active ?? true)
        }
      })
      .catch(e => {
        if (e instanceof Error && e.message === "session_expired") { router.push("/login"); return }
        setError(e instanceof Error ? e.message : "Failed to load alert")
      })
      .finally(() => setFetching(false))
  }, [id, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error: err } = await authFetch(c => c.PUT("/api/alerts/{id}", {
        params: { path: { id } },
        body: {
          email,
          city,
          condition_type: condition as never,
          threshold: NO_THRESHOLD.has(condition) ? 0 : parseFloat(threshold),
          active,
        },
      }))
      if (err) throw new Error((err as { detail?: string }).detail ?? "Failed to update alert")
      router.push("/dashboard/alerts")
    } catch (e) {
      if (e instanceof Error && e.message === "session_expired") { router.push("/login"); return }
      setError(e instanceof Error ? e.message : "Failed to update alert")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="animate-pulse h-64 bg-gray-800 rounded-xl" />

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold text-white mb-6">Edit Alert</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">City</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
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
            <input type="number" step="0.1" value={threshold} onChange={e => setThreshold(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
          </div>
        )}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)}
            className="w-4 h-4 accent-blue-500" />
          <span className="text-gray-300 text-sm">Active</span>
        </label>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3 mt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-lg transition-colors">
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}
