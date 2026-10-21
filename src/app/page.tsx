import Link from 'next/link'
import { LifeBuoy, Laptop, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">IT HelpDesk</h1>
            <p className="text-xs text-slate-400">Sistema B2B de Soporte & Inventario</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            Acceder al Sistema
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Solución SaaS B2B de Nueva Generación para TI
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
          Gestión de Soporte Técnico e <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Inventario TI</span> en Tiempo Real
        </h2>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
          Optimiza la atención de incidencias, controla el hardware institucional y escala la eficiencia de tu departamento tecnológico desde una plataforma unificada.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-xl shadow-xl shadow-blue-600/30 transition"
          >
            Probar Plataforma Ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold rounded-xl transition text-slate-300"
          >
            Conocer Características
          </a>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 text-left w-full">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-200">Mesa de Ayuda (HelpDesk)</h3>
            <p className="text-slate-400 text-sm">
              Creación, priorización y seguimiento de tickets con actualización de estados en tiempo real y métricas claras.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit border border-purple-500/20">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-200">Inventario de Hardware</h3>
            <p className="text-slate-400 text-sm">
              Control exhaustivo de activos institucionales, números de serie, categorías y estados de asignación de equipos.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-200">Seguridad & RLS</h3>
            <p className="text-slate-400 text-sm">
              Autenticación robusta y control de acceso basado en roles con Supabase Auth y PostgreSQL seguro.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-6 text-center text-xs text-slate-500">
        <p>© 2026 IT HelpDesk SaaS. Desarrollado como portafolio profesional Full-Stack.</p>
      </footer>
    </div>
  )
}