/**
 * Transactions API
 * 
 * This file provides API functions for working with transactions data.
 */

import { fetchFromFunction, ApiResponse } from '../client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { Transaction } from '../types';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.TRANSACTIONS;

/**
 * Fetches all transactions with optional filters
 */
export async function getTransactions(filters?: {
  entity_type?: string;
  entity_id?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse<Transaction[]>> {
  return fetchFromFunction<Transaction[]>(ENDPOINT, {
    queryParams: filters
  });
}

/**
 * Fetches a transaction by ID
 */
export async function getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
  return fetchFromFunction<Transaction>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new transaction
 */
export async function createTransaction(data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Transaction>> {
  return fetchFromFunction<Transaction>(ENDPOINT, {
    method: 'POST',
    body: data
  });
}

/**
 * Updates a transaction by ID
 */
export async function updateTransaction(
  id: string, 
  data: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
): Promise<ApiResponse<Transaction>> {
  return fetchFromFunction<Transaction>(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data
  });
}

/**
 * Deletes a transaction by ID
 */
export async function deleteTransaction(id: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Transactions API object with all methods
 */
export const transactionsApi = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
}; 