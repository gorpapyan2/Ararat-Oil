// Import API endpoints
import { transactionsApi } from "@/core/api/endpoints/transactions";
import { expensesApi } from "@/core/api/endpoints/expenses";
import { profitLossApi } from "@/core/api/endpoints/profit-loss";
import { financialsApi } from "@/core/api/endpoints/financials";
import { fetchJson } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/config/api';

// Import mock data provider

// Import types
import type {
  Transaction as ApiTransaction,
  Expense as ApiExpense,
  ProfitLoss as ApiProfitLoss,
} from "@/core/api/types";
import type {
  Transaction,
  Expense,
  ProfitLoss,
  FinanceData,
  FinanceOverview,
} from "../types/finance.types";

// Adapter functions for transactions
function adaptTransactionFromApi(apiTransaction: ApiTransaction): Transaction {
  return {
    id: apiTransaction.id,
    amount: apiTransaction.amount,
    description: apiTransaction.description,
    payment_method: apiTransaction.type === "income" ? "cash" : "bank_transfer", // Default mapping
    payment_status: "completed", // Default to completed
    employee_id: apiTransaction.created_by,
    created_at: apiTransaction.created_at,
    updated_at: apiTransaction.updated_at,
  };
}

function adaptTransactionToApi(
  transaction: Omit<Transaction, "id" | "created_at" | "updated_at">
): Omit<ApiTransaction, "id" | "created_at" | "updated_at"> {
  return {
    type: transaction.payment_method === "cash" ? "income" : "expense", // Simple mapping
    amount: transaction.amount,
    description: transaction.description,
    entity_type: "manual", // Default entity type
    entity_id: "0", // Default entity ID
    created_by: transaction.employee_id,
  };
}

// Adapter functions for expenses
function adaptExpenseFromApi(apiExpense: ApiExpense): Expense {
  return {
    id: apiExpense.id,
    amount: apiExpense.amount,
    description: apiExpense.description,
    category: apiExpense.category,
    date: apiExpense.payment_date || apiExpense.created_at,
    employee_id: apiExpense.created_by,
    payment_status:
      apiExpense.payment_status === "paid"
        ? "completed"
        : apiExpense.payment_status === "pending"
          ? "pending"
          : "failed",
    created_at: apiExpense.created_at,
    updated_at: apiExpense.updated_at,
  };
}

function adaptExpenseToApi(
  expense: Omit<Expense, "id" | "created_at" | "updated_at">
): Omit<ApiExpense, "id" | "created_at" | "updated_at"> {
  return {
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
    payment_status:
      expense.payment_status === "completed"
        ? "paid"
        : expense.payment_status === "pending"
          ? "pending"
          : "cancelled",
    payment_date: expense.date,
    created_by: expense.employee_id,
    receipt_number: "", // Default empty receipt number
  };
}

// Adaptation function to convert API ProfitLoss to Finance ProfitLoss
function adaptProfitLossFromApi(apiData: ApiProfitLoss): ProfitLoss {
  return {
    id: apiData.id,
    period: apiData.period,
    total_sales: apiData.revenue || 0,
    total_expenses: apiData.expenses || 0,
    profit: apiData.profit || 0,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at || apiData.created_at,
  };
}

/**
 * Get all transactions
 */
export async function getTransactions(): Promise<Transaction[]> {
  const response = await transactionsApi.getTransactions();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return (response.data || []).map(adaptTransactionFromApi);
}

/**
 * Create a transaction
 */
export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at" | "updated_at">
): Promise<Transaction> {
  const apiTransaction = adaptTransactionToApi(transaction);
  const response = await transactionsApi.createTransaction(apiTransaction);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptTransactionFromApi(response.data);
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: string,
  transaction: Partial<Transaction>
): Promise<Transaction> {
  // For partial updates, only include provided fields
  const apiUpdate: Partial<
    Omit<ApiTransaction, "id" | "created_at" | "updated_at">
  > = {};

  if (transaction.amount !== undefined) apiUpdate.amount = transaction.amount;
  if (transaction.description !== undefined)
    apiUpdate.description = transaction.description;
  if (transaction.payment_method !== undefined) {
    apiUpdate.type =
      transaction.payment_method === "cash" ? "income" : "expense";
  }
  if (transaction.employee_id !== undefined)
    apiUpdate.created_by = transaction.employee_id;

  const response = await transactionsApi.updateTransaction(id, apiUpdate);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptTransactionFromApi(response.data);
}

/**
 * Get all expenses
 */
export async function getExpenses(): Promise<Expense[]> {
  const response = await expensesApi.getExpenses();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return (response.data || []).map(adaptExpenseFromApi);
}

