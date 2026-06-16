'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUsuario } from '@/lib/usuario'

type Brinquedo = {
  id: string
  nome: string
  foto_url: string | null
  dias_restantes: number | null
  data_limite_limpeza: string | null
  ultima_limpeza: string | null
  flags_atual: string[] | null
}

type Nivel = 'vencido' | 'urgente' | 'atencao' | 'ok'

const estilos: Record<Nivel, string> = {
  vencido: 'border-red-300 bg-red-50',
  urgente: 'border-orange-300 bg-orange-50',
  atencao: 'border-yellow-200 bg-yellow-50',
  ok: 'border-slate-200 bg-white',
}

const badgeEstilos: Record<Nivel, string> = {
  vencido: 'bg-red-100 text-red-700',
  urgente: 'bg-orange-100 text-orange-700',
  atencao: 'bg-yellow-100 text-yellow-700',
  ok: 'bg-green-100 text-green-700',
}

function formatarData(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
}

function textoDias(dias: number | null) {
  if (dias === null) return 'Sem prazo'
  if (dias < 0) return `Vencido ha ${Math.abs(dias)} dia${Math.abs(dias) > 1 ? 's' : ''}`
  if (dias === 0) return 'Vence hoje'
  return `${dias} dia${dias > 1 ? 's' : ''} restante${dias > 1 ? 's' : ''}`
}

export default function LimpezaCard({ brinquedo: b, nivel }: { brinquedo: Brinquedo; nivel: Nivel }) {
  const router = useRouter()
  const [registrando, setRegistrando] = useState(false)

  async function registrarLimpeza() {
    setRegistrando(true)
    const usuario = getUsuario()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (createClient() as any).from('limpezas').insert({
      brinquedo_id: b.id,
      registrado_por: usuario?.nome ?? null,
    })
    router.refresh()
    setRegistrando(false)
  }

  return (
    <div className={`rounded-2xl border p-4 ${estilos[nivel]}`}>
      <div className="flex items-center gap-3">
        {b.foto_url ? (
          <img src={b.foto_url} alt={b.nome} className="w-12 h-12 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">🎪</div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">{b.nome}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeEstilos[nivel]}`}>
              {textoDias(b.dias_restantes)}
            </span>
            {b.data_limite_limpeza && (
              <span className="text-xs text-slate-400">ate {formatarData(b.data_limite_limpeza)}</span>
            )}
          </div>
          {b.flags_atual && b.flags_atual.some(f => f !== 'ok') && (
            <p className="text-xs text-slate-500 mt-1 truncate">
              Estado: {b.flags_atual.filter(f => f !== 'ok').join(', ')}
            </p>
          )}
        </div>
      </div>

      {nivel !== 'ok' && (
        <button
          onClick={registrarLimpeza}
          disabled={registrando}
          className="mt-3 w-full py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-xl active:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {registrando ? 'Registrando...' : '✓ Marcar como limpo'}
        </button>
      )}
    </div>
  )
}
