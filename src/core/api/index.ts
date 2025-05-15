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

// Export Supabase client
export { supabase } from './supabase';

// Export API types
export * from './types';

// Export service APIs
export { fuelSuppliesApi } from './endpoints/fuel-supplies';
export { shiftsApi } from './endpoints/shifts';
export { tanksApi } from './endpoints/tanks';
export { fuelTypesApi } from './endpoints/fuel-types';
export { fillingSystemsApi } from './endpoints/filling-systems';
export { petrolProvidersApi } from './endpoints/petrol-providers';
export { expensesApi } from './endpoints/expenses';
export { transactionsApi } from './endpoints/transactions';
export { dashboardApi } from './endpoints/dashboard';
export { profitLossApi } from './endpoints/profit-loss';
export { salesApi } from './endpoints/sales';
export { employeesApi } from './endpoints/employees';
export { fuelPricesApi } from './endpoints/fuel-prices';
export { financialsApi } from './endpoints/financials';

// Export individual endpoint functions for Fuel Supplies
export { 
  getFuelSupplies,
  getFuelSupplyById,
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply
} from './endpoints/fuel-supplies';

// Export individual endpoint functions for Shifts
export {
  getShifts,
  getShiftById,
  getActiveShift,
  getActiveShiftForUser,
  getSystemActiveShift,
  getShiftSalesTotal,
  startShift,
  closeShift,
  getShiftPaymentMethods,
  addShiftPaymentMethods,
  deleteShiftPaymentMethods
} from './endpoints/shifts';

// Export individual endpoint functions for Tanks
export {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  adjustTankLevel
} from './endpoints/tanks';

// Export individual endpoint functions for Fuel Types
export {
  getFuelTypes,
  getActiveFuelTypes,
  getFuelTypeById,
  createFuelType,
  updateFuelType,
  deleteFuelType
} from './endpoints/fuel-types';

// Export individual endpoint functions for Filling Systems
export {
  getFilingSystems,
  getFilingSystemById,
  createFilingSystem,
  updateFilingSystem,
  deleteFilingSystem,
  validateTankIds
} from './endpoints/filling-systems';

// Export individual endpoint functions for Petrol Providers
export {
  getPetrolProviders,
  getPetrolProviderById,
  createPetrolProvider,
  updatePetrolProvider,
  deletePetrolProvider
} from './endpoints/petrol-providers';

// Export individual endpoint functions for Expenses
export {
  getExpenses,
  getExpenseById,
  getExpenseCategories,
  createExpense,
  updateExpense,
  deleteExpense
} from './endpoints/expenses';

// Export individual endpoint functions for Transactions
export {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from './endpoints/transactions';

// Export individual endpoint functions for Dashboard
export {
  getDashboardData,
  getFuelLevels,
  getSalesSummary
} from './endpoints/dashboard';

// Export individual endpoint functions for Profit Loss
export {
  calculateProfitLoss,
  getProfitLossSummary,
  getProfitLossById
} from './endpoints/profit-loss';

// Re-export API configurations
export {
  API_CONFIG,
  API_ENDPOINTS,
  API_ERROR_TYPE,
  POLLING_CONFIG,
  getErrorTypeFromStatus
} from '@/core/config/api'; 