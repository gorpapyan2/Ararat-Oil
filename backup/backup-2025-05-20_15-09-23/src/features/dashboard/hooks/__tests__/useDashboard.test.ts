import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { 
  useDashboardData, 
  useFuelLevels, 
  useSalesSummary, 
  useFinancialDashboard,
  useDashboard 
} from '../useDashboard';

// Mock the services
vi.mock('../../services', () => ({
  getDashboardData: vi.fn(),
  getFuelLevels: vi.fn(),
  getSalesSummary: vi.fn(),
  getFinancialDashboard: vi.fn()
}));

import { 
  getDashboardData, 
  getFuelLevels, 
  getSalesSummary, 
  getFinancialDashboard 
} from '../../services';

// Create a wrapper for the QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Dashboard Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('useDashboardData', () => {
    it('should fetch dashboard data successfully', async () => {
      const mockDashboardData = {
        summary: {
          totalSales: 125000,
          totalExpenses: 75000,
          profit: 50000,
          salesChange: 15
        },
        fuelLevels: [
          { tankId: '1', tankName: 'Tank 1', fuelType: 'Diesel', currentLevel: 75, capacity: 100, percentFull: 75 },
          { tankId: '2', tankName: 'Tank 2', fuelType: 'Petrol', currentLevel: 45, capacity: 100, percentFull: 45 }
        ],
        recentTransactions: [
          { id: '1', amount: 1200, date: '2023-01-01', type: 'sale' },
          { id: '2', amount: 800, date: '2023-01-02', type: 'expense' }
        ]
      };
      
      (getDashboardData as any).mockResolvedValue(mockDashboardData);
      
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockDashboardData);
      expect(getDashboardData).toHaveBeenCalledTimes(1);
    });
    
    it('should handle dashboard data fetch error', async () => {
      const mockError = new Error('Failed to fetch dashboard data');
      (getDashboardData as any).mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useDashboardData(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });
  
  describe('useFuelLevels', () => {
    it('should fetch fuel levels successfully', async () => {
      const mockFuelLevels = [
        { tankId: '1', tankName: 'Tank 1', fuelType: 'Diesel', currentLevel: 75, capacity: 100, percentFull: 75 },
        { tankId: '2', tankName: 'Tank 2', fuelType: 'Petrol', currentLevel: 45, capacity: 100, percentFull: 45 }
      ];
      
      (getFuelLevels as any).mockResolvedValue(mockFuelLevels);
      
      const { result } = renderHook(() => useFuelLevels(), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFuelLevels);
      expect(getFuelLevels).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('useSalesSummary', () => {
    it('should fetch sales summary successfully with default timeframe', async () => {
      const mockSalesSummary = {
        totalSales: 125000,
        averagePerDay: 4166.67,
        topSellingProducts: [
          { productId: '1', name: 'Diesel', quantity: 5000, revenue: 75000 },
          { productId: '2', name: 'Petrol', quantity: 3500, revenue: 50000 }
        ],
        salesByDay: [
          { date: '2023-01-01', amount: 4200 },
          { date: '2023-01-02', amount: 3800 }
        ]
      };
      
      (getSalesSummary as any).mockResolvedValue(mockSalesSummary);
      
      const { result } = renderHook(() => useSalesSummary(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockSalesSummary);
      expect(getSalesSummary).toHaveBeenCalledWith('week'); // Default timeframe
    });
    
    it('should fetch sales summary with specified timeframe', async () => {
      const mockSalesSummary = {
        totalSales: 500000,
        averagePerDay: 16666.67,
        topSellingProducts: [
          { productId: '1', name: 'Diesel', quantity: 20000, revenue: 300000 },
          { productId: '2', name: 'Petrol', quantity: 15000, revenue: 200000 }
        ],
        salesByDay: [
          { date: '2023-01-01', amount: 16500 },
          { date: '2023-01-02', amount: 18200 }
        ]
      };
      
      (getSalesSummary as any).mockResolvedValue(mockSalesSummary);
      
      const { result } = renderHook(() => useSalesSummary('month'), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockSalesSummary);
      expect(getSalesSummary).toHaveBeenCalledWith('month');
    });
  });
  
  describe('useFinancialDashboard', () => {
    it('should fetch financial dashboard data successfully', async () => {
      const mockFinancialData = {
        totalRevenue: 500000,
        totalExpenses: 320000,
        netProfit: 180000,
        profitMargin: 36,
        revenueByCategory: [
          { category: 'Diesel', amount: 300000 },
          { category: 'Petrol', amount: 200000 }
        ],
        expensesByCategory: [
          { category: 'Supplies', amount: 250000 },
          { category: 'Salaries', amount: 50000 },
          { category: 'Operations', amount: 20000 }
        ]
      };
      
      (getFinancialDashboard as any).mockResolvedValue(mockFinancialData);
      
      const { result } = renderHook(() => useFinancialDashboard(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFinancialData);
      expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('useDashboard', () => {
    it('should combine all dashboard hooks and provide aggregate data', async () => {
      const mockDashboardData = {
        summary: {
          totalSales: 125000,
          totalExpenses: 75000,
          profit: 50000,
          salesChange: 15
        },
        fuelLevels: [
          { tankId: '1', tankName: 'Tank 1', fuelType: 'Diesel', currentLevel: 75, capacity: 100, percentFull: 75 },
          { tankId: '2', tankName: 'Tank 2', fuelType: 'Petrol', currentLevel: 45, capacity: 100, percentFull: 45 }
        ],
        recentTransactions: [
          { id: '1', amount: 1200, date: '2023-01-01', type: 'sale' },
          { id: '2', amount: 800, date: '2023-01-02', type: 'expense' }
        ]
      };
      
      const mockFuelLevels = [
        { tankId: '1', tankName: 'Tank 1', fuelType: 'Diesel', currentLevel: 75, capacity: 100, percentFull: 75 },
        { tankId: '2', tankName: 'Tank 2', fuelType: 'Petrol', currentLevel: 45, capacity: 100, percentFull: 45 }
      ];
      
      const mockSalesSummary = {
        totalSales: 125000,
        averagePerDay: 4166.67,
        topSellingProducts: [
          { productId: '1', name: 'Diesel', quantity: 5000, revenue: 75000 },
          { productId: '2', name: 'Petrol', quantity: 3500, revenue: 50000 }
        ],
        salesByDay: [
          { date: '2023-01-01', amount: 4200 },
          { date: '2023-01-02', amount: 3800 }
        ]
      };
      
      const mockFinancialData = {
        totalRevenue: 500000,
        totalExpenses: 320000,
        netProfit: 180000,
        profitMargin: 36,
        revenueByCategory: [
          { category: 'Diesel', amount: 300000 },
          { category: 'Petrol', amount: 200000 }
        ],
        expensesByCategory: [
          { category: 'Supplies', amount: 250000 },
          { category: 'Salaries', amount: 50000 },
          { category: 'Operations', amount: 20000 }
        ]
      };
      
      (getDashboardData as any).mockResolvedValue(mockDashboardData);
      (getFuelLevels as any).mockResolvedValue(mockFuelLevels);
      (getSalesSummary as any).mockResolvedValue(mockSalesSummary);
      (getFinancialDashboard as any).mockResolvedValue(mockFinancialData);
      
      const { result } = renderHook(() => useDashboard(), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Verify that all data from different endpoints is combined
      expect(result.current.dashboardData).toEqual(mockDashboardData);
      expect(result.current.fuelLevels).toEqual(mockFuelLevels);
      expect(result.current.salesSummary).toEqual(mockSalesSummary);
      expect(result.current.financialData).toEqual(mockFinancialData);
      
      // Verify all services were called
      expect(getDashboardData).toHaveBeenCalledTimes(1);
      expect(getFuelLevels).toHaveBeenCalledTimes(1);
      expect(getSalesSummary).toHaveBeenCalledTimes(1);
      expect(getFinancialDashboard).toHaveBeenCalledTimes(1);
    });
    
    it('should handle loading state correctly when some requests are pending', async () => {
      // Mock one service to resolve immediately and the others to delay
      (getDashboardData as any).mockResolvedValue({});
      (getFuelLevels as any).mockResolvedValue({});
      
      // These two will delay
      const salesPromise = new Promise(resolve => {
        setTimeout(() => resolve({}), 100);
      });
      const financialPromise = new Promise(resolve => {
        setTimeout(() => resolve({}), 150);
      });
      
      (getSalesSummary as any).mockReturnValue(salesPromise);
      (getFinancialDashboard as any).mockReturnValue(financialPromise);
      
      const { result } = renderHook(() => useDashboard(), {
        wrapper: createWrapper()
      });
      
      // Initially all should be loading
      expect(result.current.isLoading).toBe(true);
      
      // Even after some requests resolve, isLoading should still be true
      await waitFor(() => {
        expect(result.current.dashboardLoading).toBe(false);
        expect(result.current.fuelLevelsLoading).toBe(false);
      });
      
      expect(result.current.isLoading).toBe(true);
      
      // Only after all requests resolve should isLoading be false
      await waitFor(() => {
        expect(result.current.salesSummaryLoading).toBe(false);
        expect(result.current.financialLoading).toBe(false);
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 200 });
    });
  });
}); 