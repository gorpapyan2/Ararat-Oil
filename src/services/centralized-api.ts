/**
 * Centralized API Client
 * 
 * This module provides a unified interface for all CRUD operations,
 * eliminating duplicated code patterns across entity services.
 */

import { fetchFromFunction } from "./api";

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

// API response interface
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | null | undefined;
}

// Search parameters
export interface SearchParams extends PaginationParams {
  q?: string;
  fields?: string[];
  [key: string]: string | number | boolean | string[] | null | undefined;
}

// Entity statistics
export interface EntityStats {
  total: number;
  active: number;
  inactive: number;
  created_today: number;
  created_this_week: number;
  created_this_month: number;
}

/**
 * Centralized API service that handles all CRUD operations
 */
export class CentralizedApiService<T extends BaseEntity> {
  constructor(private entityType: string) {}

  /**
   * Get all entities with optional filtering and pagination
   */
  async getAll(filters?: Record<string, string | number | boolean>, pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    const queryParams: Record<string, string | number | boolean> = { ...filters, ...pagination };
    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}`, { queryParams });
  }

  /**
   * Get only active entities
   */
  async getActive(pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}/active`, { 
      queryParams: pagination || {} 
    });
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    return fetchFromFunction<T>(`centralized-crud/${this.entityType}/${id}`);
  }

  /**
   * Search entities
   */
  async search(params: SearchParams): Promise<ApiResponse<T[]>> {
    const { q, fields, ...otherParams } = params;
    const queryParams: Record<string, string | number | boolean> = { ...otherParams };
    
    if (q) queryParams.q = q;
    if (fields) queryParams.fields = fields.join(',');

    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}/search`, { queryParams });
  }

  /**
   * Get entity statistics
   */
  async getStats(): Promise<ApiResponse<EntityStats>> {
    return fetchFromFunction<EntityStats>(`centralized-crud/${this.entityType}/stats`);
  }

  /**
   * Create new entity
   */
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return fetchFromFunction<T>(`centralized-crud/${this.entityType}`, {
      method: "POST",
      body: data,
    });
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(items: Partial<T>[]): Promise<ApiResponse<T[]>> {
    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}/bulk`, {
      method: "POST",
      body: items,
    });
  }

  /**
   * Update entity
   */
  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return fetchFromFunction<T>(`centralized-crud/${this.entityType}/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  /**
   * Delete entity (hard delete)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return fetchFromFunction<void>(`centralized-crud/${this.entityType}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Soft delete entity (set status to inactive)
   */
  async softDelete(id: string): Promise<ApiResponse<T>> {
    return fetchFromFunction<T>(`centralized-crud/${this.entityType}/${id}/soft`, {
      method: "DELETE",
    });
  }
}

/**
 * Factory function to create API services for specific entities
 */
export function createApiService<T extends BaseEntity>(entityType: string): CentralizedApiService<T> {
  return new CentralizedApiService<T>(entityType);
}

/**
 * Service wrapper with additional business logic and error handling
 */
export class EntityService<T extends BaseEntity> {
  private apiService: CentralizedApiService<T>;

  constructor(entityType: string) {
    this.apiService = createApiService<T>(entityType);
  }

  /**
   * Centralized error handling
   */
  private handleError(error: unknown, operation: string): never {
    console.error(`${operation} failed:`, error);
    throw error instanceof Error ? error : new Error(`${operation} failed`);
  }

  /**
   * Safe API call with consistent error handling
   */
  private async safeApiCall<R>(
    operation: string,
    apiCall: () => Promise<ApiResponse<R>>
  ): Promise<R> {
    try {
      const response = await apiCall();
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data!;
    } catch (error) {
      this.handleError(error, operation);
    }
  }

  // CRUD operations with centralized error handling
  async fetchAll(filters?: Record<string, string | number | boolean>, pagination?: PaginationParams): Promise<T[]> {
    return this.safeApiCall(
      "Fetch all entities",
      () => this.apiService.getAll(filters, pagination)
    );
  }

  async fetchActive(pagination?: PaginationParams): Promise<T[]> {
    return this.safeApiCall(
      "Fetch active entities",
      () => this.apiService.getActive(pagination)
    );
  }

