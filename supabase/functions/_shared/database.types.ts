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
          id: string
          name: string
          position: string
          contact: string
          salary: number
          hire_date: string
          status: "active" | "on_leave" | "terminated"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          contact: string
          salary: number
          hire_date: string
          status?: "active" | "on_leave" | "terminated"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          contact?: string
          salary?: number
          hire_date?: string
          status?: "active" | "on_leave" | "terminated"
          created_at?: string
        }
        Relationships: []
      }
      petrol_providers: {
        Row: {
          id: string
          name: string
          contact_person: string
          phone: string
          email: string
          address: string
          tax_id: string
          bank_account: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person: string
          phone: string
          email: string
          address: string
          tax_id: string
          bank_account: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string
          phone?: string
          email?: string
          address?: string
          tax_id?: string
          bank_account?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fuel_types: {
        Row: {
          id: string
          code: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tanks: {
        Row: {
          id: string
          name: string
          capacity: number
          current_level: number
          fuel_type_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          capacity: number
          current_level: number
          fuel_type_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          capacity?: number
          current_level?: number
          fuel_type_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tanks_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["id"]
          }
        ]
      }
      filling_systems: {
        Row: {
          id: string
          name: string
          tank_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          tank_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          tank_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filling_systems_tank_id_fkey"
            columns: ["tank_id"]
            referencedRelation: "tanks"
            referencedColumns: ["id"]
          }
        ]
      }
      sales: {
        Row: {
          id: string
          date: string
          fuel_type: string
          quantity: number
          price_per_unit: number
          total_sales: number
          payment_status: "pending" | "completed" | "failed" | "refunded"
          filling_system_name: string
          meter_start: number
          meter_end: number
          filling_system_id: string
          employee_id: string
          shift_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          fuel_type: string
          quantity: number
          price_per_unit: number
          total_sales: number
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          filling_system_name: string
          meter_start: number
          meter_end: number
          filling_system_id: string
          employee_id: string
          shift_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          fuel_type?: string
          quantity?: number
          price_per_unit?: number
          total_sales?: number
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          filling_system_name?: string
          meter_start?: number
          meter_end?: number
          filling_system_id?: string
          employee_id?: string
          shift_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_filling_system_id_fkey"
            columns: ["filling_system_id"]
            referencedRelation: "filling_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_shift_id_fkey"
            columns: ["shift_id"]
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          date: string
          amount: number
          category: "utilities" | "rent" | "salaries" | "maintenance" | "supplies" | "taxes" | "insurance" | "other"
          description: string
          payment_status: "pending" | "completed" | "failed" | "refunded"
          payment_method: "cash" | "card" | "bank_transfer" | "mobile_payment" | null
          invoice_number: string | null
          notes: string | null
          employee_id: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          amount: number
          category: "utilities" | "rent" | "salaries" | "maintenance" | "supplies" | "taxes" | "insurance" | "other"
          description: string
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_method?: "cash" | "card" | "bank_transfer" | "mobile_payment" | null
          invoice_number?: string | null
          notes?: string | null
          employee_id: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          amount?: number
          category?: "utilities" | "rent" | "salaries" | "maintenance" | "supplies" | "taxes" | "insurance" | "other"
          description?: string
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_method?: "cash" | "card" | "bank_transfer" | "mobile_payment" | null
          invoice_number?: string | null
          notes?: string | null
          employee_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      fuel_supplies: {
        Row: {
          id: string
          delivery_date: string
          provider_id: string
          tank_id: string
          quantity_liters: number
          price_per_liter: number
          total_cost: number
          comments: string | null
          created_at: string
        }
        Insert: {
          id?: string
          delivery_date: string
          provider_id: string
          tank_id: string
          quantity_liters: number
          price_per_liter: number
          total_cost: number
          comments?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          delivery_date?: string
          provider_id?: string
          tank_id?: string
          quantity_liters?: number
          price_per_liter?: number
          total_cost?: number
          comments?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_supplies_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "petrol_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_supplies_tank_id_fkey"
            columns: ["tank_id"]
            referencedRelation: "tanks"
            referencedColumns: ["id"]
          }
        ]
      }
      shifts: {
        Row: {
          id: string
          employee_id: string
          start_time: string
          end_time: string | null
          opening_cash: number
          closing_cash: number | null
          sales_total: number
          status: "OPEN" | "CLOSED"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          start_time: string
          end_time?: string | null
          opening_cash: number
          closing_cash?: number | null
          sales_total?: number
          status?: "OPEN" | "CLOSED"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          start_time?: string
          end_time?: string | null
          opening_cash?: number
          closing_cash?: number | null
          sales_total?: number
          status?: "OPEN" | "CLOSED"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          amount: number
          payment_method: "cash" | "card" | "bank_transfer" | "mobile_payment"
          payment_status: "pending" | "completed" | "failed" | "refunded"
          payment_reference: string | null
          employee_id: string
          sale_id: string | null
          entity_id: string | null
          entity_type: "sale" | "expense" | "fuel_supply" | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          payment_method: "cash" | "card" | "bank_transfer" | "mobile_payment"
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_reference?: string | null
          employee_id: string
          sale_id?: string | null
          entity_id?: string | null
          entity_type?: "sale" | "expense" | "fuel_supply" | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          payment_method?: "cash" | "card" | "bank_transfer" | "mobile_payment"
          payment_status?: "pending" | "completed" | "failed" | "refunded"
          payment_reference?: string | null
          employee_id?: string
          sale_id?: string | null
          entity_id?: string | null
          entity_type?: "sale" | "expense" | "fuel_supply" | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sale_id_fkey"
            columns: ["sale_id"]
            referencedRelation: "sales"
            referencedColumns: ["id"]
          }
        ]
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