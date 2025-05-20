import { dashboardApi, DashboardData } from "@/core/api";

// Define a fallback type for dashboard data 
const DEFAULT_DASHBOARD_DATA: DashboardData = {
  fuel_levels: {},
  recent_sales: [],
  revenue_summary: {
    daily: 0,
    weekly: 0,
    monthly: 0,
  },
  inventory_status: {
    total_capacity: 0,
    current_level: 0,
    percentage: 0,
  }
};

/**
 * Fetches dashboard data including recent sales, expenses, and fuel supplies
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await dashboardApi.getDashboardData();

    if (response.error) {
      console.error("Error fetching dashboard data:", response.error);
      return DEFAULT_DASHBOARD_DATA;
    }

    return response.data || DEFAULT_DASHBOARD_DATA;
  } catch (err: any) {
    console.error("Failed to fetch dashboard data:", err);
    return DEFAULT_DASHBOARD_DATA;
  }
}; 