import { fetchFromFunction, ApiResponse } from '../client';
import type { Sale } from '../types';

/**
 * Sales API functions for managing sales data
 */
export const salesApi = {
  /**
   * Get all sales with optional filtering
   * @param filters Optional filters for sales data
   * @returns ApiResponse with array of sales
   */
  getAll: (filters?: { shift_id?: string; start_date?: string; end_date?: string; employee?: string }): Promise<ApiResponse<Sale[]>> => 
    fetchFromFunction('sales', { queryParams: filters }),
  
  /**
   * Get a specific sale by ID
   * @param id The sale ID
   * @returns ApiResponse with the sale data
   */
  getById: (id: string): Promise<ApiResponse<Sale>> => 
    fetchFromFunction(`sales/${id}`),
  
  /**
   * Get the latest sale for a filling system
   * @param fillingSystemId The filling system ID
   * @returns ApiResponse with the latest sale data
   */
  getLatest: (fillingSystemId: string): Promise<ApiResponse<Sale>> => 
    fetchFromFunction(`sales/latest/${fillingSystemId}`),
  
  /**
   * Create a new sale
   * @param data The sale data to create
   * @returns ApiResponse with the created sale
   */
  create: (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Sale>> => 
    fetchFromFunction('sales', { method: 'POST', body: data }),
  
  /**
   * Update an existing sale
   * @param id The sale ID to update
   * @param data The updated sale data
   * @returns ApiResponse with the updated sale
   */
  update: (id: string, data: Partial<Omit<Sale, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Sale>> => 
    fetchFromFunction(`sales/${id}`, { method: 'PUT', body: data }),
  
  /**
   * Delete a sale
   * @param id The sale ID to delete
   * @returns ApiResponse with success status
   */
  delete: (id: string): Promise<ApiResponse<void>> => 
    fetchFromFunction(`sales/${id}`, { method: 'DELETE' }),
}; 