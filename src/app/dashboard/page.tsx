'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LifeBuoy, 
  Ticket, 
  Laptop, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Send,
  Trash2,
  Filter,
  Database
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<any[]>([])
  const [equipmentCount, setEquipmentCount] = useState<number>(0)

  // Filtros de QA y Soporte
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Estado del Modal de Tickets
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [category, setCategory] = useState('Hardware')
  const [submitting, setSubmitting] = useState('')

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    // Obtener Perfil (Relacionado con auth.users)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) setProfile(profileData)

    fetchTickets()
    fetchEquipmentCount()
    setLoading(false)
  }

  const fetchTickets = async () => {
    let query = supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter)
    }

    const { data, error } = await query

    if (!error && data) {
      setTickets(data)
    }
  }

  // Recargar tickets al cambiar los filtros de la interfaz
  useEffect(() => {
    if (!loading) {
      fetchTickets()
    }
  }, [statusFilter, categoryFilter])

  const fetchEquipmentCount = async () => {
    const { count, error } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })

    if (!error && count !== null) {
      setEquipmentCount(count)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('Guardando ticket...')

    try {
      const { error } = await supabase.from('tickets').insert([
        {
          title,
          description,
          priority,
          category,
          status: 'open',
          client_id: user.id
        }
      ])

      if (error) throw error

      setTitle('')
      setDescription('')
      setIsModalOpen(false)
      fetchTickets()
    } catch (err: any) {
      alert('Error al crear ticket: ' + err.message)
    } finally {
      setSubmitting('')
    }
  }

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId)

      if (error) throw error
      fetchTickets()
    } catch (err: any) {
      alert('Error al actualizar estado: ' + err.message)
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este ticket?')) return

    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)

      if (error) throw error
      fetchTickets()
    } catch (err: any) {
      alert('Error al eliminar ticket: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Contadores para métricas generales
  const pendingCount = tickets.filter(t => t.status === 'open').length
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length
  const resolvedCount = tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Cargando panel de control y base de datos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">IT HelpDesk & QA Dashboard</h1>
            <p className="text-xs text-slate-400">Gestión de Soporte, Activos y Consultas SQL</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{profile?.full_name || user?.email}</p>
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {profile?.role || 'Soporte / QA'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold">Panel Técnico, {profile?.full_name?.split(' ')[0] || 'Ingeniero'} 🚀</h2>
            <p className="text-slate-400 text-sm mt-1">
              Monitoreo activo de tickets, control de equipos y validación de estados de base de datos.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nuevo Ticket de Soporte
          </button>
        </div>

        {/* Métricas / KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Tickets Pendientes</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-400">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">En Proceso</p>
              <h3 className="text-2xl font-bold mt-1 text-blue-400">{inProgressCount}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Resueltos / Cerrados</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400">{resolvedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Tarjeta Clickeable para Inventario */}
          <div 
            onClick={() => router.push('/inventory')}
            className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-500/60 hover:bg-slate-800 transition group"
            title="Ir a Inventario de Equipos"
          >
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium group-hover:text-purple-300 transition">Activos de Hardware</p>
              <h3 className="text-2xl font-bold mt-1 text-purple-400">{equipmentCount}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 group-hover:bg-purple-500/20 transition">
              <Laptop className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Sección de Filtros Estilo QA & SQL */}
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Filtros de Base de Datos:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">📂 Todos los estados</option>
              <option value="open">Pendiente (Open)</option>
              <option value="in_progress">En Proceso</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">🏷️ Todas las categorías</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Redes / Wi-Fi">Redes / Wi-Fi</option>
              <option value="Cuentas / Accesos">Cuentas / Accesos</option>
            </select>
          </div>
        </div>

        {/* Tabla Interactiva de Tickets */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-400" />
              Solicitudes e Incidencias en Vivo ({tickets.length})
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-700">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Tabla: tickets
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-900/40">
              <p className="text-slate-400 text-sm">No se encontraron registros con los filtros seleccionados.</p>
              <p className="text-xs text-slate-500 mt-1">Intenta restablecer los filtros o crea una nueva solicitud.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                    <th className="py-3 px-4">Asunto / ID</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Prioridad</th>
                    <th className="py-3 px-4">Estado (SQL Update)</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{t.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                        <span className="text-[10px] text-slate-500 font-mono">UUID: {t.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 text-xs">{t.category || 'General'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[11px] rounded-full font-semibold uppercase ${
                          t.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          t.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="open">Pendiente</option>
                          <option value="in_progress">En Proceso</option>
                          <option value="resolved">Resuelto</option>
                          <option value="closed">Cerrado</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteTicket(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Eliminar registro de la base de datos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Modal para Crear Ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Crear Ticket de Soporte</h3>
            <p className="text-xs text-slate-400 mb-6">Inserta un nuevo registro relacional en la tabla de tickets de Supabase.</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Asunto / Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Error de conexión en VPN"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Redes / Wi-Fi">Redes / Wi-Fi</option>
                    <option value="Cuentas / Accesos">Cuentas / Accesos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Descripción Detallada</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe detalladamente la falla para el análisis de QA y soporte..."
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!!submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting || 'Guardar en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}