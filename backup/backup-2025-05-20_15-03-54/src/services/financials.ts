import { financialsApi, ProfitLoss, RevenueData, ExpensesData, FinancialDashboard } from "@/core/api";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  try {
    const response = await financialsApi.getProfitLoss();

    if (response.error) {
      console.error("Error fetching profit/loss summary:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || [];
  } catch (err: any) {
    console.error("Failed to fetch profit/loss summary:", err);
    throw new Error(err.message || "Failed to fetch financial data");
  }
};

export const fetchRevenue = async (period?: string): Promise<RevenueData> => {
  try {
    const response = await financialsApi.getRevenue(period);

    if (response.error) {
      console.error("Error fetching revenue data:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || { total: 0, breakdown: {} };
  } catch (err: any) {
    console.error("Failed to fetch revenue data:", err);
    throw new Error(err.message || "Failed to fetch revenue data");
  }
};

export const fetchExpenses = async (period?: string): Promise<ExpensesData> => {
  try {
    const response = await financialsApi.getExpenses(period);

    if (response.error) {
      console.error("Error fetching expenses data:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || { total: 0, breakdown: {} };
  } catch (err: any) {
    console.error("Failed to fetch expenses data:", err);
    throw new Error(err.message || "Failed to fetch expenses data");
  }
};

export const fetchFinancialDashboard = async (): Promise<FinancialDashboard> => {
  try {
    const response = await financialsApi.getDashboard();

    if (response.error) {
      console.error("Error fetching financial dashboard:", response.error);
      throw new Error(response.error.message);
    }
    
    return response.data || { 
      revenue: { total: 0, trend: [] },
      expenses: { total: 0, trend: [] },
      profit: { total: 0, trend: [] }
    };
  } catch (err: any) {
    console.error("Failed to fetch financial dashboard:", err);
    throw new Error(err.message || "Failed to fetch financial dashboard");
  }
};
