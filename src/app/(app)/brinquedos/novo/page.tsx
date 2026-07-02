'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Categoria = { id: string; nome: string }

export default function NovoBrinquedoPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [prazo, setPrazo] = useState('30')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const inputFotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    createClient()
      .from('categorias')
      .select('id, nome')
      .order('nome')
      .then(({ data }) => setCategorias(data ?? []))
  }, [])

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Informe o nome do brinquedo.'); return }
    const prazoNum = parseInt(prazo)
    if (!prazoNum || prazoNum < 1) { setErro('Prazo deve ser ao menos 1 dia.'); return }

    setSalvando(true)
    setErro('')
    const supabase = createClient()

    let foto_url: string | null = null
    if (fotoFile) {
      const ext = fotoFile.name.split('.').pop()
      const path = `brinquedos/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(path, fotoFile, { upsert: false })
      if (!uploadError) {
        const { data } = supabase.storage.from('fotos').getPublicUrl(path)
        foto_url = data.publicUrl
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('brinquedos').insert({
      nome: nome.trim(),
      categoria_id: categoriaId || null,
      prazo_max_dias_sem_limpeza: prazoNum,
      foto_url,
    })

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    router.push('/brinquedos')
  }

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => router.back()} className="text-slate-400 text-sm mb-4 flex items-center gap-1">
        ‹ Voltar
      </button>
      <h1 className="text-xl font-bold text-slate-800 mb-6">Novo brinquedo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Foto */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Foto</label>
          <div
            onClick={() => inputFotoRef.current?.click()}
            className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50 active:bg-slate-100"
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-3xl mb-1">📷</div>
                <p className="text-sm">Toque para adicionar foto</p>
              </div>
            )}
          </div>
          <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Castelo Princesa Rosa"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Sem categoria</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        {/* Prazo */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Maximo de dias sem limpeza *
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="365"
              value={prazo}
              onChange={e => setPrazo(e.target.value)}
              className="w-24 px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-slate-500 text-sm">dias</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Contado a partir da ultima armazenagem ou limpeza.
          </p>
        </div>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors mt-2"
        >
          {salvando ? 'Salvando...' : 'Salvar brinquedo'}
        </button>
      </form>
    </main>
  )
}
