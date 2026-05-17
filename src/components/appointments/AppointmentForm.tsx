'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useDemo } from '@/context/DemoContext'
import { getTodayString, getNextHourTimeString, formatTime12h, formatDate } from '@/lib/utils'

const TREATMENTS = [
  'Limpieza dental',
  'Extracción',
  'Blanqueamiento',
  'Empaste',
  'Ortodoncia',
  'Revisión general',
  'Endodoncia',
  'Implante',
]

const INPUT_CLASS =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

interface Props {
  onSuccess?: () => void
}

export default function AppointmentForm({ onSuccess }: Props) {
  const { patients, appointments, addAppointment } = useDemo()
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState(getTodayString)
  const [time, setTime] = useState(getNextHourTimeString)
  const [treatment, setTreatment] = useState('')
  const [price, setPrice] = useState('')
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => { selectRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId || !date || !time || !treatment) return

    const datetime = new Date(`${date}T${time}:00`).toISOString()
    const { default: Swal } = await import('sweetalert2')

    const isDuplicate = appointments.some(
      (a) => a.patient_id === patientId && a.datetime === datetime
    )
    if (isDuplicate) {
      await Swal.fire({
        icon: 'error',
        title: 'Cita duplicada',
        text: 'Ya existe una cita para este paciente en esa fecha y hora. Por favor elige otro horario.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
      })
      return
    }

    const patient = patients.find((p) => p.id === patientId)
    addAppointment({ patient_id: patientId, datetime, treatment, price: parseFloat(price) || 0 })
    setPatientId('')
    setTreatment('')
    setPrice('')
    onSuccess?.()

    await Swal.fire({
      icon: 'success',
      title: '¡Cita registrada!',
      html: `<b>${patient?.full_name ?? 'Paciente'}</b><br/><span style="color:#6b7280">${formatDate(datetime)} · ${formatTime12h(datetime)}</span><br/><small style="color:#9ca3af">${treatment}</small>`,
      timer: 3000,
      timerProgressBar: true,
      confirmButtonText: '¡Entendido!',
      confirmButtonColor: '#2563eb',
    })
    selectRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Nueva cita rápida</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <select
          ref={selectRef}
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
          className={`col-span-2 sm:col-span-1 ${INPUT_CLASS}`}
        >
          <option value="">Paciente *</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={INPUT_CLASS}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className={INPUT_CLASS}
        />

        <div className="col-span-2 sm:col-span-1">
          <input
            list="treatments"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Tratamiento *"
            required
            className={`w-full ${INPUT_CLASS}`}
          />
          <datalist id="treatments">
            {TREATMENTS.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>

        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Monto S/"
          className={`col-span-1 ${INPUT_CLASS}`}
        />
      </div>

      <Button type="submit" className="mt-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Agregar cita
      </Button>
    </form>
  )
}
