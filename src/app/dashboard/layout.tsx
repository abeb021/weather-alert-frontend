"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

const NAV = [
  { href: "/dashboard/weather", label: "Weather" },
  { href: "/dashboard/alerts",  label: "Alerts" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white font-semibold text-sm">Weather Alert</span>
            <div className="flex gap-1">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    pathname.startsWith(item.href)
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
