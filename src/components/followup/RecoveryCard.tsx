'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserCheck, CheckCircle2 } from 'lucide-react'
import { buildRecoveryMessage, formatDate } from '@/lib/utils'
import WhatsAppModal from '@/components/appointments/WhatsAppModal'
import type { Patient } from '@/types'

interface Props {
  patient: Patient
  daysSinceLastVisit: number
  lastTreatment: string
  lastDatetime: string
}

export default function RecoveryCard({ patient, daysSinceLastVisit, lastTreatment, lastDatetime }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const message = buildRecoveryMessage(patient.full_name)

  function handleSend() {
    setSent(true)
    setModalOpen(true)
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">{patient.full_name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-sm text-gray-500">
              <span>Últ. tratamiento: {lastTreatment}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs">{formatDate(lastDatetime)}</span>
            </div>
            <span className="inline-flex items-center mt-2 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              Inactivo hace {daysSinceLastVisit} días
            </span>
          </div>

          {sent ? (
            <span className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Invitación enviada
            </span>
          ) : (
            <Button
              size="sm"
              onClick={handleSend}
              className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Invitar de vuelta
            </Button>
          )}
        </div>
      </div>

      <WhatsAppModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patientName={patient.full_name}
        patientPhone={patient.phone}
        message={message}
      />
    </>
  )
}
