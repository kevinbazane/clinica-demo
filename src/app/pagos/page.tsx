'use client'

import { useState, useMemo } from 'react'
import { useDemo } from '@/context/DemoContext'
import { cn } from '@/lib/utils'
import { CreditCard, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import PaymentCard from '@/components/payments/PaymentCard'

const TABS = [
  { key: 'pending',  label: 'Pendientes' },
  { key: 'paid',     label: 'Cobrados' },
  { key: 'all',      label: 'Todos' },
] as const
type TabKey = typeof TABS[number]['key']

export default function PagosPage() {
  const [tab, setTab] = useState<TabKey>('pending')
  const { appointments, totalRevenue, pendingRevenue } = useDemo()

  const completedApts = useMemo(
    () => appointments.filter((a) => a.status === 'completed' || a.paid),
    [appointments]
  )

  const filtered = useMemo(() => {
    if (tab === 'pending') return completedApts.filter((a) => !a.paid)
    if (tab === 'paid') return completedApts.filter((a) => a.paid)
    return completedApts
  }, [completedApts, tab])

  const pendingCount = completedApts.filter((a) => !a.paid).length

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Control de Pagos</h1>
        <p className="text-sm text-gray-500 mt-1">Seguimiento de cobros por atenciones realizadas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">S/ {totalRevenue.toFixed(0)}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">Total cobrado</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">S/ {pendingRevenue.toFixed(0)}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">Por cobrar</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{completedApts.length}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">Atenciones registradas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map(({ key, label }) => {
          const count = key === 'pending' ? pendingCount : key === 'paid' ? completedApts.length - pendingCount : completedApts.length
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
              <span className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                key === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mb-3 text-green-400" />
          <p className="text-sm font-medium text-gray-600">¡Todo cobrado!</p>
          <p className="text-xs mt-1">No hay pagos pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.sort((a, b) => b.datetime.localeCompare(a.datetime)).map((apt) => (
            <PaymentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}
    </div>
  )
}
