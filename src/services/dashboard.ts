import { supabase } from "@/services/supabase";

// Define a type for dashboard data
export interface DashboardData {
  recentSales: any[];
  recentExpenses: any[];
  recentSupplies: any[];
  metrics: {
    salesCount: number;
    expensesCount: number;
    suppliesCount: number;
  };
}

/**
 * Fetches dashboard data including recent sales, expenses, and fuel supplies
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Get current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }

    // Fetch recent sales (last 5)
    const { data: recentSales, error: salesError } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (salesError) {
      console.error("Error fetching recent sales:", salesError);
      throw salesError;
    }

    // Fetch recent expenses (last 5)
    const { data: recentExpenses, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (expensesError) {
      console.error("Error fetching recent expenses:", expensesError);
      throw expensesError;
    }

    // Fetch recent fuel supplies (last 5)
    const { data: recentSupplies, error: suppliesError } = await supabase
      .from("fuel_supplies")
      .select("*, provider:provider_id(name), tank:tank_id(name, fuel_type)")
      .order("created_at", { ascending: false })
      .limit(5);

    if (suppliesError) {
      console.error("Error fetching recent fuel supplies:", suppliesError);
      throw suppliesError;
    }

    // Fetch metrics counts
    const { count: salesCount, error: salesCountError } = await supabase
      .from("sales")
      .select("*", { count: "exact", head: true });

    if (salesCountError) {
      console.error("Error counting sales:", salesCountError);
      throw salesCountError;
    }

    const { count: expensesCount, error: expensesCountError } = await supabase
      .from("expenses")
      .select("*", { count: "exact", head: true });

    if (expensesCountError) {
      console.error("Error counting expenses:", expensesCountError);
      throw expensesCountError;
    }

    const { count: suppliesCount, error: suppliesCountError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true });

    if (suppliesCountError) {
      console.error("Error counting fuel supplies:", suppliesCountError);
      throw suppliesCountError;
    }

    return {
      recentSales: recentSales || [],
      recentExpenses: recentExpenses || [],
      recentSupplies: recentSupplies || [],
      metrics: {
        salesCount: salesCount || 0,
        expensesCount: expensesCount || 0,
        suppliesCount: suppliesCount || 0,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error(error.message || "Failed to fetch dashboard data");
  }
}; 