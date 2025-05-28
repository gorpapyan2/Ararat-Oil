# Hooks Architecture Usage Guide

This guide provides practical examples of using the refactored hooks architecture in the Ararat OIL application.

## Table of Contents
- [Base Hooks](#base-hooks)
  - [useBaseDialog](#usebasedialog)
  - [useEntityDialog](#useentitydialog)
- [Form Hooks](#form-hooks)
  - [useZodForm](#usezodform)
  - [useFormSubmitHandler](#useformsubmithandler)
  - [useCommonValidation](#usecommonvalidation)
- [UI Hooks](#ui-hooks)
  - [useToast](#usetoast)
- [Feature-Specific Hooks](#feature-specific-hooks)
  - [useInventoryDialog](#useinventorydialog)
  - [useReportGenerator](#usereportgenerator)
  - [useFuelTankMonitor](#usefueltankmonitor)
- [Creating Feature-Specific Hooks](#creating-feature-specific-hooks)
- [Testing Hooks](#testing-hooks)
- [Best Practices](#best-practices)

## Base Hooks

### useBaseDialog

The `useBaseDialog` hook provides basic dialog state management.

```tsx
import { useBaseDialog } from '@/shared/hooks/base';

function MyComponent() {
  const dialog = useBaseDialog({
    onClose: () => console.log('Dialog closed'),
    onSuccess: (result) => console.log('Operation succeeded:', result),
    onError: (error) => console.error('Operation failed:', error)
  });
  
  return (
    <>
      <button onClick={dialog.open}>Open Dialog</button>
      
      {dialog.isOpen && (
        <MyDialog 
          isOpen={dialog.isOpen} 
          onOpenChange={dialog.onOpenChange}
          isSubmitting={dialog.isSubmitting}
        >
          {/* Dialog content */}
        </MyDialog>
      )}
    </>
  );
}
```

### useEntityDialog

The `useEntityDialog` hook extends `useBaseDialog` with entity-specific operations (create, edit, delete).

```tsx
import { useEntityDialog } from '@/shared/hooks/base';
import type { Employee } from '@/features/employees/types';

function EmployeeManager() {
  const dialog = useEntityDialog<Employee>({
    entityName: 'employee',
    onCreateSuccess: (employee) => console.log('Employee created:', employee),
    onUpdateSuccess: (employee) => console.log('Employee updated:', employee),
    onDeleteSuccess: (id) => console.log('Employee deleted:', id)
  });
  
  return (
    <>
      <button onClick={dialog.openCreate}>Create Employee</button>
      
      {employeeList.map(employee => (
        <div key={employee.id}>
          {employee.name}
          <button onClick={() => dialog.openEdit(employee)}>Edit</button>
        </div>
      ))}
      
      {dialog.isOpen && (
        <EmployeeDialog 
          isOpen={dialog.isOpen} 
          onOpenChange={dialog.onOpenChange}
          isSubmitting={dialog.isSubmitting}
          employee={dialog.entity}
          isCreateMode={dialog.isCreateMode}
          onSubmit={dialog.handleSubmit}
        />
      )}
    </>
  );
}
```

## Form Hooks

### useZodForm

The `useZodForm` hook integrates React Hook Form with Zod validation.

```tsx
import { useZodForm } from '@/shared/hooks/form';
import { z } from 'zod';

// Define a schema for type-safe form validation
const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().min(0, 'Salary cannot be negative')
});

// Infer the type from the schema
type EmployeeFormData = z.infer<typeof employeeSchema>;

function EmployeeForm() {
  const form = useZodForm({
    schema: employeeSchema,
    defaultValues: {
      name: '',
      email: '',
      position: '',
      salary: 0
    }
  });
  
  const onSubmit = (data: EmployeeFormData) => {
    console.log('Form submitted:', data);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...form.register('name')} />
        {form.formState.errors.name && (
          <span>{form.formState.errors.name.message}</span>
        )}
      </div>
      
      {/* Other form fields... */}
      
      <button type="submit" disabled={form.formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### useFormSubmitHandler

The `useFormSubmitHandler` hook simplifies form submission with loading state and toast notifications.

```tsx
import { useZodForm, useFormSubmitHandler } from '@/shared/hooks/form';
import { createEmployee } from '@/features/employees/services';

function EmployeeForm() {
  const form = useZodForm({
    schema: employeeSchema,
    defaultValues: {
      name: '',
      email: '',
      position: '',
      salary: 0
    }
  });
  
  const formHandler = useFormSubmitHandler(form, async (data) => {
    // Submit data to the server
    await createEmployee(data);
  }, {
    successMessage: 'Employee created successfully',
    errorMessage: 'Failed to create employee',
    resetOnSuccess: true
  });
  
  return (
    <form onSubmit={formHandler.handleSubmit}>
      {/* Form fields... */}
      
      <button type="submit" disabled={formHandler.isSubmitting}>
        {formHandler.isSubmitting ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
}
```

### useCommonValidation

The `useCommonValidation` hook provides reusable validation patterns.

```tsx
import { useCommonValidation } from '@/shared/hooks/form';
import { z } from 'zod';

function defineEmployeeSchema() {
  const { requiredString, email, phoneNumber, positiveNumber } = useCommonValidation();
  
  return z.object({
    name: requiredString('Name'),
    email: email(),
    phone: phoneNumber(),
    salary: positiveNumber('Salary')
  });
}
```

## UI Hooks

### useToast

The `useToast` hook provides a consistent way to display toast notifications.

```tsx
import { useToast } from '@/shared/hooks/ui';

function MyComponent() {
  const { toast, success, error, warning, info } = useToast();
  
  const handleAction = () => {
    // Show a success toast
    success({
      title: 'Success',
      description: 'Operation completed successfully'
    });
  };
  
  const handleError = () => {
    // Show an error toast
    error({
      title: 'Error',
      description: 'Something went wrong'
    });
  };
  
  return (
    <div>
      <button onClick={handleAction}>Perform Action</button>
      <button onClick={handleError}>Trigger Error</button>
    </div>
  );
}
```

## Feature-Specific Hooks

These hooks demonstrate how to build specialized functionality by extending our base hooks architecture.

### useInventoryDialog

The `useInventoryDialog` hook provides inventory-specific dialog management for creating, editing, and deleting inventory items.

```tsx
import { useInventoryDialog } from '@/features/inventory/hooks';
import { InventoryItemFormData } from '@/features/inventory/types';

function InventoryManager() {
  const inventoryDialog = useInventoryDialog({
    onCreateSuccess: (item) => console.log('Item created:', item),
    onUpdateSuccess: (item) => console.log('Item updated:', item),
    onDeleteSuccess: (id) => console.log('Item deleted:', id)
  });
  
  // Handle form submission
  const handleSubmit = async (data: InventoryItemFormData) => {
    await inventoryDialog.handleSubmit(data);
  };
  
  // Special restock function unique to inventory management
  const handleRestock = async (itemId: string, quantity: number) => {
    await inventoryDialog.handleRestock(quantity);
  };
  
  return (
    <div>
      <button onClick={inventoryDialog.openCreate}>Add New Item</button>
      
      {/* Inventory items list */}
      {inventoryItems.map(item => (
        <div key={item.id}>
          {item.name} - {item.quantity} in stock
          <button onClick={() => inventoryDialog.openEdit(item)}>Edit</button>
          <button onClick={() => inventoryDialog.openDeleteDialog(item)}>Delete</button>
          <button onClick={() => handleRestock(item.id, 10)}>Restock (+10)</button>
        </div>
      ))}
      
      {/* Dialog components would be rendered here */}
    </div>
  );
}
```

### useReportGenerator

The `useReportGenerator` hook demonstrates composing multiple hooks for a specialized report generation feature.

```tsx
import { useReportGenerator, ReportType, ReportFormat } from '@/features/reports/hooks';

function ReportPanel() {
  const reportGenerator = useReportGenerator({
    defaultParameters: {
      reportType: ReportType.SALES,
      format: ReportFormat.PDF,
      includeDetails: true
    },
    onReportGenerated: (report) => {
      console.log('Report generated:', report);
    }
  });
  
  return (
    <div>
      <h2>Generate Report</h2>
      
      <div>
        <label>Start Date</label>
        <input 
          type="date" 
          value={reportGenerator.parameters.startDate}
          onChange={(e) => reportGenerator.updateParameters({ startDate: e.target.value })}
        />
      </div>
      
      <div>
        <label>End Date</label>
        <input 
          type="date" 
          value={reportGenerator.parameters.endDate}
          onChange={(e) => reportGenerator.updateParameters({ endDate: e.target.value })}
        />
      </div>
      
      <div>
        <label>Report Type</label>
        <select
          value={reportGenerator.parameters.reportType}
          onChange={(e) => reportGenerator.updateParameters({ 
            reportType: e.target.value as ReportType 
          })}
        >
          {Object.values(ReportType).map(type => (
            <option key={type} value={type}>{formatReportType(type)}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Format</label>
        <select
          value={reportGenerator.parameters.format}
          onChange={(e) => reportGenerator.updateParameters({ 
            format: e.target.value as ReportFormat 
          })}
        >
          {Object.values(ReportFormat).map(format => (
            <option key={format} value={format}>{format.toUpperCase()}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={reportGenerator.parameters.includeDetails}
            onChange={(e) => reportGenerator.updateParameters({ 
              includeDetails: e.target.checked 
            })}
          />
          Include Details
        </label>
      </div>
      
      <button 
        onClick={reportGenerator.generateReport}
        disabled={reportGenerator.isGenerating}
      >
        {reportGenerator.isGenerating ? 'Generating...' : 'Generate Report'}
      </button>
      
      {reportGenerator.reportResult && (
        <div>
          <h3>Report Generated</h3>
          <p>Name: {reportGenerator.reportResult.name}</p>
          <p>Format: {reportGenerator.reportResult.format}</p>
          <p>Size: {(reportGenerator.reportResult.size / 1024).toFixed(2)} MB</p>
          <button onClick={reportGenerator.downloadReport}>
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}
```

### useFuelTankMonitor

The `useFuelTankMonitor` hook demonstrates real-time monitoring and specialized actions for fuel management.

```tsx
import { useFuelTankMonitor } from '@/features/fuel-management/hooks';

function TankMonitoringDashboard() {
  const tankMonitor = useFuelTankMonitor({
    tankId: 'tank123',
    pollingInterval: 10000, // 10 seconds
    thresholds: {
      lowLevel: 30, // 30% for low level warning
      criticalLevel: 15, // 15% for critical warning
      autoRefillLevel: 20, // Auto-refill at 20%
    },
    enableAutoRefill: true,
    onLowLevel: (tank) => {
      console.log(`Tank ${tank.name} is running low!`);
    },
    onCriticalLevel: (tank) => {
      console.log(`Tank ${tank.name} is at critical level!`);
    }
  });
  
  if (tankMonitor.isLoading && !tankMonitor.tank) {
    return <div>Loading tank data...</div>;
  }
  
  if (tankMonitor.error) {
    return (
      <div>
        <p>Error monitoring tank: {tankMonitor.error.message}</p>
        <button onClick={tankMonitor.refresh}>Retry</button>
      </div>
    );
  }
  
  if (!tankMonitor.tank) {
    return <div>No tank data available</div>;
  }
  
  const levelPercentage = tankMonitor.getLevelPercentage();
  
  return (
    <div>
      <h2>Tank Monitor: {tankMonitor.tank.name}</h2>
      
      <div className="tank-level-indicator">
        <div 
          className={`tank-level ${tankMonitor.isCritical ? 'critical' : tankMonitor.isLow ? 'low' : 'normal'}`}
          style={{ height: `${levelPercentage}%` }}
        />
        <p className="tank-percentage">{levelPercentage.toFixed(1)}%</p>
      </div>
      
      <div className="tank-details">
        <p>Current Level: {tankMonitor.tank.currentLevel} liters</p>
        <p>Capacity: {tankMonitor.tank.capacity} liters</p>
        <p>Fuel Type: {tankMonitor.tank.fuelType}</p>
        <p>Status: {tankMonitor.tank.status}</p>
        <p>Last Checked: {new Date(tankMonitor.tank.lastChecked).toLocaleString()}</p>
      </div>
      
      <div className="tank-actions">
        <button 
          onClick={tankMonitor.refresh}
          disabled={tankMonitor.isLoading}
        >
          Refresh
        </button>
        
        <button 
          onClick={() => tankMonitor.startRefill()}
          disabled={tankMonitor.isRefilling}
        >
          Start Refill
        </button>
        
        <div>
          <label>Update Level:</label>
          <input type="number" id="new-level" min="0" max={tankMonitor.tank.capacity} />
          <button 
            onClick={() => {
              const input = document.getElementById('new-level') as HTMLInputElement;
              tankMonitor.updateLevel(Number(input.value));
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Creating Feature-Specific Hooks

Extend the base hooks to create feature-specific hooks that encapsulate business logic.

```tsx
// src/features/employees/hooks/useEmployeeDialog.ts
import { useEntityDialog } from '@/shared/hooks/base';
import { useToast } from '@/shared/hooks/ui';
import type { Employee } from '../types';
import { createEmployee, updateEmployee, deleteEmployee } from '../services';

export function useEmployeeDialog(options) {
  const { toast, success, error } = useToast();
  const entityDialog = useEntityDialog<Employee>({
    entityName: 'employee',
    ...options
  });
  
  const handleSubmit = async (formData) => {
    try {
      entityDialog.setIsSubmitting(true);
      
      if (entityDialog.entity) {
        // Update existing employee
        const updatedEmployee = await updateEmployee({
          id: entityDialog.entity.id,
          ...formData
        });
        
        success({ 
          title: 'Employee Updated',
          description: `Successfully updated ${updatedEmployee.name}.`
        });
        
        entityDialog.handleUpdateSuccess(updatedEmployee);
      } else {
        // Create new employee
        const newEmployee = await createEmployee(formData);
        
        success({ 
          title: 'Employee Created',
          description: `Successfully created ${newEmployee.name}.`
        });
        
        entityDialog.handleCreateSuccess(newEmployee);
      }
    } catch (err) {
      error({
        title: 'Error',
        description: 'Failed to save employee data.'
      });
      
      entityDialog.handleError(err);
    } finally {
      entityDialog.setIsSubmitting(false);
    }
  };
  
  return {
    ...entityDialog,
    handleSubmit
  };
}
```

## Testing Hooks

Unit tests for hooks should test both the initial state and behavior.

```tsx
// src/shared/hooks/base/useBaseDialog.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useBaseDialog } from './useBaseDialog';

describe('useBaseDialog', () => {
  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useBaseDialog());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.entity).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
  });
  
  it('should open dialog', () => {
    const { result } = renderHook(() => useBaseDialog());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });
  
  // More tests...
});
```

## Best Practices

1. **Composition over inheritance**: Compose hooks together instead of creating deep inheritance hierarchies.

2. **Separation of concerns**: Each hook should do one thing well. Use composition to build more complex behavior.

3. **Consistent naming**: Follow the `use[Feature][Action]` convention for hook names.

4. **Type safety**: Always use TypeScript interfaces and generics to ensure type safety.

5. **Documentation**: Document each hook with JSDoc comments and examples.

6. **Testing**: Write unit tests for each hook to ensure they behave as expected.

7. **Default values**: Always provide sensible default values to make hooks easier to use.

8. **Error handling**: Include robust error handling in hooks that perform async operations.

9. **Immutability**: Treat state as immutable and use proper state updaters.

10. **Reusability**: Design hooks to be reusable across different features when possible.
