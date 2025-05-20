/**
 * Core API Client Exports
 * 
 * This file centralizes all API-related exports from the core/api module.
 */

// Export client utilities
export { 
  fetchFromFunction,
  isNetworkError,
  createApiError 
} from './client';

// Export response and error types
export type { 
  ApiResponse, 
  ApiError, 
  ApiRequestOptions 
} from './client';

// Export API types
export * from './types';

// Export type adapters
export * from './adapters';

// Import all endpoints
import * as dashboardApi from './endpoints/dashboard';
import * as employeesApi from './endpoints/employees';
import * as expensesApi from './endpoints/expenses';
import * as fillingSystemsApi from './endpoints/filling-systems';
import * as financialsApi from './endpoints/financials';
import * as fuelPricesApi from './endpoints/fuel-prices';
import * as fuelTypesApi from './endpoints/fuel-types';
import * as petrolProvidersApi from './endpoints/petrol-providers';
import * as profitLossApi from './endpoints/profit-loss';
import * as salesApi from './endpoints/sales';
import * as shiftsApi from './endpoints/shifts';
import * as tanksApi from './endpoints/tanks';
import * as transactionsApi from './endpoints/transactions';

// Export Supabase client
export { supabase } from './supabase';

// Export logger service
export { default as logger, initSentry } from '@/services/logger';

// Import and export all endpoints as API services
export {
  dashboardApi,
  employeesApi,
  expensesApi,
  fillingSystemsApi,
  financialsApi,
  fuelPricesApi,
  fuelTypesApi,
  petrolProvidersApi,
  profitLossApi,
  salesApi,
  shiftsApi,
  tanksApi,
  transactionsApi,
};

// Export types from @/types that are used in the API
export type { FuelManagementSummary } from '@/types';

// Export all API endpoints
export * from './endpoints/dashboard';
export * from './endpoints/employees';
export * from './endpoints/expenses';
export * from './endpoints/filling-systems';
export * from './endpoints/financials';
export * from './endpoints/fuel-prices';
export * from './endpoints/fuel-types';
export * from './endpoints/petrol-providers';
export * from './endpoints/profit-loss';
export * from './endpoints/sales';
export * from './endpoints/shifts';
export * from './endpoints/tanks';
export * from './endpoints/transactions';

// Export all API types
export * from './types/expense-types';
export * from './types/sale-types';
export * from './types/employee-types';
export * from './types/profit-loss-types';
export * from './types/api-response';

// Export all adapters
export * from './adapters'; 