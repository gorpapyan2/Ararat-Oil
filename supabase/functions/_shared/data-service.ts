/**
 * Centralized Data Service for Supabase Edge Functions
 * 
 * This module provides a standardized way to interact with database entities,
 * centralizing common data access patterns and business rules.
 */

import {
  createSupabaseClient,
  CrudOperations,
  BusinessLogicError,
  ValidationUtils,
  AuditLogger,
  type ValidationResult,
  type PaginationParams,
} from "./business-logic.ts";

// Entity-specific validation rules
export interface EntityValidationRules {
  required: string[];
  unique?: string[];
  email?: string[];
  phone?: string[];
  numeric?: Array<{
    field: string;
    min?: number;
    max?: number;
  }>;
  stringLength?: Array<{
    field: string;
    min?: number;
    max?: number;
  }>;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

/**
 * Enhanced CRUD service with business logic validation
 */
export class DataService<T extends BaseEntity> extends CrudOperations<T> {
  private auditLogger: AuditLogger;

  constructor(
    tableName: string,
    private validationRules?: EntityValidationRules,
    private supabaseClient = createSupabaseClient()
  ) {
    super(supabaseClient, tableName);
    this.auditLogger = new AuditLogger(supabaseClient);
  }

  /**
   * Validate entity data against defined rules
   */
  private async validateEntity(data: Partial<T>, isUpdate = false, excludeId?: string): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!this.validationRules) {
      return { isValid: true, errors: [] };
    }

    // Required field validation (skip for updates unless explicitly provided)
    if (!isUpdate) {
      const requiredValidation = ValidationUtils.validateRequired(
        data as Record<string, any>,
        this.validationRules.required || []
      );
      errors.push(...requiredValidation.errors);
    }

    // Email validation
    if (this.validationRules.email) {
      for (const field of this.validationRules.email) {
        if (data[field as keyof T] && !ValidationUtils.validateEmail(data[field as keyof T] as string)) {
          errors.push(`${field} must be a valid email address`);
        }
      }
    }

    // Phone validation
    if (this.validationRules.phone) {
      for (const field of this.validationRules.phone) {
        if (data[field as keyof T] && !ValidationUtils.validatePhoneNumber(data[field as keyof T] as string)) {
          errors.push(`${field} must be a valid phone number`);
        }
      }
    }

    // Numeric range validation
    if (this.validationRules.numeric) {
      for (const rule of this.validationRules.numeric) {
        const value = data[rule.field as keyof T] as number;
        if (value !== undefined && !ValidationUtils.validateNumericRange(value, rule.min, rule.max)) {
          errors.push(`${rule.field} must be between ${rule.min || 'any'} and ${rule.max || 'any'}`);
        }
      }
    }

    // String length validation
    if (this.validationRules.stringLength) {
      for (const rule of this.validationRules.stringLength) {
        const value = data[rule.field as keyof T] as string;
        if (value !== undefined && !ValidationUtils.validateStringLength(value, rule.min, rule.max)) {
          errors.push(`${rule.field} must be between ${rule.min || 0} and ${rule.max || 'unlimited'} characters`);
        }
      }
    }

