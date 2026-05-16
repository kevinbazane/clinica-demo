'use client'

import { useDemo } from '@/context/DemoContext'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'

export default function PatientList() {
  const { patients } = useDemo()

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Users className="w-10 h-10 mb-3" />
        <p className="text-sm font-medium">No hay pacientes registrados</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Teléfono</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Registrado</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr
              key={p.id}
              className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
              <td className="px-4 py-3 text-gray-600 font-mono">
                <a href={`tel:+51${p.phone}`} className="hover:text-blue-600">
                  +51 {p.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.email ?? '—'}</td>
              <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">
                {formatDate(p.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
