import {
  financialsApi,
  ProfitLoss,
  RevenueData,
  ExpensesData,
  FinancialDashboard,
} from "@/core/api";
import { mockDataProvider } from "@/services/mockData";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  try {
    const response = await financialsApi.getProfitLoss();

    if (response.error) {
      console.warn("API error, using mock data:", response.error);
      return await mockDataProvider.getProfitLoss();
    }

    return response.data || [];
  } catch (err: unknown) {
    console.warn("Network error, using mock data:", err);
    // Fallback to mock data when API fails
    try {
      return await mockDataProvider.getProfitLoss();
    } catch (mockError) {
      console.error("Failed to get mock data:", mockError);
      return [];
    }
  }
};

export const fetchRevenue = async (period?: string): Promise<RevenueData> => {
  try {
    const response = await financialsApi.getRevenue(period);

    if (response.error) {
      console.warn("API error, using mock data:", response.error);
      return await mockDataProvider.getRevenue(period);
    }

    return response.data || { total: 0, breakdown: {} };
  } catch (err: unknown) {
    console.warn("Network error, using mock data:", err);
    // Fallback to mock data when API fails
    try {
      return await mockDataProvider.getRevenue(period);
    } catch (mockError) {
      console.error("Failed to get mock data:", mockError);
      return { total: 0, breakdown: {} };
    }
  }
};

export const fetchExpenses = async (period?: string): Promise<ExpensesData> => {
  try {
    const response = await financialsApi.getExpenses(period);

    if (response.error) {
      console.warn("API error, using mock data:", response.error);
      return await mockDataProvider.getExpenses(period);
    }

    return response.data || { total: 0, breakdown: {} };
  } catch (err: unknown) {
    console.warn("Network error, using mock data:", err);
    // Fallback to mock data when API fails
    try {
      return await mockDataProvider.getExpenses(period);
    } catch (mockError) {
      console.error("Failed to get mock data:", mockError);
      return { total: 0, breakdown: {} };
    }
  }
};

export const fetchFinancialDashboard =
  async (): Promise<FinancialDashboard> => {
    try {
      const response = await financialsApi.getDashboard();

      if (response.error) {
        console.warn("API error, using mock data:", response.error);
        return await mockDataProvider.getFinancialDashboard();
      }

      return (
        response.data || {
          revenue: { total: 0, trend: [] },
          expenses: { total: 0, trend: [] },
          profit: { total: 0, trend: [] },
        }
      );
    } catch (err: unknown) {
      console.warn("Network error, using mock data:", err);
      // Fallback to mock data when API fails
      try {
        return await mockDataProvider.getFinancialDashboard();
      } catch (mockError) {
        console.error("Failed to get mock data:", mockError);
        return {
          revenue: { total: 0, trend: [] },
          expenses: { total: 0, trend: [] },
          profit: { total: 0, trend: [] },
        };
      }
    }
  };
