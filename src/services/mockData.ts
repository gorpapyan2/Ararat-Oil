import type {
  DashboardData,
  FinancialDashboard,
  RevenueData,
  ExpensesData,
  ProfitLoss,
  Sale,
  Expense,
  Tank,
  Employee,
  FillingSystem,
} from "@/core/api/types";
import type { FinanceOverview } from "@/features/finance/types/finance.types";

/**
 * Mock Data Service
 * Provides fallback data when API calls fail or when in offline mode
 */

// Helper function to generate random dates within a range
function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

// Helper function to generate trend data
function generateTrendData(length: number = 7, baseValue: number = 1000): Array<{ date: string; value: number }> {
  const now = new Date();
  return Array.from({ length }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (length - 1 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue + Math.random() * baseValue * 0.5 - baseValue * 0.25)
    };
  });
}

// Mock Sales Data
export const mockSales: Sale[] = [
  {
    id: "sale-1",
    amount: 2500.00,
    fuel_type: "gasoline",
    quantity: 125.5,
    unit_price: 19.92,
    transaction_date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    customer_id: "customer-1",
    filling_system_id: "fs-1",
    status: "completed",
    payment_method: "credit_card",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sale-2",
    amount: 3200.00,
    fuel_type: "diesel",
    quantity: 180.2,
    unit_price: 17.76,
    transaction_date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    customer_id: "customer-2",
    filling_system_id: "fs-2",
    status: "completed",
    payment_method: "cash",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sale-3",
    amount: 1800.00,
    fuel_type: "gasoline",
    quantity: 90.3,
    unit_price: 19.92,
    transaction_date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    customer_id: "customer-3",
    filling_system_id: "fs-3",
    status: "completed",
    payment_method: "debit_card",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Expenses Data
export const mockExpenses: Expense[] = [
  {
    id: "expense-1",
    amount: 25000.00,
    category: "fuel_purchase",
    description: "Fuel inventory restock",
    date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    vendor: "Fuel Supplier Co.",
    receipt_url: null,
    approved_by: "manager-1",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "expense-2",
    amount: 3500.00,
    category: "maintenance",
    description: "Pump maintenance and repair",
    date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    vendor: "Equipment Services LLC",
    receipt_url: null,
    approved_by: "manager-1",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "expense-3",
    amount: 1200.00,
    category: "utilities",
    description: "Monthly electricity bill",
    date: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    vendor: "Power Company",
    receipt_url: null,
    approved_by: "manager-1",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Tanks Data
export const mockTanks: Tank[] = [
  {
    id: "tank-1",
    name: "Main Gasoline Tank",
    capacity: 50000,
    current_level: 35000,
    fuel_type: "gasoline",
    location: "Primary Storage Area",
    last_refill: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tank-2",
    name: "Diesel Storage Tank",
    capacity: 40000,
    current_level: 28000,
    fuel_type: "diesel",
    location: "Secondary Storage Area",
    last_refill: getRandomDate(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), new Date()),
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "tank-3",
    name: "Premium Gasoline Tank",
    capacity: 30000,
    current_level: 15000,
    fuel_type: "premium",
    location: "Premium Storage Area",
    last_refill: getRandomDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), new Date()),
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Employees Data
export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    full_name: "John Smith",
    email: "john.smith@araratoil.com",
    phone: "+1-555-0101",
    position: "Station Manager",
    department: "Operations",
    hire_date: "2023-01-15",
    status: "active",
    salary: 55000,
    profile_picture_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "emp-2",
    full_name: "Sarah Johnson",
    email: "sarah.johnson@araratoil.com",
    phone: "+1-555-0102",
    position: "Cashier",
    department: "Sales",
    hire_date: "2023-03-20",
    status: "active",
    salary: 32000,
    profile_picture_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "emp-3",
    full_name: "Mike Wilson",
    email: "mike.wilson@araratoil.com",
    phone: "+1-555-0103",
    position: "Maintenance Technician",
    department: "Maintenance",
    hire_date: "2022-11-10",
    status: "active",
    salary: 45000,
    profile_picture_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Filling Systems Data
export const mockFillingSystems: FillingSystem[] = [
  {
    id: "fs-1",
    name: "Pump Station A",
    location: "Front Row",
    fuel_types: ["gasoline", "premium"],
    status: "operational",
    last_maintenance: getRandomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date()),
    daily_sales: 15000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fs-2",
    name: "Pump Station B",
    location: "Middle Row",
    fuel_types: ["diesel"],
    status: "operational",
    last_maintenance: getRandomDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), new Date()),
    daily_sales: 12000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fs-3",
    name: "Pump Station C",
    location: "Back Row",
    fuel_types: ["gasoline", "diesel", "premium"],
    status: "maintenance",
    last_maintenance: getRandomDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), new Date()),
    daily_sales: 8000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Dashboard Data
