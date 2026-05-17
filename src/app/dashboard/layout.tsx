"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { CloudRain, Bell, Sun, Moon, LogOut } from "lucide-react"
import { getAccessToken, logout } from "@/lib/auth"

const NAV = [
  { href: "/dashboard/weather", label: "Weather", icon: CloudRain },
  { href: "/dashboard/alerts",  label: "Alerts",  icon: Bell },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg transition-all"
      style={{ color: "var(--muted)" }}
      aria-label="Toggle theme"
      onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 block dark:hidden" />
    </button>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!getAccessToken()) router.replace("/login")
  }, [router])

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Top nav */}
      <nav className="glass sticky top-0 z-50 border-b" style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--background) 80%, transparent)",
      }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <Link href="/dashboard/weather" className="flex items-center gap-2 select-none">
              <span className="text-lg">⛅</span>
              <span className="text-sm font-semibold tracking-tight hidden sm:block" style={{ color: "var(--foreground)", letterSpacing: "-0.02em" }}>
                WeatherAlert
              </span>
            </Link>

            {/* Divider */}
            <div className="w-px h-4" style={{ background: "var(--border)" }} />

            {/* Nav items */}
            <div className="flex items-center gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={active
                      ? { background: "var(--accent)", color: "#fff", boxShadow: "0 2px 8px rgba(14,165,233,0.3)" }
                      : { color: "var(--muted)" }
                    }
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--foreground)" }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all"
              style={{ color: "var(--muted)" }}
              title="Sign out"
              onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-7 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
