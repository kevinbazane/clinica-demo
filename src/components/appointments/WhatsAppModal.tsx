'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/utils'
import { ExternalLink, Copy, Check } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  patientName: string
  patientPhone: string
  message: string
}

export default function WhatsAppModal({ isOpen, onClose, patientName, patientPhone, message }: Props) {
  const [copied, setCopied] = useState(false)
  const whatsappUrl = buildWhatsAppUrl(patientPhone, message)
  const now = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            Vista previa — {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-[#e5ddd5] rounded-xl p-4 my-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">CS</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Clínica Sonrisa Perfecta</p>
              <p className="text-xs text-green-600">en línea</p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none shadow-sm px-3 py-2 max-w-[85%]">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{message}</p>
              <p className="text-xs text-gray-400 text-right mt-1">{now}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <Button variant="outline" onClick={handleCopy} className="flex-1">
            {copied
              ? <><Check className="w-4 h-4 mr-1.5 text-green-600" />¡Copiado!</>
              : <><Copy className="w-4 h-4 mr-1.5" />Copiar mensaje</>
            }
          </Button>
          <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Abrir WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
