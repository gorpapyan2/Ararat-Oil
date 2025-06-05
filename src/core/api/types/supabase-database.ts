export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          contact: string;
          created_at: string | null;
          hire_date: string;
          id: string;
          name: string;
          position: string;
          salary: number;
          status: string;
        };
        Insert: {
          contact: string;
          created_at?: string | null;
          hire_date: string;
          id?: string;
          name: string;
          position: string;
          salary: number;
          status?: string;
        };
        Update: {
          contact?: string;
          created_at?: string | null;
          hire_date?: string;
          id?: string;
          name?: string;
          position?: string;
          salary?: number;
          status?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: number;
          category: string;
          created_at: string | null;
          date: string;
          description: string;
          id: string;
          invoice_number: string | null;
          notes: string | null;
          payment_method: string | null;
          payment_status: string;
        };
        Insert: {
          amount: number;
          category: string;
          created_at?: string | null;
          date: string;
          description: string;
          id?: string;
          invoice_number?: string | null;
          notes?: string | null;
          payment_method?: string | null;
          payment_status: string;
        };
        Update: {
          amount?: number;
          category?: string;
          created_at?: string | null;
          date?: string;
          description?: string;
          id?: string;
          invoice_number?: string | null;
          notes?: string | null;
          payment_method?: string | null;
          payment_status?: string;
        };
        Relationships: [];
      };
      filling_systems: {
        Row: {
          id: number;
          name: string;
          status: string;
          tank_id: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          status?: string;
          tank_id?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          status?: string;
          tank_id?: string | null;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          fuel_type: string;
          id: number;
          last_updated: string | null;
          quantity: number;
        };
        Insert: {
          fuel_type: string;
          id?: number;
          last_updated?: string | null;
          quantity?: number;
        };
        Update: {
          fuel_type?: string;
          id?: number;
          last_updated?: string | null;
          quantity?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          role: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      profit_loss_summary: {
        Row: {
          created_at: string | null;
          id: string;
          period: string;
          profit: number;
          total_expenses: number;
          total_sales: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          period: string;
          profit: number;
          total_expenses: number;
          total_sales: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          period?: string;
          profit?: number;
          total_expenses?: number;
          total_sales?: number;
        };
        Relationships: [];
      };
      sales: {
        Row: {
          created_at: string | null;
          date: string;
          filling_system_id: number | null;
          fuel_type: string;
          id: number;
          liters: number;
          price_per_unit: number;
          total_sales: number | null;
        };
        Insert: {
          created_at?: string | null;
          date?: string;
          filling_system_id?: number | null;
          fuel_type: string;
          id?: number;
          liters: number;
          price_per_unit: number;
          total_sales?: number | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          filling_system_id?: number | null;
          fuel_type?: string;
          id?: number;
          liters?: number;
          price_per_unit?: number;
          total_sales?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "sales_filling_system_id_fkey";
            columns: ["filling_system_id"];
            isOneToOne: false;
            referencedRelation: "filling_systems";
            referencedColumns: ["id"];
          },
        ];
      };
      shift_payment_methods: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          payment_method: string;
          reference: string | null;
          shift_id: string;
        };
        Insert: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          payment_method: string;
          reference?: string | null;
          shift_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          payment_method?: string;
          reference?: string | null;
          shift_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shift_payment_methods_shift_id_fkey";
            columns: ["shift_id"];
            isOneToOne: false;
            referencedRelation: "shifts";
            referencedColumns: ["id"];
          },
        ];
      };
      shifts: {
        Row: {
          closing_cash: number | null;
          created_at: string | null;
          employee_id: string;
          end_time: string | null;
          id: string;
          opening_cash: number;
          sales_total: number;
          start_time: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          closing_cash?: number | null;
          created_at?: string | null;
          employee_id: string;
          end_time?: string | null;
          id?: string;
          opening_cash?: number;
          sales_total?: number;
          start_time?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          closing_cash?: number | null;
          created_at?: string | null;
          employee_id?: string;
          end_time?: string | null;
          id?: string;
          opening_cash?: number;
          sales_total?: number;
          start_time?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shifts_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
