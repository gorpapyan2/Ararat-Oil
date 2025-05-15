import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService } from '../services/financeService';
import type { Transaction, Expense, ProfitLoss } from '../types/finance.types';

export function useFinance() {
  const queryClient = useQueryClient();

  // Transactions
  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: financeService.getTransactions,
  });

  const createTransaction = useMutation({
    mutationFn: financeService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      financeService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  // Expenses
  const expenses = useQuery({
    queryKey: ['expenses'],
    queryFn: financeService.getExpenses,
  });

  const createExpense = useMutation({
    mutationFn: financeService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Expense> }) =>
      financeService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // Profit & Loss
  const profitLoss = useQuery({
    queryKey: ['profitLoss'],
    queryFn: financeService.getProfitLoss,
  });

  const createProfitLoss = useMutation({
    mutationFn: financeService.createProfitLoss,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profitLoss'] });
    },
  });

  const updateProfitLoss = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProfitLoss> }) =>
      financeService.updateProfitLoss(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profitLoss'] });
    },
  });

  return {
    // Transactions
    transactions: transactions.data || [],
    isLoadingTransactions: transactions.isLoading,
    errorTransactions: transactions.error,
    createTransaction,
    updateTransaction,

    // Expenses
    expenses: expenses.data || [],
    isLoadingExpenses: expenses.isLoading,
    errorExpenses: expenses.error,
    createExpense,
    updateExpense,

    // Profit & Loss
    profitLoss: profitLoss.data || [],
    isLoadingProfitLoss: profitLoss.isLoading,
    errorProfitLoss: profitLoss.error,
    createProfitLoss,
    updateProfitLoss,
  };
} 