'use client'

import { useDemo } from '@/context/DemoContext'
import AppointmentCard from '@/components/appointments/AppointmentCard'
import { isToday } from '@/lib/utils'

export default function TodayAppointments() {
  const { appointments } = useDemo()

  const todays = appointments.filter((a) => isToday(a.datetime))

  if (todays.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">No hay citas programadas para hoy</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todays.map((apt) => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  )
}
