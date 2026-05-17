'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/context/DemoContext'
import { formatDate, formatTime } from '@/lib/utils'
import { FileText, Phone, Mail, Calendar, Plus, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Patient } from '@/types'

interface Props {
  patient: Patient
  isOpen: boolean
  onClose: () => void
}

const TABS = [
  { key: 'info',    label: 'Información' },
  { key: 'history', label: 'Historial Clínico' },
  { key: 'citas',   label: 'Citas' },
] as const
type TabKey = typeof TABS[number]['key']

export default function PatientDetailModal({ patient, isOpen, onClose }: Props) {
  const { appointments, clinicalRecords, addClinicalRecord } = useDemo()
  const [tab, setTab] = useState<TabKey>('info')
  const [showForm, setShowForm] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')

  const patientApts = appointments
    .filter((a) => a.patient_id === patient.id)
    .sort((a, b) => b.datetime.localeCompare(a.datetime))

  const patientRecords = clinicalRecords
    .filter((r) => r.patient_id === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  function handleAddRecord() {
    if (!diagnosis.trim() || !notes.trim()) return
    addClinicalRecord({
      patient_id: patient.id,
      date: new Date().toISOString(),
      diagnosis: diagnosis.trim(),
      notes: notes.trim(),
    })
    setDiagnosis('')
    setNotes('')
    setShowForm(false)
  }

  const statusLabel: Record<string, string> = {
    scheduled: 'Programada',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  }
  const statusColor: Record<string, string> = {
    scheduled: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelled: 'bg-red-100 text-red-600 border-red-200',
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-sm">
                {patient.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-gray-900">{patient.full_name}</DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">Registrado el {formatDate(patient.created_at)}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 px-5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'px-3 py-2.5 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── Información ── */}
          {tab === 'info' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Teléfono</p>
                  <a href={`tel:+51${patient.phone}`} className="text-sm font-medium text-blue-600">
                    +51 {patient.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700">{patient.email ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Total de citas</p>
                  <p className="text-sm font-medium text-gray-700">{patientApts.length} citas registradas</p>
                </div>
              </div>
              {patient.notes && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium mb-1">Notas</p>
                  <p className="text-sm text-amber-800">{patient.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Historial Clínico ── */}
          {tab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{patientRecords.length} registro{patientRecords.length !== 1 ? 's' : ''}</p>
                <Button size="sm" onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Nueva nota
                </Button>
              </div>

              {showForm && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-800 mb-3">Nueva nota clínica</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Diagnóstico</label>
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Ej: Caries en molar inferior"
                        className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Notas del dentista</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Procedimiento realizado, indicaciones..."
                        rows={3}
                        className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleAddRecord} disabled={!diagnosis.trim() || !notes.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {patientRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FileText className="w-8 h-8 mb-2" />
                  <p className="text-sm">Sin registros clínicos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map((record) => (
                    <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                        <span className="text-xs text-gray-400 shrink-0">{formatDate(record.date)}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{record.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Citas ── */}
          {tab === 'citas' && (
            <div>
              {patientApts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p className="text-sm">Sin citas registradas</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {patientApts.map((apt) => (
                    <div key={apt.id} className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{apt.treatment}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(apt.datetime)} · {formatTime(apt.datetime)}
                          </p>
                        </div>
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', statusColor[apt.no_show ? 'cancelled' : apt.status])}>
                          {apt.no_show ? 'No asistió' : statusLabel[apt.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
