'use client'

import { useState } from 'react'
import { useDemo } from '@/context/DemoContext'
import { formatDate, formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, CreditCard, Banknote, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppointmentWithPatient } from '@/data/demo-data'
import type { PaymentMethod } from '@/types'

interface Props {
  appointment: AppointmentWithPatient
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
}

const METHOD_ICONS: Record<PaymentMethod, React.ElementType> = {
  efectivo: Banknote,
  tarjeta: CreditCard,
  transferencia: Building2,
}

export default function PaymentCard({ appointment: apt }: Props) {
  const { updateAppointment } = useDemo()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('efectivo')
  const [showMethodPicker, setShowMethodPicker] = useState(false)

  function handleMarkPaid() {
    updateAppointment(apt.id, {
      paid: true,
      payment_method: selectedMethod,
      payment_date: new Date().toISOString(),
    })
    setShowMethodPicker(false)
  }

  const MethodIcon = apt.payment_method ? METHOD_ICONS[apt.payment_method] : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 truncate">{apt.patients.full_name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-sm text-gray-500">
            <span>{apt.treatment}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs">{formatDate(apt.datetime)} {formatTime(apt.datetime)}</span>
          </div>
          <p className="text-lg font-bold text-gray-800 mt-2">
            S/ {apt.price.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          {apt.paid ? (
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pagado
              </span>
              {apt.payment_method && MethodIcon && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MethodIcon className="w-3 h-3" />
                  {METHOD_LABELS[apt.payment_method]}
                  {apt.payment_date && <span>· {formatDate(apt.payment_date)}</span>}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full sm:w-auto">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full mb-2">
                <Clock className="w-3.5 h-3.5" />
                Pendiente
              </span>

              {showMethodPicker ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-medium text-gray-600">Método de pago</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['efectivo', 'tarjeta', 'transferencia'] as PaymentMethod[]).map((m) => {
                      const Icon = METHOD_ICONS[m]
                      return (
                        <button
                          key={m}
                          onClick={() => setSelectedMethod(m)}
                          className={cn(
                            'flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors',
                            selectedMethod === m
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          {METHOD_LABELS[m]}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={handleMarkPaid} className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Confirmar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowMethodPicker(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowMethodPicker(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto justify-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Marcar pagado
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