    // Uniqueness validation
    if (this.validationRules.unique) {
      for (const field of this.validationRules.unique) {
        const value = data[field as keyof T];
        if (value !== undefined) {
          const exists = await this.exists(field, value, excludeId);
          if (exists) {
            errors.push(`${field} already exists`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Enhanced create with validation and audit logging
   */
  async createWithValidation(data: Partial<T>, userId?: string): Promise<T> {
    const validation = await this.validateEntity(data, false);
    
    if (!validation.isValid) {
      throw new BusinessLogicError(
        `Validation failed: ${validation.errors.join(', ')}`,
        400,
        'VALIDATION_ERROR'
      );
    }

    const created = await this.create(data);
    
    // Audit log
    if (userId) {
      await this.auditLogger.log('CREATE', this.tableName, created.id, userId, data);
    }

    return created;
  }

  /**
   * Enhanced update with validation and audit logging
   */
  async updateWithValidation(id: string, data: Partial<T>, userId?: string): Promise<T> {
    const validation = await this.validateEntity(data, true, id);
    
    if (!validation.isValid) {
      throw new BusinessLogicError(
        `Validation failed: ${validation.errors.join(', ')}`,
        400,
        'VALIDATION_ERROR'
      );
    }

    const updated = await this.update(id, data);
    
    // Audit log
    if (userId) {
      await this.auditLogger.log('UPDATE', this.tableName, id, userId, data);
    }

    return updated;
  }

  /**
   * Enhanced delete with audit logging
   */
  async deleteWithAudit(id: string, userId?: string): Promise<void> {
    await this.delete(id);
    
    // Audit log
    if (userId) {
      await this.auditLogger.log('DELETE', this.tableName, id, userId);
    }
  }

  /**
   * Get active entities (entities with status = 'active')
   */
  async getActive(pagination?: PaginationParams): Promise<T[]> {
    return this.getAll({ status: 'active' }, pagination);
  }

  /**
   * Soft delete (set status to 'inactive')
   */
  async softDelete(id: string, userId?: string): Promise<T> {
    const updated = await this.updateWithValidation(id, { status: 'inactive' } as unknown as Partial<T>, userId);
    
    // Audit log
    if (userId) {
      await this.auditLogger.log('SOFT_DELETE', this.tableName, id, userId);
    }

    return updated;
  }

  /**
   * Bulk operations with validation
   */
  async bulkCreate(items: Partial<T>[], userId?: string): Promise<T[]> {
    const results: T[] = [];
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const validation = await this.validateEntity(items[i], false);
        if (!validation.isValid) {
          errors.push(`Item ${i + 1}: ${validation.errors.join(', ')}`);
          continue;
        }
        
        const created = await this.create(items[i]);
        results.push(created);
        
        // Audit log
        if (userId) {
          await this.auditLogger.log('BULK_CREATE', this.tableName, created.id, userId, items[i]);
        }
      } catch (error) {
        errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      throw new BusinessLogicError(
        `Bulk create failed for some items: ${errors.join('; ')}`,
        400,
        'BULK_VALIDATION_ERROR'
      );
    }

    return results;
  }

  /**
   * Search functionality with full-text search
   */
  async search(
    searchTerm: string,
    searchFields: string[],
    filters?: Record<string, any>,
    pagination?: PaginationParams
  ): Promise<T[]> {
    let query = this.supabaseClient
      .from(this.tableName)
      .select("*");

    // Add filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    // Add search conditions
    if (searchTerm && searchFields.length > 0) {
      const searchConditions = searchFields
        .map(field => `${field}.ilike.%${searchTerm}%`)
        .join(',');
      query = query.or(searchConditions);
    }

    // Apply pagination
    if (pagination?.limit) {
      const offset = pagination.offset || (pagination.page ? (pagination.page - 1) * pagination.limit : 0);
      query = query.range(offset, offset + pagination.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new BusinessLogicError(`Search failed for ${this.tableName}: ${error.message}`, 500);
    }

    return data || [];
  }

  /**
   * Get entity statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    created_today: number;
    created_this_week: number;
    created_this_month: number;
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      active,
      inactive,
      createdToday,
      createdThisWeek,
      createdThisMonth
    ] = await Promise.all([
      this.getCount(),
      this.getCount({ status: 'active' }),
      this.getCount({ status: 'inactive' }),
      this.getCount({ created_at: `gte.${today.toISOString()}` }),
      this.getCount({ created_at: `gte.${thisWeek.toISOString()}` }),
      this.getCount({ created_at: `gte.${thisMonth.toISOString()}` })
    ]);

    return {
      total,
      active,
      inactive,
      created_today: createdToday,
      created_this_week: createdThisWeek,
      created_this_month: createdThisMonth
    };
  }

  /**
   * Get count of entities matching filters
   */
  private async getCount(filters?: Record<string, any>): Promise<number> {
    let query = this.supabaseClient
      .from(this.tableName)
      .select("*", { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'string' && value.startsWith('gte.')) {
            query = query.gte(key, value.substring(4));
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    const { count, error } = await query;

    if (error) {
      throw new BusinessLogicError(`Count failed for ${this.tableName}: ${error.message}`, 500);
    }

    return count || 0;
  }
}

/**
 * Factory function to create configured data services for different entities
 */
export function createDataService<T extends BaseEntity>(
  tableName: string,
  validationRules?: EntityValidationRules
): DataService<T> {
  return new DataService<T>(tableName, validationRules);
}

/**
 * Pre-configured data services for common entities
 */

// Employee validation rules
const employeeValidationRules: EntityValidationRules = {
  required: ['name', 'position', 'contact'],
  unique: ['contact'],
  email: ['email'],
  phone: ['contact'],
  stringLength: [
    { field: 'name', min: 2, max: 100 },
    { field: 'position', min: 2, max: 100 }
  ],
  numeric: [
    { field: 'salary', min: 0 }
  ]
};

// Fuel Type validation rules
const fuelTypeValidationRules: EntityValidationRules = {
  required: ['name', 'code'],
  unique: ['code', 'name'],
  stringLength: [
    { field: 'name', min: 2, max: 50 },
    { field: 'code', min: 2, max: 10 }
  ]
};

// Tank validation rules
const tankValidationRules: EntityValidationRules = {
  required: ['name', 'capacity', 'fuel_type_id'],
  unique: ['name'],
  stringLength: [
    { field: 'name', min: 2, max: 100 }
  ],
  numeric: [
    { field: 'capacity', min: 1 },
    { field: 'current_level', min: 0 }
  ]
};

// Petrol Provider validation rules
const petrolProviderValidationRules: EntityValidationRules = {
  required: ['name', 'contact'],
  unique: ['name', 'contact'],
  email: ['email'],
  phone: ['contact'],
  stringLength: [
    { field: 'name', min: 2, max: 100 }
  ]
};

// Filling System validation rules
const fillingSystemValidationRules: EntityValidationRules = {
  required: ['name', 'tank_id'],
  unique: ['name'],
  stringLength: [
    { field: 'name', min: 2, max: 100 }
  ]
};

// Export pre-configured services
export const employeeDataService = createDataService('employees', employeeValidationRules);
export const fuelTypeDataService = createDataService('fuel_types', fuelTypeValidationRules);
export const tankDataService = createDataService('tanks', tankValidationRules);
export const petrolProviderDataService = createDataService('petrol_providers', petrolProviderValidationRules);
export const fillingSystemDataService = createDataService('filling_systems', fillingSystemValidationRules); 