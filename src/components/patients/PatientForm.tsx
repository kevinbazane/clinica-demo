'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useDemo } from '@/context/DemoContext'

export default function PatientForm() {
  const { addPatient } = useDemo()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return
    addPatient({ full_name: name, phone, email: email || undefined })
    const savedName = name
    setName('')
    setPhone('')
    setEmail('')

    const { default: Swal } = await import('sweetalert2')
    await Swal.fire({
      icon: 'success',
      title: '¡Paciente registrado!',
      html: `<b>${savedName}</b> fue agregado exitosamente al sistema.`,
      timer: 3000,
      timerProgressBar: true,
      confirmButtonText: '¡Entendido!',
      confirmButtonColor: '#16a34a',
    })
    nameRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Nuevo paciente rápido</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo *"
          required
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono (9XXXXXXXX) *"
          required
          maxLength={9}
          className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (opcional)"
          type="email"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>
    </form>
  )
}
