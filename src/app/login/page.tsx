'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LifeBuoy, Lock, Mail, User, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'admin' | 'technician' | 'client'>('client')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      if (isRegistering) {
        // Registro de usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        })

        if (error) throw error

        alert('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
        setIsRegistering(false)
      } else {
        // Iniciar sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Redirigir al Dashboard principal
        router.push('/dashboard')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-8 shadow-2xl">
        {/* Cabecera / Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400 mb-3">
            <LifeBuoy className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">IT HelpDesk Platform</h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRegistering ? 'Crea tu cuenta institucional' : 'Ingresa a tu cuenta'}
          </p>
        </div>

        {/* Mensaje de error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Rol en el Sistema
                </label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-200"
                  >
                    <option value="client">Usuario / Cliente</option>
                    <option value="technician">Técnico de Soporte</option>
                    <option value="admin">Administrador IT</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition duration-200 text-sm disabled:opacity-50 mt-2"
          >
            {loading
              ? 'Procesando...'
              : isRegistering
              ? 'Registrar Cuenta'
              : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Alternar entre login y registro */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta aún?'}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:underline font-semibold"
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  )
}