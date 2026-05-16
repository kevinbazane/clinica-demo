'use client'

import PatientForm from '@/components/patients/PatientForm'
import PatientList from '@/components/patients/PatientList'

export default function PacientesPage() {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <p className="text-sm text-gray-500 mt-1">Registro de todos los pacientes de la clínica</p>
      </div>

      <div className="mb-6">
        <PatientForm />
      </div>

      <PatientList />
    </div>
  )
}
