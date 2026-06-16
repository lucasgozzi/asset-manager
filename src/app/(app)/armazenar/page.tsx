'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getUsuario } from '@/lib/usuario'
import type { FlagEstado } from '@/lib/supabase/types'

type Brinquedo = { id: string; nome: string; foto_url: string | null }

const FLAGS: { valor: FlagEstado; label: string; emoji: string; cor: string }[] = [
  { valor: 'ok', label: 'OK', emoji: '✅', cor: 'bg-green-50 border-green-300 text-green-700' },
  { valor: 'molhado', label: 'Molhado', emoji: '💧', cor: 'bg-blue-50 border-blue-300 text-blue-700' },
  { valor: 'sujo', label: 'Sujo', emoji: '🟤', cor: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  { valor: 'rasgado', label: 'Rasgado', emoji: '✂️', cor: 'bg-red-50 border-red-300 text-red-700' },
  { valor: 'faltando_peca', label: 'Faltando peca', emoji: '🔧', cor: 'bg-orange-50 border-orange-300 text-orange-700' },
  { valor: 'precisa_atencao', label: 'Precisa atencao', emoji: '⚠️', cor: 'bg-purple-50 border-purple-300 text-purple-700' },
]

export default function ArmazenarPage() {
  const router = useRouter()
  const [brinquedos, setBrinquedos] = useState<Brinquedo[]>([])
  const [brinquedoId, setBrinquedoId] = useState('')
  const [flags, setFlags] = useState<FlagEstado[]>(['ok'])
  const [observacoes, setObservacoes] = useState('')
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    createClient()
      .from('brinquedos')
      .select('id, nome, foto_url')
      .eq('ativo', true)
      .order('nome')
      .then(({ data }) => setBrinquedos(data ?? []))
  }, [])

  function toggleFlag(flag: FlagEstado) {
    setFlags(prev => {
      if (flag === 'ok') return ['ok']
      const semOk = prev.filter(f => f !== 'ok')
      if (semOk.includes(flag)) {
        const novo = semOk.filter(f => f !== flag)
        return novo.length === 0 ? ['ok'] : novo
      }
      return [...semOk, flag]
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!brinquedoId) { setErro('Selecione um brinquedo.'); return }

    setSalvando(true)
    setErro('')
    const usuario = getUsuario()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (createClient() as any).from('armazenagens').insert({
      brinquedo_id: brinquedoId,
      data_entrada: dataEntrada,
      flags,
      observacoes: observacoes.trim() || null,
      registrado_por: usuario?.nome ?? null,
    })

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    setSucesso(true)
    setTimeout(() => router.push('/'), 1500)
  }

  if (sucesso) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-xl font-bold text-slate-800">Guardado!</p>
          <p className="text-slate-500 text-sm mt-1">Redirecionando...</p>
        </div>
      </main>
    )
  }

  const brinquedoSelecionado = brinquedos.find(b => b.id === brinquedoId)

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-6">Guardar no barracao</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selecao de brinquedo */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Brinquedo *</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brinquedos.map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBrinquedoId(b.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                  brinquedoId === b.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 bg-white active:bg-slate-50'
                }`}
              >
                {b.foto_url ? (
                  <img src={b.foto_url} alt={b.nome} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0">🎪</div>
                )}
                <span className="font-medium text-slate-700 text-sm">{b.nome}</span>
                {brinquedoId === b.id && <span className="ml-auto text-blue-500">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Data de entrada */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Data de entrada</label>
          <input
            type="date"
            value={dataEntrada}
            onChange={e => setDataEntrada(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Estado / Flags */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Estado do brinquedo</label>
          <div className="grid grid-cols-2 gap-2">
            {FLAGS.map(f => {
              const ativo = flags.includes(f.valor)
              return (
                <button
                  key={f.valor}
                  type="button"
                  onClick={() => toggleFlag(f.valor)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    ativo ? f.cor + ' border-current' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Observacoes */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Observacoes</label>
          <textarea
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Detalhes adicionais sobre o estado do brinquedo..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {salvando ? 'Salvando...' : 'Confirmar entrada'}
        </button>
      </form>
    </main>
  )
}
