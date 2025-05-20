import { supabase } from '@/services/supabase';
import type { Transaction, Expense, ProfitLoss } from '../types/finance.types';

const EDGE_FUNCTION_URL = '/functions/finance';

export const financeService = {
  // Transactions
  async getTransactions() {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/transactions`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.transactions as Transaction[];
    } catch (error) {
      throw error;
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/transactions`, {
        method: 'POST',
        body: transaction,
      });

      if (error) throw error;
      return data.transaction as Transaction;
    } catch (error) {
      throw error;
    }
  },

  async updateTransaction(id: string, transaction: Partial<Transaction>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/transactions`, {
        method: 'PUT',
        body: { id, ...transaction },
      });

      if (error) throw error;
      return data.transaction as Transaction;
    } catch (error) {
      throw error;
    }
  },

  // Expenses
  async getExpenses() {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/expenses`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.expenses as Expense[];
    } catch (error) {
      throw error;
    }
  },

  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/expenses`, {
        method: 'POST',
        body: expense,
      });

      if (error) throw error;
      return data.expense as Expense;
    } catch (error) {
      throw error;
    }
  },

  async updateExpense(id: string, expense: Partial<Expense>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/expenses`, {
        method: 'PUT',
        body: { id, ...expense },
      });

      if (error) throw error;
      return data.expense as Expense;
    } catch (error) {
      throw error;
    }
  },

  // Profit & Loss
  async getProfitLoss() {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/profit-loss`, {
        method: 'GET',
      });

      if (error) throw error;
      return data.profitLoss as ProfitLoss[];
    } catch (error) {
      throw error;
    }
  },

  async createProfitLoss(profitLoss: Omit<ProfitLoss, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/profit-loss`, {
        method: 'POST',
        body: profitLoss,
      });

      if (error) throw error;
      return data.profitLoss as ProfitLoss;
    } catch (error) {
      throw error;
    }
  },

  async updateProfitLoss(id: string, profitLoss: Partial<ProfitLoss>) {
    try {
      const { data, error } = await supabase.functions.invoke(`${EDGE_FUNCTION_URL}/profit-loss`, {
        method: 'PUT',
        body: { id, ...profitLoss },
      });

      if (error) throw error;
      return data.profitLoss as ProfitLoss;
    } catch (error) {
      throw error;
    }
  },
}; 