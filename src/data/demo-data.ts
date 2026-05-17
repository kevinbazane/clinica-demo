import type { Patient, Appointment, ClinicalRecord } from '@/types'

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
      price: 120, paid: true, payment_method: 'efectivo', payment_date: todayAt(9),
      patients: { full_name: 'Carlos Mendoza Ríos', phone: '987654321' },
    },
    // ── HOY — sin confirmar, recordatorio pendiente ───────────────────────────
    {
      id: 'a2', patient_id: 'p2', datetime: todayAt(11),
      treatment: 'Extracción', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 250, paid: false,
      patients: { full_name: 'María Elena Torres', phone: '976543210' },
    },
    {
      id: 'a3', patient_id: 'p3', datetime: todayAt(15),
      treatment: 'Blanqueamiento', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 350, paid: false,
      patients: { full_name: 'Juan Pérez Huamán', phone: '965432109' },
    },
    // ── MAÑANA ────────────────────────────────────────────────────────────────
    {
      id: 'a4', patient_id: 'p4', datetime: tomorrowAt(10),
      treatment: 'Ortodoncia', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 800, paid: false,
      patients: { full_name: 'Rosa Gutierrez Paz', phone: '954321098' },
    },
    {
      id: 'a5', patient_id: 'p5', datetime: tomorrowAt(16),
      treatment: 'Revisión general', status: 'scheduled',
      reminder_pending: true, reminder_ready: false, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 80, paid: false,
      patients: { full_name: 'Luis Alberto Vargas', phone: '943210987' },
    },
    // ── RECIENTES — completadas, seguimiento pendiente ────────────────────────
    {
      id: 'a6', patient_id: 'p6', datetime: daysAgoAt(3, 10),
      treatment: 'Empaste', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 180, paid: true, payment_method: 'tarjeta', payment_date: daysAgoAt(3, 10),
      patients: { full_name: 'Ana Lucía Flores', phone: '932109876' },
    },
    {
      id: 'a7', patient_id: 'p7', datetime: daysAgoAt(5, 9),
      treatment: 'Limpieza dental', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 120, paid: false,
      patients: { full_name: 'Diego Ramírez Castro', phone: '921098765' },
    },
    {
      id: 'a8', patient_id: 'p8', datetime: daysAgoAt(7, 14),
      treatment: 'Extracción', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: false,
      notes: null, created_at: now,
      price: 250, paid: true, payment_method: 'transferencia', payment_date: daysAgoAt(7, 14),
      patients: { full_name: 'Patricia Quispe Lara', phone: '910987654' },
    },
    // ── INACTIVOS — última visita hace 60+ días (para recuperar pacientes) ────
    {
      id: 'a9', patient_id: 'p9', datetime: daysAgoAt(75, 10),
      treatment: 'Blanqueamiento', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: true,
      notes: null, created_at: now,
      price: 350, paid: true, payment_method: 'efectivo', payment_date: daysAgoAt(75, 10),
      patients: { full_name: 'Miriam Condori Quispe', phone: '909876543' },
    },
    {
      id: 'a10', patient_id: 'p10', datetime: daysAgoAt(95, 14),
      treatment: 'Revisión general', status: 'completed',
      reminder_pending: false, reminder_ready: true, no_show: false, followup_sent: true,
      notes: null, created_at: now,
      price: 80, paid: true, payment_method: 'tarjeta', payment_date: daysAgoAt(95, 14),
      patients: { full_name: 'Roberto Sánchez Díaz', phone: '898765432' },
    },
  ]
}

export function createDemoClinicalRecords(): ClinicalRecord[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'cr1', patient_id: 'p1', appointment_id: 'a1',
      date: daysAgoAt(0, 9),
      diagnosis: 'Placa bacteriana moderada',
      notes: 'Se realizó profilaxis completa. Paciente presenta buena higiene en general. Recomendado uso de hilo dental diario.',
      created_at: now,
    },
    {
      id: 'cr2', patient_id: 'p6', appointment_id: 'a6',
      date: daysAgoAt(3, 10),
      diagnosis: 'Caries en molar inferior derecho (pieza 46)',
      notes: 'Se realizó empaste de composite. Anestesia local aplicada sin complicaciones. Control en 2 semanas.',
      created_at: now,
    },
    {
      id: 'cr3', patient_id: 'p7', appointment_id: 'a7',
      date: daysAgoAt(5, 9),
      diagnosis: 'Sarro dental acumulado',
      notes: 'Limpieza ultrasónica realizada. Se detectó leve gingivitis inicial. Indicado enjuague con clorhexidina por 7 días.',
      created_at: now,
    },
    {
      id: 'cr4', patient_id: 'p8', appointment_id: 'a8',
      date: daysAgoAt(7, 14),
      diagnosis: 'Pieza 36 con raíz comprometida, indicada extracción',
      notes: 'Extracción realizada bajo anestesia local. Sutura simple colocada. Indicado ibuprofeno 400mg cada 8h por 3 días. Control post-extracción en 7 días.',
      created_at: now,
    },
    {
      id: 'cr5', patient_id: 'p9', appointment_id: 'a9',
      date: daysAgoAt(75, 10),
      diagnosis: 'Dientes con manchas extrínsecas por café y té',
      notes: 'Blanqueamiento con peróxido de carbamida 16%. Resultado satisfactorio. Recomendado evitar alimentos con colorantes por 48h.',
      created_at: now,
    },
    {
      id: 'cr6', patient_id: 'p10', appointment_id: 'a10',
      date: daysAgoAt(95, 14),
      diagnosis: 'Revisión de rutina — sin hallazgos patológicos',
      notes: 'Paciente presenta buena salud oral. Radiografías panorámicas sin alteraciones. Próxima revisión en 6 meses.',
      created_at: now,
    },
    {
      id: 'cr7', patient_id: 'p1',
      date: daysAgoAt(180, 10),
      diagnosis: 'Sensibilidad dental en incisivos superiores',
      notes: 'Aplicación de flúor en gel. Indicado pasta dental para dientes sensibles. Evitar alimentos muy fríos o calientes.',
      created_at: now,
    },
    {
      id: 'cr8', patient_id: 'p6',
      date: daysAgoAt(120, 9),
      diagnosis: 'Revisión de rutina — higiene aceptable',
      notes: 'Pequeño cálculo supra-gingival eliminado. Se refuerza técnica de cepillado al paciente.',
      created_at: now,
    },
  ]
}
