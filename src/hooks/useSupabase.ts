import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardService,
  EmployeeService,
  FillingSystemService,
  SalesService,
  ExpensesService,
  InventoryService,
  FinancialService,
  AuthService,
  type Employee,
  type FillingSystem,
  type Sale,
  type Expense,
  type Inventory,
  type Profile
} from '@/services/supabase-integration';
import type { User } from '@supabase/supabase-js';
// Import centralized entity hooks
import { 
  useEmployees as useCentralizedEmployees, 
  useFuelTypes as useCentralizedFuelTypes, 
  useTanks as useCentralizedTanks, 
  usePetrolProviders as useCentralizedPetrolProviders, 
  useFillingSystems as useCentralizedFillingSystems 
} from './useCentralizedEntity';

// Dashboard Hook
export function useDashboard(startDate?: string, endDate?: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DashboardService.getDashboardData(startDate, endDate);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Employees Hook - Now using centralized hook
export function useEmployees() {
  return useCentralizedEmployees();
}

// Filling Systems Hook - Now using centralized hook
export function useFillingSystems() {
  return useCentralizedFillingSystems();
}

// Sales Hook
export function useSales(limit = 100) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await SalesService.getAll(limit);
      setSales(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const createSale = useCallback(async (sale: Parameters<typeof SalesService.create>[0]) => {
    try {
      const newSale = await SalesService.create(sale);
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create sale');
      throw err;
    }
  }, []);

  const getSalesByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await SalesService.getByDateRange(startDate, endDate);
      setSales(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales by date range');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { 
    sales, 
    loading, 
    error, 
    refetch: fetchSales,
    createSale,
    getSalesByDateRange
  };
}

// Expenses Hook
export function useExpenses(limit = 100) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExpensesService.getAll(limit);
      setExpenses(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const createExpense = useCallback(async (expense: Parameters<typeof ExpensesService.create>[0]) => {
    try {
      const newExpense = await ExpensesService.create(expense);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
      throw err;
    }
  }, []);

  const getExpensesByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExpensesService.getByDateRange(startDate, endDate);
      setExpenses(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses by date range');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { 
    expenses, 
    loading, 
    error, 
    refetch: fetchExpenses,
    createExpense,
    getExpensesByDateRange
  };
}

// Inventory Hook
export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await InventoryService.getAll();
      setInventory(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    try {
      const updatedItem = await InventoryService.updateQuantity(id, quantity);
      setInventory(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory quantity');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return { 
    inventory, 
    loading, 
    error, 
    refetch: fetchInventory,
    updateQuantity
  };
}

// Financial Hook
export function useFinancials() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfitLoss = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await FinancialService.getProfitLoss(startDate, endDate);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profit/loss data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRevenue = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await FinancialService.getRevenue(startDate, endDate);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpenses = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await FinancialService.getExpenses(startDate, endDate);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboard = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await FinancialService.getDashboard(startDate, endDate);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    loading, 
    error,
    getProfitLoss,
    getRevenue,
    getExpenses,
    getDashboard
  };
}

// Authentication Hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.signIn(email, password);
      setUser(result.user);
      
      if (result.user?.id) {
        const userProfile = await AuthService.getProfile(result.user.id);
        setProfile(userProfile);
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser?.id) {
        const userProfile = await AuthService.getProfile(currentUser.id);
        setProfile(userProfile);
      }
      
      return currentUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return { 
    user, 
    profile,
    loading, 
    error,
    signIn,
    signOut,
    getCurrentUser
  };
} 