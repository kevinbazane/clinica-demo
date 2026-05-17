'use client'

import { useDemo } from '@/context/DemoContext'
import StatsCard from '@/components/dashboard/StatsCard'
import TodayAppointments from '@/components/dashboard/TodayAppointments'
import { Calendar, Users, BellRing, HeartHandshake, CreditCard } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPage() {
  const { todayCount, totalPatients, pendingConfirmCount, followupCount, inactiveCount, pendingRevenue } = useDemo()
  const seguimientoTotal = followupCount + inactiveCount

  const dateLabel = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide capitalize mb-1">{dateLabel}</p>
          <h1 className="text-2xl font-bold text-gray-900">{getGreeting()} 👋</h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Sistema activo</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Citas de Hoy"
          value={todayCount}
          icon={<Calendar className="w-5 h-5" />}
          variant="blue"
          subtitle="programadas para hoy"
        />
        <StatsCard
          title="Pacientes"
          value={totalPatients}
          icon={<Users className="w-5 h-5" />}
          variant="purple"
          subtitle="registrados en total"
        />
        <StatsCard
          title="Por Confirmar"
          value={pendingConfirmCount}
          icon={<BellRing className="w-5 h-5" />}
          variant={pendingConfirmCount > 0 ? 'yellow' : 'green'}
          subtitle={pendingConfirmCount === 0 ? '¡Todo confirmado!' : 'pendientes hoy'}
        />
        <StatsCard
          title="Seguimientos"
          value={seguimientoTotal}
          icon={<HeartHandshake className="w-5 h-5" />}
          variant={seguimientoTotal > 0 ? 'orange' : 'green'}
          subtitle={seguimientoTotal === 0 ? '¡Todo al día!' : 'pendientes'}
        />
      </div>

      {/* Payment pending banner */}
      {pendingRevenue > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
          <CreditCard className="w-5 h-5 text-yellow-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-yellow-800">Pagos pendientes de cobro</p>
            <p className="text-xs text-yellow-600 mt-0.5">Tienes S/ {pendingRevenue.toFixed(0)} por cobrar de atenciones completadas</p>
          </div>
          <a href="/pagos" className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 shrink-0">
            Ver pagos →
          </a>
        </div>
      )}

      {/* Today appointments card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            <h2 className="text-sm font-semibold text-gray-800">Agenda de hoy</h2>
          </div>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-medium">
            {todayCount} {todayCount === 1 ? 'cita' : 'citas'}
          </span>
        </div>
        <div className="p-6">
          <TodayAppointments />
        </div>
      </div>

    </div>
  )
}
