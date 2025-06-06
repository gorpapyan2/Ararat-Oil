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
}

// Search parameters
export interface SearchParams extends PaginationParams {
  q?: string;
  fields?: string[];
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
   * Get all entities with optional filters and pagination
   */
  async getAll(filters?: Record<string, string | number | boolean>, pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    const params = new URLSearchParams();
    
    // Add filters to params
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    // Add pagination to params
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}?${params.toString()}`);
  }

  /**
   * Get only active entities
   */
  async getActive(pagination?: PaginationParams): Promise<ApiResponse<T[]>> {
    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}/active`, { 
      queryParams: pagination as Record<string, string | number | boolean | null | undefined>
    });
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<ApiResponse<T>> {
    return fetchFromFunction<T>(`centralized-crud/${this.entityType}/${id}`);
  }

  /**
   * Search entities with text query
   */
  async search(params: SearchParams): Promise<ApiResponse<T[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return fetchFromFunction<T[]>(`centralized-crud/${this.entityType}/search?${searchParams.toString()}`);
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
export const fillingSystemService = new EntityService('filling_systems');
export const fuelPriceService = new EntityService('fuel_prices');
export const salesService = new EntityService('sales');
export const shiftService = new EntityService('shifts');

// Note: Removed unused centralized API exports that were not being used anywhere in the codebase
// This reduces code duplication and maintenance overhead 