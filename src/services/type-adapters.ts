/**
 * Centralized Type Adapters
 * 
 * This module provides utility functions to adapt between centralized API types
 * and feature-specific types, handling property name conversions, type casting,
 * and enum transformations consistently across all services.
 */

import type { BaseEntity } from './centralized-api';
import type { FuelTypeCode, PaymentMethod } from '@/types';

// === DATE UTILITIES ===

/**
 * Safely convert string date to Date object
 */
export function adaptStringToDate(dateString?: string): Date {
  if (!dateString) return new Date();
  return new Date(dateString);
}

/**
 * Safely convert Date object to ISO string
 */
export function adaptDateToString(date?: Date): string {
  if (!date) return new Date().toISOString();
  return date.toISOString();
}

// === PAYMENT METHOD ADAPTERS ===

/**
 * Convert centralized payment method to feature payment method
 */
export function adaptCentralizedToFeaturePaymentMethod(
  paymentMethod?: string
): PaymentMethod {
  switch (paymentMethod) {
    case "cash":
      return "cash";
    case "card":
    case "credit":
      return "credit_card";
    case "debit_card":
      return "debit_card";
    case "bank_transfer":
      return "bank_transfer";
    case "mobile_payment":
      return "mobile_payment";
    default:
      return "cash";
  }
}

/**
 * Convert feature payment method to centralized payment method
 */
export function adaptFeatureToCentralizedPaymentMethod(
  paymentMethod?: PaymentMethod
): "cash" | "card" | "credit" {
  switch (paymentMethod) {
    case "credit_card":
      return "credit";
    case "debit_card":
    case "card":
      return "card";
    case "bank_transfer":
    case "mobile_payment":
      return "card"; // Map unsupported methods to card
    case "cash":
    default:
      return "cash";
  }
}

// === FUEL TYPE ADAPTERS ===

/**
 * Convert string fuel type to FuelTypeCode
 */
export function adaptStringToFuelTypeCode(fuelType?: string): FuelTypeCode {
  switch (fuelType) {
    case "diesel":
      return "diesel";
    case "gas":
      return "gas";
    case "petrol_regular":
      return "petrol_regular";
    case "petrol_premium":
      return "petrol_premium";
    default:
      return "petrol_regular";
  }
}

// === STATUS ADAPTERS ===

/**
 * Convert centralized status to feature-specific status
 */
export function adaptCentralizedToFeatureStatus<T extends string>(
  validStatuses: readonly T[],
  defaultStatus: T,
  status?: string
): T {
  if (status && validStatuses.includes(status as T)) {
    return status as T;
  }
  return defaultStatus;
}

// === COMMON PROPERTY ADAPTERS ===

/**
 * Base adapter for common BaseEntity properties
 */
export interface FeatureBaseProperties {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  status?: string;
}

/**
 * Adapt BaseEntity to feature base properties
 */
export function adaptBaseEntityToFeature(entity: BaseEntity): FeatureBaseProperties {
  return {
    id: entity.id,
    createdAt: adaptStringToDate(entity.created_at),
    updatedAt: entity.updated_at ? adaptStringToDate(entity.updated_at) : null,
    status: entity.status,
  };
}

/**
 * Adapt feature base properties to BaseEntity
 */
export function adaptFeatureToBaseEntity(feature: FeatureBaseProperties): Partial<BaseEntity> {
  return {
    id: feature.id,
    created_at: adaptDateToString(feature.createdAt),
    updated_at: feature.updatedAt ? adaptDateToString(feature.updatedAt) : undefined,
    status: feature.status,
  };
}

// === PROPERTY NAME CONVERTERS ===

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function transformObjectKeysToCamel<T = any>(obj: Record<string, any>): T {
  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    transformed[camelKey] = value;
  }
  
  return transformed as T;
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function transformObjectKeysToSnake<T = any>(obj: Record<string, any>): T {
  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      const snakeKey = camelToSnake(key);
      transformed[snakeKey] = value;
    }
  }
  
  return transformed as T;
}

// === VALIDATION UTILITIES ===

/**
 * Safely access nested property with fallback
 */
export function safeAccess<T>(obj: any, path: string, fallback: T): T {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
}

/**
 * Check if value is defined and not null
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
} 