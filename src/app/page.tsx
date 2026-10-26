'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { LifeBuoy, Laptop, ShieldCheck, CheckCircle2, Zap, ArrowRight, X, Terminal } from 'lucide-react'

export default function LandingPage() {
  const [showBox, setShowBox] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)

  const handleToggleFeatures = () => {
    setShowBox(!showBox)
    if (!showBox) {
      setTimeout(() => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

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
            <p className="text-xs text-slate-400">Sistema B2B de Soporte & QA Testing</p>
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-6xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Solución SaaS Full-Stack con QA & API Testing Integrado
        </div>

        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl">
          Gestión de Soporte, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Inventario TI & QA</span> en Tiempo Real
        </h2>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
          Plataforma unificada para la atención de incidencias, control de hardware y validación robusta de endpoints REST con pruebas automatizadas en Postman.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-xl shadow-xl shadow-blue-600/30 transition"
          >
            Probar Plataforma Ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {/* Botón interactivo que alterna la visibilidad del recuadro */}
          <button
            type="button"
            onClick={handleToggleFeatures}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold rounded-xl transition text-slate-300 cursor-pointer flex items-center justify-center gap-2"
          >
            {showBox ? 'Ocultar Características' : 'Conocer Características & QA'}
          </button>
        </div>

        {/* Recuadro interactivo desplegable con 4 columnas */}
        {showBox && (
          <div className="w-full bg-slate-800/90 border border-blue-500/40 p-6 sm:p-8 rounded-2xl shadow-2xl transition-all duration-300 space-y-6 text-left my-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">Arquitectura y Módulos del Sistema</h3>
                  <p className="text-xs text-slate-400">Panel técnico de capacidades Full-Stack y QA</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBox(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition"
                aria-label="Cerrar recuadro"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-700/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <LifeBuoy className="w-4 h-4" /> Mesa de Ayuda
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Creación, priorización de tickets y seguimiento en tiempo real con asignación técnica.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                  <Laptop className="w-4 h-4" /> Inventario TI
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Control exhaustivo de activos institucionales, números de serie y estados de equipos.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Seguridad RLS
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Autenticación robusta basada en roles con Supabase Auth y PostgreSQL seguro.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Terminal className="w-4 h-4" /> QA & API Testing
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Suite de pruebas Postman integrada en el repositorio (`/postman`) para endpoints REST.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid principal abajo (4 tarjetas) */}
        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 text-left w-full scroll-mt-28">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20 mb-3">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-200">Mesa de Ayuda</h3>
              <p className="text-slate-400 text-sm mt-2">
                Creación, priorización y seguimiento de incidencias con actualización de estados en tiempo real.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Módulo Operativo
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit border border-purple-500/20 mb-3">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-200">Inventario TI</h3>
              <p className="text-slate-400 text-sm mt-2">
                Control exhaustivo de activos institucionales, números de serie y categorías de hardware.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-purple-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Control de Activos
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-200">Seguridad & RLS</h3>
              <p className="text-slate-400 text-sm mt-2">
                Autenticación robusta y control de acceso basado en roles con Supabase Auth y PostgreSQL.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Protección de Datos
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit border border-amber-500/20 mb-3">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-200">QA & API Testing</h3>
              <p className="text-slate-400 text-sm mt-2">
                Colección Postman integrada en GitHub para pruebas y validación de endpoints RESTful.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Endpoints Validados
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-6 text-center text-xs text-slate-500">
        <p>© 2026 IT HelpDesk SaaS. Desarrollado como portafolio profesional Full-Stack & QA.</p>
      </footer>
    </div>
  )
}