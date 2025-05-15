import { describe, it, expect } from 'vitest';
import { 
  adaptApiEmployeeToAppEmployee,
  adaptAppEmployeeToApiEmployee,
  adaptApiProfitLossToSummary,
  adaptSummaryToApiProfitLoss,
  adaptApiSaleToAppSale,
  adaptAppSaleToApiSale,
  adaptApiExpenseToAppExpense,
  adaptAppExpenseToApiExpense
} from '../index';
import { EmployeeStatus, ExpenseCategory, PaymentStatus, PaymentMethod, FuelTypeCode } from '@/types';
import { Sale as ApiSale, Expense as ApiExpense } from '@/core/api/types';

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
      filling_system_id: 'fs1',
      fuel_type_id: 'diesel',
      quantity: 50,
      price_per_liter: 100,
      total_price: 5000,
      payment_method: 'cash',
      employee_id: 'emp1',
      shift_id: 'shift1',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptApiSaleToAppSale(apiSale);

    expect(result).toEqual({
      id: '123',
      filling_system_id: 'fs1',
      fuel_type: 'diesel' as FuelTypeCode,
      quantity: 50,
      price_per_unit: 100,
      total_sales: 5000,
      payment_status: 'completed' as PaymentStatus,
      filling_system_name: '',
      meter_start: 0,
      meter_end: 0,
      shift_id: 'shift1',
      date: '2022-01-01T00:00:00Z',
      created_at: '2022-01-01T00:00:00Z'
    });
  });

  it('should convert App Sale to API Sale', () => {
    const appSale = {
      id: '123',
      filling_system_id: 'fs1',
      fuel_type: 'diesel' as FuelTypeCode,
      quantity: 50,
      price_per_unit: 100,
      total_sales: 5000,
      payment_status: 'completed' as PaymentStatus,
      filling_system_name: 'Test System',
      meter_start: 100,
      meter_end: 150,
      shift_id: 'shift1',
      date: '2022-01-01',
      created_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptAppSaleToApiSale(appSale);

    expect(result).toEqual({
      id: '123',
      filling_system_id: 'fs1',
      fuel_type_id: 'diesel',
      quantity: 50,
      price_per_liter: 100,
      total_price: 5000,
      payment_method: 'cash',
      employee_id: '',
      shift_id: 'shift1'
    });
  });
});

describe('Expense Adapters', () => {
  it('should convert API Expense to App Expense', () => {
    const apiExpense: ApiExpense = {
      id: '123',
      category: 'utilities',
      amount: 500,
      description: 'Electricity bill',
      payment_status: 'paid' as 'paid' | 'pending' | 'cancelled',
      payment_date: '2022-01-01',
      receipt_number: 'R12345',
      created_by: 'manager1',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptApiExpenseToAppExpense(apiExpense);

    expect(result).toEqual({
      id: '123',
      date: '2022-01-01',
      amount: 500,
      category: 'utilities' as ExpenseCategory,
      description: 'Electricity bill',
      payment_status: 'completed' as PaymentStatus,
      payment_method: 'cash' as PaymentMethod,
      invoice_number: 'R12345',
      notes: '',
      created_at: '2022-01-01T00:00:00Z'
    });
  });

  it('should convert App Expense to API Expense', () => {
    const appExpense = {
      id: '123',
      date: '2022-01-01',
      amount: 500,
      category: 'utilities' as ExpenseCategory,
      description: 'Electricity bill',
      payment_status: 'completed' as PaymentStatus,
      payment_method: 'cash' as PaymentMethod,
      invoice_number: 'R12345',
      notes: 'Test note',
      created_at: '2022-01-01T00:00:00Z'
    };

    const result = adaptAppExpenseToApiExpense(appExpense);

    expect(result).toEqual({
      id: '123',
      category: 'Utilities',
      amount: 500,
      description: 'Electricity bill',
      payment_status: 'paid',
      payment_date: '2022-01-01',
      receipt_number: 'R12345',
      created_by: ''
    });
  });
}); 