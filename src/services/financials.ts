import {
  financialsApi,
  ProfitLoss,
  RevenueData,
  ExpensesData,
  FinancialDashboard,
} from "@/core/api";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  try {
    const response = await financialsApi.getProfitLoss();

    if (response.error) {
      console.warn("Failed to fetch profit/loss data:", response.error);
      return [];
    }

    const data = response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch (err: unknown) {
    console.error("Network error fetching profit/loss data:", err);
    return [];
  }
};

export const fetchRevenue = async (period?: string): Promise<RevenueData> => {
  try {
    const response = await financialsApi.getRevenue(period);

    if (response.error) {
      console.warn("Failed to fetch revenue data:", response.error);
      return { total: 0, breakdown: {} };
    }

    return response.data || { total: 0, breakdown: {} };
  } catch (err: unknown) {
    console.error("Network error fetching revenue data:", err);
    return { total: 0, breakdown: {} };
  }
};

export const fetchExpenses = async (period?: string): Promise<ExpensesData> => {
  try {
    const response = await financialsApi.getExpenses(period);

    if (response.error) {
      console.warn("Failed to fetch expenses data:", response.error);
      return { total: 0, breakdown: {} };
    }

    return response.data || { total: 0, breakdown: {} };
  } catch (err: unknown) {
    console.error("Network error fetching expenses data:", err);
    return { total: 0, breakdown: {} };
  }
};

export const fetchFinancialDashboard = async (): Promise<FinancialDashboard> => {
  try {
    const response = await financialsApi.getDashboard();

    if (response.error) {
      console.warn("Failed to fetch financial dashboard:", response.error);
      return {
        revenue: { total: 0, trend: [] },
        expenses: { total: 0, trend: [] },
        profit: { total: 0, trend: [] },
      };
    }

    return (
      response.data || {
        revenue: { total: 0, trend: [] },
        expenses: { total: 0, trend: [] },
        profit: { total: 0, trend: [] },
      }
    );
  } catch (err: unknown) {
    console.error("Network error fetching financial dashboard:", err);
    return {
      revenue: { total: 0, trend: [] },
      expenses: { total: 0, trend: [] },
      profit: { total: 0, trend: [] },
    };
  }
};
