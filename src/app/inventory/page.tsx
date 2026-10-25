'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Laptop, 
  Plus, 
  ArrowLeft, 
  Trash2, 
  X, 
  Send,
  Filter,
  Database
} from 'lucide-react'

export default function InventoryPage() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros de Inventario / QA
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Laptop')
  const [serialNumber, setSerialNumber] = useState('')
  const [status, setStatus] = useState('available')
  const [submitting, setSubmitting] = useState('')

  useEffect(() => {
    checkUserAndFetchEquipment()
  }, [])

  const checkUserAndFetchEquipment = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    fetchEquipment()
  }

  const fetchEquipment = async () => {
    let query = supabase
      .from('equipment')
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
      setEquipment(data)
    }
    setLoading(false)
  }

  // Recargar al cambiar filtros
  useEffect(() => {
    if (!loading) {
      fetchEquipment()
    }
  }, [statusFilter, categoryFilter])

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('Guardando...')

    try {
      const { error } = await supabase.from('equipment').insert([
        {
          name,
          category,
          serial_number: serialNumber,
          status,
        }
      ])

      if (error) throw error

      setName('')
      setSerialNumber('')
      setIsModalOpen(false)
      fetchEquipment()
    } catch (err: any) {
      alert('Error al registrar equipo: ' + err.message)
    } finally {
      setSubmitting('')
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este equipo del inventario?')) return

    try {
      const { error } = await supabase.from('equipment').delete().eq('id', id)
      if (error) throw error
      fetchEquipment()
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition cursor-pointer"
            title="Volver al Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Inventario de Equipos TI</h1>
            <p className="text-xs text-slate-400">Control de hardware y activos institucionales</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 font-semibold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Equipo
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Barra de Filtros */}
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Filter className="w-4 h-4 text-purple-400" />
            <span className="font-semibold">Filtros de Activos:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">📂 Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="assigned">Asignado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">🏷️ Todas las categorías</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Monitor">Monitor</option>
              <option value="Periférico">Periférico</option>
              <option value="Servidor / Redes">Servidor / Redes</option>
            </select>
          </div>
        </div>

        {/* Tabla de Activos */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              Activos Registrados en Vivo ({equipment.length})
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-700">
              <Database className="w-3.5 h-3.5 text-purple-400" /> Tabla: equipment
            </span>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm animate-pulse text-center py-8">Cargando inventario desde Supabase...</p>
          ) : equipment.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-900/40">
              <p className="text-slate-400 text-sm">No se encontraron equipos con los filtros seleccionados.</p>
              <p className="text-xs text-slate-500 mt-1">Haz clic en "Registrar Equipo" para agregar hardware nuevo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                    <th className="py-3 px-4">Equipo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Número de Serie / Tag</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{item.name}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{item.serial_number}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          item.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.status === 'assigned' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status === 'available' ? 'Disponible' : item.status === 'assigned' ? 'Asignado' : 'Mantenimiento'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Eliminar equipo"
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

      {/* Modal para Crear Equipo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-1">Registrar Nuevo Equipo</h3>
            <p className="text-xs text-slate-400 mb-6">Inserta un nuevo activo de hardware en la tabla equipment de Supabase.</p>

            <form onSubmit={handleCreateEquipment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nombre del Equipo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Dell Latitude 5420 - IT 01"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Periférico">Periférico</option>
                    <option value="Servidor / Redes">Servidor / Redes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estado Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="assigned">Asignado</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Número de Serie / Tag</label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Ej. SN-99823-IT"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
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
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-xs font-semibold rounded-lg shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
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