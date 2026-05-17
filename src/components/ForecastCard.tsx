import type { components } from "@/lib/api/schema"

type Props = components["schemas"]["DailyForecast"]

export default function ForecastCard({ date, temp_day, temp_night, condition, wind_speed, humidity, rain_probability }: Props) {
  const label = date ? new Date(date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" }) : ""

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2 min-w-[140px]">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white font-medium text-sm">{condition}</p>
      <div className="flex gap-2 text-sm">
        <span className="text-white">{temp_day?.toFixed(0)}°</span>
        <span className="text-gray-500">{temp_night?.toFixed(0)}°</span>
      </div>
      <div className="text-xs text-gray-500 flex flex-col gap-0.5">
        <span>{wind_speed} m/s</span>
        <span>{humidity}% humidity</span>
        {rain_probability != null && rain_probability > 0 && (
          <span className="text-blue-400">{(rain_probability * 100).toFixed(0)}% rain</span>
        )}
      </div>
    </div>
  )
}
