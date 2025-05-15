/**
 * API Translation Keys
 * 
 * This file provides helper functions to standardize i18n translation keys 
 * related to the core API. It centralizes API-related translations to make
 * maintenance easier and avoid duplication.
 */

import i18next from 'i18next';

/**
 * Translation namespaces for API modules
 */
export const apiNamespaces = {
  employees: 'employees',
  tanks: 'tanks',
  fillingSystems: 'fillingSystems',
  sales: 'sales',
  shifts: 'shifts',
  transactions: 'transactions',
  expenses: 'expenses',
  fuelSupplies: 'fuelSupplies',
  petrolProviders: 'petrolProviders',
  finances: 'finances',
  profitLoss: 'profitLoss',
  dashboard: 'dashboard',
  fuelPrices: 'fuelPrices',
  auth: 'auth'
} as const;

/**
 * Translation function for API-related errors
 */
export const getApiErrorMessage = (
  moduleName: keyof typeof apiNamespaces,
  operation: 'create' | 'update' | 'get' | 'delete' | 'fetch',
  entityName?: string
): string => {
  // Entity name defaults to module name if not provided
  const entity = entityName || moduleName;
  
  // Standard error message keys
  const errorKeys = {
    create: `errors.${moduleName}.createFailed`,
    update: `errors.${moduleName}.updateFailed`,
    get: `errors.${moduleName}.getFailed`,
    delete: `errors.${moduleName}.deleteFailed`,
    fetch: `errors.${moduleName}.fetchFailed`,
  };

  // Fallback messages if translation is missing
  const fallbacks = {
    create: `Failed to create ${entity}`,
    update: `Failed to update ${entity}`,
    get: `Failed to get ${entity} details`,
    delete: `Failed to delete ${entity}`,
    fetch: `Failed to fetch ${entity} data`,
  };

  // Try to get the translation using the standard key
  let message = i18next.t(errorKeys[operation]);
  
  // If the translation is the same as the key, it means it's missing
  // Use the fallback message instead
  if (message === errorKeys[operation]) {
    message = fallbacks[operation];
  }
  
  return message;
};

/**
 * Translation function for API-related success messages
 */
export const getApiSuccessMessage = (
  moduleName: keyof typeof apiNamespaces,
  operation: 'create' | 'update' | 'delete',
  entityName?: string
): string => {
  // Entity name defaults to module name if not provided
  const entity = entityName || moduleName;
  
  // Standard success message keys
  const successKeys = {
    create: `success.${moduleName}.createSuccess`,
    update: `success.${moduleName}.updateSuccess`,
    delete: `success.${moduleName}.deleteSuccess`,
  };

  // Fallback messages if translation is missing
  const fallbacks = {
    create: `${entity} created successfully`,
    update: `${entity} updated successfully`,
    delete: `${entity} deleted successfully`,
  };

  // Try to get the translation using the standard key
  let message = i18next.t(successKeys[operation]);
  
  // If the translation is the same as the key, it means it's missing
  // Use the fallback message instead
  if (message === successKeys[operation]) {
    message = fallbacks[operation];
  }
  
  return message;
};

/**
 * Translation function for API-related button and action labels
 */
export const getApiActionLabel = (
  moduleName: keyof typeof apiNamespaces,
  action: 'create' | 'update' | 'delete' | 'view' | 'list' | 'filter',
  entityName?: string
): string => {
  // Entity name defaults to module name if not provided
  const entity = entityName || moduleName;
  
  // Standard action label keys
  const actionKeys = {
    create: `actions.${moduleName}.create`,
    update: `actions.${moduleName}.update`,
    delete: `actions.${moduleName}.delete`,
    view: `actions.${moduleName}.view`,
    list: `actions.${moduleName}.list`,
    filter: `actions.${moduleName}.filter`,
  };

  // Fallback messages if translation is missing
  const fallbacks = {
    create: `Create ${entity}`,
    update: `Update ${entity}`,
    delete: `Delete ${entity}`,
    view: `View ${entity} details`,
    list: `List all ${entity}`,
    filter: `Filter ${entity}`,
  };

  // Try to get the translation using the standard key
  let message = i18next.t(actionKeys[action]);
  
  // If the translation is the same as the key, it means it's missing
  // Use the fallback message instead
  if (message === actionKeys[action]) {
    message = fallbacks[action];
  }
  
  return message;
}; 