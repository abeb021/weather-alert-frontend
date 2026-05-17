import { Thermometer, Wind, CloudRain, Snowflake, Trash2, ChevronRight } from "lucide-react"
import type { components } from "@/lib/api/schema"

type Alert = components["schemas"]["Alert"]

const CONDITION_META: Record<string, { label: string; icon: React.ElementType; accent: string; bg: string }> = {
  temp_above: { label: "Temp above",  icon: Thermometer, accent: "#f97316", bg: "rgba(249,115,22,0.08)" },
  temp_below: { label: "Temp below",  icon: Thermometer, accent: "#38bdf8", bg: "rgba(56,189,248,0.08)" },
  wind_above: { label: "Wind above",  icon: Wind,        accent: "#22d3ee", bg: "rgba(34,211,238,0.08)" },
  rain:       { label: "Rain",        icon: CloudRain,   accent: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  snow:       { label: "Snow",        icon: Snowflake,   accent: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
}

const NO_THRESHOLD = new Set(["rain", "snow"])

export default function AlertRow({ alert, onDelete }: { alert: Alert; onDelete: () => void }) {
  const meta = CONDITION_META[alert.condition_type ?? ""] ?? {
    label: alert.condition_type, icon: Thermometer, accent: "var(--muted)", bg: "var(--background)",
  }
  const Icon = meta.icon

  return (
    <div
      className="group flex items-center gap-4 rounded-2xl border px-4 py-3.5 cursor-pointer transition-all"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = meta.accent + "40" }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)" }}
    >
      {/* Condition icon */}
      <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: meta.bg }}>
        <Icon className="h-4 w-4" style={{ color: meta.accent }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{alert.city}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={alert.active
              ? { background: "rgba(34,197,94,0.1)", color: "#22c55e" }
              : { background: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {alert.active ? "● active" : "paused"}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
          {meta.label}
          {!NO_THRESHOLD.has(alert.condition_type ?? "") && alert.threshold != null && (
            <span className="font-mono ml-1" style={{ color: meta.accent }}>{alert.threshold}</span>
          )}
          <span className="mx-1.5 opacity-40">·</span>
          {alert.email}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          style={{ color: "var(--muted)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444" }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--muted)" }} />
      </div>
    </div>
  )
}
