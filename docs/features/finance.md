# Finance Feature

## Overview

The Finance feature manages all aspects of financial operations for the fuel station business. It provides functionality to:

- Track transactions for income and expenses
- Manage business expenses with categories and payment status
- Generate profit and loss reports for different time periods
- Provide financial overview and summaries for business management

## Architecture

The feature follows the standardized feature-based architecture:

```
src/features/finance/
├── hooks/                 # React Query hooks
│   ├── useFinance.ts      # Main hook for financial operations
│   └── index.ts           # Export file
├── services/              # API service functions
│   ├── index.ts           # API integration with adapters
│   └── financeService.ts  # Original service implementation
├── types/                 # TypeScript type definitions
│   ├── finance.types.ts   # Feature-specific types
│   └── index.ts           # Export file
├── components/            # React components
│   └── [various components]
└── index.ts               # Feature-level exports
```

## Types

The main types in this feature are:

- `Transaction`: Represents a financial transaction with amount, payment method, and status
- `Expense`: Represents business expenses with category, amount, and payment status
- `ProfitLoss`: Represents profit and loss data for a specific period
- `FinanceData`: Aggregates all financial data types for comprehensive views

## Services

The service layer provides the following functions:

- `getTransactions()`: Get all financial transactions
- `createTransaction(data)`: Create a new transaction
- `updateTransaction(id, data)`: Update an existing transaction
- `getExpenses()`: Get all business expenses
- `createExpense(data)`: Create a new expense
- `updateExpense(id, data)`: Update an existing expense
- `getProfitLoss()`: Get profit and loss reports
- `calculateProfitLoss(period, startDate, endDate)`: Calculate profit and loss for a specific period
- `getFinanceOverview()`: Get a high-level overview of financial status
- `getAllFinanceData()`: Get all financial data in a single call

The service layer includes adapter functions to convert between API types and feature types.

## Hooks

The feature provides React Query hooks for data fetching and mutations:

- `useFinance()`: Main hook that provides access to all financial data and operations

This hook returns:
- Transaction data and mutation functions
- Expense data and mutation functions
- Profit and loss data and calculation function
- Financial overview data

## Usage Examples

### Fetching Financial Data

```tsx
import { useFinance } from '@/features/finance';

function FinanceDashboard() {
  const { 
    transactions, 
    expenses, 
    profitLoss, 
    financeOverview,
    isLoadingTransactions,
    isLoadingExpenses
  } = useFinance();
  
  if (isLoadingTransactions || isLoadingExpenses) {
    return <div>Loading financial data...</div>;
  }
  
  return (
    <div>
      <h2>Financial Dashboard</h2>
      
      <section>
        <h3>Overview</h3>
        <p>Total Sales: {financeOverview.total_sales}</p>
        <p>Total Expenses: {financeOverview.total_expenses}</p>
        <p>Net Profit: {financeOverview.net_profit}</p>
      </section>
      
      <section>
        <h3>Recent Transactions</h3>
        <ul>
          {transactions.slice(0, 5).map(tx => (
            <li key={tx.id}>
              {tx.description}: {tx.amount} - {tx.payment_method}
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h3>Recent Expenses</h3>
        <ul>
          {expenses.slice(0, 5).map(expense => (
            <li key={expense.id}>
              {expense.description}: {expense.amount} - {expense.category}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

### Creating a New Expense

```tsx
import { useFinance } from '@/features/finance';

function ExpenseForm() {
  const { createExpense } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    createExpense.mutate({
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
      employee_id: 'current-employee-id',
      payment_status: 'completed'
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        <option value="utilities">Utilities</option>
        <option value="salaries">Salaries</option>
        <option value="maintenance">Maintenance</option>
        <option value="supplies">Supplies</option>
      </select>
      <button type="submit">Create Expense</button>
    </form>
  );
}
```

### Calculating Profit & Loss for a Period

```tsx
import { useFinance } from '@/features/finance';

function ProfitLossCalculator() {
  const { calculateProfitLoss, profitLoss } = useFinance();
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleCalculate = () => {
    calculateProfitLoss.mutate({
      period,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };
  
  return (
    <div>
      <div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
          <option value="custom">Custom</option>
        </select>
        
        {period === 'custom' && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </>
        )}
        
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      
      {calculateProfitLoss.isSuccess && (
        <div>
          <h3>Profit & Loss Result</h3>
          <p>Period: {calculateProfitLoss.data?.period}</p>
          <p>Total Sales: {calculateProfitLoss.data?.total_sales}</p>
          <p>Total Expenses: {calculateProfitLoss.data?.total_expenses}</p>
          <p>Profit: {calculateProfitLoss.data?.profit}</p>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

All service functions include proper error handling:

- API errors are caught and processed consistently
- Error messages are logged for debugging
- Failed operations return appropriate error responses
- React Query hooks propagate errors for UI handling

## Future Improvements

Planned enhancements for the feature:

1. Implement financial reports export functionality
2. Add data visualization components for financial trends
3. Enhance filtering options for transactions and expenses
4. Add budget planning and tracking capabilities
5. Implement approval workflows for large expenses 