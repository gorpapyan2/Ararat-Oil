import { supabase } from "./supabase";
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

// API Functions for Tanks
export const tanksApi = {
  getAll: () => fetchFromFunction<Tank[]>("tanks"),
  getById: (id: string) => fetchFromFunction<Tank>(`tanks/${id}`),
  getLevelChanges: (id: string) =>
    fetchFromFunction<unknown[]>(`tanks/${id}/level-changes`),
  create: (data: TankCreate) =>
    fetchFromFunction<Tank>("tanks", { method: "POST", body: data }),
  update: (id: string, data: TankUpdate) =>
    fetchFromFunction<Tank>(`tanks/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`tanks/${id}`, { method: "DELETE" }),
  adjustLevel: (
    id: string,
    changeAmount: number,
    changeType: "add" | "subtract",
    reason?: string
  ) =>
    fetchFromFunction<Tank>(`tanks/${id}/adjust-level`, {
      method: "POST",
      body: { change_amount: changeAmount, change_type: changeType, reason },
    }),
  getSummary: () =>
    fetchFromFunction<{
      totalTanks: number;
      activeTanks: number;
      totalCapacity: number;
      totalCurrentLevel: number;
      lowLevelTanks: number;
      criticalLevelTanks: number;
    }>("tanks/summary"),
};

// API Functions for Filling Systems
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

// API Functions for Transactions
export const transactionsApi = {
  getAll: (filters?: {
    entity_type?: string;
    entity_id?: string;
    start_date?: string;
    end_date?: string;
  }) => fetchFromFunction<Transaction[]>("transactions", { queryParams: filters }),
  getById: (id: string) => fetchFromFunction<Transaction>(`transactions/${id}`),
  create: (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) =>
    fetchFromFunction<Transaction>("transactions", { method: "POST", body: data }),
  update: (id: string, data: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>) =>
    fetchFromFunction<Transaction>(`transactions/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`transactions/${id}`, { method: "DELETE" }),
};

// API Functions for Sales
export const salesApi = {
  getAll: (filters?: {
    shift_id?: string;
    start_date?: string;
    end_date?: string;
    employee?: string;
  }) => fetchFromFunction<Sale[]>("sales", { queryParams: filters }),
  getById: (id: string) => fetchFromFunction<Sale>(`sales/${id}`),
  getLatest: (fillingSystemId: string) =>
    fetchFromFunction<Sale>(`sales/latest/${fillingSystemId}`),
  create: (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) =>
    fetchFromFunction<Sale>("sales", { method: "POST", body: data }),
  update: (id: string, data: Partial<Omit<Sale, 'id' | 'created_at' | 'updated_at'>>) =>
    fetchFromFunction<Sale>(`sales/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`sales/${id}`, { method: "DELETE" }),
};

// API Functions for Expenses
export const expensesApi = {
  getAll: (filters?: {
    category?: string;
    start_date?: string;
    end_date?: string;
    payment_status?: string;
  }) => fetchFromFunction<Expense[]>("expenses", { queryParams: filters }),
  getById: (id: string) => fetchFromFunction<Expense>(`expenses/${id}`),
  getCategories: () => fetchFromFunction<string[]>("expenses/categories"),
  create: (data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) =>
    fetchFromFunction<Expense>("expenses", { method: "POST", body: data }),
  update: (id: string, data: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at'>>) =>
    fetchFromFunction<Expense>(`expenses/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`expenses/${id}`, { method: "DELETE" }),
};

// API Functions for Reports
export const reportsApi = {
  get: (
    type:
      | "sales"
      | "expenses"
      | "inventory"
      | "fuel_supply"
      | "fuel_consumption",
    timeframe: "day" | "week" | "month" | "quarter" | "year" | "custom",
    startDate?: string,
    endDate?: string
  ) =>
    fetchFromFunction<unknown>("reports", {
      queryParams: {
        type,
        timeframe,
        start_date: startDate,
        end_date: endDate,
      },
    }),

  custom: (params: {
    type:
      | "sales"
      | "expenses"
      | "inventory"
      | "fuel_supply"
      | "fuel_consumption";
    timeframe: "day" | "week" | "month" | "quarter" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    filters?: Record<string, unknown>;
    groupBy?: string[];
  }) => fetchFromFunction<unknown>("reports/custom", { method: "POST", body: params }),
};

