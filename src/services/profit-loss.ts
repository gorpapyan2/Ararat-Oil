import { profitLossApi, ProfitLoss } from "@/core/api";
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
    const response = await profitLossApi.calculate(
      period, 
      startDate, 
      endDate, 
      includeDetails
    );

    if (response.error) {
      console.error("Error calculating profit and loss:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
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
    const response = await profitLossApi.getSummary(period, startDate, endDate);

    if (response.error) {
      console.error("Error fetching profit-loss summary:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch profit-loss summary:", err);
    throw err;
  }
};

export const fetchProfitLossSummary = getProfitLossSummary;

export const getProfitLossById = async (id: string): Promise<ProfitLossSummary | null> => {
  try {
    const response = await profitLossApi.getById(id);

    if (response.error) {
      console.error(`Error fetching profit-loss record with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch profit-loss record with ID ${id}:`, err);
    throw err;
  }
};

export const generateAndSaveProfitLoss = async (
  params: GenerateProfitLossRequest
): Promise<ProfitLossSummary> => {
  try {
    const response = await profitLossApi.calculate(params.period_type, params.start_date, params.end_date, true);

    if (response.error) {
      console.error("Error generating profit-loss record:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error("Failed to generate profit-loss record:", err);
    throw err;
  }
}; 