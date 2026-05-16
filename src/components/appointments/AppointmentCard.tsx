'use client'

import { useState } from 'react'
import { Bell, CheckCircle, UserX, MessageCircle, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import WhatsAppModal from './WhatsAppModal'
import { formatTime, buildReminderMessage } from '@/lib/utils'
import { useDemo } from '@/context/DemoContext'
import type { AppointmentWithPatient } from '@/data/demo-data'

interface Props {
  appointment: AppointmentWithPatient
}

export default function AppointmentCard({ appointment: apt }: Props) {
  const { updateAppointment } = useDemo()
  const [loading, setLoading] = useState<string | null>(null)
  const [whatsAppOpen, setWhatsAppOpen] = useState(false)

  function handleReminder() {
    setLoading('reminder')
    updateAppointment(apt.id, { reminder_pending: false, reminder_ready: true })
    setWhatsAppOpen(true)
    setLoading(null)
  }

  function handleConfirm() {
    setLoading('confirm')
    updateAppointment(apt.id, { status: 'confirmed' })
    setLoading(null)
  }

  function handleComplete() {
    setLoading('complete')
    updateAppointment(apt.id, { status: 'completed' })
    setLoading(null)
  }

  function handleNoShow() {
    setLoading('noshow')
    updateAppointment(apt.id, { no_show: true, status: 'cancelled' })
    setLoading(null)
  }

  const isActive = apt.status !== 'cancelled' && apt.status !== 'completed'
  const reminderMessage = buildReminderMessage(apt.patients.full_name, apt.datetime)

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-900 truncate">
                {apt.patients.full_name}
              </span>
              {apt.reminder_pending && (
                <span title="Recordatorio pendiente">
                  <Bell className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm font-mono text-blue-700 font-semibold">
                {formatTime(apt.datetime)}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-600">{apt.treatment}</span>
            </div>
          </div>
          <StatusBadge status={apt.status} noShow={apt.no_show} />
        </div>

        {isActive && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {apt.reminder_pending && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReminder}
                disabled={loading !== null}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                {loading === 'reminder' ? 'Enviando...' : 'Enviar Recordatorio'}
              </Button>
            )}
            {apt.status === 'scheduled' && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={loading !== null}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                {loading === 'confirm' ? 'Confirmando...' : 'Confirmar Cita'}
              </Button>
            )}
            {apt.status === 'confirmed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleComplete}
                disabled={loading !== null}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />
                {loading === 'complete' ? 'Guardando...' : 'Atención completada'}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleNoShow}
              disabled={loading !== null}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <UserX className="w-3.5 h-3.5 mr-1.5" />
              {loading === 'noshow' ? 'Marcando...' : 'No Asistió'}
            </Button>
          </div>
        )}
      </div>

      <WhatsAppModal
        isOpen={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        patientName={apt.patients.full_name}
        patientPhone={apt.patients.phone}
        message={reminderMessage}
      />
    </>
  )
}
