import { supabase } from "@/core/api";
import type {
  FuelSupply,
  FuelSupplyCreate,
  FuelSupplyUpdate,
  Shift,
  ShiftPaymentMethod,
  PetrolProvider,
  PetrolProviderCreate,
  PetrolProviderUpdate,
  FuelType,
  FuelTypeCreate,
  FuelTypeUpdate,
  Tank,
  TankCreate,
  TankUpdate,
  FillingSystem,
  FillingSystemCreate,
  FillingSystemUpdate,
  Transaction,
  Sale,
  Expense,
  Employee,
} from "@/core/api/types";

// Base URL for all Edge Function calls
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL

// Helper to handle errors
const handleError = (error: unknown) => {
  console.error("API Error:", error);
  return { 
    error: error instanceof Error ? error.message : "An unknown error occurred" 
  };
};

// Generic fetch function that handles auth tokens and error handling
export async function fetchFromFunction<T = unknown>(
  functionPath: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | null | undefined>;
  } = {}
): Promise<{ data?: T; error?: string }> {
  try {
    // Get current session for auth token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    // Set up headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add query parameters if provided
    let url = `${EDGE_FUNCTION_URL}/${functionPath}`;
    if (options.queryParams) {
      const queryString = Object.entries(options.queryParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: options.method || "GET",
      headers,
      // Add body for non-GET requests if provided
      ...(options.method !== "GET" && options.body
        ? { body: JSON.stringify(options.body) }
        : {}),
    };

    // Make the fetch request
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    // Check for error response
    if (!response.ok) {
      throw new Error(result.error || `HTTP error ${response.status}`);
    }

    return result;
  } catch (error) {
    return handleError(error);
  }
}

/*
 * ⚠️ DEPRECATION NOTICE:
 * 
 * The API implementations below have been moved to @/core/api/endpoints/*
 * Please import from @/core/api instead of using these deprecated functions.
 * 
 * These will be removed in a future version.
 * 
 * Migration examples:
 * - import { employeesApi } from "@/services/api" → import { employeesApi } from "@/core/api"
 * - import { salesApi } from "@/services/api" → import { salesApi } from "@/core/api"
 * - import { tanksApi } from "@/services/api" → import { tanksApi } from "@/core/api"
 */

// API Functions for Fuel Supplies
export const fuelSuppliesApi = {
  getAll: () => fetchFromFunction<FuelSupply[]>("fuel-supplies"),
  getById: (id: string) => fetchFromFunction<FuelSupply>(`fuel-supplies/${id}`),
  create: (data: FuelSupplyCreate) =>
    fetchFromFunction<FuelSupply>("fuel-supplies", { method: "POST", body: data }),
  update: (id: string, data: FuelSupplyUpdate) =>
    fetchFromFunction<FuelSupply>(`fuel-supplies/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`fuel-supplies/${id}`, { method: "DELETE" }),
};

// API Functions for Shifts
export const shiftsApi = {
  getAll: () => fetchFromFunction<Shift[]>("shifts"),
  getById: (id: string) => fetchFromFunction<Shift>(`shifts/${id}`),
  getActive: () => fetchFromFunction<Shift>("shifts/active"),
  getActiveForUser: (userId: string) =>
    fetchFromFunction<Shift>(`shifts/active/${userId}`),
  getSystemActive: () => fetchFromFunction<Shift>("shifts/system-active"),
  getSalesTotal: (shiftId: string) =>
    fetchFromFunction<{ total: number }>(`shifts/${shiftId}/sales-total`),
  start: (openingCash: number, employeeIds?: string[]) =>
    fetchFromFunction<Shift>("shifts", {
      method: "POST",
      body: { openingCash, employeeIds },
    }),
  close: (id: string, closingCash: number, paymentMethods?: ShiftPaymentMethod[]) =>
    fetchFromFunction<Shift>(`shifts/${id}/close`, {
      method: "POST",
      body: { closingCash, paymentMethods },
    }),
  getPaymentMethods: (id: string) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${id}/payment-methods`),
  addPaymentMethods: (id: string, methods: ShiftPaymentMethod[]) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${id}/payment-methods`, {
      method: "POST",
      body: methods,
    }),
  deletePaymentMethods: (id: string) =>
    fetchFromFunction<void>(`shifts/${id}/payment-methods`, {
      method: "DELETE",
    }),
};

// API Functions for Petrol Providers
export const petrolProvidersApi = {
  getAll: () => fetchFromFunction<PetrolProvider[]>("petrol-providers"),
  getById: (id: string) => fetchFromFunction<PetrolProvider>(`petrol-providers/${id}`),
  create: (data: PetrolProviderCreate) =>
    fetchFromFunction<PetrolProvider>("petrol-providers", { method: "POST", body: data }),
  update: (id: string, data: PetrolProviderUpdate) =>
    fetchFromFunction<PetrolProvider>(`petrol-providers/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`petrol-providers/${id}`, { method: "DELETE" }),
};

