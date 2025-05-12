import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  methodNotAllowed,
  unauthorized,
  notFound,
  parseRequestBody,
  getUrlParams
} from '../_shared/api.ts';
import { Expense, ExpenseCategory, PaymentStatus, PaymentMethod } from '../_shared/types.ts';

// Types for better type safety
interface ExpenseWithRelations extends Expense {
  employee: {
    id: string;
    name: string;
  };
}

interface ExpenseFilters {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  paymentStatus?: PaymentStatus;
}

interface ExpenseValidation {
  isValid: boolean;
  message?: string;
  status?: number;
}

interface TransactionData {
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  employee_id: string;
  entity_id: string;
  entity_type: 'expense';
  description: string;
  updated_at: string;
}

console.info('Expenses Edge Function started');

// Handle expenses operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/expenses', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        const params = getUrlParams(req);
        const filters: ExpenseFilters = {
          category: params.get('category') as ExpenseCategory || undefined,
          startDate: params.get('start_date') || undefined,
          endDate: params.get('end_date') || undefined,
          paymentStatus: params.get('payment_status') as PaymentStatus || undefined
        };
        
        return await getExpenses(filters);
      } else if (path === '/categories') {
        return await getExpenseCategories();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getExpenseById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<Expense, 'id' | 'created_at'>>(req);
      return await createExpense(data, user.id);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<Expense, 'id' | 'created_at'>>>(req);
      return await updateExpense(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteExpense(id);
    }
  } catch (error) {
    console.error('Expenses function error:', error);
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Validate expense data
 */
function validateExpense(expense: Partial<Expense>): ExpenseValidation {
  if (!expense.date) {
    return { isValid: false, message: "Expense date is required", status: 400 };
  }
  
  if (!expense.amount || expense.amount <= 0) {
    return { isValid: false, message: "Amount must be a positive number", status: 400 };
  }
  
  if (!expense.category) {
    return { isValid: false, message: "Category is required", status: 400 };
  }
  
  if (!expense.description) {
    return { isValid: false, message: "Description is required", status: 400 };
  }

  if (!expense.employee_id) {
    return { isValid: false, message: "Employee ID is required", status: 400 };
  }

  // Validate UUID format for employee_id
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(expense.employee_id)) {
    return { isValid: false, message: "Invalid employee ID format", status: 400 };
  }
  
  return { isValid: true };
}

/**
 * Get available expense categories
 */
async function getExpenseCategories(): Promise<Response> {
  try {
    // These are the available expense categories as defined in the ExpenseCategory type
    const categories: ExpenseCategory[] = [
      "utilities", 
      "rent", 
      "salaries", 
      "maintenance", 
      "supplies", 
      "taxes", 
      "insurance", 
      "other"
    ];

    return successResponse(categories);
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    return errorResponse(error);
  }
}

/**
 * Get expenses with optional filtering
 */
async function getExpenses(filters: ExpenseFilters): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Start with base query
    let query = supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });
    
    // Apply filters if provided
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    
    if (filters.startDate) {
      query = query.gte("date", filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte("date", filters.endDate);
    }
    
    if (filters.paymentStatus) {
      query = query.eq("payment_status", filters.paymentStatus);
    }
    
    // Execute the query
    const { data: expenses, error } = await query;

    if (error) throw error;

    // If we have expenses, fetch employee data separately
    if (expenses && expenses.length > 0) {
      const employeeIds = [...new Set(expenses.map(e => e.employee_id).filter(Boolean))];
      
      if (employeeIds.length === 0) {
        return successResponse(expenses);
      }

      const { data: employees, error: employeeError } = await supabase
        .from("employees")
        .select("id, name")
        .in("id", employeeIds);

      if (employeeError) {
        console.error('Error fetching employee data:', employeeError);
        // Return expenses without employee data rather than failing
        return successResponse(expenses);
      }

      // Create a map of employee data
      const employeeMap = new Map(
        (employees || []).map(emp => [emp.id, { id: emp.id, name: emp.name }])
      );

      // Combine the data
      const expensesWithEmployees = expenses.map(expense => ({
        ...expense,
        employee: expense.employee_id ? employeeMap.get(expense.employee_id) || null : null
      }));

      return successResponse(expensesWithEmployees as ExpenseWithRelations[]);
    }

    return successResponse([]);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return errorResponse(error);
  }
}

/**
 * Get an expense by ID
 */
