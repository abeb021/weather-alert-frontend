export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Weather Alert Service</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor weather conditions for your cities</p>
      </div>
      <div className="w-full max-w-sm bg-gray-900 rounded-xl border border-gray-800 p-8">
        {children}
      </div>
    </div>
  )
}