/**
 * Create an expense
 */
export async function createExpense(
  expense: Omit<Expense, "id" | "created_at" | "updated_at">
): Promise<Expense> {
  const apiExpense = adaptExpenseToApi(expense);
  const response = await expensesApi.createExpense(apiExpense);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptExpenseFromApi(response.data);
}

/**
 * Update an expense
 */
export async function updateExpense(
  id: string,
  expense: Partial<Expense>
): Promise<Expense> {
  // For partial updates, only include provided fields
  const apiUpdate: Partial<
    Omit<ApiExpense, "id" | "created_at" | "updated_at">
  > = {};

  if (expense.amount !== undefined) apiUpdate.amount = expense.amount;
  if (expense.description !== undefined)
    apiUpdate.description = expense.description;
  if (expense.category !== undefined) apiUpdate.category = expense.category;
  if (expense.date !== undefined) apiUpdate.payment_date = expense.date;
  if (expense.payment_status !== undefined) {
    apiUpdate.payment_status =
      expense.payment_status === "completed"
        ? "paid"
        : expense.payment_status === "pending"
          ? "pending"
          : "cancelled";
  }
  if (expense.employee_id !== undefined)
    apiUpdate.created_by = expense.employee_id;

  const response = await expensesApi.updateExpense(id, apiUpdate);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptExpenseFromApi(response.data);
}

/**
 * Get profit and loss reports
 */
export const getProfitLoss = async (
  periodType?: 'day' | 'week' | 'month' | 'quarter' | 'year',
  startDate?: string,
  endDate?: string
): Promise<ProfitLoss[]> => {
  try {
    console.log('Fetching profit & loss data from Edge Function...');
    
    const queryParams: Record<string, string | boolean> = {};
    if (periodType) queryParams.period_type = periodType;
    if (startDate) queryParams.start_date = startDate;
    if (endDate) queryParams.end_date = endDate;
    queryParams.include_details = false;
    
    const response = await fetchJson<ApiProfitLoss[]>(API_ENDPOINTS.FUNCTIONS.PROFIT_LOSS, {
      queryParams
    });
    
    if (response.error) {
      console.warn('Profit & Loss Edge Function returned error:', response.error);
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      console.warn('Profit & Loss Edge Function returned no data');
      return [];
    }
    
    console.log('Profit & loss data fetched successfully from Edge Function');
    return response.data.map(adaptProfitLossFromApi);
    
  } catch (error) {
    console.warn('Profit & Loss Edge Function failed:', error);
    return [];
  }
};

/**
 * Calculate profit and loss for a period
 */
export async function calculateProfitLoss(
  period: string,
  startDate?: string,
  endDate?: string
): Promise<ProfitLoss> {
  const response = await profitLossApi.calculateProfitLoss(
    period as "day" | "week" | "month" | "quarter" | "year" | "custom",
    startDate,
    endDate
  );

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No profit-loss data returned");
  }

  return adaptProfitLossFromApi(response.data);
}

/**
 * Get finance overview data
 */
export const getFinanceOverview = async (): Promise<FinanceOverview> => {
  try {
    console.log('Fetching finance overview from Edge Function...');
    
    const response = await fetchJson<FinanceOverview>('finance/overview');
    
    if (response.error) {
      console.warn('Finance Overview Edge Function returned error:', response.error);
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      console.warn('Finance Overview Edge Function returned no data');
      return {
        total_sales: 0,
        total_expenses: 0,
        net_profit: 0,
        recent_transactions: [],
        top_expenses: []
      };
    }
    
    console.log('Finance overview fetched successfully from Edge Function');
    return response.data;
    
  } catch (error) {
    console.warn('Finance Overview Edge Function failed:', error);
    return {
      total_sales: 0,
      total_expenses: 0,
      net_profit: 0,
      recent_transactions: [],
      top_expenses: []
    };
  }
};

/**
 * Get all finance data in one call
 */
export async function getAllFinanceData(): Promise<FinanceData> {
  const [transactions, expenses, profitLoss] = await Promise.all([
    getTransactions(),
    getExpenses(),
    getProfitLoss(),
  ]);

  return {
    transactions,
    expenses,
    profitLoss,
  };
}

// Export finance service as an object for compatibility
export const financeService = {
  getTransactions,
  createTransaction,
  updateTransaction,
  getExpenses,
  createExpense,
  updateExpense,
  getProfitLoss,
  calculateProfitLoss,
  getFinanceOverview,
  getAllFinanceData,
};

// Export all finance-related services
// Removed problematic exports for missing files
