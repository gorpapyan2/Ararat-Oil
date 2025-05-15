# Type Mapping Patterns for Supabase and Domain Models

## Introduction

This guide documents the type mapping patterns we use to bridge the gap between our Supabase database schema and our application's domain models. These patterns help maintain type safety throughout the application while allowing our domain models to evolve independently from the database schema.

## Core Concepts

### 1. Database Types

We use generated types from Supabase that represent our actual database schema:

```typescript
// From src/types/supabase.ts
export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          contact: string;
          created_at: string | null;
          hire_date: string;
          id: string;
          name: string;
          position: string;
          salary: number;
          status: string;
        }
        // ...
      }
      // Other tables...
    }
  }
}

// Type for database employee shape
type DbEmployee = Database['public']['Tables']['employees']['Row'];
```

### 2. Domain Models

Domain models represent the business entities in our application and have a shape optimized for our frontend needs:

```typescript
// Example domain model from src/features/employees/types/employees.types.ts
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## Mapping Patterns

### 1. Database to Domain Mapping

We use mapping functions to transform database records to domain entities:

```typescript
/**
 * Maps a database employee record to a domain Employee model
 */
const mapDbToEmployee = (dbEmployee: DbEmployee): Employee => {
  // Parse name into first and last name (assuming format "First Last")
  const nameParts = dbEmployee.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Parse contact string (assuming format "email|phone")
  const contactParts = dbEmployee.contact.split('|');
  const email = contactParts[0] || '';
  const phone = contactParts[1] || '';

  // Map other fields with appropriate transformations
  return {
    id: dbEmployee.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    position: dbEmployee.position,
    department: extractDepartment(dbEmployee.status),
    hire_date: dbEmployee.hire_date,
    salary: dbEmployee.salary,
    status: normalizeStatus(dbEmployee.status),
    notes: '',
    created_at: dbEmployee.created_at || new Date().toISOString(),
    updated_at: dbEmployee.created_at || new Date().toISOString()
  };
};
```

### 2. Domain to Database Mapping

When saving data, we map from domain models back to database format:

```typescript
/**
 * Maps a domain Employee model to database format for insert/update
 */
const mapEmployeeToDb = (employee: EmployeeFormData): Omit<DbEmployee, 'id' | 'created_at'> => {
  // Combine first and last name
  const name = `${employee.first_name} ${employee.last_name}`;
  
  // Combine email and phone into contact string
  const contact = `${employee.email}|${employee.phone}`;
  
  // Store additional metadata in status if needed
  let status = employee.status;
  if (employee.department !== 'general') {
    status = `dept:${employee.department}`;
  }
  
  return {
    name,
    contact,
    position: employee.position,
    hire_date: employee.hire_date,
    salary: employee.salary,
    status
  };
};
```

### 3. Using Mappers in Service Functions

We integrate these mappers in our service layer:

```typescript
export const employeesService = {
  async getEmployees(filters?: EmployeeFilters) {
    let query = supabase.from('employees').select('*');
    
    // Apply filters...
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Transform DB records to our Employee type
    return (data || []).map(mapDbToEmployee);
  },
  
  async createEmployee(employee: EmployeeFormData) {
    const dbEmployee = mapEmployeeToDb(employee);
    
    const { data, error } = await supabase
      .from('employees')
      .insert(dbEmployee)
      .select()
      .single();

    if (error) throw error;
    
    return mapDbToEmployee(data);
  },
  
  // Other methods...
};
```

## Handling Complex Mapping Scenarios

### 1. One-to-Many Relationships

For complex data with one-to-many relationships, use nested queries and map the results:

```typescript
async function getDepartmentsWithEmployees() {
  const { data, error } = await supabase
    .from('departments')
    .select(`
      id, name, 
      employees:employees(*)
    `);
    
  if (error) throw error;
  
  return data.map(dept => ({
    id: dept.id,
    name: dept.name,
    employees: dept.employees.map(mapDbToEmployee)
  }));
}
```

### 2. Partial Updates

When performing partial updates, we need to handle undefined fields carefully:

```typescript
async function updateEmployee(id: string, updates: Partial<Employee>) {
  // First get the current employee
  const { data: currentEmployee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();
  
  // Convert to domain model
  const currentDomainEmployee = mapDbToEmployee(currentEmployee);
  
  // Apply updates to create the complete domain model
  const updatedDomainEmployee = {
    ...currentDomainEmployee,
    ...updates
  };
  
  // Map back to DB format
  const dbEmployee = mapEmployeeToDb(updatedDomainEmployee);
  
  // Perform update
  const { data, error } = await supabase
    .from('employees')
    .update(dbEmployee)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return mapDbToEmployee(data);
}
```

## Type Safety Best Practices

1. **Always define explicit interfaces** for both database and domain types
2. **Use TypeScript utility types** like `Partial<T>`, `Omit<T, K>`, and `Pick<T, K>` for derived types
3. **Implement proper error handling** with type guards
4. **Validate data at runtime** before mapping, especially for external inputs
5. **Document assumptions** in mapping functions with comments
6. **Use nullish coalescing and optional chaining** for handling potential null/undefined values
7. **Add unit tests** for mapping functions to verify correct transformations

## Example Test

Here's an example of how to test a mapping function:

```typescript
import { mapDbToEmployee } from './employee-mappers';

describe('Employee Mappers', () => {
  test('mapDbToEmployee correctly transforms database record', () => {
    // Arrange
    const dbEmployee = {
      id: '123',
      name: 'John Doe',
      contact: 'john@example.com|555-1234',
      position: 'Developer',
      status: 'dept:Engineering',
      hire_date: '2023-01-15',
      salary: 75000,
      created_at: '2023-01-01T12:00:00Z'
    };
    
    // Act
    const result = mapDbToEmployee(dbEmployee);
    
    // Assert
    expect(result).toEqual({
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '555-1234',
      position: 'Developer',
      department: 'Engineering',
      status: 'active',
      hire_date: '2023-01-15',
      salary: 75000,
      notes: '',
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-01-01T12:00:00Z'
    });
  });
  
  // Additional tests for edge cases...
});
```

## Conclusion

By following these type mapping patterns, we maintain a clean separation between our database schema and domain models while ensuring type safety throughout the application. This approach provides flexibility to evolve our domain models independently from the database schema and makes our codebase more maintainable. 