// API Functions for Profit-Loss
export const profitLossApi = {
  calculate: (
    period: "day" | "week" | "month" | "quarter" | "year" | "custom",
    startDate?: string,
    endDate?: string,
    includeDetails?: boolean
  ) =>
    fetchFromFunction<unknown>("profit-loss", {
      queryParams: {
        period,
        start_date: startDate,
        end_date: endDate,
        include_details: includeDetails,
      },
    }),

  getSummary: (
    period: "day" | "week" | "month" | "quarter" | "year" | "custom",
    startDate?: string,
    endDate?: string
  ) =>
    fetchFromFunction<unknown>("profit-loss/summary", {
      queryParams: {
        period,
        start_date: startDate,
        end_date: endDate,
      },
    }),

  getById: (id: string) => fetchFromFunction<unknown>(`profit-loss/${id}`),

  generate: (params: {
    period_type: "day" | "week" | "month" | "quarter" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    notes?: string;
  }) => fetchFromFunction<unknown>("profit-loss", { method: "POST", body: params }),
};

// API Functions for Dashboard
export const dashboardApi = {
  getData: () => fetchFromFunction<unknown>("dashboard"),
  getMetrics: () => fetchFromFunction<unknown>("dashboard/metrics"),
  getRecentItems: (limit: number = 5) =>
    fetchFromFunction<unknown>("dashboard/recent", {
      queryParams: { limit },
    }),
};

// API Functions for Employees
export const employeesApi = {
  getAll: (filters?: { status?: string }) =>
    fetchFromFunction<Employee[]>("employees", { queryParams: filters }),
  getById: (id: string) => fetchFromFunction<Employee>(`employees/${id}`),
  getActive: () => fetchFromFunction<Employee[]>("employees/active"),
  create: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) =>
    fetchFromFunction<Employee>("employees", { method: "POST", body: data }),
  update: (id: string, data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>) =>
    fetchFromFunction<Employee>(`employees/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    fetchFromFunction<void>(`employees/${id}`, { method: "DELETE" }),
};

// API Functions for Fuel Prices
export const fuelPricesApi = {
  // List all fuel prices, optionally filter by fuel_type
  getAll: (fuelType?: string) =>
    fetchFromFunction("fuel-prices", {
      queryParams: fuelType ? { fuel_type: fuelType } : undefined,
    }),
  // Get a specific fuel price by ID
  getById: (id: string) => fetchFromFunction(`fuel-prices/${id}`),
  // Create a new fuel price
  create: (data: {
    fuel_type: string;
    price_per_liter: number;
    effective_date: string;
  }) => fetchFromFunction("fuel-prices", { method: "POST", body: data }),
  // Update a fuel price by ID
  update: (
    id: string,
    data: Partial<{
      fuel_type: string;
      price_per_liter: number;
      effective_date: string;
      status?: string;
    }>
  ) => fetchFromFunction(`fuel-prices/${id}`, { method: "PUT", body: data }),
  // Delete a fuel price by ID
  delete: (id: string) =>
    fetchFromFunction(`fuel-prices/${id}`, { method: "DELETE" }),
};

// API Functions for Shift Payment Methods
export const shiftPaymentMethodsApi = {
  getAll: (shiftId: string) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${shiftId}/payment-methods`),
  add: (shiftId: string, methods: ShiftPaymentMethod[]) =>
    fetchFromFunction<ShiftPaymentMethod[]>(`shifts/${shiftId}/payment-methods`, {
      method: "POST",
      body: methods,
    }),
  delete: (shiftId: string) =>
    fetchFromFunction<void>(`shifts/${shiftId}/payment-methods`, {
      method: "DELETE",
    }),
};

// API Functions for Financials
export const financialsApi = {
  getProfitLoss: () => fetchFromFunction<unknown>("financials/profit-loss"),
  getRevenue: (period?: string) =>
    fetchFromFunction<unknown>("financials/revenue", {
      queryParams: { period },
    }),
  getExpenses: (period?: string) =>
    fetchFromFunction<unknown>("financials/expenses", {
      queryParams: { period },
    }),
  getDashboard: () => fetchFromFunction<unknown>("financials/dashboard"),
};

// API Functions for Business Analytics
export const businessAnalyticsApi = {
  getMetrics: (timeframe?: string) =>
    fetchFromFunction<unknown>("business-analytics/metrics", {
      queryParams: { timeframe },
    }),
  getQuickActions: () =>
    fetchFromFunction<unknown>("business-analytics/quick-actions"),
  getRecentActivity: (limit?: number) =>
    fetchFromFunction<unknown>("business-analytics/recent-activity", {
      queryParams: { limit },
    }),
  getSystemHealth: () =>
    fetchFromFunction<unknown>("business-analytics/system-health"),
  getSummary: (timeframe?: string) =>
    fetchFromFunction<unknown>("business-analytics/summary", {
      queryParams: { timeframe },
    }),
};
