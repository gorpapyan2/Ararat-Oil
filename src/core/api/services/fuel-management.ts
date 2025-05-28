import { supabase } from "../supabase";
import { FuelManagementSummary } from "@/types";
import { ApiResponse } from "../client";
import { API_ERROR_TYPE } from "@/core/config/api";
import { fetchFromFunction } from "../client";

interface FuelManagementFilters {
  dateRange?: { from: Date; to: Date };
  tankId?: string;
  fuelType?: string;
}

/**
 * Fetches the fuel management dashboard summary data
 */
export const getFuelManagementSummary = async (
  filters?: FuelManagementFilters
): Promise<ApiResponse<FuelManagementSummary>> => {
  try {
    // Convert filters to query parameters format expected by the API
    const queryParams: Record<string, string> = {};

    if (filters?.dateRange?.from && filters?.dateRange?.to) {
      queryParams.from_date = filters.dateRange.from.toISOString();
      queryParams.to_date = filters.dateRange.to.toISOString();
    }

    if (filters?.tankId) {
      queryParams.tank_id = filters.tankId;
    }

    if (filters?.fuelType && filters.fuelType !== "all") {
      queryParams.fuel_type = filters.fuelType;
    }

    // Make the actual API call using the fetchFromFunction utility
    return await fetchFromFunction<FuelManagementSummary>(
      "fuel-management/dashboard",
      { queryParams }
    );
  } catch (error) {
    console.error("Error fetching fuel management summary:", error);
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: API_ERROR_TYPE.UNKNOWN,
      },
    };
  }
};
