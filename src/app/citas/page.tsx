'use client'

import { useState } from 'react'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import AppointmentList from '@/components/appointments/AppointmentList'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'today', label: 'Hoy' },
  { key: 'upcoming', label: 'Mañana' },
  { key: 'all', label: 'Todas' },
] as const

type TabKey = typeof TABS[number]['key']

export default function CitasPage() {
  const [tab, setTab] = useState<TabKey>('today')

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión de agenda y confirmaciones</p>
      </div>

      <div className="mb-6">
        <AppointmentForm />
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <AppointmentList filter={tab} />
    </div>
  )
}