export const mockDashboardData: DashboardData = {
  fuel_levels: {
    "tank-1": 70, // 35000 / 50000 * 100
    "tank-2": 70, // 28000 / 40000 * 100
    "tank-3": 50, // 15000 / 30000 * 100
  },
  recent_sales: mockSales.slice(0, 5),
  revenue_summary: {
    daily: 7500,
    weekly: 52500,
    monthly: 210000,
  },
  inventory_status: {
    total_capacity: 120000,
    current_level: 78000,
    percentage: 65,
  },
};

// Mock Financial Dashboard Data
export const mockFinancialDashboard: FinancialDashboard = {
  revenue: {
    total: 125000,
    trend: generateTrendData(7, 15000),
  },
  expenses: {
    total: 78000,
    trend: generateTrendData(7, 10000),
  },
  profit: {
    total: 47000,
    trend: generateTrendData(7, 5000),
  },
};

// Mock Revenue Data
export const mockRevenueData: RevenueData = {
  total: 125000,
  breakdown: {
    gasoline: 75000,
    diesel: 35000,
    premium: 15000,
  },
  period: "monthly",
  trend: generateTrendData(30, 4000),
};

// Mock Expenses Data
export const mockExpensesData: ExpensesData = {
  total: 78000,
  breakdown: {
    fuel_purchase: 45000,
    salaries: 18000,
    utilities: 8000,
    maintenance: 4500,
    other: 2500,
  },
  period: "monthly",
  trend: generateTrendData(30, 2500),
};

// Mock Profit Loss Data
export const mockProfitLoss: ProfitLoss[] = [
  {
    id: "pl-2024-01",
    period: "2024-01",
    revenue: 120000,
    expenses: 75000,
    profit: 45000,
    profit_margin: 37.5,
    created_at: "2024-01-31T23:59:59Z",
  },
  {
    id: "pl-2024-02",
    period: "2024-02",
    revenue: 135000,
    expenses: 82000,
    profit: 53000,
    profit_margin: 39.3,
    created_at: "2024-02-29T23:59:59Z",
  },
  {
    id: "pl-2024-03",
    period: "2024-03",
    revenue: 125000,
    expenses: 78000,
    profit: 47000,
    profit_margin: 37.6,
    created_at: "2024-03-31T23:59:59Z",
  },
];

// Mock Finance Overview Data
export const mockFinanceOverview: FinanceOverview = {
  total_sales: 125000,
  total_expenses: 78000,
  net_profit: 47000,
  recent_transactions: [
    {
      id: "txn-1",
      type: "sale",
      amount: 2500,
      description: "Fuel sale - Gasoline",
      date: new Date().toISOString(),
      category: "revenue",
    },
    {
      id: "txn-2",
      type: "expense",
      amount: 25000,
      description: "Fuel inventory purchase",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "fuel_purchase",
    },
    {
      id: "txn-3",
      type: "sale",
      amount: 1800,
      description: "Fuel sale - Diesel",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: "revenue",
    },
  ],
  top_expenses: mockExpenses.slice(0, 3),
};

/**
 * Mock Data Provider
 * Main export that provides all mock data functions
 */
export const mockDataProvider = {
  // Basic data
  getSales: () => Promise.resolve(mockSales),
  getExpenses: () => Promise.resolve(mockExpenses),
  getTanks: () => Promise.resolve(mockTanks),
  getEmployees: () => Promise.resolve(mockEmployees),
  getFillingSystems: () => Promise.resolve(mockFillingSystems),

  // Dashboard data
  getDashboardData: () => Promise.resolve(mockDashboardData),
  getFinancialDashboard: () => Promise.resolve(mockFinancialDashboard),

  // Financial data
  getRevenue: (period?: string) => Promise.resolve(mockRevenueData),
  getExpenses: (period?: string) => Promise.resolve(mockExpensesData),
  getProfitLoss: () => Promise.resolve(mockProfitLoss),
  getFinanceOverview: () => Promise.resolve(mockFinanceOverview),

  // Utility functions
  generateTrendData,
  getRandomDate,
};

export default mockDataProvider; 