import { describe, it, expect } from 'vitest';
import { 
  employeeAdapter, 
  adaptApiEmployeeToAppEmployee,
  adaptAppEmployeeToApiEmployee,
  profitLossAdapter,
  adaptApiProfitLossToSummary,
  adaptSummaryToApiProfitLoss,
  salesAdapter,
  expensesAdapter
} from '../index';
import { EmployeeStatus, ExpenseCategory, PaymentStatus, PaymentMethod, FuelTypeCode, Sale, Expense } from '@/types';
import { ApiSale } from '../../types/sale-types';
import { ApiExpense } from '../../types/expense-types';

describe('Employee Adapters', () => {
  it('should convert API Employee to App Employee', () => {
    const apiEmployee = {
      id: '123',
      name: 'John Doe',
      position: 'Manager',
      contact: 'john@example.com',
      salary: 5000,
      hire_date: '2022-01-01',
      status: 'active',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z',
      department: 'Sales'
    };

    const result = adaptApiEmployeeToAppEmployee(apiEmployee);

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      position: 'Manager',
      contact: 'john@example.com',
      salary: 5000,
      hire_date: '2022-01-01',
      status: 'active' as EmployeeStatus,
      created_at: '2022-01-01T00:00:00Z'
    });
  });

  it('should convert App Employee to API Employee', () => {
    const appEmployee = {
      id: '123',
      name: 'John Doe',
      position: 'Manager',
      contact: 'john@example.com',
      salary: 5000,
      hire_date: '2022-01-01',
      status: 'active' as EmployeeStatus,
      created_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptAppEmployeeToApiEmployee(appEmployee);

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      position: 'Manager',
      contact: 'john@example.com',
      salary: 5000,
      hire_date: '2022-01-01',
      status: 'active',
      department: ''
    });
  });
});

describe('ProfitLoss Adapters', () => {
  it('should convert API ProfitLoss to ProfitLossSummary', () => {
    const apiProfitLoss = {
      id: '123',
      period: '2022-01',
      revenue: 10000,
      expenses: 5000,
      profit: 5000,
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z',
      notes: 'Monthly profit'
    };

    const result = adaptApiProfitLossToSummary(apiProfitLoss);

    expect(result).toEqual({
      id: '123',
      period: '2022-01',
      total_sales: 10000,
      total_expenses: 5000,
      profit: 5000,
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    });
  });

  it('should convert ProfitLossSummary to API ProfitLoss', () => {
    const summary = {
      id: '123',
      period: '2022-01',
      total_sales: 10000,
      total_expenses: 5000,
      profit: 5000,
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptSummaryToApiProfitLoss(summary);

    expect(result).toEqual({
      period: '2022-01',
      revenue: 10000,
      expenses: 5000,
      profit: 5000,
      notes: ''
    });
  });
});

describe('Sale Adapters', () => {
  it('should convert API Sale to App Sale', () => {
    const apiSale: ApiSale = {
      id: '123',
      sale_date: '2022-01-01',
      fuel_type: 'diesel',
      quantity: 50,
      price_per_liter: 100,
      total_price: 5000,
      payment_method: 'cash',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    };

    const result = salesAdapter.fromApiData(apiSale);

    expect(result).toEqual(expect.objectContaining({
      id: '123',
      fuelType: 'diesel',
      quantityLiters: 50,
      unitPrice: 100,
      amount: 5000,
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      saleDate: expect.any(Date),
      createdAt: expect.any(Date)
    }));
  });

  it('should convert App Sale to API Sale', () => {
    const appSale = {
      id: '123',
      fuelType: 'diesel' as FuelTypeCode,
      quantityLiters: 50,
      unitPrice: 100,
      amount: 5000,
      paymentMethod: 'cash' as PaymentMethod,
      paymentStatus: 'completed' as PaymentStatus,
      saleDate: new Date('2022-01-01'),
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: null,
      vehiclePlate: '',
      customerName: '',
      notes: ''
    } as Sale;

    const result = salesAdapter.toApiData(appSale);

    expect(result).toEqual(expect.objectContaining({
      id: '123',
      fuel_type: 'diesel',
      quantity_liters: 50,
      unit_price: 100,
      amount: 5000,
      payment_method: 'cash',
      payment_status: 'completed',
      sale_date: '2022-01-01'
    }));
  });
});

describe('Expense Adapters', () => {
  it('should convert API Expense to App Expense', () => {
    const apiExpense: ApiExpense = {
      id: '123',
      amount: 500,
      expense_date: '2022-01-01',
      expense_category: 'utilities',
      description: 'Electricity bill',
      payment_method: 'cash',
      payment_status: 'paid',
      receipt_url: 'receipt.pdf',
      vendor_name: 'Electric Co',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    };

    const result = expensesAdapter.fromApiData(apiExpense);

    expect(result).toEqual(expect.objectContaining({
      id: '123',
      amount: 500,
      expenseDate: expect.any(Date),
      category: 'utilities',
      description: 'Electricity bill',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      receiptUrl: 'receipt.pdf',
      vendorName: 'Electric Co',
      createdAt: expect.any(Date)
    }));
  });

  it('should convert App Expense to API Expense', () => {
    const appExpense = {
      id: '123',
      amount: 500,
      expenseDate: new Date('2022-01-01'),
      category: 'utilities' as ExpenseCategory,
      description: 'Electricity bill',
      paymentMethod: 'cash' as PaymentMethod,
      paymentStatus: 'paid' as PaymentStatus,
      receiptUrl: 'receipt.pdf',
      vendorName: 'Electric Co',
      notes: 'Monthly bill',
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: null
    } as Expense;

    const result = expensesAdapter.toApiData(appExpense);

    expect(result).toEqual(expect.objectContaining({
      id: '123',
      amount: 500,
      expense_date: '2022-01-01',
      expense_category: 'utilities',
      description: 'Electricity bill',
      payment_method: 'cash',
      payment_status: 'paid',
      receipt_url: 'receipt.pdf',
      vendor_name: 'Electric Co',
      notes: 'Monthly bill'
    }));
  });
}); 