export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden" style={{ background: "#06101e" }}>
      {/* Atmospheric mesh gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ animation: "mesh-drift 18s ease-in-out infinite" }}>
        <div className="absolute" style={{
          top: "-20%", left: "-10%", width: "60%", height: "60%",
          background: "radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)",
        }} />
        <div className="absolute" style={{
          top: "40%", right: "-15%", width: "55%", height: "55%",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.10) 0%, transparent 70%)",
        }} />
        <div className="absolute" style={{
          bottom: "-10%", left: "20%", width: "50%", height: "50%",
          background: "radial-gradient(ellipse, rgba(2,132,199,0.12) 0%, transparent 70%)",
        }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(148,210,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,210,255,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[380px] animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(56,189,248,0.1))",
            border: "1px solid rgba(56,189,248,0.2)",
          }}>
            <span className="text-2xl">⛅</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#e8f0f8", letterSpacing: "-0.02em" }}>
            Weather Alert Service
          </h1>
          <p className="text-sm mt-1" style={{ color: "#4a6580" }}>
            Real-time weather monitoring
          </p>
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl p-7" style={{
          background: "rgba(15, 28, 46, 0.7)",
          border: "1px solid rgba(56, 189, 248, 0.12)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
