/**
 * Shifts API
 *
 * This file provides API functions for working with shifts data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { Shift, ShiftPaymentMethod } from "../types";

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
export async function getActiveShiftForUser(
  userId: string
): Promise<ApiResponse<Shift>> {
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
  return fetchFromFunction<{ total: number }>(
    `${ENDPOINT}/${shiftId}/sales-total`
  );
}

/**
 * Starts a new shift
 */
export async function startShift(
  openingCash: number,
  employeeIds?: string[]
): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(ENDPOINT, {
    method: "POST",
    body: { 
      opening_cash: openingCash, 
      employee_ids: employeeIds 
    },
  });
}

/**
 * Closes a shift
 */
export async function closeShift(
  id: string,
  closingCash: number,
  paymentMethods?: ShiftPaymentMethod[]
): Promise<ApiResponse<Shift>> {
  return fetchFromFunction<Shift>(`${ENDPOINT}/${id}/close`, {
    method: "POST",
    body: { 
      closing_cash: closingCash, 
      payment_methods: paymentMethods 
    },
  });
}

/**
 * Fetches payment methods for a shift
 */
export async function getShiftPaymentMethods(
  id: string
): Promise<ApiResponse<ShiftPaymentMethod[]>> {
  return fetchFromFunction<ShiftPaymentMethod[]>(`payment-methods/shift/${id}`, {
    cache: "force-cache",
    queryParams: {
      _cache: Math.floor(Date.now() / 300000)
    }
  });
}

/**
 * Adds payment methods to a shift
 */
export async function addShiftPaymentMethods(
  id: string,
  methods: ShiftPaymentMethod[]
): Promise<ApiResponse<ShiftPaymentMethod[]>> {
  return fetchFromFunction<ShiftPaymentMethod[]>(`payment-methods/shift/${id}`, {
    method: "POST",
    body: methods,
  });
}

/**
 * Deletes payment methods from a shift
 */
export async function deleteShiftPaymentMethods(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(
    `payment-methods/shift/${id}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * Fetches shifts count
 */
export async function getShiftsCount(): Promise<
  ApiResponse<{ count: number }>
> {
  return fetchFromFunction<{ count: number }>(`${ENDPOINT}/count`);
}

/**
 * API functions for shifts management
 */
export const shiftsApi = {
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
  deleteShiftPaymentMethods,
  getShiftsCount,
};
