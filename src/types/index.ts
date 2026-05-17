export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia'

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
  price: number
  paid: boolean
  payment_method?: PaymentMethod
  payment_date?: string
  patients?: Pick<Patient, 'full_name' | 'phone'>
}

export interface ClinicalRecord {
  id: string
  patient_id: string
  appointment_id?: string
  date: string
  diagnosis: string
  notes: string
  created_at: string
}

export interface DashboardStats {
  todayCount: number
  totalPatients: number
  pendingConfirmCount: number
}

export type ToothCondition = 'healthy' | 'caries' | 'filling' | 'crown' | 'extracted' | 'root-canal'
export type OdontogramSurface = 'B' | 'M' | 'O' | 'D' | 'L'
export type OdontogramData = Record<number, Partial<Record<OdontogramSurface, ToothCondition>>>
