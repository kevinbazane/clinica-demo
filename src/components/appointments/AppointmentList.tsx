'use client'

import { useDemo } from '@/context/DemoContext'
import AppointmentCard from './AppointmentCard'
import { isToday, isTomorrow } from '@/lib/utils'
import { CalendarX } from 'lucide-react'

type Filter = 'today' | 'upcoming' | 'all'

interface Props {
  filter?: Filter
}

export default function AppointmentList({ filter = 'all' }: Props) {
  const { appointments } = useDemo()

  const filtered = appointments.filter((a) => {
    if (filter === 'today') return isToday(a.datetime)
    if (filter === 'upcoming') return isTomorrow(a.datetime)
    return true
  })

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <CalendarX className="w-10 h-10 mb-3" />
        <p className="text-sm font-medium">No hay citas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((apt) => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  )
}
