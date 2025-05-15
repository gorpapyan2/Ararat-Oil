# Finance Feature Migration Guide

## Overview
This document outlines the migration of the finance feature to use Supabase Edge Functions and follow the new feature-based architecture.

## Changes Made

### 1. Edge Function Integration
- Created new edge function at `supabase/functions/finance/index.ts`
- Handles transactions, expenses, and profit/loss operations
- Implements proper error handling and CORS
- Includes user authentication checks

### 2. Service Layer Updates
- Updated `financeService.ts` to use edge functions
- Improved error handling with try/catch blocks
- Standardized response handling
- Added type safety

### 3. Type System
- Maintained existing types for:
  - `Transaction`
  - `Expense`
  - `ProfitLoss`
  - `PaymentMethod`
  - `PaymentStatus`

## How to Use

### Transactions
```typescript
import { financeService } from '@/features/finance'

// Get all transactions
const transactions = await financeService.getTransactions()

// Create a new transaction
const newTransaction = await financeService.createTransaction({
  amount: 1000,
  description: 'Fuel sale',
  payment_method: 'cash',
  payment_status: 'completed',
  employee_id: 'emp123'
})

// Update a transaction
const updatedTransaction = await financeService.updateTransaction('txn123', {
  payment_status: 'refunded'
})
```

### Expenses
```typescript
import { financeService } from '@/features/finance'

// Get all expenses
const expenses = await financeService.getExpenses()

// Create a new expense
const newExpense = await financeService.createExpense({
  amount: 500,
  description: 'Office supplies',
  category: 'supplies',
  date: '2024-03-20',
  employee_id: 'emp123',
  payment_status: 'pending'
})

// Update an expense
const updatedExpense = await financeService.updateExpense('exp123', {
  payment_status: 'completed'
})
```

### Profit & Loss
```typescript
import { financeService } from '@/features/finance'

// Get profit/loss data
const profitLoss = await financeService.getProfitLoss()

// Create new profit/loss entry
const newProfitLoss = await financeService.createProfitLoss({
  period: '2024-Q1',
  total_sales: 50000,
  total_expenses: 30000,
  profit: 20000
})

// Update profit/loss entry
const updatedProfitLoss = await financeService.updateProfitLoss('pl123', {
  total_expenses: 35000,
  profit: 15000
})
```

## Migration Steps

1. Update imports to use the new finance feature:
   ```typescript
   // Old
   import { financeService } from '@/services/finance'
   
   // New
   import { financeService } from '@/features/finance'
   ```

2. Update service calls to handle the new response format:
   ```typescript
   // Old
   const transactions = await financeService.getTransactions()
   
   // New
   const { transactions } = await financeService.getTransactions()
   ```

3. Add error handling:
   ```typescript
   try {
     const transactions = await financeService.getTransactions()
   } catch (error) {
     // Handle error
   }
   ```

## Testing

1. Test transaction operations:
   - Create transaction
   - Update transaction
   - List transactions
   - Error handling

2. Test expense operations:
   - Create expense
   - Update expense
   - List expenses
   - Error handling

3. Test profit/loss operations:
   - Create profit/loss entry
   - Update profit/loss entry
   - List profit/loss data
   - Error handling

## Security Considerations

1. All operations require authentication
2. Edge functions validate user permissions
3. Data access is restricted to authorized users
4. Input validation is performed on the server

## Performance Impact

1. Reduced client-side code
2. Better error handling
3. Improved data validation
4. More efficient data fetching

## Rollback Plan

If issues are encountered:

1. Revert to direct Supabase access:
   ```typescript
   const { data, error } = await supabase
     .from('transactions')
     .select('*')
   ```

2. Remove edge function calls
3. Restore old service methods
4. Update types to match old structure

## Next Steps

1. Add transaction filtering
2. Implement expense categories
3. Add financial reporting
4. Enhance profit/loss calculations 