'use client'

import { useState } from 'react'
import { useDemo } from '@/context/DemoContext'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import AppointmentList from '@/components/appointments/AppointmentList'
import CalendarView from '@/components/appointments/CalendarView'
import { cn } from '@/lib/utils'
import { List, CalendarDays } from 'lucide-react'

const TABS = [
  { key: 'today',    label: 'Hoy' },
  { key: 'upcoming', label: 'Mañana' },
  { key: 'all',      label: 'Todas' },
] as const

type TabKey = typeof TABS[number]['key']
type ViewMode = 'list' | 'calendar'

export default function CitasPage() {
  const [tab, setTab] = useState<TabKey>('today')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { appointments } = useDemo()

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión de agenda y confirmaciones</p>
      </div>

      <div className="mb-6">
        <AppointmentForm />
      </div>

      {/* View mode toggle + list tabs */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        {viewMode === 'list' && (
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
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
        )}

        {viewMode === 'calendar' && <div />}

        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lista</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calendario</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <AppointmentList filter={tab} />
      ) : (
        <CalendarView appointments={appointments} />
      )}
    </div>
  )
}
