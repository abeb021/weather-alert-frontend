"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Bell, AlertCircle } from "lucide-react"
import { authFetch } from "@/lib/auth"
import AlertRow from "@/components/AlertRow"
import type { components } from "@/lib/api/schema"

type Alert = components["schemas"]["Alert"]

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchAlerts = useCallback(async () => {
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
  }, [router])

  useEffect(() => { fetchAlerts() }, [fetchAlerts])

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
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Alert Rules
          </h2>
          {!loading && alerts.length > 0 && (
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {alerts.length} rule{alerts.length !== 1 ? "s" : ""} configured
            </p>
          )}
        </div>
        <button
          onClick={() => router.push("/dashboard/alerts/new")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: "var(--accent)", color: "white", boxShadow: "0 2px 12px rgba(14,165,233,0.3)" }}
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm" style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.15)",
          color: "#f87171",
        }}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && alerts.length === 0 && !error && (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
          }}>
            <Bell className="h-6 w-6" style={{ color: "var(--muted)", opacity: 0.5 }} />
          </div>
          <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>No alerts yet</p>
          <p className="text-xs mt-1 mb-5" style={{ color: "var(--muted)" }}>Create one to start monitoring weather conditions</p>
          <button
            onClick={() => router.push("/dashboard/alerts/new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Plus className="h-4 w-4" /> Create alert
          </button>
        </div>
      )}

      {/* Alert list */}
      {!loading && alerts.map((alert, i) => (
        <div
          key={alert.id}
          onClick={() => router.push(`/dashboard/alerts/${alert.id}`)}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          <AlertRow alert={alert} onDelete={() => handleDelete(alert.id!)} />
        </div>
      ))}
    </div>
  )
}
