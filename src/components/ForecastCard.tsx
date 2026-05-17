import { Wind, Droplets, CloudRain } from "lucide-react"
import type { components } from "@/lib/api/schema"

type Props = components["schemas"]["DailyForecast"]

function conditionEmoji(condition: string | undefined) {
  switch (condition?.toLowerCase()) {
    case "clear":        return "☀️"
    case "clouds":       return "☁️"
    case "rain":         return "🌧️"
    case "drizzle":      return "🌦️"
    case "thunderstorm": return "⛈️"
    case "snow":         return "❄️"
    case "mist":
    case "fog":          return "🌫️"
    default:             return "🌡️"
  }
}

function dayLabel(dateStr: string | undefined) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return "Today"
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow"
  return d.toLocaleDateString("en", { weekday: "short", day: "numeric" })
}

export default function ForecastCard({ date, temp_day, temp_night, condition, wind_speed, humidity, rain_probability }: Props) {
  const isToday = date ? new Date(date as string).toDateString() === new Date().toDateString() : false

  return (
    <div
      className="rounded-2xl flex flex-col gap-3.5 min-w-[136px] shrink-0 p-4 transition-all"
      style={{
        background: isToday ? "var(--accent)" : "var(--surface)",
        border: `1px solid ${isToday ? "transparent" : "var(--border)"}`,
        boxShadow: isToday ? "0 4px 20px rgba(14,165,233,0.25)" : "none",
      }}
    >
      {/* Day label */}
      <p className="text-xs font-semibold tracking-wide uppercase" style={{
        color: isToday ? "rgba(255,255,255,0.8)" : "var(--muted)",
        letterSpacing: "0.05em",
      }}>
        {dayLabel(date as string)}
      </p>

      {/* Emoji */}
      <span className="text-2xl leading-none">{conditionEmoji(condition)}</span>

      {/* Temps */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xl font-semibold leading-none" style={{ color: isToday ? "#fff" : "var(--foreground)" }}>
          {temp_day?.toFixed(0)}°
        </span>
        <span className="font-mono text-sm" style={{ color: isToday ? "rgba(255,255,255,0.55)" : "var(--muted)" }}>
          {temp_night?.toFixed(0)}°
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1">
        {[
          { icon: Wind, value: `${wind_speed} m/s` },
          { icon: Droplets, value: `${humidity}%` },
          ...(rain_probability != null && rain_probability > 0
            ? [{ icon: CloudRain, value: `${(rain_probability * 100).toFixed(0)}%` }]
            : []),
        ].map(({ icon: Icon, value }, i) => (
          <span key={i} className="flex items-center gap-1 text-xs" style={{
            color: isToday ? "rgba(255,255,255,0.6)" : "var(--muted)",
          }}>
            <Icon className="h-3 w-3" />
            {value}
          </span>
        ))}
      </div>
    </div>
  )
}
