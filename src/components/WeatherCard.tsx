import { Wind, Droplets, Thermometer, Clock } from "lucide-react"
import type { components } from "@/lib/api/schema"

type Props = components["schemas"]["Weather"]

function conditionEmoji(condition: string | undefined) {
  switch (condition?.toLowerCase()) {
    case "clear":        return "☀️"
    case "clouds":       return "☁️"
    case "rain":         return "🌧️"
    case "drizzle":      return "🌦️"
    case "thunderstorm": return "⛈️"
    case "snow":         return "❄️"
    case "mist":
    case "fog":
    case "haze":         return "🌫️"
    default:             return "🌡️"
  }
}

function conditionGradient(condition: string | undefined, temp: number | undefined) {
  const c = condition?.toLowerCase() ?? ""
  if (c === "clear")                          return "from-amber-500/10 via-transparent to-transparent"
  if (c === "rain" || c === "drizzle")        return "from-blue-500/10 via-transparent to-transparent"
  if (c === "thunderstorm")                   return "from-purple-500/10 via-transparent to-transparent"
  if (c === "snow")                           return "from-indigo-300/10 via-transparent to-transparent"
  if ((temp ?? 0) > 25)                       return "from-orange-500/8 via-transparent to-transparent"
  if ((temp ?? 0) < 5)                        return "from-cyan-400/8 via-transparent to-transparent"
  return "from-sky-500/8 via-transparent to-transparent"
}

export default function WeatherCard({ city, temperature, feels_like, condition, wind_speed, humidity, timestamp }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border animate-fade-up`}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Gradient tint based on condition */}
      <div className={`absolute inset-0 bg-gradient-to-br ${conditionGradient(condition, temperature)} pointer-events-none`} />

      {/* Watermark temperature */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none font-mono font-bold"
        style={{ fontSize: "clamp(6rem, 20vw, 11rem)", opacity: 0.035, color: "var(--foreground)", right: "-1rem" }}
      >
        {temperature?.toFixed(0)}°
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{conditionEmoji(condition)}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                background: "var(--background)",
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }}>
                {condition ?? "—"}
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }}>
              {city}
            </h2>
          </div>
          {/* Actual temperature — right side, large */}
          <div className="text-right">
            <span className="font-mono font-light" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--foreground)", letterSpacing: "-0.04em" }}>
              {temperature?.toFixed(1)}<span style={{ color: "var(--muted)" }}>°C</span>
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Thermometer, label: "Feels like", value: `${feels_like?.toFixed(1)}°C` },
            { icon: Wind,        label: "Wind",       value: `${wind_speed} m/s` },
            { icon: Droplets,    label: "Humidity",   value: `${humidity}%` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="h-3 w-3" style={{ color: "var(--accent)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
              </div>
              <p className="font-mono font-semibold text-sm" style={{ color: "var(--foreground)" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div className="flex items-center gap-1.5 mt-4">
            <Clock className="h-3 w-3" style={{ color: "var(--muted)", opacity: 0.5 }} />
            <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.6 }}>
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
