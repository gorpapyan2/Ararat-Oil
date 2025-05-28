import { supabase } from "@/services/supabase";
import type { Transaction, Expense, ProfitLoss } from "../types/finance.types";

const EDGE_FUNCTION_URL = "/functions/finance";

export const financeService = {
  // Transactions
  async getTransactions() {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/transactions`,
      {
        method: "GET",
      }
    );

    if (error) throw error;
    return data.transactions as Transaction[];
  },

  async createTransaction(
    transaction: Omit<Transaction, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/transactions`,
      {
        method: "POST",
        body: transaction,
      }
    );

    if (error) throw error;
    return data.transaction as Transaction;
  },

  async updateTransaction(id: string, transaction: Partial<Transaction>) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/transactions`,
      {
        method: "PUT",
        body: { id, ...transaction },
      }
    );

    if (error) throw error;
    return data.transaction as Transaction;
  },

  // Expenses
  async getExpenses() {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/expenses`,
      {
        method: "GET",
      }
    );

    if (error) throw error;
    return data.expenses as Expense[];
  },

  async createExpense(
    expense: Omit<Expense, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/expenses`,
      {
        method: "POST",
        body: expense,
      }
    );

    if (error) throw error;
    return data.expense as Expense;
  },

  async updateExpense(id: string, expense: Partial<Expense>) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/expenses`,
      {
        method: "PUT",
        body: { id, ...expense },
      }
    );

    if (error) throw error;
    return data.expense as Expense;
  },

  // Profit & Loss
  async getProfitLoss() {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/profit-loss`,
      {
        method: "GET",
      }
    );

    if (error) throw error;
    return data.profitLoss as ProfitLoss[];
  },

  async createProfitLoss(
    profitLoss: Omit<ProfitLoss, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/profit-loss`,
      {
        method: "POST",
        body: profitLoss,
      }
    );

    if (error) throw error;
    return data.profitLoss as ProfitLoss;
  },

  async updateProfitLoss(id: string, profitLoss: Partial<ProfitLoss>) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/profit-loss`,
      {
        method: "PUT",
        body: { id, ...profitLoss },
      }
    );

    if (error) throw error;
    return data.profitLoss as ProfitLoss;
  },
};
