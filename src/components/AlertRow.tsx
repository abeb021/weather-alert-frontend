import type { components } from "@/lib/api/schema"

type Alert = components["schemas"]["Alert"]
type Props = { alert: Alert; onDelete: () => void }

const CONDITION_LABELS: Record<string, string> = {
  temp_above: "Temp above",
  temp_below: "Temp below",
  wind_above: "Wind above",
  rain: "Rain",
  snow: "Snow",
}

const NO_THRESHOLD = new Set(["rain", "snow"])

export default function AlertRow({ alert, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{alert.city}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${alert.active ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
            {alert.active ? "active" : "paused"}
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {CONDITION_LABELS[alert.condition_type ?? ""] ?? alert.condition_type}
          {alert.condition_type && !NO_THRESHOLD.has(alert.condition_type) && alert.threshold != null
            ? ` ${alert.threshold}`
            : ""}
        </span>
        <span className="text-gray-600 text-xs truncate">{alert.email}</span>
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 text-gray-500 hover:text-red-400 transition-colors text-sm"
      >
        Delete
      </button>
    </div>
  )
}
