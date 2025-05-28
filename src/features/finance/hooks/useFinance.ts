import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  createTransaction as createTransactionService,
  updateTransaction as updateTransactionService,
  getExpenses,
  createExpense as createExpenseService,
  updateExpense as updateExpenseService,
  getProfitLoss,
  calculateProfitLoss as calculateProfitLossService,
  getFinanceOverview,
} from "../services";
import type {
  Transaction,
  Expense,
  ProfitLoss,
  FinanceOverview,
} from "../types/finance.types";

// Define query keys as array strings for consistency
const QUERY_KEYS = {
  transactions: ["transactions"],
  expenses: ["expenses"],
  profitLoss: ["profit-loss"],
  financeOverview: ["finance-overview"],
};

/**
 * Custom hook for managing finance data and operations
 * @returns Finance data and mutation functions
 */
export function useFinance() {
  const queryClient = useQueryClient();

  // Transactions Query
  const transactionsQuery = useQuery<Transaction[], Error>({
    queryKey: QUERY_KEYS.transactions,
    queryFn: getTransactions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Expenses Query
  const expensesQuery = useQuery<Expense[], Error>({
    queryKey: QUERY_KEYS.expenses,
    queryFn: getExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Profit & Loss Query - fetch the first item from array
  const profitLossQuery = useQuery<ProfitLoss, Error>({
    queryKey: QUERY_KEYS.profitLoss,
    queryFn: async () => {
      const data = await getProfitLoss();
      // Return the most recent profit/loss record or throw if none found
      if (data.length === 0) {
        throw new Error("No profit/loss data available");
      }
      return data[0]; // Return the first/most recent item
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Finance Overview Query
  const financeOverviewQuery = useQuery<FinanceOverview, Error>({
    queryKey: QUERY_KEYS.financeOverview,
    queryFn: getFinanceOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transaction Mutations
  const createTransactionMutation = useMutation<
    Transaction,
    Error,
    Omit<Transaction, "id" | "created_at" | "updated_at">
  >({
    mutationFn: createTransactionService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.financeOverview });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profitLoss });
    },
  });

  const updateTransactionMutation = useMutation<
    Transaction,
    Error,
    { id: string; data: Partial<Transaction> }
  >({
    mutationFn: ({ id, data }) => updateTransactionService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.financeOverview });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profitLoss });
    },
  });

  // Expense Mutations
  const createExpenseMutation = useMutation<
    Expense,
    Error,
    Omit<Expense, "id" | "created_at" | "updated_at">
  >({
    mutationFn: createExpenseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.financeOverview });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profitLoss });
    },
  });

  const updateExpenseMutation = useMutation<
    Expense,
    Error,
    { id: string; data: Partial<Expense> }
  >({
    mutationFn: ({ id, data }) => updateExpenseService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.financeOverview });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profitLoss });
    },
  });

  // Calculate Profit & Loss Mutation
  const calculateProfitLossMutation = useMutation<
    ProfitLoss,
    Error,
    { period: string; startDate?: string; endDate?: string }
  >({
    mutationFn: ({ period, startDate, endDate }) =>
      calculateProfitLossService(period, startDate, endDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profitLoss });
    },
  });

  // Compute combined loading and error states
  const isLoading =
    transactionsQuery.isLoading ||
    expensesQuery.isLoading ||
    profitLossQuery.isLoading ||
    financeOverviewQuery.isLoading;

  const error =
    transactionsQuery.error ||
    expensesQuery.error ||
    profitLossQuery.error ||
    financeOverviewQuery.error;

  return {
    // Data properties
    transactions: transactionsQuery.data || [],
    expenses: expensesQuery.data || [],
    profitLoss: profitLossQuery.data,
    financeOverview: financeOverviewQuery.data,

    // Combined states
    isLoading,
    error,

    // Individual loading states
    isLoadingTransactions: transactionsQuery.isLoading,
    isLoadingExpenses: expensesQuery.isLoading,
    isLoadingProfitLoss: profitLossQuery.isLoading,
    isLoadingFinanceOverview: financeOverviewQuery.isLoading,

    // Individual error states
    transactionsError: transactionsQuery.error,
    expensesError: expensesQuery.error,
    profitLossError: profitLossQuery.error,
    financeOverviewError: financeOverviewQuery.error,

    // Mutations
    createTransaction: createTransactionMutation,
    updateTransaction: updateTransactionMutation,
    createExpense: createExpenseMutation,
    updateExpense: updateExpenseMutation,
    calculateProfitLoss: calculateProfitLossMutation,

    // Refetch functions
    refetchTransactions: transactionsQuery.refetch,
    refetchExpenses: expensesQuery.refetch,
    refetchProfitLoss: profitLossQuery.refetch,
    refetchFinanceOverview: financeOverviewQuery.refetch,

    // Refetch all
    refetchAll: () => {
      transactionsQuery.refetch();
      expensesQuery.refetch();
      profitLossQuery.refetch();
      financeOverviewQuery.refetch();
    },
  };
}
