'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import AppointmentCard from './AppointmentCard'
import type { AppointmentWithPatient } from '@/data/demo-data'

interface Props {
  appointments: AppointmentWithPatient[]
}

const HOUR_START = 8
const HOUR_END = 19
const SLOT_HEIGHT = 56 // px per hour
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 border-green-400 text-green-800',
  scheduled: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  completed: 'bg-gray-100 border-gray-400 text-gray-600',
  cancelled: 'bg-red-100 border-red-400 text-red-700',
}

function getMondayOf(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CalendarView({ appointments }: Props) {
  const today = new Date()
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(today))
  const [selectedDay, setSelectedDay] = useState<Date>(today)
  const [selectedApt, setSelectedApt] = useState<AppointmentWithPatient | null>(null)

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  const aptsByDay = useMemo(() => {
    const map = new Map<string, AppointmentWithPatient[]>()
    for (const apt of appointments) {
      const key = new Date(apt.datetime).toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(apt)
    }
    return map
  }, [appointments])

  function goToday() {
    setWeekStart(getMondayOf(today))
    setSelectedDay(today)
  }

  const weekLabel = (() => {
    const end = addDays(weekStart, 6)
    const startStr = weekStart.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
    const endStr = end.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startStr} – ${endStr}`
  })()

  const gridHeight = HOURS.length * SLOT_HEIGHT

  function getTopPx(datetime: string): number {
    const d = new Date(datetime)
    const minutes = (d.getHours() - HOUR_START) * 60 + d.getMinutes()
    return Math.max(0, (minutes / 60) * SLOT_HEIGHT)
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekStart(d => addDays(d, -7))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekStart(d => addDays(d, 7))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-700 ml-1">{weekLabel}</span>
        </div>
        <button
          onClick={goToday}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* ── DESKTOP: full week grid ── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <div className="min-w-[620px]">
          {/* Day header row */}
          <div className="grid border-b border-gray-200 bg-gray-50" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
            <div className="py-2 border-r border-gray-200" />
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today)
              return (
                <div key={i} className="py-2 text-center border-r border-gray-200 last:border-r-0">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{DAY_LABELS[i]}</p>
                  <p className={cn(
                    'text-sm font-bold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full',
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-800'
                  )}>
                    {day.getDate()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Body: time col + day columns */}
          <div className="grid bg-white" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
            {/* Time labels column */}
            <div className="border-r border-gray-200">
              {HOURS.map((h) => (
                <div key={h} className="border-b border-gray-100 flex items-start justify-end pr-2 pt-1" style={{ height: SLOT_HEIGHT }}>
                  <span className="text-[10px] text-gray-400 font-mono">{pad(h)}:00</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, di) => {
              const dayApts = (aptsByDay.get(day.toDateString()) ?? [])
              const isToday = isSameDay(day, today)
              return (
                <div
                  key={di}
                  className={cn(
                    'relative border-r border-gray-200 last:border-r-0',
                    isToday && 'bg-blue-50/30'
                  )}
                  style={{ height: gridHeight }}
                >
                  {/* Hour lines */}
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-b border-gray-100"
                      style={{ top: (h - HOUR_START) * SLOT_HEIGHT }}
                    />
                  ))}

                  {/* Appointment blocks */}
                  {dayApts.map((apt) => {
                    const d = new Date(apt.datetime)
                    if (d.getHours() < HOUR_START || d.getHours() >= HOUR_END) return null
                    const topPx = getTopPx(apt.datetime)
                    const colorClass = STATUS_COLORS[apt.no_show ? 'cancelled' : apt.status] ?? STATUS_COLORS.scheduled
                    return (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedApt(apt)}
                        className={cn(
                          'absolute left-0.5 right-0.5 rounded border px-1.5 py-0.5 text-left hover:opacity-80 transition-opacity overflow-hidden z-10',
                          colorClass
                        )}
                        style={{ top: topPx + 1, height: SLOT_HEIGHT - 4 }}
                      >
                        <p className="text-[10px] font-bold leading-tight truncate">{d.getHours()}:{pad(d.getMinutes())}</p>
                        <p className="text-[10px] font-semibold leading-tight truncate">{apt.patients.full_name}</p>
                        <p className="text-[9px] leading-tight truncate opacity-75">{apt.treatment}</p>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE: single day view ── */}
      <div className="sm:hidden">
        {/* Day selector */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today)
            const isSel = isSameDay(day, selectedDay)
            const hasCitas = (aptsByDay.get(day.toDateString()) ?? []).length > 0
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'flex flex-col items-center py-2 px-3 rounded-xl transition-colors shrink-0 min-w-[44px]',
                  isSel ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <span className="text-[10px] font-medium">{DAY_LABELS[i]}</span>
                <span className="text-sm font-bold">{day.getDate()}</span>
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full mt-0.5',
                  hasCitas ? (isSel ? 'bg-white' : 'bg-blue-400') : 'bg-transparent'
                )} />
              </button>
            )
          })}
        </div>

        {/* Selected day list */}
        {(() => {
          const dayApts = (aptsByDay.get(selectedDay.toDateString()) ?? [])
            .sort((a, b) => a.datetime.localeCompare(b.datetime))

          if (dayApts.length === 0) {
            return (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Sin citas este día</p>
              </div>
            )
          }

          return (
            <div className="space-y-3">
              {dayApts.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )
        })()}
      </div>

      {/* Appointment detail modal (desktop click) */}
      {selectedApt && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) setSelectedApt(null) }}>
          <DialogContent className="max-w-md p-4">
            <DialogTitle className="sr-only">Detalle de cita</DialogTitle>
            <AppointmentCard appointment={selectedApt} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
