import { supabase } from './supabase';

// Base URL for all Edge Function calls
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'http://localhost:54321/functions/v1';

// Helper to handle errors
const handleError = (error: any) => {
  console.error('API Error:', error);
  return { error: error.message || 'An unknown error occurred' };
};

// Generic fetch function that handles auth tokens and error handling
export async function fetchFromFunction<T = any>(
  functionPath: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
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
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add query parameters if provided
    let url = `${EDGE_FUNCTION_URL}/${functionPath}`;
    if (options.queryParams) {
      const queryString = Object.entries(options.queryParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      // Add body for non-GET requests if provided
      ...(options.method !== 'GET' && options.body
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
  getAll: () => fetchFromFunction('fuel-supplies'),
  getById: (id: string) => fetchFromFunction(`fuel-supplies/${id}`),
  create: (data: any) => fetchFromFunction('fuel-supplies', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`fuel-supplies/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`fuel-supplies/${id}`, { method: 'DELETE' }),
};

// API Functions for Shifts
export const shiftsApi = {
  getAll: () => fetchFromFunction('shifts'),
  getById: (id: string) => fetchFromFunction(`shifts/${id}`),
  getActive: () => fetchFromFunction('shifts/active'),
  getActiveForUser: (userId: string) => fetchFromFunction(`shifts/active/${userId}`),
  getSystemActive: () => fetchFromFunction('shifts/system-active'),
  getSalesTotal: (shiftId: string) => fetchFromFunction(`shifts/${shiftId}/sales-total`),
  start: (openingCash: number, employeeIds?: string[]) => 
    fetchFromFunction('shifts', { 
      method: 'POST', 
      body: { openingCash, employeeIds } 
    }),
  close: (id: string, closingCash: number, paymentMethods?: any[]) => 
    fetchFromFunction(`shifts/${id}/close`, { 
      method: 'POST', 
      body: { closingCash, paymentMethods } 
    }),
  getPaymentMethods: (id: string) => fetchFromFunction(`shifts/${id}/payment-methods`),
  addPaymentMethods: (id: string, methods: any[]) => 
    fetchFromFunction(`shifts/${id}/payment-methods`, { 
      method: 'POST', 
      body: methods 
    }),
  deletePaymentMethods: (id: string) => 
    fetchFromFunction(`shifts/${id}/payment-methods`, { 
      method: 'DELETE' 
    }),
};

// API Functions for Petrol Providers
export const petrolProvidersApi = {
  getAll: () => fetchFromFunction('petrol-providers'),
  getById: (id: string) => fetchFromFunction(`petrol-providers/${id}`),
  create: (data: any) => fetchFromFunction('petrol-providers', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`petrol-providers/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`petrol-providers/${id}`, { method: 'DELETE' }),
};

// API Functions for Fuel Types
export const fuelTypesApi = {
  getAll: () => fetchFromFunction('fuel-types'),
  getActive: () => fetchFromFunction('fuel-types/active'),
  getById: (id: string) => fetchFromFunction(`fuel-types/${id}`),
  create: (data: any) => fetchFromFunction('fuel-types', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`fuel-types/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`fuel-types/${id}`, { method: 'DELETE' }),
};

// API Functions for Tanks
export const tanksApi = {
  getAll: () => fetchFromFunction('tanks'),
  getById: (id: string) => fetchFromFunction(`tanks/${id}`),
  getLevelChanges: (id: string) => fetchFromFunction(`tanks/${id}/level-changes`),
  create: (data: any) => fetchFromFunction('tanks', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`tanks/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`tanks/${id}`, { method: 'DELETE' }),
  adjustLevel: (id: string, changeAmount: number, changeType: 'add' | 'subtract', reason?: string) => 
    fetchFromFunction(`tanks/${id}/adjust-level`, { 
      method: 'POST', 
      body: { change_amount: changeAmount, change_type: changeType, reason } 
    }),
};

// API Functions for Filling Systems
export const fillingSystemsApi = {
  getAll: () => fetchFromFunction('filling-systems'),
  getById: (id: string) => fetchFromFunction(`filling-systems/${id}`),
  create: (data: any) => fetchFromFunction('filling-systems', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`filling-systems/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`filling-systems/${id}`, { method: 'DELETE' }),
  validateTankIds: (tankIds: string[]) => 
    fetchFromFunction('filling-systems/validate-tank-ids', { 
      queryParams: { tankIds: tankIds.join(',') } 
    }),
};

// API Functions for Transactions
export const transactionsApi = {
  getAll: (filters?: { entity_type?: string; entity_id?: string; start_date?: string; end_date?: string }) => 
    fetchFromFunction('transactions', { queryParams: filters }),
  getById: (id: string) => fetchFromFunction(`transactions/${id}`),
  create: (data: any) => fetchFromFunction('transactions', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`transactions/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`transactions/${id}`, { method: 'DELETE' }),
};

// API Functions for Sales
export const salesApi = {
  getAll: (filters?: { shift_id?: string; start_date?: string; end_date?: string; employee?: string }) => 
    fetchFromFunction('sales', { queryParams: filters }),
  getById: (id: string) => fetchFromFunction(`sales/${id}`),
  getLatest: (fillingSystemId: string) => 
    fetchFromFunction(`sales/latest/${fillingSystemId}`),
  create: (data: any) => fetchFromFunction('sales', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`sales/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`sales/${id}`, { method: 'DELETE' }),
};

// API Functions for Expenses
export const expensesApi = {
  getAll: (filters?: { category?: string; start_date?: string; end_date?: string; payment_status?: string }) => 
    fetchFromFunction('expenses', { queryParams: filters }),
  getById: (id: string) => fetchFromFunction(`expenses/${id}`),
  getCategories: () => fetchFromFunction('expenses/categories'),
  create: (data: any) => fetchFromFunction('expenses', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`expenses/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`expenses/${id}`, { method: 'DELETE' }),
};

// API Functions for Reports
export const reportsApi = {
  get: (type: 'sales' | 'expenses' | 'inventory' | 'fuel_supply' | 'fuel_consumption', 
       timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom',
       startDate?: string, 
       endDate?: string) => 
    fetchFromFunction('reports', { 
      queryParams: { 
        type, 
        timeframe, 
        start_date: startDate, 
        end_date: endDate 
      } 
    }),
  
  custom: (params: {
    type: 'sales' | 'expenses' | 'inventory' | 'fuel_supply' | 'fuel_consumption';
    timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    start_date?: string;
    end_date?: string;
    filters?: Record<string, any>;
    groupBy?: string[];
  }) => fetchFromFunction('reports/custom', { method: 'POST', body: params }),
};

// API Functions for Profit-Loss
export const profitLossApi = {
  calculate: (
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom',
    startDate?: string,
    endDate?: string,
    includeDetails?: boolean
  ) => 
    fetchFromFunction('profit-loss', { 
      queryParams: { 
        period, 
        start_date: startDate, 
        end_date: endDate,
        include_details: includeDetails
      } 
    }),
  
  getSummary: (
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom',
    startDate?: string,
    endDate?: string
  ) => 
    fetchFromFunction('profit-loss/summary', { 
      queryParams: { 
        period, 
        start_date: startDate, 
        end_date: endDate
      } 
    }),
  
  getById: (id: string) => fetchFromFunction(`profit-loss/${id}`),
  
  generate: (params: {
    period_type: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    start_date?: string;
    end_date?: string;
    notes?: string;
  }) => fetchFromFunction('profit-loss', { method: 'POST', body: params }),
};

// API Functions for Dashboard
export const dashboardApi = {
  getData: () => fetchFromFunction('dashboard'),
  getMetrics: () => fetchFromFunction('dashboard/metrics'),
  getRecentItems: (limit: number = 5) => 
    fetchFromFunction('dashboard/recent', { 
      queryParams: { limit } 
    }),
};

// API Functions for Employees
export const employeesApi = {
  getAll: (filters?: { status?: string }) => 
    fetchFromFunction('employees', { queryParams: filters }),
  getById: (id: string) => fetchFromFunction(`employees/${id}`),
  getActive: () => fetchFromFunction('employees/active'),
  create: (data: any) => fetchFromFunction('employees', { method: 'POST', body: data }),
  update: (id: string, data: any) => fetchFromFunction(`employees/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => fetchFromFunction(`employees/${id}`, { method: 'DELETE' }),
};

// API Functions for Fuel Prices
export const fuelPricesApi = {
  // List all fuel prices, optionally filter by fuel_type
  getAll: (fuelType?: string) =>
    fetchFromFunction('fuel-prices', {
      queryParams: fuelType ? { fuel_type: fuelType } : undefined,
    }),
  // Get a specific fuel price by ID
  getById: (id: string) => fetchFromFunction(`fuel-prices/${id}`),
  // Create a new fuel price
  create: (data: { fuel_type: string; price_per_liter: number; effective_date: string }) =>
    fetchFromFunction('fuel-prices', { method: 'POST', body: data }),
  // Update a fuel price by ID
  update: (id: string, data: Partial<{ fuel_type: string; price_per_liter: number; effective_date: string; status?: string }>) =>
    fetchFromFunction(`fuel-prices/${id}`, { method: 'PUT', body: data }),
  // Delete a fuel price by ID
  delete: (id: string) => fetchFromFunction(`fuel-prices/${id}`, { method: 'DELETE' }),
};

// API Functions for Shift Payment Methods
export const shiftPaymentMethodsApi = {
  getAll: (shiftId: string) => 
    fetchFromFunction(`shifts/${shiftId}/payment-methods`),
  add: (shiftId: string, methods: any[]) => 
    fetchFromFunction(`shifts/${shiftId}/payment-methods`, { 
      method: 'POST', 
      body: methods 
    }),
  delete: (shiftId: string) => 
    fetchFromFunction(`shifts/${shiftId}/payment-methods`, { 
      method: 'DELETE' 
    }),
};

// API Functions for Financials
export const financialsApi = {
  getProfitLoss: () => fetchFromFunction('financials/profit-loss'),
  getRevenue: (period?: string) => 
    fetchFromFunction('financials/revenue', { 
      queryParams: { period } 
    }),
  getExpenses: (period?: string) => 
    fetchFromFunction('financials/expenses', { 
      queryParams: { period } 
    }),
  getDashboard: () => fetchFromFunction('financials/dashboard'),
};