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
      daily_inventory_records: {
        Row: {
          closing_stock: number
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          opening_stock: number
          received: number
          sold: number
          tank_id: string
          unit_price: number
        }
        Insert: {
          closing_stock: number
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          opening_stock: number
          received?: number
          sold?: number
          tank_id: string
          unit_price: number
        }
        Update: {
          closing_stock?: number
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          opening_stock?: number
          received?: number
          sold?: number
          tank_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_inventory_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_inventory_records_tank_id_fkey"
            columns: ["tank_id"]
            isOneToOne: false
            referencedRelation: "fuel_tanks"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          contact: string
          created_at: string | null
          hire_date: string
          id: string
          name: string
          position: string
          salary: number
          status: string
        }
        Insert: {
          contact: string
          created_at?: string | null
          hire_date: string
          id?: string
          name: string
          position: string
          salary: number
          status?: string
        }
        Update: {
          contact?: string
          created_at?: string | null
          hire_date?: string
          id?: string
          name?: string
          position?: string
          salary?: number
          status?: string
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
      fuel_tanks: {
        Row: {
          capacity: number
          created_at: string | null
          current_level: number
          fuel_type: string
          id: string
          name: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          current_level?: number
          fuel_type: string
          id?: string
          name: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          current_level?: number
          fuel_type?: string
          id?: string
          name?: string
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
          tank_id: string | null
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
          tank_id?: string | null
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
          tank_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_tank_id_fkey"
            columns: ["tank_id"]
            isOneToOne: false
            referencedRelation: "fuel_tanks"
            referencedColumns: ["id"]
          },
        ]
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
      tank_level_changes: {
        Row: {
          change_amount: number
          change_type: string
          created_at: string | null
          id: string
          new_level: number
          previous_level: number
          tank_id: string
        }
        Insert: {
          change_amount: number
          change_type: string
          created_at?: string | null
          id?: string
          new_level: number
          previous_level: number
          tank_id: string
        }
        Update: {
          change_amount?: number
          change_type?: string
          created_at?: string | null
          id?: string
          new_level?: number
          previous_level?: number
          tank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tank_level_changes_tank_id_fkey"
            columns: ["tank_id"]
            isOneToOne: false
            referencedRelation: "fuel_tanks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_tank_level_change: {
        Args: {
          p_tank_id: string
          p_change_amount: number
          p_previous_level: number
          p_new_level: number
          p_change_type: string
        }
        Returns: undefined
      }
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
