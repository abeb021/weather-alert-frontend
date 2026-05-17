import type { components } from "@/lib/api/schema"

type Props = components["schemas"]["Weather"]

export default function WeatherCard({ city, temperature, feels_like, condition, wind_speed, humidity, timestamp }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{city}</h2>
          <p className="text-gray-400 text-sm">{condition}</p>
        </div>
        <span className="text-5xl font-light text-white">{temperature?.toFixed(1)}°C</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400">Feels like</p>
          <p className="text-white font-medium">{feels_like?.toFixed(1)}°C</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400">Wind</p>
          <p className="text-white font-medium">{wind_speed} m/s</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400">Humidity</p>
          <p className="text-white font-medium">{humidity}%</p>
        </div>
      </div>
      {timestamp && (
        <p className="text-gray-600 text-xs mt-4">
          Updated {new Date(timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
