import { describe, it, expect, vi } from 'vitest';
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
  getApiActionLabel
} from '../i18n';

// Mock i18next
vi.mock('i18next', () => ({
  default: {
    t: (key: string) => key, // Return the key itself for testing
    exists: (key: string) => true // Assume all keys exist
  }
}));

describe('API Translation Helpers', () => {
  describe('apiNamespaces', () => {
    it('should provide namespaces for all API entities', () => {
      expect(apiNamespaces).toHaveProperty('employees');
      expect(apiNamespaces).toHaveProperty('shifts');
      expect(apiNamespaces).toHaveProperty('sales');
      expect(apiNamespaces).toHaveProperty('expenses');
      expect(apiNamespaces).toHaveProperty('fuelSupplies');
      expect(apiNamespaces).toHaveProperty('petrolProviders');
    });
  });

  describe('getApiErrorMessage', () => {
    it('should return error message for a specific API action', () => {
      const message = getApiErrorMessage(apiNamespaces.employees, 'fetch');
      expect(message).toBe('api.errors.employees.fetch');
    });

    it('should return generic error message when action is not provided', () => {
      // @ts-ignore - testing missing action parameter
      const message = getApiErrorMessage(apiNamespaces.employees);
      expect(message).toBe('api.errors.employees.generic');
    });

    it('should include entity name in fallback if provided', () => {
      const message = getApiErrorMessage(apiNamespaces.employees, 'fetch', 'manager');
      expect(message).toBe('api.errors.employees.fetch');
    });
  });

  describe('getApiSuccessMessage', () => {
    it('should return success message for a specific API action', () => {
      const message = getApiSuccessMessage(apiNamespaces.shifts, 'create');
      expect(message).toBe('api.success.shifts.create');
    });

    it('should return generic success message when action is not provided', () => {
      // @ts-ignore - testing missing action parameter
      const message = getApiSuccessMessage(apiNamespaces.shifts);
      expect(message).toBe('api.success.shifts.generic');
    });

    it('should include entity name in message if provided', () => {
      const message = getApiSuccessMessage(apiNamespaces.shifts, 'update', 'morning shift');
      expect(message).toBe('api.success.shifts.update');
    });
  });

  describe('getApiActionLabel', () => {
    it('should return action label for a specific API entity', () => {
      const label = getApiActionLabel(apiNamespaces.expenses, 'create');
      expect(label).toBe('api.actions.expenses.create');
    });

    it('should handle missing entity by returning a generic action label', () => {
      // @ts-ignore - testing with invalid namespace
      const label = getApiActionLabel('nonexistent', 'delete');
      expect(label).toBe('api.actions.generic.delete');
    });

    it('should handle missing action by returning a fallback', () => {
      // @ts-ignore - testing with invalid action
      const label = getApiActionLabel(apiNamespaces.sales, 'nonexistent');
      expect(label).toBe('api.actions.sales.generic');
    });
  });
}); 