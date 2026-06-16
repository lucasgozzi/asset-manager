'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUsuario } from '@/lib/usuario'

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const usuario = getUsuario()
    if (!usuario && pathname !== '/bem-vindo') {
      router.replace('/bem-vindo')
    } else {
      setPronto(true)
    }
  }, [pathname, router])

  if (!pronto) return null
  return <>{children}</>
}
