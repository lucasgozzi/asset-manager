'use client'

export type UsuarioLocal = {
  nome: string
  empresa: string
}

const CHAVE = 'asset_manager_usuario'

export function getUsuario(): UsuarioLocal | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(CHAVE)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UsuarioLocal
  } catch {
    return null
  }
}

export function salvarUsuario(usuario: UsuarioLocal): void {
  localStorage.setItem(CHAVE, JSON.stringify(usuario))
}
