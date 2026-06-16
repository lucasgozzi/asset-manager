import { createClient } from '@/lib/supabase/server'
import type { EstadoBrinquedo } from '@/lib/supabase/types'
import LimpezaCard from './LimpezaCard'

function urgencia(dias: number | null): 'vencido' | 'urgente' | 'atencao' | 'ok' {
  if (dias === null) return 'ok'
  if (dias < 0) return 'vencido'
  if (dias <= 3) return 'urgente'
  if (dias <= 7) return 'atencao'
  return 'ok'
}

export default async function ManutencaoPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('estado_brinquedos')
    .select('*')
    .not('ultima_entrada', 'is', null)
    .order('dias_restantes', { ascending: true, nullsFirst: false })

  const brinquedos = (data ?? []) as EstadoBrinquedo[]
  const vencidos = brinquedos.filter(b => urgencia(b.dias_restantes) === 'vencido')
  const urgentes = brinquedos.filter(b => urgencia(b.dias_restantes) === 'urgente')
  const atencao = brinquedos.filter(b => urgencia(b.dias_restantes) === 'atencao')
  const ok = brinquedos.filter(b => urgencia(b.dias_restantes) === 'ok')

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto pb-8">
      <h1 className="text-xl font-bold text-slate-800 mb-2">Manutencao</h1>
      <p className="text-sm text-slate-500 mb-6">Calendario de limpeza dos brinquedos</p>

      {brinquedos.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🧹</div>
          <p className="font-medium">Nenhum brinquedo armazenado ainda.</p>
        </div>
      )}

      {vencidos.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2">🔴 Vencidos</h2>
          <div className="space-y-2">
            {vencidos.map(b => <LimpezaCard key={b.id} brinquedo={b} nivel="vencido" />)}
          </div>
        </section>
      )}

      {urgentes.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-2">🟠 Urgente (ate 3 dias)</h2>
          <div className="space-y-2">
            {urgentes.map(b => <LimpezaCard key={b.id} brinquedo={b} nivel="urgente" />)}
          </div>
        </section>
      )}

      {atencao.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-wide mb-2">🟡 Atencao (4-7 dias)</h2>
          <div className="space-y-2">
            {atencao.map(b => <LimpezaCard key={b.id} brinquedo={b} nivel="atencao" />)}
          </div>
        </section>
      )}

      {ok.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-green-600 uppercase tracking-wide mb-2">🟢 Em dia</h2>
          <div className="space-y-2">
            {ok.map(b => <LimpezaCard key={b.id} brinquedo={b} nivel="ok" />)}
          </div>
        </section>
      )}
    </main>
  )
}
