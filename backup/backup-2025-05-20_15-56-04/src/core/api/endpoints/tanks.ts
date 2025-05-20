/**
 * Tanks API
 * 
 * This file provides API functions for working with tanks data.
 */

import { fetchFromFunction, ApiResponse } from '../client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { Tank, TankCreate, TankUpdate } from '../types';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.TANKS;

/**
 * Fetches all tanks
 */
export async function getTanks(): Promise<ApiResponse<Tank[]>> {
  return fetchFromFunction<Tank[]>(ENDPOINT);
}

/**
 * Fetches a tank by ID
 */
export async function getTankById(id: string): Promise<ApiResponse<Tank>> {
  return fetchFromFunction<Tank>(`${ENDPOINT}/${id}`);
}

/**
 * Fetches level changes for a specific tank
 */
export async function getTankLevelChanges(id: string): Promise<ApiResponse<any[]>> {
  return fetchFromFunction<any[]>(`${ENDPOINT}/${id}/level-changes`);
}

/**
 * Creates a new tank
 */
export async function createTank(data: TankCreate): Promise<ApiResponse<Tank>> {
  return fetchFromFunction<Tank>(ENDPOINT, {
    method: 'POST',
    body: data
  });
}

/**
 * Updates a tank by ID
 */
export async function updateTank(
  id: string, 
  data: TankUpdate
): Promise<ApiResponse<Tank>> {
  return fetchFromFunction<Tank>(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data
  });
}

/**
 * Deletes a tank by ID
 */
export async function deleteTank(id: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Adjusts the level of a tank
 */
export async function adjustTankLevel(
  id: string, 
  changeAmount: number, 
  changeType: 'add' | 'subtract', 
  reason?: string
): Promise<ApiResponse<Tank>> {
  return fetchFromFunction<Tank>(`${ENDPOINT}/${id}/adjust-level`, {
    method: 'POST',
    body: { 
      change_amount: changeAmount, 
      change_type: changeType, 
      reason 
    }
  });
}

/**
 * Tanks API object with all methods
 */
export const tanksApi = {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  adjustTankLevel
}; 