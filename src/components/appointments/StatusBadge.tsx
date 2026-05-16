import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

interface Props {
  status: AppointmentStatus
  noShow?: boolean
}

const config: Record<string, { label: string; classes: string }> = {
  confirmed: { label: 'Confirmada', classes: 'bg-green-100 text-green-800 border-green-200' },
  scheduled: { label: 'Programada', classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  cancelled: { label: 'Cancelada', classes: 'bg-red-100 text-red-800 border-red-200' },
  completed: { label: 'Completada', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
  no_show: { label: 'No asistió', classes: 'bg-red-100 text-red-800 border-red-200' },
}

export default function StatusBadge({ status, noShow }: Props) {
  const key = noShow ? 'no_show' : status
  const { label, classes } = config[key] ?? config.scheduled
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', classes)}>
      {label}
    </span>
  )
}
