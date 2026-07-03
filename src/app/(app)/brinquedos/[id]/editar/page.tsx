'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Categoria = { id: string; nome: string }

export default function EditarBrinquedoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [prazo, setPrazo] = useState('30')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const inputFotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('categorias').select('id, nome').order('nome'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from('brinquedos')
        .select('nome, categoria_id, prazo_max_dias_sem_limpeza, foto_url')
        .eq('id', id)
        .single(),
    ]).then(([{ data: cats }, { data: b }]) => {
      setCategorias(cats ?? [])
      if (b) {
        setNome(b.nome)
        setCategoriaId(b.categoria_id ?? '')
        setPrazo(String(b.prazo_max_dias_sem_limpeza))
        setFotoUrl(b.foto_url)
        setFotoPreview(b.foto_url)
      }
      setCarregando(false)
    })
  }, [id])

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

    let foto_url = fotoUrl
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
    const { error } = await (supabase as any).from('brinquedos').update({
      nome: nome.trim(),
      categoria_id: categoriaId || null,
      prazo_max_dias_sem_limpeza: prazoNum,
      foto_url,
    }).eq('id', id)

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }

    router.push(`/brinquedos/${id}`)
  }

  if (carregando) {
    return (
      <main className="p-4 pt-6 max-w-lg mx-auto">
        <div className="text-center py-16 text-slate-400">Carregando...</div>
      </main>
    )
  }

  return (
    <main className="p-4 pt-6 max-w-lg mx-auto">
      <button onClick={() => router.back()} className="text-slate-400 text-sm mb-4 flex items-center gap-1">
        ‹ Voltar
      </button>
      <h1 className="text-xl font-bold text-slate-800 mb-6">Editar brinquedo</h1>

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
                <p className="text-sm">Toque para alterar foto</p>
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
        </div>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors mt-2"
        >
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </main>
  )
}
