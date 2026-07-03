import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function BrinquedoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: b } = await supabase
    .from('brinquedos')
    .select('id, nome, foto_url, prazo_max_dias_sem_limpeza, ativo, categorias(nome)')
    .eq('id', id)
    .single()

  if (!b) notFound()

  const brinquedo = b as typeof b & { categorias: { nome: string } | null }

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <Link href="/brinquedos" className="text-slate-400 text-sm mb-4 flex items-center gap-1">
        ‹ Voltar
      </Link>

      {brinquedo.foto_url ? (
        <img
          src={brinquedo.foto_url}
          alt={brinquedo.nome}
          className="w-full h-52 object-cover rounded-2xl mb-5"
        />
      ) : (
        <div className="w-full h-52 rounded-2xl bg-slate-100 flex items-center justify-center text-5xl mb-5">
          🎪
        </div>
      )}

      <div className="flex items-start justify-between mb-1">
        <h1 className="text-xl font-bold text-slate-800">{brinquedo.nome}</h1>
        {!brinquedo.ativo && (
          <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Inativo</span>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-1">{brinquedo.categorias?.nome ?? 'Sem categoria'}</p>
      <p className="text-slate-500 text-sm">Limpeza a cada {brinquedo.prazo_max_dias_sem_limpeza} dias</p>

      <Link
        href={`/brinquedos/${id}/editar`}
        className="mt-6 w-full block text-center py-3 bg-blue-600 text-white font-semibold rounded-xl active:bg-blue-700"
      >
        Editar brinquedo
      </Link>
    </main>
  )
}
