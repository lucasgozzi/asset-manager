'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const itens = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/brinquedos', label: 'Brinquedos', icon: '🎪' },
  { href: '/armazenar', label: 'Guardar', icon: '📦' },
  { href: '/manutencao', label: 'Manutencao', icon: '🧹' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb z-50">
      <div className="flex">
        {itens.map(item => {
          const ativo = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-medium transition-colors ${
                ativo ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
