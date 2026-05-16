'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, CalendarDays, HeartHandshake } from 'lucide-react'
import { useDemo } from '@/context/DemoContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { followupCount, inactiveCount } = useDemo()
  const seguimientoTotal = followupCount + inactiveCount

  const links = [
    { href: '/',            label: 'Dashboard',   icon: LayoutDashboard, badge: 0 },
    { href: '/citas',       label: 'Citas',        icon: CalendarDays,    badge: 0 },
    { href: '/pacientes',   label: 'Pacientes',    icon: Users,           badge: 0 },
    { href: '/seguimiento', label: 'Seguimiento',  icon: HeartHandshake,  badge: seguimientoTotal },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">🦷</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-600 leading-none">Clínica Dental</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Sonrisa Perfecta</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              {label}
            </span>
            {badge > 0 && (
              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Demo badge */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
          <p className="text-xs font-semibold text-amber-700">Modo Demo Activo</p>
          <p className="text-xs text-amber-600 mt-0.5">Datos de prueba</p>
        </div>
      </div>
    </aside>
  )
}
