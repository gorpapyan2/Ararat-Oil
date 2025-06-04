# 🚀 AraratOIL Supabase Quick Start Guide

## 5-Minute Setup

### 1. Environment Setup
Copy your `.env.local` file (already configured):
```env
VITE_SUPABASE_URL=https://vfywgrsymuvojbbfodri.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Test the Integration
```bash
npm run test-supabase
```

### 3. Use in Your Components

#### Basic Hook Usage
```typescript
import { useEmployees, useSales, useExpenses } from '@/hooks/useSupabase'

function EmployeeList() {
  const { employees, loading, error, createEmployee } = useEmployees()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>{emp.name} - {emp.position}</div>
      ))}
      <button onClick={() => createEmployee({
        name: "John Doe",
        position: "Manager",
        contact: "john@example.com",
        salary: 50000,
        hire_date: new Date().toISOString().split('T')[0],
        status: "active"
      })}>
        Add Employee
      </button>
    </div>
  )
}
```

#### Direct Service Usage
```typescript
import { EmployeesService, SalesService } from '@/services/supabase-integration'

// In your component or utility function
const employeesService = new EmployeesService()
const salesService = new SalesService()

// Get all employees
const employees = await employeesService.getAll()

// Create a new sale
const newSale = await salesService.create({
  filling_system_id: 1,
  fuel_type: "Gasoline",
  liters: 50,
  price_per_unit: 1.25,
  total_sales: 62.5
})
```

## Available Endpoints

### 🔗 Ready to Use
- ✅ **Database**: All tables accessible
- ✅ **Authentication**: Auth functions working
- ✅ **Employees**: Full CRUD operations
- ✅ **Dashboard**: Basic data endpoint

### ⚠️ Needs Setup
- **Filling Systems**: Function needs debugging
- **Finance**: Advanced analytics pending
- **Real-time**: Subscriptions not yet configured

## Common Patterns

### Error Handling
```typescript
const { data, error } = await supabase
  .from('employees')
  .select('*')

if (error) {
  console.error('Supabase error:', error)
  // Handle error appropriately
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  setLoading(true)
  try {
    const data = await employeesService.getAll()
    // Use data
  } finally {
    setLoading(false)
  }
}
```

### Optimistic Updates
```typescript
const createEmployee = async (newEmployee) => {
  // Add to local state immediately
  setEmployees(prev => [...prev, { ...newEmployee, id: 'temp-id' }])
  
  try {
    const created = await employeesService.create(newEmployee)
    // Replace temp with real data
    setEmployees(prev => prev.map(emp => 
      emp.id === 'temp-id' ? created : emp
    ))
  } catch (error) {
    // Revert on error
    setEmployees(prev => prev.filter(emp => emp.id !== 'temp-id'))
  }
}
```

## Next Steps

1. **Start with Employees**: Most stable functionality
2. **Add Sales Tracking**: Ready for implementation
3. **Financial Analytics**: Use direct queries for now
4. **Real-time Features**: Add subscriptions as needed

## Troubleshooting

### Quick Fixes
```bash
# If tests fail
npm run test-supabase

# Check environment
echo $VITE_SUPABASE_URL

# Restart dev server
npm run dev
```

### Common Issues
- **CORS errors**: Already configured for localhost:3005
- **404 errors**: Check if edge function is deployed
- **Auth errors**: Verify anon key is correct

---

**Need Help?** Check the full [Supabase Integration README](./SUPABASE_INTEGRATION_README.md) 