  async fetchById(id: string): Promise<T | null> {
    try {
      return await this.safeApiCall(
        "Fetch entity by ID",
        () => this.apiService.getById(id)
      );
    } catch (error) {
      // Return null for not found errors instead of throwing
      if (error instanceof Error && error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  async search(params: SearchParams): Promise<T[]> {
    return this.safeApiCall(
      "Search entities",
      () => this.apiService.search(params)
    );
  }

  async getStats(): Promise<EntityStats> {
    return this.safeApiCall(
      "Get entity statistics",
      () => this.apiService.getStats()
    );
  }

  async create(data: Partial<T>): Promise<T> {
    return this.safeApiCall(
      "Create entity",
      () => this.apiService.create(data)
    );
  }

  async bulkCreate(items: Partial<T>[]): Promise<T[]> {
    return this.safeApiCall(
      "Bulk create entities",
      () => this.apiService.bulkCreate(items)
    );
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.safeApiCall(
      "Update entity",
      () => this.apiService.update(id, data)
    );
  }

  async delete(id: string): Promise<void> {
    return this.safeApiCall(
      "Delete entity",
      () => this.apiService.delete(id)
    );
  }

  async softDelete(id: string): Promise<T> {
    return this.safeApiCall(
      "Soft delete entity",
      () => this.apiService.softDelete(id)
    );
  }
}

// Pre-configured entity services
export const employeeService = new EntityService('employees');
export const fuelTypeService = new EntityService('fuel_types');
export const tankService = new EntityService('tanks');
export const petrolProviderService = new EntityService('petrol_providers');
export const fillingSystemService = new EntityService('filling_systems');
export const fuelPriceService = new EntityService('fuel_prices');
export const salesService = new EntityService('sales');
export const shiftService = new EntityService('shifts');

// Export individual services for backward compatibility
export const centralizedEmployeesApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    employeeService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    employeeService.fetchActive(pagination),
  getById: (id: string) => 
    employeeService.fetchById(id),
  search: (params: SearchParams) => 
    employeeService.search(params),
  getStats: () => 
    employeeService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    employeeService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    employeeService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    employeeService.update(id, data),
  delete: (id: string) => 
    employeeService.delete(id),
  softDelete: (id: string) => 
    employeeService.softDelete(id),
};

export const centralizedFuelTypesApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    fuelTypeService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    fuelTypeService.fetchActive(pagination),
  getById: (id: string) => 
    fuelTypeService.fetchById(id),
  search: (params: SearchParams) => 
    fuelTypeService.search(params),
  getStats: () => 
    fuelTypeService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    fuelTypeService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    fuelTypeService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    fuelTypeService.update(id, data),
  delete: (id: string) => 
    fuelTypeService.delete(id),
  softDelete: (id: string) => 
    fuelTypeService.softDelete(id),
};

export const centralizedTanksApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    tankService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    tankService.fetchActive(pagination),
  getById: (id: string) => 
    tankService.fetchById(id),
  search: (params: SearchParams) => 
    tankService.search(params),
  getStats: () => 
    tankService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    tankService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    tankService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    tankService.update(id, data),
  delete: (id: string) => 
    tankService.delete(id),
  softDelete: (id: string) => 
    tankService.softDelete(id),
};

export const centralizedPetrolProvidersApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    petrolProviderService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    petrolProviderService.fetchActive(pagination),
  getById: (id: string) => 
    petrolProviderService.fetchById(id),
  search: (params: SearchParams) => 
    petrolProviderService.search(params),
  getStats: () => 
    petrolProviderService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    petrolProviderService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    petrolProviderService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    petrolProviderService.update(id, data),
  delete: (id: string) => 
    petrolProviderService.delete(id),
  softDelete: (id: string) => 
    petrolProviderService.softDelete(id),
};

export const centralizedFillingSystemsApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    fillingSystemService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    fillingSystemService.fetchActive(pagination),
  getById: (id: string) => 
    fillingSystemService.fetchById(id),
  search: (params: SearchParams) => 
    fillingSystemService.search(params),
  getStats: () => 
    fillingSystemService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    fillingSystemService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    fillingSystemService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    fillingSystemService.update(id, data),
  delete: (id: string) => 
    fillingSystemService.delete(id),
  softDelete: (id: string) => 
    fillingSystemService.softDelete(id),
};

export const centralizedShiftsApi = {
  getAll: (filters?: Record<string, string | number | boolean>, pagination?: PaginationParams) => 
    shiftService.fetchAll(filters, pagination),
  getActive: (pagination?: PaginationParams) => 
    shiftService.fetchActive(pagination),
  getById: (id: string) => 
    shiftService.fetchById(id),
  search: (params: SearchParams) => 
    shiftService.search(params),
  getStats: () => 
    shiftService.getStats(),
  create: (data: Partial<BaseEntity>) => 
    shiftService.create(data),
  bulkCreate: (items: Partial<BaseEntity>[]) => 
    shiftService.bulkCreate(items),
  update: (id: string, data: Partial<BaseEntity>) => 
    shiftService.update(id, data),
  delete: (id: string) => 
    shiftService.delete(id),
  softDelete: (id: string) => 
    shiftService.softDelete(id),
}; 