import { expensesApi } from "@/services/api";
import { Expense, ExpenseCategory } from "@/types";

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
    const { data, error } = await expensesApi.getAll(filters);

    if (error) {
      console.error("Error fetching expenses:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    throw err;
  }
}

export async function fetchExpenseById(id: string): Promise<Expense | null> {
  try {
    const { data, error } = await expensesApi.getById(id);

    if (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch expense with ID ${id}:`, err);
    throw err;
  }
}

export async function fetchExpenseCategories(): Promise<string[]> {
  try {
    const { data, error } = await expensesApi.getCategories();

    if (error) {
      console.error("Error fetching expense categories:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch expense categories:", err);
    throw err;
  }
}

export async function createExpense(expense: CreateExpenseRequest): Promise<Expense> {
  try {
    const { data, error } = await expensesApi.create(expense);

    if (error) {
      console.error("Error creating expense:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create expense:", err);
    throw err;
  }
}

export async function updateExpense(id: string, expense: UpdateExpenseRequest): Promise<Expense> {
  try {
    const { data, error } = await expensesApi.update(id, expense);

    if (error) {
      console.error(`Error updating expense with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update expense with ID ${id}:`, err);
    throw err;
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    const { error } = await expensesApi.delete(id);

    if (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete expense with ID ${id}:`, err);
    throw err;
  }
}
