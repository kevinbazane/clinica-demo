'use client'

import { useState } from 'react'
import { useDemo } from '@/context/DemoContext'
import { cn } from '@/lib/utils'
import type { ToothCondition, OdontogramSurface, OdontogramData } from '@/types'

const COND_LIST: { value: ToothCondition; label: string; cls: string }[] = [
  { value: 'healthy',    label: 'Sano',       cls: 'bg-white border border-gray-400' },
  { value: 'caries',     label: 'Caries',     cls: 'bg-red-500' },
  { value: 'filling',    label: 'Obturación', cls: 'bg-blue-500' },
  { value: 'crown',      label: 'Corona',     cls: 'bg-yellow-400' },
  { value: 'extracted',  label: 'Extraído',   cls: 'bg-gray-400' },
  { value: 'root-canal', label: 'Endodoncia', cls: 'bg-violet-500' },
]

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

const SURFACE_LABELS: Record<OdontogramSurface, string> = {
  B: 'Vestibular', M: 'Mesial', O: 'Oclusal', D: 'Distal', L: 'Lingual/Palatino',
}

function condCls(c: ToothCondition | undefined) {
  return COND_LIST.find((x) => x.value === c)?.cls ?? 'bg-white border border-gray-300'
}

interface ActiveCell { tooth: number; surface: OdontogramSurface }

function ToothCell({ num, data, active, onCell }: {
  num: number
  data: Partial<Record<OdontogramSurface, ToothCondition>>
  active: ActiveCell | null
  onCell: (tooth: number, surface: OdontogramSurface) => void
}) {
  const get = (s: OdontogramSurface): ToothCondition => data[s] ?? 'healthy'
  const isActiveTooth = active?.tooth === num

  function Surface({ s }: { s: OdontogramSurface }) {
    const isActiveCell = isActiveTooth && active?.surface === s
    return (
      <div
        style={{ gridArea: s }}
        className={cn(
          'cursor-pointer hover:opacity-70 transition-opacity',
          condCls(get(s)),
          isActiveCell && 'outline outline-[1.5px] outline-blue-600 outline-offset-[-1.5px]'
        )}
        onClick={() => onCell(num, s)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-[2px] overflow-hidden shrink-0',
        isActiveTooth && 'ring-2 ring-blue-500'
      )}
      style={{
        display: 'grid',
        gridTemplateAreas: '". B ." "M O D" ". L ."',
        gridTemplateColumns: '8px 14px 8px',
        gridTemplateRows: '8px 14px 8px',
        gap: '1px',
        backgroundColor: '#d1d5db',
      }}
    >
      <Surface s="B" />
      <Surface s="M" />
      <Surface s="O" />
      <Surface s="D" />
      <Surface s="L" />
    </div>
  )
}

interface Props { patientId: string }

export default function Odontogram({ patientId }: Props) {
  const { odontograms, updateToothSurface } = useDemo()
  const [active, setActive] = useState<ActiveCell | null>(null)

  const data: OdontogramData = odontograms[patientId] ?? {}

  function handleCell(tooth: number, surface: OdontogramSurface) {
    setActive((prev) =>
      prev?.tooth === tooth && prev.surface === surface ? null : { tooth, surface }
    )
  }

  function applyCondition(condition: ToothCondition) {
    if (!active) return
    updateToothSurface(patientId, active.tooth, active.surface, condition)
  }

  function renderArch(teeth: number[], isUpper: boolean) {
    const nodes: React.ReactNode[] = []
    teeth.forEach((num, i) => {
      if (i === 8) {
        nodes.push(
          <div key="mid" className="w-[1px] self-stretch bg-gray-300 mx-1" />
        )
      }
      nodes.push(
        <div key={num} className="flex flex-col items-center gap-[3px]">
          {isUpper && (
            <span className="text-[8px] text-gray-400 font-mono leading-none">{num}</span>
          )}
          <ToothCell
            num={num}
            data={data[num] ?? {}}
            active={active}
            onCell={handleCell}
          />
          {!isUpper && (
            <span className="text-[8px] text-gray-400 font-mono leading-none">{num}</span>
          )}
        </div>
      )
    })
    return <div className="flex items-center gap-[3px]">{nodes}</div>
  }

  const activeCondition = active ? (data[active.tooth]?.[active.surface] ?? 'healthy') : null

  return (
    <div className="space-y-4">
      {/* Condition picker */}
      <div
        className={cn(
          'rounded-xl border p-3 transition-colors',
          active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
        )}
      >
        {active ? (
          <>
            <p className="text-xs font-medium text-blue-700 mb-2">
              Diente <span className="font-bold">{active.tooth}</span>{' '}
              · {SURFACE_LABELS[active.surface]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COND_LIST.map((c) => (
                <button
                  key={c.value}
                  onClick={() => applyCondition(c.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors',
                    activeCondition === c.value
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                  )}
                >
                  <span className={cn('w-2.5 h-2.5 rounded-[2px] shrink-0', c.cls)} />
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400 text-center py-0.5">
            Toca una superficie del diente para registrar su condición
          </p>
        )}
      </div>

      {/* Odontogram arches */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center">{renderArch(UPPER_TEETH, true)}</div>
            <div className="border-t-2 border-dashed border-gray-200 my-0.5" />
            <div className="flex justify-center">{renderArch(LOWER_TEETH, false)}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2 border-t border-gray-100">
        {COND_LIST.map((c) => (
          <div key={c.value} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={cn('w-3 h-3 rounded-[2px] shrink-0', c.cls)} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}
