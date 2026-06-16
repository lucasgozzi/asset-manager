'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUsuario } from '@/lib/usuario'
import { createClient } from '@/lib/supabase/client'

type ResumoManutencao = {
  total: number
  urgentes: number // <= 3 dias
  atencao: number  // 4-7 dias
}

export default function HomePage() {
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [resumo, setResumo] = useState<ResumoManutencao | null>(null)

  useEffect(() => {
    const u = getUsuario()
    if (u) setNomeUsuario(u.nome.split(' ')[0])

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase as any)
      .from('estado_brinquedos')
      .select('dias_restantes')
      .then(({ data }: { data: Array<{ dias_restantes: number | null }> | null }) => {
        if (!data) return
        const comPrazo = data.filter(d => d.dias_restantes !== null)
        setResumo({
          total: comPrazo.length,
          urgentes: comPrazo.filter(d => (d.dias_restantes ?? 99) <= 3).length,
          atencao: comPrazo.filter(d => {
            const d_ = d.dias_restantes ?? 99
            return d_ > 3 && d_ <= 7
          }).length,
        })
      })
  }, [])

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <div className="mb-6">
        <p className="text-slate-500 text-sm">Ola, {nomeUsuario || 'bem-vindo'} 👋</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-0.5">Asset Manager</h1>
      </div>

      {resumo && (resumo.urgentes > 0 || resumo.atencao > 0) && (
        <Link href="/manutencao" className="block mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-semibold text-red-700 text-sm mb-1">⚠️ Atencao</p>
            {resumo.urgentes > 0 && (
              <p className="text-red-600 text-sm">
                {resumo.urgentes} brinquedo{resumo.urgentes > 1 ? 's' : ''} com limpeza urgente (ate 3 dias)
              </p>
            )}
            {resumo.atencao > 0 && (
              <p className="text-orange-600 text-sm">
                {resumo.atencao} brinquedo{resumo.atencao > 1 ? 's' : ''} precisam de atencao em breve
              </p>
            )}
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link href="/brinquedos/novo" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 active:bg-slate-50">
          <span className="text-3xl">➕</span>
          <span className="font-semibold text-slate-700 text-sm">Cadastrar brinquedo</span>
        </Link>
        <Link href="/armazenar" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 active:bg-slate-50">
          <span className="text-3xl">📦</span>
          <span className="font-semibold text-slate-700 text-sm">Guardar no barracao</span>
        </Link>
        <Link href="/manutencao" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 active:bg-slate-50">
          <span className="text-3xl">🧹</span>
          <span className="font-semibold text-slate-700 text-sm">Calendario de limpeza</span>
        </Link>
        <Link href="/brinquedos" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 active:bg-slate-50">
          <span className="text-3xl">📋</span>
          <span className="font-semibold text-slate-700 text-sm">Ver brinquedos</span>
        </Link>
      </div>
    </main>
  )
}
