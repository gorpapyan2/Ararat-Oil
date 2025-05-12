import { dashboardApi } from "@/services/api";

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

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  recentSales: [],
  recentExpenses: [],
  recentSupplies: [],
  metrics: {
    salesCount: 0,
    expensesCount: 0,
    suppliesCount: 0,
  },
};

/**
 * Fetches dashboard data including recent sales, expenses, and fuel supplies
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const { data, error } = await dashboardApi.getData();

    if (error) {
      console.error("Error fetching dashboard data:", error);
      return DEFAULT_DASHBOARD_DATA;
    }

    return data || DEFAULT_DASHBOARD_DATA;
  } catch (err: any) {
    console.error("Failed to fetch dashboard data:", err);
    return DEFAULT_DASHBOARD_DATA;
  }
}; 