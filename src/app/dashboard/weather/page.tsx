"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authFetch } from "@/lib/auth"
import WeatherCard from "@/components/WeatherCard"
import ForecastCard from "@/components/ForecastCard"
import type { components } from "@/lib/api/schema"

type Weather = components["schemas"]["Weather"]

export default function WeatherPage() {
  const router = useRouter()
  const [city, setCity] = useState("London")
  const [input, setInput] = useState("London")
  const [current, setCurrent] = useState<Weather | null>(null)
  const [forecast, setForecast] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchWeather = useCallback(async (c: string) => {
    setLoading(true)
    setError("")
    try {
      const [cur, fore] = await Promise.all([
        authFetch(client => client.GET("/api/weather/current", { params: { query: { city: c } } })),
        authFetch(client => client.GET("/api/weather/forecast", { params: { query: { city: c } } })),
      ])
      if (cur.error) throw new Error((cur.error as { detail?: string }).detail ?? "Failed to fetch weather")
      if (fore.error) throw new Error((fore.error as { detail?: string }).detail ?? "Failed to fetch forecast")
      setCurrent(cur.data ?? null)
      setForecast(fore.data ?? null)
    } catch (err) {
      if (err instanceof Error && err.message === "session_expired") {
        router.push("/login")
        return
      }
      setError(err instanceof Error ? err.message : "Failed to fetch weather")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchWeather(city) }, [city, fetchWeather])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) setCity(input.trim())
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter city…"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-40 bg-gray-800 rounded-xl" />
          <div className="flex gap-3 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-40 w-36 shrink-0 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {!loading && current && <WeatherCard {...current} />}

      {!loading && forecast?.forecast && forecast.forecast.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-sm mb-3">5-day forecast</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {forecast.forecast.map((day, i) => (
              <ForecastCard key={i} {...day} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
