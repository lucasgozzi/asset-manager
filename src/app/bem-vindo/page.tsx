'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { salvarUsuario } from '@/lib/usuario'

export default function BemVindoPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !empresa.trim()) {
      setErro('Preencha todos os campos.')
      return
    }
    salvarUsuario({ nome: nome.trim(), empresa: empresa.trim() })
    router.replace('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎪</div>
          <h1 className="text-2xl font-bold text-slate-800">Asset Manager</h1>
          <p className="text-slate-500 mt-1 text-sm">Gerenciamento de brinquedos e equipamentos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Quem e voce?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Seu nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Joao Silva"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Empresa</label>
              <input
                type="text"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                placeholder="Ex: Festas & Cia"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Suas informacoes ficam salvas apenas neste dispositivo.
        </p>
      </div>
    </main>
  )
}
