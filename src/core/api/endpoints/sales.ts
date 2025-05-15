import { fetchFromFunction, ApiResponse } from '../client';
import type { Sale } from '../types';

/**
 * Get all sales with optional filtering
 * @param filters Optional filters for sales data
 * @returns ApiResponse with array of sales
 */
export async function getSales(filters?: { shift_id?: string; start_date?: string; end_date?: string; employee?: string }): Promise<ApiResponse<Sale[]>> {
  return fetchFromFunction('sales', { queryParams: filters });
}

/**
 * Get a specific sale by ID
 * @param id The sale ID
 * @returns ApiResponse with the sale data
 */
export async function getSaleById(id: string): Promise<ApiResponse<Sale>> {
  return fetchFromFunction(`sales/${id}`);
}

/**
 * Get the latest sale for a filling system
 * @param fillingSystemId The filling system ID
 * @returns ApiResponse with the latest sale data
 */
export async function getLatestSale(fillingSystemId: string): Promise<ApiResponse<Sale>> {
  return fetchFromFunction(`sales/latest/${fillingSystemId}`);
}

/**
 * Create a new sale
 * @param data The sale data to create
 * @returns ApiResponse with the created sale
 */
export async function createSale(data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Sale>> {
  return fetchFromFunction('sales', { method: 'POST', body: data });
}

/**
 * Update an existing sale
 * @param id The sale ID to update
 * @param data The updated sale data
 * @returns ApiResponse with the updated sale
 */
export async function updateSale(id: string, data: Partial<Omit<Sale, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Sale>> {
  return fetchFromFunction(`sales/${id}`, { method: 'PUT', body: data });
}

/**
 * Delete a sale
 * @param id The sale ID to delete
 * @returns ApiResponse with success status
 */
export async function deleteSale(id: string): Promise<ApiResponse<void>> {
  return fetchFromFunction(`sales/${id}`, { method: 'DELETE' });
}

/**
 * Get sales count
 * @returns ApiResponse with the count of sales
 */
export async function getSalesCount(): Promise<ApiResponse<{ count: number }>> {
  return fetchFromFunction('sales/count');
}

/**
 * Sales API functions for managing sales data
 */
export const salesApi = {
  getSales,
  getSaleById,
  getLatestSale,
  createSale,
  updateSale,
  deleteSale,
  getSalesCount
}; 