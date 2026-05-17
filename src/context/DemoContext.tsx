'use client'

import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import {
  createDemoPatients,
  createDemoAppointments,
  createDemoClinicalRecords,
  type AppointmentWithPatient,
} from '@/data/demo-data'
import type { Patient, Appointment, AppointmentStatus, ClinicalRecord, ToothCondition, OdontogramSurface, OdontogramData } from '@/types'
import { isToday } from '@/lib/utils'

const INACTIVE_DAYS = 60

interface DemoContextType {
  patients: Patient[]
  appointments: AppointmentWithPatient[]
  clinicalRecords: ClinicalRecord[]
  addPatient: (p: { full_name: string; phone: string; email?: string }) => void
  addAppointment: (a: { patient_id: string; datetime: string; treatment: string; price?: number }) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  addClinicalRecord: (r: Omit<ClinicalRecord, 'id' | 'created_at'>) => void
  odontograms: Record<string, OdontogramData>
  updateToothSurface: (patientId: string, tooth: number, surface: OdontogramSurface, condition: ToothCondition) => void
  resetDemo: () => void
  todayCount: number
  totalPatients: number
  pendingConfirmCount: number
  followupCount: number
  inactiveCount: number
  totalRevenue: number
  pendingRevenue: number
}

const DemoContext = createContext<DemoContextType | null>(null)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(createDemoPatients)
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>(createDemoAppointments)
  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>(createDemoClinicalRecords)
  const [odontograms, setOdontograms] = useState<Record<string, OdontogramData>>({
    p1: {
      16: { O: 'filling', M: 'caries' },
      26: { O: 'filling' },
      36: { O: 'filling', D: 'filling' },
      46: { O: 'caries', D: 'caries' },
      11: { B: 'crown', O: 'crown', L: 'crown' },
    },
  })

  const patientsRef = useRef(patients)
  patientsRef.current = patients

  const addPatient = useCallback((p: { full_name: string; phone: string; email?: string }) => {
    setPatients((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        full_name: p.full_name,
        phone: p.phone,
        email: p.email ?? null,
        notes: null,
        created_at: new Date().toISOString(),
      },
    ])
  }, [])

  const addAppointment = useCallback(
    (a: { patient_id: string; datetime: string; treatment: string; price?: number }) => {
      const patient = patientsRef.current.find((p) => p.id === a.patient_id)
      const newApt: AppointmentWithPatient = {
        id: crypto.randomUUID(),
        patient_id: a.patient_id,
        datetime: a.datetime,
        treatment: a.treatment,
        status: 'scheduled' as AppointmentStatus,
        reminder_pending: true,
        reminder_ready: false,
        no_show: false,
        followup_sent: false,
        notes: null,
        created_at: new Date().toISOString(),
        price: a.price ?? 0,
        paid: false,
        patients: {
          full_name: patient?.full_name ?? 'Paciente',
          phone: patient?.phone ?? '',
        },
      }
      setAppointments((prev) =>
        [...prev, newApt].sort((a, b) => a.datetime.localeCompare(b.datetime))
      )
    },
    []
  )

  const updateAppointment = useCallback(
    (id: string, updates: Partial<Appointment>) => {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
      )
    },
    []
  )

  const addClinicalRecord = useCallback(
    (r: Omit<ClinicalRecord, 'id' | 'created_at'>) => {
      setClinicalRecords((prev) => [
        {
          ...r,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    []
  )

  const updateToothSurface = useCallback(
    (patientId: string, tooth: number, surface: OdontogramSurface, condition: ToothCondition) => {
      setOdontograms((prev) => ({
        ...prev,
        [patientId]: {
          ...(prev[patientId] ?? {}),
          [tooth]: {
            ...(prev[patientId]?.[tooth] ?? {}),
            [surface]: condition,
          },
        },
      }))
    },
    []
  )

  const resetDemo = useCallback(() => {
    setPatients(createDemoPatients())
    setAppointments(createDemoAppointments())
    setClinicalRecords(createDemoClinicalRecords())
    setOdontograms({
      p1: {
        16: { O: 'filling', M: 'caries' },
        26: { O: 'filling' },
        36: { O: 'filling', D: 'filling' },
        46: { O: 'caries', D: 'caries' },
        11: { B: 'crown', O: 'crown', L: 'crown' },
      },
    })
  }, [])

  const { todayCount, pendingConfirmCount } = useMemo(() => {
    const todays = appointments.filter((a) => isToday(a.datetime))
    return {
      todayCount: todays.length,
      pendingConfirmCount: todays.filter(
        (a) => a.status !== 'confirmed' && a.status !== 'cancelled' && a.status !== 'completed'
      ).length,
    }
  }, [appointments])

  const followupCount = useMemo(
    () => appointments.filter((a) => a.status === 'completed' && !a.followup_sent).length,
    [appointments]
  )

  const inactiveCount = useMemo(() => {
    const now = Date.now()
    return patients.reduce((count, patient) => {
      const lastCompleted = appointments
        .filter((a) => a.patient_id === patient.id && a.status === 'completed')
        .sort((a, b) => b.datetime.localeCompare(a.datetime))[0]
      if (!lastCompleted) return count
      const days = Math.floor((now - new Date(lastCompleted.datetime).getTime()) / 86_400_000)
      return days >= INACTIVE_DAYS ? count + 1 : count
    }, 0)
  }, [patients, appointments])

  const { totalRevenue, pendingRevenue } = useMemo(() => {
    let total = 0
    let pending = 0
    for (const apt of appointments) {
      if (apt.paid) {
        total += apt.price
      } else if (apt.status === 'completed') {
        pending += apt.price
      }
    }
    return { totalRevenue: total, pendingRevenue: pending }
  }, [appointments])

  return (
    <DemoContext.Provider
      value={{
        patients,
        appointments,
        clinicalRecords,
        addPatient,
        addAppointment,
        updateAppointment,
        addClinicalRecord,
        odontograms,
        updateToothSurface,
        resetDemo,
        todayCount,
        totalPatients: patients.length,
        pendingConfirmCount,
        followupCount,
        inactiveCount,
        totalRevenue,
        pendingRevenue,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
