import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import Sidebar from '@/components/layout/Sidebar'
import DemoStoryPanel from '@/components/layout/DemoStoryPanel'
import { DemoProvider } from '@/context/DemoContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clínica Dental Sonrisa Perfecta',
  description: 'Sistema de gestión de citas y pacientes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <DemoProvider>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <DemoStoryPanel />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </DemoProvider>
      </body>
    </html>
  )
}
