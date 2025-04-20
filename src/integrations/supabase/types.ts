export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          contact: string
          created_at: string | null
          hire_date: string
          id: string
          name: string
          position: string
          salary: number
        }
        Insert: {
          contact: string
          created_at?: string | null
          hire_date: string
          id?: string
          name: string
          position: string
          salary: number
        }
        Update: {
          contact?: string
          created_at?: string | null
          hire_date?: string
          id?: string
          name?: string
          position?: string
          salary?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_status: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          payment_status: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_status?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          closing_stock: number
          created_at: string | null
          date: string
          fuel_type: string
          id: string
          opening_stock: number
          received: number
          sold: number
          unit_price: number
        }
        Insert: {
          closing_stock: number
          created_at?: string | null
          date: string
          fuel_type: string
          id?: string
          opening_stock: number
          received: number
          sold: number
          unit_price: number
        }
        Update: {
          closing_stock?: number
          created_at?: string | null
          date?: string
          fuel_type?: string
          id?: string
          opening_stock?: number
          received?: number
          sold?: number
          unit_price?: number
        }
        Relationships: []
      }
      profit_loss_summary: {
        Row: {
          created_at: string | null
          id: string
          period: string
          profit: number
          total_expenses: number
          total_sales: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          period: string
          profit: number
          total_expenses: number
          total_sales: number
        }
        Update: {
          created_at?: string | null
          id?: string
          period?: string
          profit?: number
          total_expenses?: number
          total_sales?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string | null
          date: string
          fuel_type: string
          id: string
          payment_status: string
          price_per_unit: number
          quantity: number
          total_sales: number
        }
        Insert: {
          created_at?: string | null
          date: string
          fuel_type: string
          id?: string
          payment_status: string
          price_per_unit: number
          quantity: number
          total_sales: number
        }
        Update: {
          created_at?: string | null
          date?: string
          fuel_type?: string
          id?: string
          payment_status?: string
          price_per_unit?: number
          quantity?: number
          total_sales?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
