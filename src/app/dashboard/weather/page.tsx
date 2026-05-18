"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { authFetch } from "@/lib/auth"
import WeatherCard from "@/components/WeatherCard"
import ForecastCard from "@/components/ForecastCard"
import type { components } from "@/lib/api/schema"

type Weather = components["schemas"]["Weather"]
type DailyForecast = components["schemas"]["DailyForecast"]

function todayFromCurrent(w: Weather): DailyForecast {
  return {
    date: w.timestamp,
    temp_day: w.temperature,
    temp_night: w.temperature,
    condition: w.condition,
    wind_speed: w.wind_speed,
    humidity: w.humidity,
    rain_probability: 0,
  }
}

export default function WeatherPage() {
  const router = useRouter()
  const [city, setCity] = useState("London")
  const [input, setInput] = useState("London")
  const [current, setCurrent] = useState<Weather | null>(null)
  const [forecast, setForecast] = useState<DailyForecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchWeather = useCallback(async (c: string) => {
    setLoading(true)
    setError("")
    try {
      const [curRes, foreRes] = await Promise.all([
        authFetch(client => client.GET("/api/weather/current",  { params: { query: { city: c } } })),
        authFetch(client => client.GET("/api/weather/forecast", { params: { query: { city: c } } })),
      ])

      if (curRes.error)  throw new Error((curRes.error  as { detail?: string }).detail ?? "Failed to fetch weather")
      if (foreRes.error) throw new Error((foreRes.error as { detail?: string }).detail ?? "Failed to fetch forecast")

      const cur  = curRes.data  ?? null
      const fore = foreRes.data ?? null

      setCurrent(cur)

      const forecastDays = fore?.forecast ?? []
      const todayEntry   = cur ? todayFromCurrent(cur) : null

      if (todayEntry) {
        const today = new Date().toDateString()
        const firstIsSameDay = forecastDays[0]?.date
          ? new Date(forecastDays[0].date as string).toDateString() === today
          : false
        setForecast(firstIsSameDay
          ? [todayEntry, ...forecastDays.slice(1)]
          : [todayEntry, ...forecastDays])
      } else {
        setForecast(forecastDays)
      }
    } catch (err) {
      if (err instanceof Error && err.message === "session_expired") { router.push("/login"); return }
      setError(err instanceof Error ? err.message : "Failed to fetch weather")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchWeather(city) }, [city, fetchWeather])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && trimmed !== city) setCity(trimmed)
    else if (trimmed === city) fetchWeather(trimmed)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted)" }} />
          <input
            type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Search city…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm transition-all outline-none"
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
            onFocus={e => (e.target.style.borderColor = "var(--accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "var(--accent)", color: "white", boxShadow: "0 2px 12px var(--accent-shadow)" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

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

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-52" />
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-48 w-36 shrink-0" />
            ))}
          </div>
        </div>
      )}

      {/* Current weather */}
      {!loading && current && <WeatherCard {...current} />}

      {/* Forecast strip */}
      {!loading && forecast.length > 0 && (
        <div className="animate-fade-up stagger-2">
          <p className="text-xs font-semibold mb-3 tracking-wide uppercase" style={{ color: "var(--muted)", letterSpacing: "0.06em" }}>
            Forecast
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {forecast.map((day, i) => <ForecastCard key={i} {...day} />)}
          </div>
        </div>
      )}
    </div>
  )
}
