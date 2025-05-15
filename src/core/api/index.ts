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
export * as adapters from './adapters';

// Import and export all endpoints as API services
import * as tanksApi from './endpoints/tanks';
import * as shiftsApi from './endpoints/shifts';
import * as fillingSystemsApi from './endpoints/filling-systems';
import * as salesApi from './endpoints/sales';
import * as employeesApi from './endpoints/employees';
import * as petrolProvidersApi from './endpoints/petrol-providers';
import * as fuelPricesApi from './endpoints/fuel-prices';
import * as fuelTypesApi from './endpoints/fuel-types';
import * as fuelSuppliesApi from './endpoints/fuel-supplies';
import * as expensesApi from './endpoints/expenses';
import * as transactionsApi from './endpoints/transactions';
import * as dashboardApi from './endpoints/dashboard';
import * as profitLossApi from './endpoints/profit-loss';
import * as financialsApi from './endpoints/financials';

// Add the new fuel management API
import * as fuelManagementApi from './services/fuel-management';

// Export Supabase client
export { supabase } from './supabase';

// Export logger service
export { default as logger, initSentry } from '@/services/logger';

// Export all API services
export {
  tanksApi,
  shiftsApi,
  fillingSystemsApi,
  salesApi,
  employeesApi,
  petrolProvidersApi,
  fuelPricesApi,
  fuelTypesApi,
  fuelManagementApi,
  fuelSuppliesApi,
  expensesApi,
  transactionsApi,
  dashboardApi,
  profitLossApi,
  financialsApi
};

// Re-export API configurations
export {
  API_CONFIG,
  API_ENDPOINTS,
  API_ERROR_TYPE,
  POLLING_CONFIG,
  getErrorTypeFromStatus
} from '@/core/config/api';

// Export types from @/types that are used in the API
export type { FuelManagementSummary } from '@/types'; 