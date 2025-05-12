import { profitLossApi } from "@/services/api";
import { ProfitLossSummary } from "@/types";

export type PeriodType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface ProfitLossDetails {
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  sales_details?: {
    by_fuel_type: Record<string, number>;
    by_employee: Record<string, number>;
    by_filling_system: Record<string, number>;
  };
  expense_details?: {
    by_category: Record<string, number>;
  };
  fuel_supply_details?: {
    by_provider: Record<string, number>;
    by_fuel_type: Record<string, number>;
  };
}

export interface GenerateProfitLossRequest {
  period_type: PeriodType;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export const calculateProfitLoss = async (
  period: PeriodType,
  startDate?: string,
  endDate?: string,
  includeDetails = false
): Promise<ProfitLossDetails> => {
  try {
    const { data, error } = await profitLossApi.calculate(
      period, 
      startDate, 
      endDate, 
      includeDetails
    );

    if (error) {
      console.error("Error calculating profit and loss:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to calculate profit and loss:", err);
    throw err;
  }
};

export const getProfitLossSummary = async (
  period: PeriodType,
  startDate?: string,
  endDate?: string
): Promise<ProfitLossSummary[]> => {
  try {
    const { data, error } = await profitLossApi.getSummary(period, startDate, endDate);

    if (error) {
      console.error("Error fetching profit-loss summary:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch profit-loss summary:", err);
    throw err;
  }
};

export const fetchProfitLossSummary = getProfitLossSummary;

export const getProfitLossById = async (id: string): Promise<ProfitLossSummary | null> => {
  try {
    const { data, error } = await profitLossApi.getById(id);

    if (error) {
      console.error(`Error fetching profit-loss record with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch profit-loss record with ID ${id}:`, err);
    throw err;
  }
};

export const generateAndSaveProfitLoss = async (
  params: GenerateProfitLossRequest
): Promise<ProfitLossSummary> => {
  try {
    const { data, error } = await profitLossApi.generate(params);

    if (error) {
      console.error("Error generating profit-loss record:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to generate profit-loss record:", err);
    throw err;
  }
}; 