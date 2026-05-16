'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles, RotateCcw } from 'lucide-react'
import { useDemo } from '@/context/DemoContext'

const steps = [
  {
    n: 1,
    title: 'Recordatorios',
    desc: 'En Citas, envía recordatorios por WhatsApp a pacientes que aún no confirmaron.',
  },
  {
    n: 2,
    title: 'Confirmaciones',
    desc: 'Confirma la cita con un clic — el dashboard se actualiza al instante.',
  },
  {
    n: 3,
    title: 'Post-atención',
    desc: 'Marca la cita como completada y ve a Seguimiento para enviar un mensaje de bienestar.',
  },
  {
    n: 4,
    title: 'Recuperar pacientes',
    desc: 'En Seguimiento → Recuperar Pacientes, invita de vuelta a quienes no han regresado.',
  },
]

export default function DemoStoryPanel() {
  const [open, setOpen] = useState(true)
  const { resetDemo } = useDemo()

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-sm font-semibold text-amber-800">
            Guía de Demo
            <span className="hidden sm:inline"> — Presentación para ventas</span>
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
            : <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
          }
        </button>

        <button
          onClick={resetDemo}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Resetear Demo</span>
        </button>
      </div>

      {open && (
        <div className="px-4 sm:px-6 pb-4">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1">
            {steps.map((step) => (
              <div key={step.n} className="flex items-start gap-3 min-w-[200px]">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">{step.title}</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
