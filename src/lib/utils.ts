import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(isoDatetime: string): string {
  return new Date(isoDatetime).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDate(isoDatetime: string): string {
  return new Date(isoDatetime).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '')
  // api.whatsapp.com/send goes directly to WhatsApp Web without the wa.me
  // redirect that can double-encode emoji sequences and corrupt them.
  return `https://api.whatsapp.com/send?phone=51${cleaned}&text=${encodeURIComponent(message)}`
}

export function formatTime12h(isoDatetime: string): string {
  return new Date(isoDatetime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function buildReminderMessage(name: string, isoDatetime: string): string {
  const time = formatTime12h(isoDatetime)
  return `Hola ${name} 👋\n\nTe recordamos tu cita de mañana a las ${time} en Clínica Dental Sonrisa Perfecta 😊\n\nPor favor, confirma tu asistencia respondiendo SÍ ✅\n\n¡Te esperamos!`
}

export function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isToday(isoDatetime: string): boolean {
  const d = new Date(isoDatetime)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function isTomorrow(isoDatetime: string): boolean {
  const d = new Date(isoDatetime)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  )
}

export function getNextHourTimeString(): string {
  const now = new Date()
  now.setHours(now.getHours() + 1, 0, 0, 0)
  return now.toTimeString().slice(0, 5)
}

export function buildFollowupMessage(name: string, treatment: string, isoDatetime: string): string {
  const date = formatDate(isoDatetime)
  return `Hola ${name} 👋\n\nEsperamos que te encuentres muy bien después de tu ${treatment} del ${date} 😊\n\nEn Clínica Dental Sonrisa Perfecta nos importa tu bienestar. ¿Cómo te has sentido? ¿Tienes alguna consulta?\n\n¡Estamos aquí para ayudarte! ✅`
}

export function buildRecoveryMessage(name: string): string {
  return `Hola ${name} 👋\n\n¡Te extrañamos en Clínica Dental Sonrisa Perfecta! 😊\n\nHan pasado varios meses desde tu última visita. Recuerda que una revisión dental cada 6 meses es clave para tu salud bucal.\n\n¿Te gustaría agendar una cita? ¡Con gusto te atendemos! ✅`
}
