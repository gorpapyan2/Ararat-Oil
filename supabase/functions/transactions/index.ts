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
import { Transaction } from '../_shared/types.ts';

// Handle transactions operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/transactions', '');

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
        const entityType = params.get('entity_type');
        const entityId = params.get('entity_id');
        const startDate = params.get('start_date');
        const endDate = params.get('end_date');
        
        return await getTransactions(entityType, entityId, startDate, endDate);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getTransactionById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>(req);
      return await createTransaction(data, user.id);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>>(req);
      return await updateTransaction(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteTransaction(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get transactions with optional filtering
 */
async function getTransactions(
  entityType?: string | null, 
  entityId?: string | null,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Start with base query
    let query = supabase
      .from("transactions")
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .order("created_at", { ascending: false });
    
    // Apply filters if provided
    if (entityType) {
      query = query.eq("entity_type", entityType);
    }
    
    if (entityId) {
      query = query.eq("entity_id", entityId);
    }
    
    if (startDate) {
      // Convert to ISO string if it's not already
      const startDateISO = new Date(startDate).toISOString();
      query = query.gte("created_at", startDateISO);
    }
    
    if (endDate) {
      // Convert to ISO string if it's not already
      // Set time to end of day
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      query = query.lte("created_at", endDateISO);
    }
    
    // Execute the query
    const { data, error } = await query;

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a transaction by ID
 */
async function getTransactionById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Transaction');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new transaction
 */
async function createTransaction(
  transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Ensure the amount is a number and is valid
    if (typeof transaction.amount !== 'number' || isNaN(transaction.amount) || transaction.amount <= 0) {
      return errorResponse({
        message: "Transaction amount must be a positive number"
      }, 400);
    }
    
    // If entity_id and entity_type are provided, validate they exist
    if (transaction.entity_id && transaction.entity_type) {
      let table: string;
      
      // Map entity type to table name
      switch (transaction.entity_type) {
        case "sale":
          table = "sales";
          break;
        case "expense":
          table = "expenses";
          break;
        case "fuel_supply":
          table = "fuel_supplies";
          break;
        default:
          return errorResponse({
            message: `Unknown entity type: ${transaction.entity_type}`
          }, 400);
      }
      
      // Check if the entity exists
      const { data: entity, error: entityError } = await supabase
        .from(table)
        .select("id")
        .eq("id", transaction.entity_id)
        .single();
        
      if (entityError) {
        if (entityError.code === 'PGRST116') {
          return errorResponse({
            message: `${transaction.entity_type} with ID ${transaction.entity_id} not found`
          }, 400);
        }
        throw entityError;
      }
    }
    
    // Set employee_id to current user if not provided
    if (!transaction.employee_id) {
      transaction.employee_id = userId;
    }
    
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...transaction,
        // Set updated_at to same as created_at for new records
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .single();

    if (error) throw error;

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing transaction
 */
async function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the transaction exists
    const { data: existingTransaction, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Transaction');
      }
      throw checkError;
    }
    
    // Validate amount if it's being updated
    if (updates.amount !== undefined) {
      if (typeof updates.amount !== 'number' || isNaN(updates.amount) || updates.amount <= 0) {
        return errorResponse({
          message: "Transaction amount must be a positive number"
        }, 400);
      }
    }
    
    // Validate entity_id and entity_type if they're being updated
    if (updates.entity_id && updates.entity_type) {
      let table: string;
      
      switch (updates.entity_type) {
        case "sale":
          table = "sales";
          break;
        case "expense":
          table = "expenses";
          break;
        case "fuel_supply":
          table = "fuel_supplies";
          break;
        default:
          return errorResponse({
            message: `Unknown entity type: ${updates.entity_type}`
          }, 400);
      }
      
      const { data: entity, error: entityError } = await supabase
        .from(table)
        .select("id")
        .eq("id", updates.entity_id)
        .single();
        
      if (entityError) {
        if (entityError.code === 'PGRST116') {
          return errorResponse({
            message: `${updates.entity_type} with ID ${updates.entity_id} not found`
          }, 400);
        }
        throw entityError;
      }
    }
    
    // Always set updated_at to now
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update the transaction
    const { data, error } = await supabase
      .from("transactions")
      .update(updatedFields)
      .eq("id", id)
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete a transaction
 */
async function deleteTransaction(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the transaction exists
    const { data: transaction, error: checkError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Transaction');
      }
      throw checkError;
    }
    
    // If this transaction is linked to an entity, check if we should allow deletion
    if (transaction.entity_id && transaction.entity_type) {
      // For now, we allow deletion of transactions linked to other entities
      // In the future, you might want to add additional validation here
    }

    // Delete the transaction
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
} 