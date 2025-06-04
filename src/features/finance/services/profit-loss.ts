/**
 * Service for handling profit-loss related operations
 *
 * This service has been updated to use standardized API methods from the core API.
 * - calculate -> calculateProfitLoss
 * - getSummary -> getProfitLossSummary
 * - getById -> getProfitLossById
 */

import { logger } from "@/core/utils/logger";
import { createApiError } from "@/core/utils/error-handling";
import { profitLossApi, ProfitLoss } from "@/core/api";
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
    const response = await profitLossApi.getProfitLossSummary(
      period,
      startDate,
      endDate
    );

    if (response.error) {
      console.error("Error fetching profit-loss summary:", response.error);
      throw new Error(response.error.message);
    }

    // Use adapter to convert API response to application type
    // Make sure we're passing an array to the adapter function
    const dataArray = Array.isArray(response.data)
      ? response.data
      : response.data
        ? [response.data]
        : [];
    return adapters.adaptApiProfitLossToSummaryArray(dataArray);
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
    const response = await profitLossApi.getProfitLossById(id);

    if (response.error) {
      console.error(
        `Error fetching profit-loss record with ID ${id}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    // Use adapter to convert API response to application type
    return response.data
      ? adapters.adaptApiProfitLossToSummary(response.data)
      : null;
  } catch (err) {
    console.error(`Failed to fetch profit-loss record with ID ${id}:`, err);
    throw err;
  }
};

export const generateAndSaveProfitLoss = async (
  params: GenerateProfitLossRequest
): Promise<ProfitLossSummary> => {
  try {
    const response = await profitLossApi.calculateProfitLoss(
      params.period_type,
      params.start_date,
      params.end_date,
      true
    );

    if (response.error) {
      console.error("Error generating profit-loss record:", response.error);
      throw new Error(response.error.message);
    }

    // Use adapter to convert API response to application type
    return adapters.adaptApiProfitLossToSummary(response.data!);
  } catch (err) {
    console.error("Failed to generate profit-loss record:", err);
    throw err;
  }
};

// Summary calculations
const DEFAULT_SUMMARY = {
  total: 0,
  current_month: 0,
  previous_month: 0,
  change_percentage: 0,
  trend: "stable" as const,
};

/**
 * Fetches profit and loss data for a specific date range
 */
export async function fetchProfitLossData(
  startDate?: string,
  endDate?: string,
  period: "daily" | "weekly" | "monthly" = "monthly"
): Promise<ProfitLoss[]> {
  try {
    logger.info("Fetching profit/loss data", { startDate, endDate, period });

    const response = await profitLossApi.getProfitLoss({
      start_date: startDate,
      end_date: endDate,
      period,
    });

    if (!response.success) {
      throw createApiError(
        "Failed to fetch profit/loss data",
        response.error || "Unknown error"
      );
    }

    return response.data || [];
  } catch (error) {
    logger.error("Error fetching profit/loss data:", error);
    throw error;
  }
}

/**
 * Creates a new profit/loss record
 */
export async function createProfitLossRecord(
  data: Omit<ProfitLoss, "id" | "created_at" | "updated_at">
): Promise<ProfitLoss> {
  try {
    logger.info("Creating profit/loss record", data);

    const response = await profitLossApi.createProfitLoss(data);

    if (!response.success) {
      throw createApiError(
        "Failed to create profit/loss record",
        response.error || "Unknown error"
      );
    }

    if (!response.data) {
      throw createApiError(
        "No data returned when creating profit/loss record",
        "Empty response"
      );
    }

    return response.data;
  } catch (error) {
    logger.error("Error creating profit/loss record:", error);
    throw error;
  }
}

/**
 * Updates an existing profit/loss record
 */
export async function updateProfitLossRecord(
  id: string,
  data: Partial<Omit<ProfitLoss, "id" | "created_at" | "updated_at">>
): Promise<ProfitLoss> {
  try {
    logger.info("Updating profit/loss record", { id, data });

    const response = await profitLossApi.updateProfitLoss(id, data);

    if (!response.success) {
      throw createApiError(
        "Failed to update profit/loss record",
        response.error || "Unknown error"
      );
    }

    if (!response.data) {
      throw createApiError(
        "No data returned when updating profit/loss record",
        "Empty response"
      );
    }

    return response.data;
  } catch (error) {
    logger.error("Error updating profit/loss record:", error);
    throw error;
  }
}

/**
 * Deletes a profit/loss record
 */
export async function deleteProfitLossRecord(id: string): Promise<void> {
  try {
    logger.info("Deleting profit/loss record", { id });

    const response = await profitLossApi.deleteProfitLoss(id);

    if (!response.success) {
      throw createApiError(
        "Failed to delete profit/loss record",
        response.error || "Unknown error"
      );
    }
  } catch (error) {
    logger.error("Error deleting profit/loss record:", error);
    throw error;
  }
}

/**
 * Gets profit/loss summary for dashboard display
 */
export async function getProfitLossSummary(
  startDate?: string,
  endDate?: string
) {
  try {
    logger.info("Fetching profit/loss summary", { startDate, endDate });

    const response = await profitLossApi.getProfitLossSummary({
      start_date: startDate,
      end_date: endDate,
    });

    if (!response.success) {
      logger.warn("Failed to fetch profit/loss summary, using default");
      return DEFAULT_SUMMARY;
    }

    return response.data || DEFAULT_SUMMARY;
  } catch (error) {
    logger.error("Error fetching profit/loss summary:", error);
    return DEFAULT_SUMMARY;
  }
}

/**
 * Gets profit/loss data for array of entries
 */
export async function getProfitLossDataArray(
  filters?: { start_date?: string; end_date?: string; period?: string }
): Promise<ProfitLoss[]> {
  try {
    logger.info("Fetching profit/loss data array", filters);

    const response = await profitLossApi.getProfitLoss(filters || {});

    if (!response.success) {
      logger.warn("Failed to fetch profit/loss data array, returning empty array");
      return [];
    }

    const dataArray = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
    return dataArray;
  } catch (error) {
    logger.error("Error fetching profit/loss data array:", error);
    return [];
  }
}

/**
 * Gets single profit/loss entry by ID
 */
export async function getProfitLossById(id: string) {
  try {
    logger.info("Fetching profit/loss by ID", { id });

    const response = await profitLossApi.getProfitLossById(id);

    if (!response.success) {
      throw createApiError(
        "Failed to fetch profit/loss record",
        response.error || "Unknown error"
      );
    }

    return response.data || null;
  } catch (error) {
    logger.error("Error fetching profit/loss by ID:", error);
    throw error;
  }
} 