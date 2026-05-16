'use client'

import { useState, useMemo } from 'react'
import { useDemo } from '@/context/DemoContext'
import { cn } from '@/lib/utils'
import { HeartHandshake, Users, UserCheck, CheckCircle2 } from 'lucide-react'
import FollowupCard from '@/components/followup/FollowupCard'
import RecoveryCard from '@/components/followup/RecoveryCard'

const INACTIVE_DAYS = 60

const TABS = [
  { key: 'followup',  label: 'Post-Atención',      shortLabel: 'Post-Atención', icon: HeartHandshake },
  { key: 'recovery',  label: 'Recuperar Pacientes', shortLabel: 'Recuperar',     icon: Users },
] as const

type TabKey = typeof TABS[number]['key']

export default function SeguimientoPage() {
  const [tab, setTab] = useState<TabKey>('followup')
  const { appointments, patients } = useDemo()

  const pendingFollowup = appointments.filter(
    (a) => a.status === 'completed' && !a.followup_sent
  )

  const inactivePatients = useMemo(() => {
    const now = Date.now()
    return patients.flatMap((patient) => {
      const lastCompleted = appointments
        .filter((a) => a.patient_id === patient.id && a.status === 'completed')
        .sort((a, b) => b.datetime.localeCompare(a.datetime))[0]
      if (!lastCompleted) return []
      const days = Math.floor((now - new Date(lastCompleted.datetime).getTime()) / 86_400_000)
      if (days < INACTIVE_DAYS) return []
      return [{ patient, days, lastApt: lastCompleted }]
    })
  }, [patients, appointments])

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seguimiento</h1>
        <p className="text-sm text-gray-500 mt-1">Fideliza y recupera pacientes de forma proactiva</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map(({ key, label, shortLabel, icon: Icon }) => {
          const count = key === 'followup' ? pendingFollowup.length : inactivePatients.length
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
              {count > 0 && (
                <span className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  key === 'followup'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Post-Atención */}
      {tab === 'followup' && (
        <div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-purple-800">¿Qué es el seguimiento post-atención?</p>
            <p className="text-xs text-purple-600 mt-1 leading-relaxed">
              Después de cada tratamiento, contacta al paciente para saber cómo se siente. Un simple mensaje genera confianza y fidelidad a largo plazo.
            </p>
          </div>

          {pendingFollowup.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <CheckCircle2 className="w-10 h-10 mb-3 text-green-400" />
              <p className="text-sm font-medium text-gray-600">¡Todo al día!</p>
              <p className="text-xs mt-1">No hay seguimientos pendientes por enviar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingFollowup.map((apt) => (
                <FollowupCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recuperar Pacientes */}
      {tab === 'recovery' && (
        <div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-orange-800">¿Qué son los pacientes inactivos?</p>
            <p className="text-xs text-orange-600 mt-1 leading-relaxed">
              Pacientes que no han regresado en más de {INACTIVE_DAYS} días. Un mensaje amigable puede reactivarlos — muchas clínicas recuperan hasta un 30% de estos pacientes.
            </p>
          </div>

          {inactivePatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <UserCheck className="w-10 h-10 mb-3 text-green-400" />
              <p className="text-sm font-medium text-gray-600">Sin inactivos</p>
              <p className="text-xs mt-1">Todos los pacientes han visitado recientemente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inactivePatients.map(({ patient, days, lastApt }) => (
                <RecoveryCard
                  key={patient.id}
                  patient={patient}
                  daysSinceLastVisit={days}
                  lastTreatment={lastApt.treatment}
                  lastDatetime={lastApt.datetime}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
