'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeartHandshake, CheckCircle2 } from 'lucide-react'
import { buildFollowupMessage, buildWhatsAppUrl, formatDate } from '@/lib/utils'
import { useDemo } from '@/context/DemoContext'
import WhatsAppModal from '@/components/appointments/WhatsAppModal'
import type { AppointmentWithPatient } from '@/data/demo-data'

interface Props {
  appointment: AppointmentWithPatient
}

export default function FollowupCard({ appointment: apt }: Props) {
  const { updateAppointment } = useDemo()
  const [modalOpen, setModalOpen] = useState(false)

  const message = buildFollowupMessage(apt.patients.full_name, apt.treatment, apt.datetime)

  function handleSend() {
    setModalOpen(true)
  }

  function handleModalClose() {
    updateAppointment(apt.id, { followup_sent: true })
    setModalOpen(false)
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">{apt.patients.full_name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-sm text-gray-500">
              <span>{apt.treatment}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs">{formatDate(apt.datetime)}</span>
            </div>
          </div>

          {apt.followup_sent ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Seguimiento enviado
            </span>
          ) : (
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto justify-center"
            >
              <HeartHandshake className="w-3.5 h-3.5 mr-1.5" />
              Enviar seguimiento
            </Button>
          )}
        </div>
      </div>

      <WhatsAppModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        patientName={apt.patients.full_name}
        patientPhone={apt.patients.phone}
        message={message}
      />
    </>
  )
}
