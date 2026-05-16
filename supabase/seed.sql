-- ============================================================
-- DEMO RESET SCRIPT — Clínica Dental Sonrisa Perfecta
-- Ejecutar en Supabase SQL Editor para REINICIAR la demo
-- ============================================================

-- Limpiar datos existentes (respeta FK)
truncate table appointments cascade;
truncate table patients cascade;

-- ============================================================
-- PACIENTES (8 pacientes con teléfonos peruanos)
-- ============================================================
insert into patients (id, full_name, phone, email) values
  ('11111111-1111-1111-1111-111111111101', 'Carlos Mendoza Ríos',    '987654321', 'carlos.mendoza@gmail.com'),
  ('11111111-1111-1111-1111-111111111102', 'María Elena Torres',      '976543210', 'maria.torres@gmail.com'),
  ('11111111-1111-1111-1111-111111111103', 'Juan Pérez Huamán',       '965432109', null),
  ('11111111-1111-1111-1111-111111111104', 'Rosa Gutierrez Paz',      '954321098', null),
  ('11111111-1111-1111-1111-111111111105', 'Luis Alberto Vargas',     '943210987', 'luis.vargas@gmail.com'),
  ('11111111-1111-1111-1111-111111111106', 'Ana Lucía Flores',        '932109876', null),
  ('11111111-1111-1111-1111-111111111107', 'Diego Ramírez Castro',    '921098765', null),
  ('11111111-1111-1111-1111-111111111108', 'Patricia Quispe Lara',    '910987654', 'patricia.quispe@gmail.com');

-- ============================================================
-- CITAS DE HOY (3 citas)
-- ============================================================

-- 09:00 — Confirmada, recordatorio ya enviado
insert into appointments (patient_id, datetime, treatment, status, reminder_pending, reminder_ready, no_show) values
  ('11111111-1111-1111-1111-111111111101',
   (CURRENT_DATE + interval '9 hours')::timestamptz,
   'Limpieza dental', 'confirmed', false, true, false);

-- 11:00 — Sin confirmar, recordatorio pendiente (demo step 2)
insert into appointments (patient_id, datetime, treatment, status, reminder_pending, reminder_ready, no_show) values
  ('11111111-1111-1111-1111-111111111102',
   (CURRENT_DATE + interval '11 hours')::timestamptz,
   'Extracción', 'scheduled', true, false, false);

-- 15:00 — Sin confirmar, recordatorio pendiente (demo step 2)
insert into appointments (patient_id, datetime, treatment, status, reminder_pending, reminder_ready, no_show) values
  ('11111111-1111-1111-1111-111111111103',
   (CURRENT_DATE + interval '15 hours')::timestamptz,
   'Blanqueamiento', 'scheduled', true, false, false);

-- ============================================================
-- CITAS DE MAÑANA (2 citas)
-- ============================================================
insert into appointments (patient_id, datetime, treatment, status, reminder_pending, reminder_ready, no_show) values
  ('11111111-1111-1111-1111-111111111104',
   (CURRENT_DATE + interval '1 day 10 hours')::timestamptz,
   'Ortodoncia', 'scheduled', true, false, false),

  ('11111111-1111-1111-1111-111111111105',
   (CURRENT_DATE + interval '1 day 16 hours')::timestamptz,
   'Revisión general', 'scheduled', true, false, false);

-- ============================================================
-- CITAS PASADAS (3 completadas)
-- ============================================================
insert into appointments (patient_id, datetime, treatment, status, reminder_pending, reminder_ready, no_show) values
  ('11111111-1111-1111-1111-111111111106',
   (CURRENT_DATE - interval '3 days' + interval '10 hours')::timestamptz,
   'Empaste', 'completed', false, true, false),

  ('11111111-1111-1111-1111-111111111107',
   (CURRENT_DATE - interval '5 days' + interval '9 hours')::timestamptz,
   'Limpieza dental', 'completed', false, true, false),

  ('11111111-1111-1111-1111-111111111108',
   (CURRENT_DATE - interval '7 days' + interval '14 hours')::timestamptz,
   'Extracción', 'completed', false, true, false);
