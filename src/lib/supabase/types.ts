export type FlagEstado = 'ok' | 'molhado' | 'rasgado' | 'faltando_peca' | 'precisa_atencao' | 'sujo'

export type EstadoBrinquedo = {
  id: string
  nome: string
  foto_url: string | null
  prazo_max_dias_sem_limpeza: number
  categoria: string | null
  ultima_entrada: string | null
  flags_atual: FlagEstado[] | null
  observacoes_atual: string | null
  ultima_limpeza: string | null
  data_limite_limpeza: string | null
  dias_restantes: number | null
}

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: { id: string; nome: string; created_at: string }
        Insert: { id?: string; nome: string; created_at?: string }
        Update: { id?: string; nome?: string }
      }
      brinquedos: {
        Row: {
          id: string
          nome: string
          categoria_id: string | null
          foto_url: string | null
          prazo_max_dias_sem_limpeza: number
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          categoria_id?: string | null
          foto_url?: string | null
          prazo_max_dias_sem_limpeza?: number
          ativo?: boolean
        }
        Update: {
          nome?: string
          categoria_id?: string | null
          foto_url?: string | null
          prazo_max_dias_sem_limpeza?: number
          ativo?: boolean
        }
      }
      armazenagens: {
        Row: {
          id: string
          brinquedo_id: string
          data_entrada: string
          flags: FlagEstado[]
          observacoes: string | null
          registrado_por: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brinquedo_id: string
          data_entrada?: string
          flags?: FlagEstado[]
          observacoes?: string | null
          registrado_por?: string | null
        }
        Update: {
          flags?: FlagEstado[]
          observacoes?: string | null
        }
      }
      limpezas: {
        Row: {
          id: string
          brinquedo_id: string
          data_limpeza: string
          registrado_por: string | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brinquedo_id: string
          data_limpeza?: string
          registrado_por?: string | null
          observacoes?: string | null
        }
        Update: Record<string, never>
      }
      // View exposta como tabela read-only para o cliente Supabase
      estado_brinquedos: {
        Row: EstadoBrinquedo
        Insert: Record<string, never>
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Enums: {
      flag_estado: FlagEstado
    }
  }
}
