export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed'

export interface Patient {
  id: string
  full_name: string
  phone: string
  email: string | null
  notes: string | null
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  datetime: string
  treatment: string
  status: AppointmentStatus
  reminder_pending: boolean
  reminder_ready: boolean
  no_show: boolean
  followup_sent: boolean
  notes: string | null
  created_at: string
  patients?: Pick<Patient, 'full_name' | 'phone'>
}

export interface DashboardStats {
  todayCount: number
  totalPatients: number
  pendingConfirmCount: number
}
