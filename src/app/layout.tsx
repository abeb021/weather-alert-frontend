import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Weather Alert Service",
  description: "Monitor weather conditions and receive email alerts",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
