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
      filling_systems: {
        Row: {
          created_at: string
          id: string
          name: string
          tank_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tank_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filling_systems_tank_id_fkey"
            columns: ["tank_id"]
            isOneToOne: false
            referencedRelation: "fuel_tanks"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_prices: {
        Row: {
          created_at: string
          effective_date: string
          fuel_type: string
          fuel_type_id: string
          id: string
          price_per_liter: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_date?: string
          fuel_type: string
          fuel_type_id: string
          id?: string
          price_per_liter: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_date?: string
          fuel_type?: string
          fuel_type_id?: string
          id?: string
          price_per_liter?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fuel_prices_fuel_type"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_prices_backup: {
        Row: {
          action: string
          actioned_at: string
          created_at: string | null
          effective_date: string | null
          fuel_type: string | null
          fuel_type_id: string | null
          id: string | null
          price_per_liter: number | null
          updated_at: string | null
        }
        Insert: {
          action?: string
          actioned_at?: string
          created_at?: string | null
          effective_date?: string | null
          fuel_type?: string | null
          fuel_type_id?: string | null
          id?: string | null
          price_per_liter?: number | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          actioned_at?: string
          created_at?: string | null
          effective_date?: string | null
          fuel_type?: string | null
          fuel_type_id?: string | null
          id?: string | null
          price_per_liter?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fuel_supplies: {
        Row: {
          comments: string | null
          created_at: string | null
          delivery_date: string
          id: string
          payment_method: string | null
          payment_status: string
          price_per_liter: number
          provider_id: string
          quantity_liters: number
          shift_id: string | null
          tank_id: string
          total_cost: number
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          delivery_date: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          price_per_liter: number
          provider_id: string
          quantity_liters: number
          shift_id?: string | null
          tank_id: string
          total_cost: number
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          delivery_date?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          price_per_liter?: number
          provider_id?: string
          quantity_liters?: number
          shift_id?: string | null
          tank_id?: string
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "fuel_supplies_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "petrol_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_supplies_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_supplies_tank_id_fkey"
            columns: ["tank_id"]
            isOneToOne: false
            referencedRelation: "fuel_tanks"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_tanks: {
        Row: {
          capacity: number
          created_at: string | null
          current_level: number
          fuel_type: string
          fuel_type_id: string
          id: string
          name: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          current_level?: number
          fuel_type: string
          fuel_type_id: string
          id?: string
          name: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          current_level?: number
          fuel_type?: string
          fuel_type_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fuel_tanks_fuel_type"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_types: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: number
          method_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          method_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          method_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      petrol_providers: {
        Row: {
          contact: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
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
          profit?: number
          total_expenses?: number
          total_sales?: number
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
          employee_id: string | null
          filling_system_id: string | null
          id: string
          meter_end: number | null
          meter_start: number | null
          payment_status: string | null
          price_per_unit: number
          shift_id: string | null
          total_sales: number
          total_sold_liters: number
        }
        Insert: {
          created_at?: string | null
          date: string
          employee_id?: string | null
          filling_system_id?: string | null
          id?: string
          meter_end?: number | null
          meter_start?: number | null
          payment_status?: string | null
          price_per_unit: number
          shift_id?: string | null
          total_sales: number
          total_sold_liters?: number
        }
        Update: {
          created_at?: string | null
          date?: string
          employee_id?: string | null
          filling_system_id?: string | null
          id?: string
          meter_end?: number | null
          meter_start?: number | null
          payment_status?: string | null
          price_per_unit?: number
          shift_id?: string | null
          total_sales?: number
          total_sold_liters?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_filling_system_id_fkey"
            columns: ["filling_system_id"]
            isOneToOne: false
            referencedRelation: "filling_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_employees: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          shift_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          shift_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          shift_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_employees_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_payment_methods: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string
          reference: string | null
          shift_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method: string
          reference?: string | null
          shift_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string
          reference?: string | null
          shift_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_payment_methods_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          closing_cash: number | null
          created_at: string | null
          employee_id: string
          end_time: string | null
          id: string
          opening_cash: number
          sales_total: number
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          closing_cash?: number | null
          created_at?: string | null
          employee_id: string
          end_time?: string | null
          id?: string
          opening_cash?: number
          sales_total?: number
          start_time?: string
          status: string
          updated_at?: string | null
        }
        Update: {
          closing_cash?: number | null
          created_at?: string | null
          employee_id?: string
          end_time?: string | null
          id?: string
          opening_cash?: number
          sales_total?: number
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          employee_id: string
          entity_id: string | null
          entity_type: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          sale_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          employee_id: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          sale_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          employee_id?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          sale_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_fuel_supply: {
        Args: { p_supply: Json }
        Returns: Json
      }
      create_sale_and_update_tank: {
        Args: {
          p_date: string
          p_price_per_unit: number
          p_total_sales: number
          p_total_sold_liters: number
          p_meter_start: number
          p_meter_end: number
          p_filling_system_id: string
          p_employee_id: string
          p_tank_id: string
          p_previous_level: number
          p_new_level: number
          p_change_amount: number
        }
        Returns: {
          created_at: string | null
          date: string
          employee_id: string | null
          filling_system_id: string | null
          id: string
          meter_end: number | null
          meter_start: number | null
          payment_status: string | null
          price_per_unit: number
          shift_id: string | null
          total_sales: number
          total_sold_liters: number
        }
      }
      delete_fuel_supply: {
        Args: { p_id: string }
        Returns: Json
      }
      delete_sale_and_restore_tank: {
        Args: {
          p_sale_id: string
          p_tank_id: string
          p_previous_level: number
          p_new_level: number
          p_change_amount: number
        }
        Returns: undefined
      }
      employee_has_open_shift: {
        Args: { employee_id_param: string }
        Returns: boolean
      }
      get_shift_employees: {
        Args: { shift_id_param: string }
        Returns: {
          employee_id: string
          employee_name: string
          employee_position: string
          employee_status: string
        }[]
      }
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
      update_fuel_supply: {
        Args: { p_id: string; p_supply: Json }
        Returns: Json
      }
    }
    Enums: {
      employee_status: "active" | "on_leave" | "terminated"
      expense_category:
        | "utilities"
        | "rent"
        | "salaries"
        | "maintenance"
        | "supplies"
        | "taxes"
        | "insurance"
        | "other"
      fuel_type: "petrol" | "diesel" | "gas" | "kerosene" | "cng"
      payment_method: "cash" | "card" | "bank_transfer" | "mobile_payment"
      payment_status: "pending" | "completed" | "failed" | "refunded"
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
    Enums: {
      employee_status: ["active", "on_leave", "terminated"],
      expense_category: [
        "utilities",
        "rent",
        "salaries",
        "maintenance",
        "supplies",
        "taxes",
        "insurance",
        "other",
      ],
      fuel_type: ["petrol", "diesel", "gas", "kerosene", "cng"],
      payment_method: ["cash", "card", "bank_transfer", "mobile_payment"],
      payment_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
