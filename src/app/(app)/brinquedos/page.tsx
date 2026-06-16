import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type BrinquedoComCategoria = {
  id: string
  nome: string
  foto_url: string | null
  prazo_max_dias_sem_limpeza: number
  categorias: { nome: string } | null
}

export default async function BrinquedosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('brinquedos')
    .select('id, nome, foto_url, prazo_max_dias_sem_limpeza, categorias(nome)')
    .eq('ativo', true)
    .order('nome')

  const brinquedos = (data ?? []) as BrinquedoComCategoria[]

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">Brinquedos</h1>
        <Link
          href="/brinquedos/novo"
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl active:bg-blue-700"
        >
          + Novo
        </Link>
      </div>

      {!brinquedos.length && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🎪</div>
          <p className="font-medium">Nenhum brinquedo cadastrado ainda.</p>
          <Link href="/brinquedos/novo" className="text-blue-500 text-sm mt-2 inline-block">
            Cadastrar o primeiro
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {brinquedos.map(b => (
          <Link key={b.id} href={`/brinquedos/${b.id}`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 active:bg-slate-50">
              {b.foto_url ? (
                <img src={b.foto_url} alt={b.nome} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">🎪</div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{b.nome}</p>
                <p className="text-sm text-slate-400">{b.categorias?.nome ?? 'Sem categoria'}</p>
                <p className="text-xs text-slate-400 mt-0.5">Limpeza a cada {b.prazo_max_dias_sem_limpeza} dias</p>
              </div>
              <span className="ml-auto text-slate-300 text-lg shrink-0">›</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
