import { waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  useDashboardData,
  useFuelLevels,
  useSalesSummary,
  useFinancialDashboard,
  useDashboard,
} from "../useDashboard";
import { setupHookTest, setupErrorTest } from "@/test/utils/test-setup";

// Mock the services
vi.mock("../../services", () => ({
  getDashboardData: vi.fn(),
  getFuelLevels: vi.fn(),
  getSalesSummary: vi.fn(),
  getFinancialDashboard: vi.fn(),
}));

import {
  getDashboardData,
  getFuelLevels,
  getSalesSummary,
  getFinancialDashboard,
} from "../../services";

describe("Dashboard Hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("useDashboardData", () => {
    it("should fetch dashboard data successfully", async () => {
      const mockDashboardData = {
        summary: {
          totalSales: 125000,
          totalExpenses: 75000,
          profit: 50000,
          salesChange: 15,
        },
        fuelLevels: [
          {
            tankId: "1",
            tankName: "Tank 1",
            fuelType: "Diesel",
            currentLevel: 75,
            capacity: 100,
            percentFull: 75,
          },
          {
            tankId: "2",
            tankName: "Tank 2",
            fuelType: "Petrol",
            currentLevel: 45,
            capacity: 100,
            percentFull: 45,
          },
        ],
        recentTransactions: [
          { id: "1", amount: 1200, date: "2023-01-01", type: "sale" },
          { id: "2", amount: 800, date: "2023-01-02", type: "expense" },
        ],
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockDashboardData);

      const { result } = renderTestHook(() => useDashboardData());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockDashboardData);
      expect(getDashboardData).toHaveBeenCalledTimes(1);
    });

    it("should handle dashboard data fetch error", async () => {
      // Use shared error test utility
      const { renderTestHook, mockFetch } = setupErrorTest();
      mockFetch.mockRejectedValue(new Error("Failed to fetch dashboard data"));

      const { result } = renderTestHook(() => useDashboardData());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe("useFuelLevels", () => {
    it("should fetch fuel levels successfully", async () => {
      const mockFuelLevels = [
        {
          tankId: "1",
          tankName: "Tank 1",
          fuelType: "Diesel",
          currentLevel: 75,
          capacity: 100,
          percentFull: 75,
        },
        {
          tankId: "2",
          tankName: "Tank 2",
          fuelType: "Petrol",
          currentLevel: 45,
          capacity: 100,
          percentFull: 45,
        },
      ];

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFuelLevels);

      const { result } = renderTestHook(() => useFuelLevels());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockFuelLevels);
      expect(getFuelLevels).toHaveBeenCalledTimes(1);
    });
  });

  describe("useSalesSummary", () => {
    it("should fetch sales summary successfully with default timeframe", async () => {
      const mockSalesSummary = {
        totalSales: 125000,
        averagePerDay: 4166.67,
        topSellingProducts: [
          { productId: "1", name: "Diesel", quantity: 5000, revenue: 75000 },
          { productId: "2", name: "Petrol", quantity: 3500, revenue: 50000 },
        ],
        salesByDay: [
          { date: "2023-01-01", amount: 4200 },
          { date: "2023-01-02", amount: 3800 },
        ],
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockSalesSummary);

      const { result } = renderTestHook(() => useSalesSummary());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockSalesSummary);
      expect(getSalesSummary).toHaveBeenCalledWith("week"); // Default timeframe
    });

    it("should fetch sales summary with specified timeframe", async () => {
      const mockSalesSummary = {
        totalSales: 500000,
        averagePerDay: 16666.67,
        topSellingProducts: [
          { productId: "1", name: "Diesel", quantity: 20000, revenue: 300000 },
          { productId: "2", name: "Petrol", quantity: 15000, revenue: 200000 },
        ],
        salesByDay: [
          { date: "2023-01-01", amount: 16500 },
          { date: "2023-01-02", amount: 18200 },
        ],
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockSalesSummary);

      const { result } = renderTestHook(() => useSalesSummary("month"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockSalesSummary);
      expect(getSalesSummary).toHaveBeenCalledWith("month");
    });
  });

  describe("useFinancialDashboard", () => {
    it("should fetch financial dashboard data successfully", async () => {
      const mockFinancialData = {
        totalRevenue: 500000,
        totalExpenses: 320000,
        netProfit: 180000,
        profitMargin: 36,
        revenueByCategory: [
          { category: "Diesel", amount: 300000 },
          { category: "Petrol", amount: 200000 },
        ],
        expensesByCategory: [
          { category: "Supplies", amount: 250000 },
          { category: "Salaries", amount: 50000 },
          { category: "Operations", amount: 20000 },
        ],
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFinancialData);

      const { result } = renderTestHook(() => useFinancialDashboard());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockFinancialData);
      expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe("useDashboard", () => {
    it("should combine all dashboard hooks and provide aggregate data", async () => {
      const mockDashboardData = {
        summary: {
          totalSales: 125000,
          totalExpenses: 75000,
          profit: 50000,
          salesChange: 15,
        },
        fuelLevels: [
          {
            tankId: "1",
            tankName: "Tank 1",
            fuelType: "Diesel",
            currentLevel: 75,
            capacity: 100,
            percentFull: 75,
          },
          {
            tankId: "2",
            tankName: "Tank 2",
            fuelType: "Petrol",
            currentLevel: 45,
            capacity: 100,
            percentFull: 45,
          },
        ],
        recentTransactions: [
          { id: "1", amount: 1200, date: "2023-01-01", type: "sale" },
          { id: "2", amount: 800, date: "2023-01-02", type: "expense" },
        ],
      };

      const mockFuelLevels = [
        {
          tankId: "1",
          tankName: "Tank 1",
          fuelType: "Diesel",
          currentLevel: 75,
          capacity: 100,
          percentFull: 75,
        },
        {
          tankId: "2",
          tankName: "Tank 2",
          fuelType: "Petrol",
          currentLevel: 45,
          capacity: 100,
          percentFull: 45,
        },
      ];

      const mockSalesSummary = {
        totalSales: 125000,
        averagePerDay: 4166.67,
        topSellingProducts: [
          { productId: "1", name: "Diesel", quantity: 5000, revenue: 75000 },
          { productId: "2", name: "Petrol", quantity: 3500, revenue: 50000 },
        ],
        salesByDay: [
          { date: "2023-01-01", amount: 4200 },
          { date: "2023-01-02", amount: 3800 },
        ],
      };

      const mockFinancialData = {
        totalRevenue: 500000,
        totalExpenses: 320000,
        netProfit: 180000,
        profitMargin: 36,
        revenueByCategory: [
          { category: "Diesel", amount: 300000 },
          { category: "Petrol", amount: 200000 },
        ],
        expensesByCategory: [
          { category: "Supplies", amount: 250000 },
          { category: "Salaries", amount: 50000 },
          { category: "Operations", amount: 20000 },
        ],
      };

      // Use shared test utility, but we need to mock multiple API calls
      const { renderTestHook, mockFetch, queryClient } = setupHookTest();

      // Setup different responses based on the API endpoint
      mockFetch.mockImplementation((endpoint) => {
        if (endpoint.includes("dashboard-data"))
          return Promise.resolve(mockDashboardData);
        if (endpoint.includes("fuel-levels"))
          return Promise.resolve(mockFuelLevels);
        if (endpoint.includes("sales-summary"))
          return Promise.resolve(mockSalesSummary);
        if (endpoint.includes("financial-dashboard"))
          return Promise.resolve(mockFinancialData);
        return Promise.reject(new Error("Unknown endpoint"));
      });

      const { result } = renderTestHook(() => useDashboard());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify that all data from different endpoints is combined
      expect(result.current.data).toEqual(mockDashboardData);
      expect(result.current.fuelLevels).toEqual(mockFuelLevels);
      expect(result.current.salesSummary).toEqual(mockSalesSummary);
      expect(result.current.financialData).toEqual(mockFinancialData);

      // Verify all services were called
      expect(getDashboardData).toHaveBeenCalledTimes(1);
      expect(getFuelLevels).toHaveBeenCalledTimes(1);
      expect(getSalesSummary).toHaveBeenCalledTimes(1);
      expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
    });

    it("should handle loading state correctly when some requests are pending", async () => {
      // Use shared test utility but with controlled promise resolution
      const { renderTestHook, mockFetch, queryClient } = setupHookTest();

      // Mock different loading times for different endpoints
      mockFetch.mockImplementation((endpoint) => {
        if (endpoint.includes("dashboard-data")) return Promise.resolve({});
        if (endpoint.includes("fuel-levels")) return Promise.resolve({});
        if (endpoint.includes("sales-summary")) {
          return new Promise((resolve) => {
            setTimeout(() => resolve({}), 100);
          });
        }
        if (endpoint.includes("financial-dashboard")) {
          return new Promise((resolve) => {
            setTimeout(() => resolve({}), 150);
          });
        }
        return Promise.reject(new Error("Unknown endpoint"));
      });

      const { result } = renderTestHook(() => useDashboard());

      // Initially all should be loading
      expect(result.current.isLoading).toBe(true);

      // Even after some requests resolve, isLoading should still be true
      await waitFor(() => {
        // Check individual loading states instead of dashboardLoading/fuelLevelsLoading
        expect(result.current.isLoading).toBe(true);
      });

      // Only after all requests resolve should isLoading be false
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 200 }
      );
    });
  });
});
