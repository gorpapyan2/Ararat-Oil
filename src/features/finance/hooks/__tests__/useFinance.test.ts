import { waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { useFinance } from "../useFinance";
import {
  setupHookTest,
  setupErrorTest,
  setupMutationTest,
} from "@/test/utils/test-setup";
import type {
  FinanceTransaction,
  Expense,
  ProfitLossData,
  FinanceOverview,
} from "../../types/finance.types";

// Mock the services
vi.mock("../../services", () => ({
  getTransactions: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  getExpenses: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  getProfitLoss: vi.fn(),
  calculateProfitLoss: vi.fn(),
  getFinanceOverview: vi.fn(),
}));

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  getExpenses,
  createExpense,
  updateExpense,
  getProfitLoss,
  calculateProfitLoss,
  getFinanceOverview,
} from "../../services";

describe("Finance Hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("useFinance", () => {
    it("should fetch transactions successfully", async () => {
      const mockTransactions = [
        {
          id: "1",
          amount: 1000,
          date: "2023-01-01",
          type: "income",
          category: "sales",
          description: "Fuel sale",
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
        {
          id: "2",
          amount: 500,
          date: "2023-01-02",
          type: "expense",
          category: "supplies",
          description: "Office supplies",
          created_at: "2023-01-02",
          updated_at: "2023-01-02",
        },
      ];

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockTransactions);

      const { result } = renderTestHook(() => useFinance());

      expect(result.current.transactionsQuery.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.transactionsQuery.isLoading).toBe(false);
      });

      expect(result.current.transactionsQuery.data).toEqual(mockTransactions);
      expect(getTransactions).toHaveBeenCalledTimes(1);
    });

    it("should fetch expenses successfully", async () => {
      const mockExpenses = [
        {
          id: "1",
          amount: 300,
          date: "2023-01-01",
          category: "utilities",
          description: "Electricity bill",
          is_recurring: true,
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
        {
          id: "2",
          amount: 500,
          date: "2023-01-02",
          category: "rent",
          description: "Office rent",
          is_recurring: true,
          created_at: "2023-01-02",
          updated_at: "2023-01-02",
        },
      ];

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockExpenses);

      const { result } = renderTestHook(() => useFinance());

      expect(result.current.expensesQuery.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.expensesQuery.isLoading).toBe(false);
      });

      expect(result.current.expensesQuery.data).toEqual(mockExpenses);
      expect(getExpenses).toHaveBeenCalledTimes(1);
    });

    it("should fetch profit and loss data successfully", async () => {
      const mockProfitLoss = {
        total_income: 10000,
        total_expenses: 5000,
        net_profit: 5000,
        time_period: "month",
        breakdown: {
          income: { sales: 8000, services: 2000 },
          expenses: { supplies: 3000, utilities: 2000 },
        },
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockProfitLoss);

      const { result } = renderTestHook(() => useFinance());

      expect(result.current.profitLossQuery.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.profitLossQuery.isLoading).toBe(false);
      });

      expect(result.current.profitLossQuery.data).toEqual(mockProfitLoss);
      expect(getProfitLoss).toHaveBeenCalledWith("month"); // Default time period
    });

    it("should fetch finance overview successfully", async () => {
      const mockOverview = {
        cash_flow: {
          current_month: 5000,
          previous_month: 4500,
          change_percentage: 11.11,
        },
        outstanding_payments: 2000,
        upcoming_expenses: [
          {
            id: "1",
            amount: 500,
            date: "2023-02-01",
            category: "rent",
            description: "Office rent",
          },
        ],
        financial_health: "good",
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockOverview);

      const { result } = renderTestHook(() => useFinance());

      expect(result.current.overviewQuery.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.overviewQuery.isLoading).toBe(false);
      });

      expect(result.current.overviewQuery.data).toEqual(mockOverview);
      expect(getFinanceOverview).toHaveBeenCalledTimes(1);
    });

    it("should create a transaction successfully", async () => {
      const newTransaction = {
        amount: 1500,
        date: "2023-01-10",
        type: "income",
        category: "services",
        description: "Consulting service",
      };

      const createdTransaction = {
        id: "3",
        ...newTransaction,
        created_at: "2023-01-10",
        updated_at: "2023-01-10",
      };

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(createdTransaction);

      const { result } = renderTestHook(() => useFinance());

      await act(async () => {
        result.current.createTransactionMutation.mutate(newTransaction);
      });

      await waitFor(() => {
        expect(result.current.createTransactionMutation.isSuccess).toBe(true);
        expect(result.current.createTransactionMutation.data).toEqual(
          createdTransaction
        );
      });

      expect(createTransaction).toHaveBeenCalledWith(newTransaction);
    });

    it("should update a transaction successfully", async () => {
      const transactionId = "1";
      const updateData = {
        amount: 1200,
        description: "Updated description",
      };

      const updatedTransaction = {
        id: transactionId,
        amount: 1200,
        date: "2023-01-01",
        type: "income",
        category: "sales",
        description: "Updated description",
        created_at: "2023-01-01",
        updated_at: "2023-01-10",
      };

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(updatedTransaction);

      const { result } = renderTestHook(() => useFinance());

      await act(async () => {
        result.current.updateTransactionMutation.mutate({
          id: transactionId,
          data: updateData,
        });
      });

      await waitFor(() => {
        expect(result.current.updateTransactionMutation.isSuccess).toBe(true);
        expect(result.current.updateTransactionMutation.data).toEqual(
          updatedTransaction
        );
      });

      expect(updateTransaction).toHaveBeenCalledWith(transactionId, updateData);
    });

    it("should calculate profit and loss successfully", async () => {
      const timePeriod = "year";
      const mockProfitLossCalculation = {
        total_income: 120000,
        total_expenses: 80000,
        net_profit: 40000,
        time_period: timePeriod,
        breakdown: {
          income: { sales: 100000, services: 20000 },
          expenses: { supplies: 50000, utilities: 30000 },
        },
      };

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(mockProfitLossCalculation);

      const { result } = renderTestHook(() => useFinance());

      await act(async () => {
        result.current.calculateProfitLossMutation.mutate(timePeriod);
      });

      await waitFor(() => {
        expect(result.current.calculateProfitLossMutation.isSuccess).toBe(true);
        expect(result.current.calculateProfitLossMutation.data).toEqual(
          mockProfitLossCalculation
        );
      });

      expect(calculateProfitLoss).toHaveBeenCalledWith(timePeriod);
    });

    it("should invalidate queries after successful mutations", async () => {
      // Use shared mutation test utility with query client access
      const { queryClient, renderTestHook, mockMutate } = setupMutationTest();
      const spyInvalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

      // Mock a successful creation
      const newExpense = {
        amount: 750,
        date: "2023-01-15",
        category: "maintenance",
        description: "Equipment repair",
        is_recurring: false,
      };

      const createdExpense = {
        id: "3",
        ...newExpense,
        created_at: "2023-01-15",
        updated_at: "2023-01-15",
      };

      mockMutate.mockResolvedValue(createdExpense);

      const { result } = renderTestHook(() => useFinance());

      await act(async () => {
        result.current.createExpenseMutation.mutate(newExpense);
      });

      await waitFor(() => {
        expect(result.current.createExpenseMutation.isSuccess).toBe(true);
      });

      // Should invalidate multiple queries
      expect(spyInvalidateQueries).toHaveBeenCalledWith(["transactions"]);
      expect(spyInvalidateQueries).toHaveBeenCalledWith(["expenses"]);
      expect(spyInvalidateQueries).toHaveBeenCalledWith(["profitLoss"]);
      expect(spyInvalidateQueries).toHaveBeenCalledWith(["financeOverview"]);
    });
  });
});
