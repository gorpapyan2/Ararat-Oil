# 🚀 AraratOIL Supabase Integration Guide

## Overview

This document provides comprehensive information about the Supabase integration for the AraratOIL fuel management application. The integration includes database schema, edge functions, authentication, and React hooks for seamless data management.

## 📋 Table of Contents

1. [Project Configuration](#project-configuration)
2. [Database Schema](#database-schema)
3. [Edge Functions](#edge-functions)
4. [TypeScript Integration](#typescript-integration)
5. [React Hooks](#react-hooks)
6. [Service Layer](#service-layer)
7. [Testing](#testing)
8. [API Endpoints](#api-endpoints)
9. [CORS Configuration](#cors-configuration)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## 🔧 Project Configuration

### Supabase Project Details
- **Project ID**: `vfywgrsymuvojbbfodri`
- **Region**: `us-east-1`
- **URL**: `https://vfywgrsymuvojbbfodri.supabase.co`
- **API URL**: `https://vfywgrsymuvojbbfodri.supabase.co/rest/v1/`

### Environment Variables (.env.local)
```env
VITE_SUPABASE_URL=https://vfywgrsymuvojbbfodri.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=vfywgrsymuvojbbfodri
VITE_SUPABASE_REGION=us-east-1
VITE_APP_NAME=AraratOIL Management System
VITE_APP_VERSION=1.0.0
```

## 📊 Database Schema

### Core Tables

#### 1. Employees
- **Purpose**: Manage staff information
- **Columns**: 
  - `id` (UUID, Primary Key)
  - `name` (Text, Required)
  - `position` (Text, Required)
  - `contact` (Text, Required)
  - `salary` (Numeric, Required)
  - `hire_date` (Date, Required)
  - `status` (Text, Enum: active/on_leave/terminated)
  - `created_at` (Timestamp)

#### 2. Sales
- **Purpose**: Track fuel sales transactions
- **Columns**:
  - `id` (Integer, Primary Key)
  - `created_at` (Timestamp)
  - `date` (Date, Default: Current Date)
  - `filling_system_id` (Integer, FK to filling_systems)
  - `fuel_type` (Text, Required)
  - `liters` (Numeric, Required)
  - `price_per_unit` (Numeric, Required)
  - `total_sales` (Numeric, Calculated: liters * price_per_unit)

#### 3. Expenses
- **Purpose**: Track business expenses
- **Columns**:
  - `id` (UUID, Primary Key)
  - `date` (Date, Required)
  - `amount` (Numeric, Required)
  - `category` (Text, Required)
  - `description` (Text, Required)
  - `payment_status` (Text, Required)
  - `payment_method` (Text)
  - `invoice_number` (Text)
  - `notes` (Text)
  - `created_at` (Timestamp)

#### 4. Filling Systems
- **Purpose**: Manage fuel dispensing systems
- **Columns**:
  - `id` (Integer, Primary Key)
  - `name` (Text, Required)
  - `status` (Text, Default: 'active')
  - `tank_id` (Text)

#### 5. Inventory
- **Purpose**: Track fuel inventory levels
- **Columns**:
  - `id` (Integer, Primary Key)
  - `fuel_type` (Text, Required)
  - `quantity` (Numeric, Default: 0)
  - `last_updated` (Timestamp)

#### 6. Profiles
- **Purpose**: User profile management
- **Columns**:
  - `id` (UUID, Primary Key, FK to auth.users)
  - `updated_at` (Timestamp)
  - `username` (Text, Unique)
  - `full_name` (Text)
  - `avatar_url` (Text)
  - `email` (Text)
  - `role` (Text, Default: 'employee')

#### 7. Profit Loss Summary
- **Purpose**: Store financial summaries
- **Columns**:
  - `id` (UUID, Primary Key)
  - `period` (Text, Required)
  - `total_sales` (Numeric, Required)
  - `total_expenses` (Numeric, Required)
  - `profit` (Numeric, Required)
  - `created_at` (Timestamp)

## ⚡ Edge Functions

### Available Functions

#### 1. Authentication (`auth`)
- **Endpoint**: `/functions/v1/auth`
- **Methods**: POST
- **Purpose**: Handle user login/authentication
- **CORS**: Configured for localhost:3005

#### 2. Dashboard (`dashboard`)
- **Endpoint**: `/functions/v1/dashboard`
- **Methods**: GET
- **Purpose**: Provide dashboard summary data
- **Parameters**: 
  - `startDate` (optional)
  - `endDate` (optional)

#### 3. Transactions (`transactions`)
- **Endpoint**: `/functions/v1/transactions`
- **Methods**: GET, POST, PUT, DELETE
- **Purpose**: Manage sales transactions
- **Maps to**: `sales` table

#### 4. Expenses (`expenses`)
- **Endpoint**: `/functions/v1/expenses`
- **Methods**: GET, POST, PUT, DELETE
- **Purpose**: Manage business expenses
- **Maps to**: `expenses` table

#### 5. Finance Overview (`finance`)
- **Endpoint**: `/functions/v1/finance/overview`
- **Methods**: GET
- **Purpose**: Comprehensive financial analytics
- **Features**:
  - Revenue/expense breakdown
  - Profit calculations
  - Trend analysis
  - Category grouping

#### 6. Employees (`employees`)
- **Endpoint**: `/functions/v1/employees`
- **Methods**: GET, POST, PUT, DELETE
- **Purpose**: Employee management

#### 7. Filling Systems (`filling-systems`)
- **Endpoint**: `/functions/v1/filling-systems`
- **Methods**: GET, POST, PUT, DELETE
- **Purpose**: Manage fuel dispensing systems

## 🔧 TypeScript Integration

### Type Definitions (src/integrations/supabase/types.ts)

```typescript
export interface Database {
  public: {
    Tables: {
      employees: {
        Row: EmployeesRow
        Insert: EmployeesInsert
        Update: EmployeesUpdate
      }
      sales: {
        Row: SalesRow
        Insert: SalesInsert
        Update: SalesUpdate
      }
      // ... other tables
    }
  }
}
```

### Usage Example
```typescript
import { Database } from '@/integrations/supabase/types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)
```

## 🎣 React Hooks

### Available Hooks (src/hooks/useSupabase.ts)

#### 1. useEmployees()
```typescript
const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee } = useEmployees()
```

#### 2. useSales()
```typescript
const { sales, loading, error, createSale, updateSale, deleteSale } = useSales()
```

#### 3. useExpenses()
```typescript
const { expenses, loading, error, createExpense, updateExpense, deleteExpense } = useExpenses()
```

#### 4. useInventory()
```typescript
const { inventory, loading, error, updateInventory } = useInventory()
```

#### 5. useFillingSystem()
```typescript
const { fillingSystems, loading, error, createSystem, updateSystem, deleteSystem } = useFillingSystem()
```

### Hook Features
- ✅ Loading states
- ✅ Error handling
- ✅ Real-time updates
- ✅ Optimistic updates
- ✅ TypeScript support

## 🔧 Service Layer

### Service Classes (src/services/supabase-integration.ts)

#### EmployeesService
```typescript
const employeesService = new EmployeesService()
const employees = await employeesService.getAll()
```

#### SalesService
```typescript
const salesService = new SalesService()
const sales = await salesService.getAll()
const newSale = await salesService.create(saleData)
```

#### ExpensesService
```typescript
const expensesService = new ExpensesService()
const expenses = await expensesService.getAll()
```

### Service Features
- ✅ CRUD operations
- ✅ Error handling
- ✅ Performance optimization
- ✅ Type safety

## 🧪 Testing

### Test Command
```bash
npm run test-supabase
```

### Test Coverage
- ✅ Database connectivity
- ✅ Edge function availability
- ✅ Authentication system
- ✅ CORS configuration

### Test Results Interpretation
- **✅ Green**: Function working correctly
- **❌ Red**: Function has issues
- **⚠️ Yellow**: Partial functionality

## 🌐 API Endpoints

### Configuration (src/core/config/api.ts)
```typescript
export const API_CONFIG = {
  SUPABASE_URL: "https://vfywgrsymuvojbbfodri.supabase.co",
  FUNCTIONS_URL: "https://vfywgrsymuvojbbfodri.supabase.co/functions/v1",
  PROJECT_ID: "vfywgrsymuvojbbfodri"
}
```

### Direct Table Access
- **Employees**: `/rest/v1/employees`
- **Sales**: `/rest/v1/sales`
- **Expenses**: `/rest/v1/expenses`
- **Inventory**: `/rest/v1/inventory`

### Edge Function Access
- **Dashboard**: `/functions/v1/dashboard`
- **Transactions**: `/functions/v1/transactions`
- **Finance**: `/functions/v1/finance/overview`

## 🔒 CORS Configuration

### Current Settings
- **Origin**: `http://localhost:3005`
- **Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Headers**: `Content-Type, Authorization`
- **Credentials**: `true`

### Production Setup
For production, update CORS origins in edge functions:
```typescript
'Access-Control-Allow-Origin': 'https://yourdomain.com'
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
- **Check**: Environment variables are set correctly
- **Verify**: Project ID and URL match
- **Test**: Run `npm run test-supabase`

#### 2. CORS Errors
- **Issue**: Mixed origins or credentials
- **Solution**: Update edge functions with correct origins
- **Local**: Use `http://localhost:3005`

#### 3. Edge Function 503 Errors
- **Cause**: Function timeout or startup issues
- **Solution**: Simplify function code or check logs
- **Debug**: Use `mcp_supabase_get_logs`

#### 4. Authentication Issues
- **Check**: Auth settings in Supabase dashboard
- **Verify**: JWT configuration
- **Test**: Login flow works correctly

### Debug Commands
```bash
# Test integration
npm run test-supabase

# Check environment
echo $VITE_SUPABASE_URL

# View logs (requires MCP tools)
# Use the Supabase MCP tools to check edge function logs
```

## 📚 Best Practices

### 1. Environment Management
- Use `.env.local` for local development
- Never commit sensitive keys to git
- Use different projects for dev/staging/prod

### 2. Error Handling
```typescript
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (error) {
  console.error('Database error:', error)
  // Handle appropriately
}
```

### 3. Performance Optimization
- Use select() to limit columns
- Implement pagination for large datasets
- Use indexes for frequently queried columns
- Enable RLS (Row Level Security) where needed

### 4. Security
- Enable RLS on sensitive tables
- Use service role key only on server-side
- Validate input data before database operations
- Use parameterized queries

### 5. Real-time Features
```typescript
// Subscribe to changes
const subscription = supabase
  .channel('sales-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'sales' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## 🚀 Next Steps

1. **Add Authentication**: Implement user login/logout
2. **Real-time Updates**: Add real-time subscriptions
3. **File Storage**: Integrate Supabase Storage for documents
4. **Advanced Analytics**: Create more detailed financial reports
5. **Mobile Support**: Extend for mobile applications
6. **Backup Strategy**: Implement data backup procedures

## 📞 Support

For issues with this integration:
1. Check this README for common solutions
2. Run the test suite: `npm run test-supabase`
3. Check Supabase dashboard logs
4. Verify environment configuration

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Project**: AraratOIL Management System 