async function getExpenseById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data: expense, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Expense');
      }
      throw error;
    }

    // Fetch employee data separately
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, name")
      .eq("id", expense.employee_id)
      .single();

    if (employeeError) throw employeeError;

    const expenseWithEmployee = {
      ...expense,
      employee: employee || null
    };

    return successResponse(expenseWithEmployee as ExpenseWithRelations);
  } catch (error) {
    console.error(`Error fetching expense ${id}:`, error);
    return errorResponse(error);
  }
}

/**
 * Create a transaction record for an expense
 */
async function createExpenseTransaction(
  expense: Expense,
  userId: string
): Promise<void> {
  const supabase = createServiceClient();
  
  const transactionData: TransactionData = {
    amount: expense.amount,
    payment_method: expense.payment_method || "cash",
    payment_status: "completed",
    employee_id: userId,
    entity_id: expense.id,
    entity_type: "expense",
    description: `Expense: ${expense.description} (${expense.category})`,
    updated_at: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from("transactions")
    .insert(transactionData);
    
  if (error) {
    console.error("Error creating transaction for expense:", error);
    throw error;
  }
}

/**
 * Create a new expense
 */
async function createExpense(
  expense: Omit<Expense, 'id' | 'created_at'>,
  userId: string
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate the expense data
    const validation = validateExpense(expense);
    if (!validation.isValid) {
      return errorResponse({ message: validation.message }, validation.status);
    }
    
    // Set payment status to pending if not provided
    if (!expense.payment_status) {
      expense.payment_status = "pending";
    }
    
    // Create the expense
    const { data: newExpense, error } = await supabase
      .from("expenses")
      .insert(expense)
      .select("*")
      .single();

    if (error) throw error;

    // Fetch employee data separately
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, name")
      .eq("id", newExpense.employee_id)
      .single();

    if (employeeError) throw employeeError;

    const expenseWithEmployee = {
      ...newExpense,
      employee: employee || null
    };

    // If the payment_status is completed, create a transaction record
    if (expense.payment_status === "completed") {
      try {
        await createExpenseTransaction(expenseWithEmployee, userId);
      } catch (transactionError) {
        console.error("Error creating transaction for expense:", transactionError);
        // We don't throw here, as the expense was created successfully
      }
    }

    return successResponse(expenseWithEmployee as ExpenseWithRelations, 201);
  } catch (error) {
    console.error('Error creating expense:', error);
    return errorResponse(error);
  }
}

/**
 * Update an existing expense
 */
async function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'created_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate the updates
    const validation = validateExpense(updates);
    if (!validation.isValid) {
      return errorResponse({ message: validation.message }, validation.status);
    }
    
    // Check if the expense exists
    const { data: existingExpense, error: existingError } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
      
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        return notFound('Expense');
      }
      throw existingError;
    }
    
    // Update the expense
    const { data: updatedExpense, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();
      
    if (error) throw error;

    // Fetch employee data separately
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, name")
      .eq("id", updatedExpense.employee_id)
      .single();

    if (employeeError) throw employeeError;

    const expenseWithEmployee = {
      ...updatedExpense,
      employee: employee || null
    };
    
    // If payment_status is being updated to completed, create a transaction
    if (updates.payment_status === "completed" && existingExpense.payment_status !== "completed") {
      try {
        await createExpenseTransaction(expenseWithEmployee, existingExpense.employee_id);
      } catch (transactionError) {
        console.error("Error creating transaction for expense:", transactionError);
        // We don't throw here, as the expense was updated successfully
      }
    }
    
    return successResponse(expenseWithEmployee as ExpenseWithRelations);
  } catch (error) {
    console.error(`Error updating expense ${id}:`, error);
    return errorResponse(error);
  }
}

/**
 * Delete an expense
 */
async function deleteExpense(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the expense exists
    const { data: existingExpense, error: existingError } = await supabase
      .from("expenses")
      .select("id, payment_status")
      .eq("id", id)
      .single();
      
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        return notFound('Expense');
      }
      throw existingError;
    }
    
    // If the expense has a completed payment, we should not delete it
    if (existingExpense.payment_status === "completed") {
      return errorResponse({
        message: "Cannot delete an expense with completed payment"
      }, 400);
    }
    
    // Delete the expense
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    
    return successResponse(null, 204);
  } catch (error) {
    console.error(`Error deleting expense ${id}:`, error);
    return errorResponse(error);
  }
} 