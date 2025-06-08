
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          name: string
          contact: string
          position: string
          hire_date: string
          salary: number
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          contact: string
          position: string
          hire_date: string
          salary: number
          status: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          contact?: string
          position?: string
          hire_date?: string
          salary?: number
          status?: string
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
