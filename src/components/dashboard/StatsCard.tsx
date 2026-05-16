import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: number
  icon: ReactNode
  variant?: 'blue' | 'purple' | 'yellow' | 'green' | 'orange'
  subtitle?: string
}

const config = {
  blue:   { iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   value: 'text-blue-700'   },
  purple: { iconBg: 'bg-purple-100', iconColor: 'text-purple-600', value: 'text-purple-700' },
  yellow: { iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', value: 'text-yellow-700' },
  green:  { iconBg: 'bg-green-100',  iconColor: 'text-green-600',  value: 'text-green-700'  },
  orange: { iconBg: 'bg-orange-100', iconColor: 'text-orange-600', value: 'text-orange-700' },
}

export default function StatsCard({ title, value, icon, variant = 'blue', subtitle }: Props) {
  const { iconBg, iconColor, value: valueCls } = config[variant]
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-5', iconBg)}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className={cn('text-4xl font-bold tracking-tight', valueCls)}>{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}
