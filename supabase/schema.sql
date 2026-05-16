-- ============================================================
-- SCHEMA — Clínica Dental Sonrisa Perfecta
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists patients (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  phone      text not null,
  email      text,
  notes      text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid not null references patients(id) on delete cascade,
  datetime         timestamptz not null,
  treatment        text not null,
  status           text not null default 'scheduled'
                   check (status in ('scheduled','confirmed','cancelled','completed')),
  reminder_pending boolean not null default true,
  reminder_ready   boolean not null default false,
  no_show          boolean not null default false,
  notes            text,
  created_at       timestamptz not null default now()
);

create index if not exists idx_appointments_patient_id on appointments(patient_id);
create index if not exists idx_appointments_datetime   on appointments(datetime);
create index if not exists idx_appointments_status     on appointments(status);
