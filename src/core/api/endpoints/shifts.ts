/**
 * Shifts API
 * 
 * This file provides API functions for working with shifts data.
 */

import { fetchFromFunction, ApiResponse } from '../client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { Shift, ShiftPaymentMethod } from '../types';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.SHIFTS;

/**
 * Fetches all shifts
 */
export async function getShifts(): Promise<ApiResponse<Shift[]>> {
  return fetchFromFunction<Shift[]>(ENDPOINT);
}

/**
 * Fetches a shift by ID
 */
export async function getShiftById(id: string): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/${id}`);
}

/**
 * Fetches the active shift
 */
export async function getActiveShift(): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/active`);
}

/**
 * Fetches the active shift for a specific user
 */
export async function getActiveShiftForUser(userId: string): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/active/${userId}`);
}

/**
 * Fetches the system active shift
 */
export async function getSystemActiveShift(): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/system-active`);
}

/**
 * Fetches the sales total for a shift
 */
export async function getShiftSalesTotal(
  shiftId: string
): Promise<ApiResponse<{ total: number }>> {
  return fetchFromFunction<{ total: number }>(`${ENDPOINT}/${shiftId}/sales-total`);
}

/**
 * Starts a new shift
 */
export async function startShift(
  openingCash: number, 
  employeeIds?: string[]
): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(ENDPOINT, {
    method: 'POST',
    body: { openingCash, employeeIds }
  });
}

/**
 * Closes a shift
 */
export async function closeShift(
  id: string, 
  closingCash: number, 
  paymentMethods?: any[]
): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/${id}/close`, {
    method: 'POST',
    body: { closingCash, paymentMethods }
  });
}

/**
 * Fetches payment methods for a shift
 */
export async function getShiftPaymentMethods(
  id: string
): Promise<ApiResponse<any[]>> {
  return fetchFromFunction<any[]>(`${ENDPOINT}/${id}/payment-methods`);
}

/**
 * Adds payment methods to a shift
 */
export async function addShiftPaymentMethods(
  id: string, 
  methods: any[]
): Promise<ApiResponse<any[]>> {
  return fetchFromFunction<any[]>(`${ENDPOINT}/${id}/payment-methods`, {
    method: 'POST',
    body: methods
  });
}

/**
 * Deletes payment methods from a shift
 */
export async function deleteShiftPaymentMethods(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}/payment-methods`, {
    method: 'DELETE'
  });
}

/**
 * API functions for shifts management
 */
export const shiftsApi = {
  /**
   * Get all shifts
   * @returns Promise with the shifts data
   */
  getAll: (): Promise<ApiResponse<Shift[]>> => 
    fetchFromFunction('shifts'),
    
  /**
   * Get a shift by ID
   * @param id Shift ID
   * @returns Promise with the shift data
   */
  getById: (id: string): Promise<ApiResponse<Shift>> => 
    fetchFromFunction(`shifts/${id}`),
    
  /**
   * Get active shifts
   * @returns Promise with active shifts data
   */
  getActive: (): Promise<ApiResponse<Shift[]>> => 
    fetchFromFunction('shifts/active'),
    
  /**
   * Get active shift for a specific user
   * @param userId User ID
   * @returns Promise with the user's active shift
   */
  getActiveForUser: (userId: string): Promise<ApiResponse<Shift>> => 
    fetchFromFunction(`shifts/active/${userId}`),
    
  /**
   * Get system-active shifts
   * @returns Promise with system-active shifts
   */
  getSystemActive: (): Promise<ApiResponse<Shift[]>> => 
    fetchFromFunction('shifts/system-active'),
    
  /**
   * Get sales total for a shift
   * @param shiftId Shift ID
   * @returns Promise with sales total data
   */
  getSalesTotal: (shiftId: string): Promise<ApiResponse<{ total: number }>> => 
    fetchFromFunction(`shifts/${shiftId}/sales-total`),
    
  /**
   * Start a new shift
   * @param openingCash Opening cash amount
   * @param employeeIds Optional array of employee IDs
   * @returns Promise with the created shift
   */
  start: (openingCash: number, employeeIds?: string[]): Promise<ApiResponse<Shift>> => 
    fetchFromFunction('shifts', { 
      method: 'POST', 
      body: { openingCash, employeeIds } 
    }),
    
  /**
   * Close a shift
   * @param id Shift ID
   * @param closingCash Closing cash amount
   * @param paymentMethods Optional array of payment methods
   * @returns Promise with the updated shift
   */
  close: (id: string, closingCash: number, paymentMethods?: any[]): Promise<ApiResponse<Shift>> => 
    fetchFromFunction(`shifts/${id}/close`, { 
      method: 'POST', 
      body: { closingCash, paymentMethods } 
    }),
    
  /**
   * Get payment methods for a shift
   * @param id Shift ID
   * @returns Promise with payment methods data
   */
  getPaymentMethods: (id: string): Promise<ApiResponse<ShiftPaymentMethod[]>> => 
    fetchFromFunction(`shifts/${id}/payment-methods`),
    
  /**
   * Add payment methods to a shift
   * @param id Shift ID
   * @param methods Array of payment methods
   * @returns Promise with updated payment methods
   */
  addPaymentMethods: (id: string, methods: ShiftPaymentMethod[]): Promise<ApiResponse<ShiftPaymentMethod[]>> => 
    fetchFromFunction(`shifts/${id}/payment-methods`, { 
      method: 'POST', 
      body: methods 
    }),
    
  /**
   * Delete payment methods for a shift
   * @param id Shift ID
   * @returns Promise with success status
   */
  deletePaymentMethods: (id: string): Promise<ApiResponse<void>> => 
    fetchFromFunction(`shifts/${id}/payment-methods`, { 
      method: 'DELETE' 
    }),
}; 