// API Functions for Fuel Types
export const fuelTypesApi = {
  getAll: () => fetchFromFunction<FuelType[]>("fuel-types"),
  getActive: () => fetchFromFunction<FuelType[]>("fuel-types/active"),
  getById: (id: string) => fetchFromFunction<FuelType>(`fuel-types/${id}`),
  create: (data: FuelTypeCreate) =>
    fetchFromFunction<FuelType>("fuel-types", { method: "POST", body: data }),
  update: (id: string, data: FuelTypeUpdate) =>
    fetchFromFunction<FuelType>(`fuel-types/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`fuel-types/${id}`, { method: "DELETE" }),
};

/*
 * 🚨 DEPRECATED APIs - Use @/core/api instead
 * 
 * The following APIs have been consolidated in @/core/api/endpoints/
 * Import from the new location:
 */

// ❌ DEPRECATED: Use import { tanksApi } from "@/core/api" instead
// Note: tanksApi has been moved to src/core/api/endpoints/tanks.ts

// ❌ DEPRECATED: Use import { employeesApi } from "@/core/api" instead  
// Note: employeesApi has been moved to src/core/api/endpoints/employees.ts

// ❌ DEPRECATED: Use import { salesApi } from "@/core/api" instead
// Note: salesApi has been moved to src/core/api/endpoints/sales.ts

// ❌ DEPRECATED: Use import { expensesApi } from "@/core/api" instead
// Note: expensesApi has been moved to src/core/api/endpoints/expenses.ts

// ❌ DEPRECATED: Use import { transactionsApi } from "@/core/api" instead
// Note: transactionsApi has been moved to src/core/api/endpoints/transactions.ts

// ❌ DEPRECATED: Use import { fillingSystemsApi } from "@/core/api" instead
// Note: fillingSystemsApi has been moved to src/core/api/endpoints/filling-systems.ts

// Legacy functions maintained for backward compatibility (will be removed in v2.0.0)

// API Functions for Filling Systems (DEPRECATED)
export const fillingSystemsApi = {
  getAll: () => fetchFromFunction<FillingSystem[]>("filling-systems"),
  getById: (id: string) => fetchFromFunction<FillingSystem>(`filling-systems/${id}`),
  create: (data: FillingSystemCreate) =>
    fetchFromFunction<FillingSystem>("filling-systems", { method: "POST", body: data }),
  update: (id: string, data: FillingSystemUpdate) =>
    fetchFromFunction<FillingSystem>(`filling-systems/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`filling-systems/${id}`, { method: "DELETE" }),
  validateTankIds: (tankIds: string[]) =>
    fetchFromFunction<{ valid: boolean; invalidIds?: string[] }>("filling-systems/validate-tank-ids", {
      queryParams: { tankIds: tankIds.join(",") },
    }),
};

// Simplified legacy API exports for backward compatibility
export const reportsApi = {
  get: (type: string, timeframe: string, startDate?: string, endDate?: string) =>
    fetchFromFunction<unknown>("reports", {
      queryParams: { type, timeframe, start_date: startDate, end_date: endDate },
    }),
  custom: (params: any) => fetchFromFunction<unknown>("reports/custom", { method: "POST", body: params }),
};

export const profitLossApi = {
  calculate: (period: string, startDate?: string, endDate?: string, includeDetails?: boolean) =>
    fetchFromFunction<unknown>("profit-loss", {
      queryParams: { period, start_date: startDate, end_date: endDate, include_details: includeDetails },
    }),
  getSummary: (period: string, startDate?: string, endDate?: string) =>
    fetchFromFunction<unknown>("profit-loss/summary", {
      queryParams: { period, start_date: startDate, end_date: endDate },
    }),
  getById: (id: string) => fetchFromFunction<unknown>(`profit-loss/${id}`),
  generate: (params: any) => fetchFromFunction<unknown>("profit-loss", { method: "POST", body: params }),
};

export const dashboardApi = {
  getData: () => fetchFromFunction<unknown>("dashboard"),
  getMetrics: () => fetchFromFunction<unknown>("dashboard/metrics"),
  getRecentItems: (limit: number = 5) =>
    fetchFromFunction<unknown>("dashboard/recent", { queryParams: { limit } }),
};

export const fuelPricesApi = {
  getAll: (fuelType?: string) =>
    fetchFromFunction("fuel-prices", {
      queryParams: fuelType ? { fuel_type: fuelType } : undefined,
    }),
  getById: (id: string) => fetchFromFunction(`fuel-prices/${id}`),
  create: (data: any) => fetchFromFunction("fuel-prices", { method: "POST", body: data }),
  update: (id: string, data: any) => fetchFromFunction(`fuel-prices/${id}`, { method: "PUT", body: data }),
  delete: (id: string) => fetchFromFunction(`fuel-prices/${id}`, { method: "DELETE" }),
};

export const shiftPaymentMethodsApi = {
  getAll: (shiftId: string) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${shiftId}/payment-methods`),
  add: (shiftId: string, methods: ShiftPaymentMethod[]) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${shiftId}/payment-methods`, {
      method: "POST",
      body: methods,
    }),
  delete: (shiftId: string) =>
    fetchFromFunction<void>(`shifts/${shiftId}/payment-methods`, { method: "DELETE" }),
};

export const financialsApi = {
  getProfitLoss: () => fetchFromFunction<unknown>("financials/profit-loss"),
  getRevenue: (period?: string) =>
    fetchFromFunction<unknown>("financials/revenue", { queryParams: { period } }),
  getExpenses: (period?: string) =>
    fetchFromFunction<unknown>("financials/expenses", { queryParams: { period } }),
  getDashboard: () => fetchFromFunction<unknown>("financials/dashboard"),
};

export const businessAnalyticsApi = {
  getMetrics: (timeframe?: string) =>
    fetchFromFunction<unknown>("business-analytics/metrics", { queryParams: { timeframe } }),
  getQuickActions: () => fetchFromFunction<unknown>("business-analytics/quick-actions"),
  getRecentActivity: (limit?: number) =>
    fetchFromFunction<unknown>("business-analytics/recent-activity", { queryParams: { limit } }),
  getSystemHealth: () => fetchFromFunction<unknown>("business-analytics/system-health"),
  getSummary: (timeframe?: string) =>
    fetchFromFunction<unknown>("business-analytics/summary", { queryParams: { timeframe } }),
};
