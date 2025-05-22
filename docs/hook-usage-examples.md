# API Hooks Usage Examples

This document provides examples of how to use the new standardized API hooks system in different scenarios.

## Basic Usage Examples

### Using Resource Hooks

```tsx
import { useEmployeesList, useEmployeeById, useCreateEmployee } from '@/features/employees/hooks/useEmployees-refactored';

function EmployeesList() {
  // Fetch all employees
  const { data, isLoading, error } = useEmployeesList();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {data?.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  );
}

function EmployeeDetails({ id }: { id: string }) {
  // Fetch a single employee by ID
  const { data, isLoading } = useEmployeeById(id);
  
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <NotFound />;
  
  return <EmployeeProfile employee={data} />;
}

function CreateEmployeeForm() {
  // Use create mutation
  const { mutate, isLoading, error, isSuccess } = useCreateEmployee();
  
  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: (newEmployee) => {
        toast.success('Employee created successfully');
        navigate(`/employees/${newEmployee.id}`);
      }
    });
  };
  
  return (
    <Form onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  );
}
```

### Using Filters

```tsx
import { useEmployeesList } from '@/features/employees/hooks/useEmployees-refactored';

function FilteredEmployeesList() {
  const [department, setDepartment] = useState('IT');
  
  // Fetch filtered employees
  const { data, isLoading } = useEmployeesList({
    filters: { department },
    enabled: !!department
  });
  
  return (
    <div>
      <Select 
        value={department} 
        onChange={e => setDepartment(e.target.value)}
        options={['IT', 'HR', 'Finance', 'Operations']}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <EmployeeList employees={data || []} />
      )}
    </div>
  );
}
```

## Advanced Usage Examples

### Combining Hooks

```tsx
import { useEmployeeById, useUpdateEmployee } from '@/features/employees/hooks/useEmployees-refactored';

function EditEmployeeForm({ id }: { id: string }) {
  // Fetch employee data
  const { data, isLoading: isFetching } = useEmployeeById(id);
  
  // Update mutation
  const { 
    mutate, 
    isLoading: isUpdating, 
    error 
  } = useUpdateEmployee();
  
  const handleSubmit = (formData) => {
    mutate({ 
      id, 
      data: formData 
    });
  };
  
  if (isFetching) return <LoadingSpinner />;
  
  return (
    <Form 
      initialValues={data}
      onSubmit={handleSubmit} 
      isLoading={isUpdating} 
      error={error}
    />
  );
}
```

### Custom Query Keys and Cache Invalidation

```tsx
import { useEmployeesList, useCreateEmployee } from '@/features/employees/hooks/useEmployees-refactored';
import { queryClient } from '@/lib/react-query';

function EmployeeManager() {
  // Department-specific query
  const { data: itEmployees } = useEmployeesList({
    filters: { department: 'IT' },
    queryKey: ['employees', 'department', 'IT']
  });
  
  const { data: hrEmployees } = useEmployeesList({
    filters: { department: 'HR' },
    queryKey: ['employees', 'department', 'HR']
  });
  
  // Create mutation with selective invalidation
  const { mutate } = useCreateEmployee({
    onSuccess: (newEmployee) => {
      // Only invalidate the department-specific query that matches the new employee
      queryClient.invalidateQueries(['employees', 'department', newEmployee.department]);
    }
  });
  
  return (
    // UI implementation
  );
}
```

### Using with React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEmployee } from '@/features/employees/hooks/useEmployees-refactored';
import { employeeSchema } from '@/features/employees/schemas';

function EmployeeForm() {
  const { mutate, isLoading } = useCreateEmployee();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(employeeSchema)
  });
  
  const onSubmit = handleSubmit(data => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Employee created successfully");
      }
    });
  });
  
  return (
    <form onSubmit={onSubmit}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
}
```

### Infinite Scrolling

```tsx
import { useApiInfiniteQuery } from '@/hooks/api';
import { employeesService } from '@/features/employees/services';

function InfiniteEmployeesList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useApiInfiniteQuery({
    queryKey: 'employees-infinite',
    queryFn: (pageParam = 1) => employeesService.getPaginatedEmployees({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    }
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {data?.pages.flatMap(page => page.data).map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()} 
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
```

## Migration from Old Hooks

### Before (Old API)

```tsx
import { useFuelSales } from '@/features/fuel-sales/hooks/useFuelSales';

function FuelSalesList() {
  const { 
    fuelSales, 
    isLoading, 
    error,
    createFuelSale,
    updateFuelSale,
    deleteFuelSale 
  } = useFuelSales();
  
  // Implementation using the old API
}
```

### After (New API)

```tsx
// Option 1: Use the backward-compatible hook
import { useFuelSales } from '@/features/fuel-sales/hooks/useFuelSales-refactored';

function FuelSalesList() {
  const { 
    fuelSales,  // now returns data instead of fuelSales
    isLoading, 
    error,
    createFuelSale,
    updateFuelSale,
    deleteFuelSale 
  } = useFuelSales();
  
  // Implementation remains mostly the same
}

// Option 2: Use the granular hooks
import { 
  useFuelSalesList, 
  useCreateFuelSale,
  useUpdateFuelSale,
  useDeleteFuelSale
} from '@/features/fuel-sales/hooks/useFuelSales-refactored';

function ModernFuelSalesList() {
  // More explicit and granular hook usage
  const { data, isLoading, error } = useFuelSalesList();
  const { mutate: createSale } = useCreateFuelSale();
  const { mutate: updateSale } = useUpdateFuelSale();
  const { mutate: deleteSale } = useDeleteFuelSale();
  
  // Implementation with the granular hooks
}
``` 