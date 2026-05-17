"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authFetch } from "@/lib/auth"
import AlertRow from "@/components/AlertRow"
import type { components } from "@/lib/api/schema"

type Alert = components["schemas"]["Alert"]

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function fetchAlerts() {
    try {
      const { data, error: err } = await authFetch(c => c.GET("/api/alerts"))
      if (err) throw new Error("Failed to load alerts")
      setAlerts(data ?? [])
    } catch (e) {
      if (e instanceof Error && e.message === "session_expired") { router.push("/login"); return }
      setError(e instanceof Error ? e.message : "Failed to load alerts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAlerts() }, [])

  async function handleDelete(id: string) {
    try {
      await authFetch(c => c.DELETE("/api/alerts/{id}", { params: { path: { id } } }))
      setAlerts(prev => prev.filter(a => a.id !== id))
    } catch (e) {
      if (e instanceof Error && e.message === "session_expired") { router.push("/login"); return }
      setError(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Alert Rules</h2>
        <button
          onClick={() => router.push("/dashboard/alerts/new")}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + New Alert
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && alerts.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p>No alerts yet.</p>
          <p className="text-sm mt-1">Create one to start monitoring weather conditions.</p>
        </div>
      )}

      {!loading && alerts.map(alert => (
        <div key={alert.id} onClick={() => router.push(`/dashboard/alerts/${alert.id}`)} className="cursor-pointer">
          <AlertRow
            alert={alert}
            onDelete={() => handleDelete(alert.id!)}
          />
        </div>
      ))}
    </div>
  )
}
