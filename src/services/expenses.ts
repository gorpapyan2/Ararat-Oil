import { expensesApi, Expense } from "@/core/api";
import { ExpenseCategory } from "@/types";

export interface CreateExpenseRequest {
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  payment_status: string;
  payment_method?: string;
  invoice_number?: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  date?: string;
  amount?: number;
  category?: ExpenseCategory;
  description?: string;
  payment_status?: string;
  payment_method?: string;
  invoice_number?: string;
  notes?: string;
}

export async function fetchExpenses(
  filters?: { 
    category?: string; 
    start_date?: string; 
    end_date?: string; 
    payment_status?: string 
  }
): Promise<Expense[]> {
  try {
    const response = await expensesApi.getAll(filters);

    if (response.error) {
      console.error("Error fetching expenses:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    throw err;
  }
}

export async function fetchExpenseById(id: string): Promise<Expense | null> {
  try {
    const response = await expensesApi.getById(id);

    if (response.error) {
      console.error(`Error fetching expense with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch expense with ID ${id}:`, err);
    throw err;
  }
}

export async function fetchExpenseCategories(): Promise<string[]> {
  try {
    const response = await expensesApi.getCategories();

    if (response.error) {
      console.error("Error fetching expense categories:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch expense categories:", err);
    throw err;
  }
}

export async function createExpense(expense: CreateExpenseRequest): Promise<Expense> {
  try {
    const response = await expensesApi.create(expense as any);

    if (response.error) {
      console.error("Error creating expense:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error("Failed to create expense:", err);
    throw err;
  }
}

export async function updateExpense(id: string, expense: UpdateExpenseRequest): Promise<Expense> {
  try {
    const response = await expensesApi.update(id, expense as any);

    if (response.error) {
      console.error(`Error updating expense with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to update expense with ID ${id}:`, err);
    throw err;
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    const response = await expensesApi.delete(id);

    if (response.error) {
      console.error(`Error deleting expense with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete expense with ID ${id}:`, err);
    throw err;
  }
}
