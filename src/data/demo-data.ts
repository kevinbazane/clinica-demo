import type { Patient, Appointment } from '@/types'

export type AppointmentWithPatient = Appointment & {
  patients: { full_name: string; phone: string }
}

function todayAt(hours: number): string {
  const d = new Date()
  d.setHours(hours, 0, 0, 0)
  return d.toISOString()
}

function daysAgoAt(days: number, hours: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hours, 0, 0, 0)
  return d.toISOString()
}

function tomorrowAt(hours: number): string {
  return daysAgoAt(-1, hours)
}

export function createDemoPatients(): Patient[] {
  const now = new Date().toISOString()
  return [
    { id: 'p1',  full_name: 'Carlos Mendoza Ríos',   phone: '987654321', email: 'carlos.mendoza@gmail.com',  notes: null, created_at: now },
    { id: 'p2',  full_name: 'María Elena Torres',     phone: '976543210', email: 'maria.torres@gmail.com',    notes: null, created_at: now },
    { id: 'p3',  full_name: 'Juan Pérez Huamán',      phone: '965432109', email: null,                        notes: null, created_at: now },
    { id: 'p4',  full_name: 'Rosa Gutierrez Paz',     phone: '954321098', email: null,                        notes: null, created_at: now },
    { id: 'p5',  full_name: 'Luis Alberto Vargas',    phone: '943210987', email: 'luis.vargas@gmail.com',     notes: null, created_at: now },
    { id: 'p6',  full_name: 'Ana Lucía Flores',       phone: '932109876', email: null,                        notes: null, created_at: now },
    { id: 'p7',  full_name: 'Diego Ramírez Castro',   phone: '921098765', email: null,                        notes: null, created_at: now },
    { id: 'p8',  full_name: 'Patricia Quispe Lara',   phone: '910987654', email: 'patricia.quispe@gmail.com', notes: null, created_at: now },
    { id: 'p9',  full_name: 'Miriam Condori Quispe',  phone: '909876543', email: null,                        notes: null, created_at: now },
    { id: 'p10', full_name: 'Roberto Sánchez Díaz',   phone: '898765432', email: 'roberto.sanchez@gmail.com', notes: null, created_at: now },
  ]
}

export function createDemoAppointments(): AppointmentWithPatient[] {
  const now = new Date().toISOString()
  return [
    // ── HOY — confirmada ──────────────────────────────────────────────────────
    {
      id: 'a1', patient_id: 'p1', datetime: todayAt(9),
      treatment: 'Limpieza dental', status: 'confirmed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Carlos Mendoza Ríos', phone: '987654321' },
    },
    // ── HOY — sin confirmar, recordatorio pendiente ───────────────────────────
    {
      id: 'a2', patient_id: 'p2', datetime: todayAt(11),
      treatment: 'Extracción', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'María Elena Torres', phone: '976543210' },
    },
    {
      id: 'a3', patient_id: 'p3', datetime: todayAt(15),
      treatment: 'Blanqueamiento', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Juan Pérez Huamán', phone: '965432109' },
    },
    // ── MAÑANA ────────────────────────────────────────────────────────────────
    {
      id: 'a4', patient_id: 'p4', datetime: tomorrowAt(10),
      treatment: 'Ortodoncia', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Rosa Gutierrez Paz', phone: '954321098' },
    },
    {
      id: 'a5', patient_id: 'p5', datetime: tomorrowAt(16),
      treatment: 'Revisión general', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Luis Alberto Vargas', phone: '943210987' },
    },
    // ── RECIENTES — completadas, seguimiento pendiente ────────────────────────
    {
      id: 'a6', patient_id: 'p6', datetime: daysAgoAt(3, 10),
      treatment: 'Empaste', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Ana Lucía Flores', phone: '932109876' },
    },
    {
      id: 'a7', patient_id: 'p7', datetime: daysAgoAt(5, 9),
      treatment: 'Limpieza dental', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Diego Ramírez Castro', phone: '921098765' },
    },
    {
      id: 'a8', patient_id: 'p8', datetime: daysAgoAt(7, 14),
      treatment: 'Extracción', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      patients: { full_name: 'Patricia Quispe Lara', phone: '910987654' },
    },
    // ── INACTIVOS — última visita hace 60+ días (para recuperar pacientes) ────
    {
      id: 'a9', patient_id: 'p9', datetime: daysAgoAt(75, 10),
      treatment: 'Blanqueamiento', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: true,
      notes: null, created_at: now,
      patients: { full_name: 'Miriam Condori Quispe', phone: '909876543' },
    },
    {
      id: 'a10', patient_id: 'p10', datetime: daysAgoAt(95, 14),
      treatment: 'Revisión general', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: true,
      notes: null, created_at: now,
      patients: { full_name: 'Roberto Sánchez Díaz', phone: '898765432' },
    },
  ]
}
