export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          card: string | null
          created_at: string | null
          id: string
          isSpectactorMode: boolean | null
          name: string | null
          teamId: string | null
        }
        Insert: {
          card?: string | null
          created_at?: string | null
          id?: string
          isSpectactorMode?: boolean | null
          name?: string | null
          teamId?: string | null
        }
        Update: {
          card?: string | null
          created_at?: string | null
          id?: string
          isSpectactorMode?: boolean | null
          name?: string | null
          teamId?: string | null
        }
      }
      teams: {
        Row: {
          cardMode: string | null
          created_at: string | null
          id: string
          isLocked: boolean | null
          name: string | null
        }
        Insert: {
          cardMode?: string | null
          created_at?: string | null
          id?: string
          isLocked?: boolean | null
          name?: string | null
        }
        Update: {
          cardMode?: string | null
          created_at?: string | null
          id?: string
          isLocked?: boolean | null
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

