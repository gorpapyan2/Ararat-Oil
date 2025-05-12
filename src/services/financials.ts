import { financialsApi } from "@/services/api";
import { ProfitLoss } from "@/types";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  try {
    const { data, error } = await financialsApi.getProfitLoss();

    if (error) {
      console.error("Error fetching profit/loss summary:", error);
      throw new Error(error);
    }
    
    return data || [];
  } catch (err: any) {
    console.error("Failed to fetch profit/loss summary:", err);
    throw new Error(err.message || "Failed to fetch financial data");
  }
};

export const fetchRevenue = async (period?: string): Promise<any> => {
  try {
    const { data, error } = await financialsApi.getRevenue(period);

    if (error) {
      console.error("Error fetching revenue data:", error);
      throw new Error(error);
    }
    
    return data || { total: 0, breakdown: {} };
  } catch (err: any) {
    console.error("Failed to fetch revenue data:", err);
    throw new Error(err.message || "Failed to fetch revenue data");
  }
};

export const fetchExpenses = async (period?: string): Promise<any> => {
  try {
    const { data, error } = await financialsApi.getExpenses(period);

    if (error) {
      console.error("Error fetching expenses data:", error);
      throw new Error(error);
    }
    
    return data || { total: 0, breakdown: {} };
  } catch (err: any) {
    console.error("Failed to fetch expenses data:", err);
    throw new Error(err.message || "Failed to fetch expenses data");
  }
};

export const fetchFinancialDashboard = async (): Promise<any> => {
  try {
    const { data, error } = await financialsApi.getDashboard();

    if (error) {
      console.error("Error fetching financial dashboard:", error);
      throw new Error(error);
    }
    
    return data || { 
      revenue: { total: 0, trend: [] },
      expenses: { total: 0, trend: [] },
      profit: { total: 0, trend: [] }
    };
  } catch (err: any) {
    console.error("Failed to fetch financial dashboard:", err);
    throw new Error(err.message || "Failed to fetch financial dashboard");
  }
};
