/**
 * Service for handling profit-loss related operations
 *
 * This service has been updated to use standardized API methods from the core API.
 * - calculate -> calculateProfitLoss
 * - getSummary -> getProfitLossSummary
 * - getById -> getProfitLossById
 */

import { profitLossApi, ProfitLoss, logger } from "@/core/api";
import { ProfitLossSummary } from "@/types";

export type PeriodType =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

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

// Extended ProfitLoss type that includes details for the calculate function
interface ProfitLossWithDetails extends ProfitLoss {
  details?: {
    sales?: {
      by_fuel_type: Record<string, number>;
      by_employee: Record<string, number>;
      by_filling_system: Record<string, number>;
    };
    expenses?: {
      by_category: Record<string, number>;
    };
    fuel_supplies?: {
      by_provider: Record<string, number>;
      by_fuel_type: Record<string, number>;
    };
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
    const response = await profitLossApi.calculateProfitLoss(
      period,
      startDate,
      endDate,
      includeDetails
    );

    if (response.error) {
      console.error("Error calculating profit and loss:", response.error);
      throw new Error(response.error.message);
    }

    // Cast the data to the extended type that includes details
    const profitLossData = response.data as ProfitLossWithDetails;

    // Adapt the API response to the ProfitLossDetails type
    return {
      period: profitLossData?.period || "",
      total_sales: profitLossData?.revenue || 0,
      total_expenses: profitLossData?.expenses || 0,
      profit: profitLossData?.profit || 0,
      // Any additional details will be passed through if they exist
      ...(profitLossData?.details
        ? {
            sales_details: profitLossData.details.sales,
            expense_details: profitLossData.details.expenses,
            fuel_supply_details: profitLossData.details.fuel_supplies,
          }
        : {}),
    };
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
    logger.info("Fetching profit-loss summary", { period, startDate, endDate });
    
    const response = await profitLossApi.getProfitLossSummary(period as any);
    
    if (response.error || !response.data) {
      console.warn("Failed to fetch profit-loss summary:", response.error);
      return [];
    }

    // Convert single item to array if needed
    const dataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];
    
    // Return the data with correct property mapping
    return dataArray.map(item => ({
      id: item.id,
      period: item.period,
      total_sales: item.revenue || 0, // Map revenue to total_sales
      total_expenses: item.expenses || 0, // Map expenses to total_expenses
      profit: item.profit,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (err) {
    console.error("Failed to fetch profit-loss summary:", err);
    throw err;
  }
};

export const fetchProfitLossSummary = getProfitLossSummary;

export const getProfitLossById = async (
  id: string
): Promise<ProfitLossSummary | null> => {
  try {
    logger.info(`Fetching profit-loss record with ID: ${id}`);
    
    const response = await profitLossApi.getProfitLossById(id);
    
    if (response.error || !response.data) {
      console.warn(`Failed to fetch profit-loss record with ID ${id}:`, response.error);
      return null;
    }

    // Return the data with correct property mapping
    const item = response.data;
    return {
      id: item.id,
      period: item.period,
      total_sales: item.revenue || 0, // Map revenue to total_sales
      total_expenses: item.expenses || 0, // Map expenses to total_expenses
      profit: item.profit,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  } catch (err) {
    console.error(`Failed to fetch profit-loss record with ID ${id}:`, err);
    throw err;
  }
};

export const generateAndSaveProfitLoss = async (
  params: GenerateProfitLossRequest
): Promise<ProfitLossSummary> => {
  try {
    logger.info("Generating profit-loss record", params);
    
    // Use calculateProfitLoss instead since there's no create method
    const response = await profitLossApi.calculateProfitLoss(
      params.period_type,
      params.start_date,
      params.end_date,
      false
    );
    
    if (response.error || !response.data) {
      console.error("Failed to generate profit-loss record:", response.error);
      throw new Error(response.error?.message || "Failed to generate profit-loss record");
    }

    // Return the data with correct property mapping
    const item = response.data;
    return {
      id: item.id,
      period: item.period,
      total_sales: item.revenue || 0, // Map revenue to total_sales
      total_expenses: item.expenses || 0, // Map expenses to total_expenses
      profit: item.profit,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  } catch (err) {
    console.error("Failed to generate profit-loss record:", err);
    throw err;
  }
};
