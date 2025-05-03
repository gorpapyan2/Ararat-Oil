# Dialog Migration Guide

This guide provides step-by-step instructions for migrating existing dialog components to the new standardized dialog system.

## Table of Contents

1. [Introduction](#introduction)
2. [Migration Benefits](#migration-benefits)
3. [Migration Levels](#migration-levels)
4. [Step-by-Step Migration Process](#step-by-step-migration-process)
5. [Example: EmployeeDialog Migration](#example-employeedialog-migration)
6. [Examples from Codebase](#examples-from-codebase)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Use Cases](#advanced-use-cases)
9. [Multi-Step Dialogs](#multi-step-dialogs)
10. [Nested Dialogs](#nested-dialogs)

## Introduction

Our application is transitioning from custom dialog implementations to a standardized dialog system. This migration improves accessibility, reduces code duplication, and provides a consistent user experience across the application.

## Migration Benefits

Migrating to standardized dialogs offers several advantages:

- **Improved Accessibility**: Focus management, keyboard navigation, and ARIA attributes
- **Simplified Implementation**: Reduced code needed for dialog implementation by ~40%
- **Enhanced UX**: Consistent dialog behavior and styling across the application
- **Better Maintainability**: Centralized dialog logic for easier updates
- **Developer Experience**: Intuitive API and comprehensive hooks for state management

## Migration Levels

The migration process can be implemented at different levels:

1. **Basic Standardization**: Replace the dialog component with StandardDialog
   - Minimal changes to the existing component
   - Quick implementation
   - Limited code reduction

2. **Enhanced Standardization**: Use StandardDialog with react-hook-form
   - Improved form validation
   - Better UX through improved error handling
   - Moderate code reduction

3. **Advanced Standardization**: Implement a custom dialog hook
   - Full state management abstraction
   - Simplified parent components
   - Maximal code reduction and reusability
   - Best developer experience

4. **Controller Pattern**: Create a controller component with integrated hooks
   - Complete dialog management with UI controls
   - Table integration capabilities
   - Fully abstracted dialog state and UI
   - Most comprehensive solution for entity management

## Step-by-Step Migration Process

### 1. Basic Standardization

1. Import the StandardDialog component:
   ```tsx
   import { StandardDialog } from "@/components/ui/dialog";
   ```

2. Replace your existing Dialog components:

   Before:
   ```tsx
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="sm:max-w-[425px]">
       <DialogHeader>
         <DialogTitle>Edit Item</DialogTitle>
         <DialogDescription>Make changes to your item.</DialogDescription>
       </DialogHeader>
       <form onSubmit={handleSubmit}>
         {/* Form fields */}
         <DialogFooter>
           <Button type="submit">Save changes</Button>
         </DialogFooter>
       </form>
     </DialogContent>
   </Dialog>
   ```

   After:
   ```tsx
   <StandardDialog
     open={open}
     onOpenChange={onOpenChange}
     title="Edit Item"
     description="Make changes to your item."
     maxWidth="sm:max-w-[425px]"
     actions={
       <Button type="submit" form="edit-form">Save changes</Button>
     }
   >
     <form id="edit-form" onSubmit={handleSubmit}>
       {/* Form fields */}
     </form>
   </StandardDialog>
   ```

### 2. Enhanced Standardization

1. Add Zod schema for validation:
   ```tsx
   import { z } from "zod";
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";

   const formSchema = z.object({
     name: z.string().min(2, "Name must be at least 2 characters"),
     price: z.number().min(0, "Price cannot be negative"),
   });
   ```

2. Use react-hook-form with StandardDialog:
   ```tsx
   function EditItemDialog({ open, onOpenChange, item, onSubmit }) {
     const form = useForm({
       resolver: zodResolver(formSchema),
       defaultValues: item || { name: "", price: 0 },
     });
     
     const handleSubmit = form.handleSubmit((data) => {
       onSubmit(data);
       onOpenChange(false);
     });
     
     const formActions = (
       <>
         <Button variant="outline" onClick={() => onOpenChange(false)}>
           Cancel
         </Button>
         <Button type="submit" form="edit-form">
           Save changes
         </Button>
       </>
     );
     
     return (
       <StandardDialog
         open={open}
         onOpenChange={onOpenChange}
         title="Edit Item"
         description="Make changes to your item."
         actions={formActions}
       >
         <form id="edit-form" onSubmit={handleSubmit}>
           {/* Form fields with Form components */}
         </form>
       </StandardDialog>
     );
   }
   ```

### 3. Advanced Standardization

1. Create a custom hook:

   ```tsx
   // useItemDialog.ts
   import { useState, useCallback } from "react";
   import { z } from "zod";
   import { Item } from "@/types";
   
   export function useItemDialog({
     onCreateSuccess,
     onUpdateSuccess,
   }: {
     onCreateSuccess?: (item: Item) => void;
     onUpdateSuccess?: (item: Item) => void;
   }) {
     const [isOpen, setIsOpen] = useState(false);
     const [selectedItem, setSelectedItem] = useState<Item | null>(null);
     const [isSubmitting, setIsSubmitting] = useState(false);
     
     const openCreate = useCallback(() => {
       setSelectedItem(null);
       setIsOpen(true);
     }, []);
     
     const openEdit = useCallback((item: Item) => {
       setSelectedItem(item);
       setIsOpen(true);
     }, []);
     
     const onOpenChange = useCallback((open: boolean) => {
       setIsOpen(open);
       if (!open) {
         setSelectedItem(null);
       }
     }, []);
     
     const handleSubmit = useCallback(
       async (data: z.infer<typeof formSchema>) => {
         setIsSubmitting(true);
         try {
           if (selectedItem?.id) {
             // Update logic
             onUpdateSuccess?.(updatedItem);
           } else {
             // Create logic
             onCreateSuccess?.(newItem);
           }
           setIsOpen(false);
         } catch (error) {
           // Error handling
         } finally {
           setIsSubmitting(false);
         }
       },
       [selectedItem, onCreateSuccess, onUpdateSuccess]
     );
     
     return {
       isOpen,
       selectedItem,
       isSubmitting,
       openCreate,
       openEdit,
       onOpenChange,
       handleSubmit,
     };
   }
   ```

2. Implement a dialog component using the hook:

   ```tsx
   // ItemDialogHooked.tsx
   import { useItemDialog } from "@/hooks/useItemDialog";
   import { StandardDialog } from "@/components/ui/dialog";
   
   export function ItemDialogHooked({
     onCreateSuccess,
     onUpdateSuccess,
   }) {
     const {
       isOpen,
       selectedItem,
       isSubmitting,
       onOpenChange,
       handleSubmit,
     } = useItemDialog({ onCreateSuccess, onUpdateSuccess });
     
     const formActions = (
       <>
         <Button
           variant="outline"
           onClick={() => onOpenChange(false)}
           disabled={isSubmitting}
         >
           Cancel
         </Button>
         <Button
           type="submit"
           form="item-form"
           disabled={isSubmitting}
         >
           {isSubmitting ? "Saving..." : "Save changes"}
         </Button>
       </>
     );
     
     return (
       <StandardDialog
         open={isOpen}
         onOpenChange={onOpenChange}
         title={selectedItem ? "Edit Item" : "Create Item"}
         description="Enter item details below."
         actions={formActions}
       >
         <form id="item-form" onSubmit={form.handleSubmit(handleSubmit)}>
           {/* Form fields */}
         </form>
       </StandardDialog>
     );
   }
   ```

3. Simplify the parent component:

   ```tsx
   function ItemManager() {
     return (
       <div>
         <Button onClick={itemDialog.openCreate}>Create Item</Button>
         <ItemList onEditItem={itemDialog.openEdit} />
         <ItemDialogHooked
           onCreateSuccess={handleItemCreated}
           onUpdateSuccess={handleItemUpdated}
         />
       </div>
     );
   }
   ```

## Example: EmployeeDialog Migration

We've created a comprehensive example of migrating the `EmployeeDialog` component through all three standardization levels. This example is available in the codebase as `EmployeeDialogMigrationExample.tsx`.

### Level 1: Basic Standardization (`EmployeeDialogStandardized.tsx`)

The first level replaces the original dialog structure with the `StandardDialog` component:

```tsx
// Original structure
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>
        {employee ? "Edit Employee" : "Add New Employee"}
      </DialogTitle>
    </DialogHeader>
    <Form {...form}>
      {/* Form content */}
    </Form>
  </DialogContent>
</Dialog>

// Standardized structure
<StandardDialog
  open={open}
  onOpenChange={onOpenChange}
  title={employee ? "Edit Employee" : "Add New Employee"}
  description="Update employee information"
  maxWidth="sm:max-w-[425px]"
  actions={formActions}
>
  <form onSubmit={handleSubmit}>
    {/* Form content */}
  </form>
</StandardDialog>
```

Key improvements:
- Simplified component structure
- Added standard description
- Unified action buttons location
- Standardized styling and layout

### Level 2: Enhanced Standardization with Form Validation

The second level adds robust form validation using Zod schema validation:

```tsx
const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  status: z.enum(["active", "inactive", "on_leave"]),
  contact: z.string().email("Invalid email address").or(z.string().length(0)),
  hire_date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date"
  }),
});

// Form initialization
const form = useForm<z.infer<typeof employeeSchema>>({
  resolver: zodResolver(employeeSchema),
  defaultValues: employee || {
    name: "",
    position: "",
    salary: 0,
    status: "active",
    contact: "",
    hire_date: new Date().toISOString().split("T")[0],
  },
});
```

Key improvements:
- Type-safe form handling
- Client-side validation with clear error messages
- Form state management

### Level 3: Advanced Standardization with Custom Hook (`useEmployeeDialog.ts`)

The third level abstracts the dialog state and form handling into a reusable hook:

```tsx
// In useEmployeeDialog.ts
export function useEmployeeDialog({
  onCreateSuccess,
  onUpdateSuccess,
}: {
  onCreateSuccess?: (employee: Employee) => void;
  onUpdateSuccess?: (employee: Employee) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const openCreate = useCallback(() => {
    setSelectedEmployee(null);
    setIsOpen(true);
  }, []);
  
  const openEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsOpen(true);
  }, []);
  
  // Additional state management and submission handling...
  
  return {
    isOpen,
    selectedEmployee,
    isSubmitting,
    openCreate,
    openEdit,
    onOpenChange,
    handleSubmit,
  };
}

// In EmployeeDialogHooked.tsx
export function EmployeeDialogHooked({
  onCreateSuccess,
  onUpdateSuccess,
}) {
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess,
    onUpdateSuccess,
  });
  
  // Dialog and form implementation...
}

// In parent component
function EmployeeManager() {
  return (
    <div>
      <Button onClick={employeeDialog.openCreate}>
        Create Employee
      </Button>
      <EmployeeDialogHooked 
        onCreateSuccess={handleEmployeeCreated}
        onUpdateSuccess={handleEmployeeUpdated}
      />
    </div>
  );
}
```

Key improvements:
- Complete separation of concerns
- Reusable dialog state management
- Simplified parent components
- Consistent dialog behavior

## Examples from Codebase

### Example 1: Expenses Dialog

The `ExpensesDialogStandardized` component demonstrates a successful migration:

```tsx
// From ExpensesDialogStandardized.tsx
<StandardDialog
  open={open}
  onOpenChange={onOpenChange}
  title={expense ? "Edit Expense" : "Add New Expense"}
  description="Enter expense details below"
  actions={
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button type="submit" form="expense-form" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </>
  }
>
  <form id="expense-form" onSubmit={handleSubmit}>
    {/* Form fields */}
  </form>
</StandardDialog>
```

### Example 2: Category Manager

The `CategoryManagerStandardized` demonstrates a hook-based implementation:

```tsx
// From CategoryManagerStandardized.tsx
const {
  isOpen,
  selectedCategory,
  onOpenChange,
  openCreate,
  openEdit,
  handleSubmit,
} = useCategoryDialog({ 
  onCreateSuccess: refetchCategories,
  onUpdateSuccess: refetchCategories, 
});

// Dialog usage
<StandardDialog
  open={isOpen}
  onOpenChange={onOpenChange}
  title={selectedCategory ? "Edit Category" : "Create Category"}
  description="Enter category details below"
  actions={formActions}
>
  <form id="category-form" onSubmit={form.handleSubmit(handleSubmit)}>
    {/* Form fields */}
  </form>
</StandardDialog>
```

### Example 3: EmployeeDialog

See the comprehensive example at `src/examples/EmployeeDialogMigrationExample.tsx` which demonstrates all three migration levels.

### Example 4: ConfirmationDialog

The `ConfirmationDialogStandardized` component and `ConfirmationController` demonstrate a flexible approach to confirmation dialogs:

```tsx
// Using the ConfirmationDialogStandardized directly
<ConfirmationDialogStandardized
  open={isConfirmOpen}
  onOpenChange={setIsConfirmOpen}
  defaultOptions={{
    title: "Delete Item",
    message: "Are you sure you want to delete this item? This action cannot be undone.",
    variant: "destructive",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    onConfirm: handleDeleteItem,
    onCancel: () => console.log("Cancelled deletion")
  }}
/>

// Using the ConfirmationController with render props pattern
<ConfirmationController>
  {(openConfirmation) => (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => openConfirmation({
        title: "Delete Item",
        message: "Are you sure you want to delete this item? This action cannot be undone.",
        variant: "destructive",
        confirmLabel: "Delete",
        onConfirm: handleDeleteItem
      })}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  )}
</ConfirmationController>
```

### Example 5: LoginDialog

The `LoginDialogStandardized` component and `LoginController` demonstrate authentication with social login support:

```tsx
// Using the LoginDialogStandardized directly
<LoginDialogStandardized
  open={isLoginOpen}
  onOpenChange={setIsLoginOpen}
  onLoginSuccess={handleLoginSuccess}
  onSignUpClick={handleSignUpClick}
  onForgotPasswordClick={handleForgotPasswordClick}
  onSocialLogin={handleSocialLogin}
  redirectUrl="/dashboard"
  availableProviders={["google", "github"]}
/>

// Using the LoginController
<LoginController
  onLoginSuccess={handleLoginSuccess}
  onSignUpClick={handleSignUpClick}
  onForgotPasswordClick={handleForgotPasswordClick}
  onSocialLogin={handleSocialLogin}
  redirectUrl="/dashboard"
  buttonText="Sign In"
  variant="outline"
  size="sm"
/>

// Using the LoginController with custom trigger
<LoginController
  onLoginSuccess={handleLoginSuccess}
  redirectUrl="/dashboard"
>
  <CustomButton>Sign In</CustomButton>
</LoginController>
```

## Troubleshooting

### Common Issues

1. **Form Submission Problems**
   - Ensure the form has a unique ID
   - Connect the submit button to the form using the `form` attribute
   - Verify that the form submit handler is correctly defined

2. **Dialog Not Closing After Submission**
   - Check that `onOpenChange(false)` is called after successful submission
   - In hooks, verify the state update logic in the submit handler

3. **Dialog Size Issues**
   - Use the `maxWidth` prop to control the dialog size
   - Standard sizes include: `sm:max-w-[425px]`, `sm:max-w-[525px]`, `sm:max-w-[640px]`

### How to Get Help

If you encounter issues during migration, please:

1. Check this guide for common solutions
2. Review the examples in the `src/examples` directory
3. Consult the Standard Dialog API Reference document 

## Advanced Use Cases

### Controller Pattern for Entity Management

For comprehensive entity management, we can implement a controller pattern that combines the hook with UI controls:

```tsx
// SalesController.tsx
import { useSalesDialog } from "@/hooks/useSalesDialog";
import { Button } from "@/components/ui/button";
import { SalesDialogsHooked } from "./SalesDialogsHooked";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Sale } from "@/types";

interface SalesControllerProps {
  sales?: Sale[];
  showCreateButton?: boolean;
  onCreateSuccess?: (sale: Sale) => void;
  onUpdateSuccess?: (sale: Sale) => void;
  onDeleteSuccess?: (id: string) => void;
  className?: string;
}

export function SalesController({
  sales = [],
  showCreateButton = true,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
  className,
}: SalesControllerProps) {
  const {
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
  } = useSalesDialog({
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  });
  
  return (
    <>
      {/* Create Button */}
      {showCreateButton && (
        <Button 
          onClick={openCreateDialog}
          className={className}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entity
        </Button>
      )}
      
      {/* Action Buttons for each entity */}
      {sales.map(sale => (
        <div key={sale.id} className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => openEditDialog(sale)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => openDeleteDialog(sale)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      ))}
      
      {/* The dialogs */}
      <SalesDialogsHooked
        onCreateSuccess={onCreateSuccess}
        onUpdateSuccess={onUpdateSuccess}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}
```

Using the controller in a parent component:

```tsx
function EntityManager() {
  const handleEntityCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["entities"] });
  };
  
  const handleEntityUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["entities"] });
  };
  
  const handleEntityDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["entities"] });
  };
  
  return (
    <div>
      <h1>Entity Management</h1>
      
      {/* Create button */}
      <SalesController 
        showCreateButton={true}
        onCreateSuccess={handleEntityCreated}
        onUpdateSuccess={handleEntityUpdated}
        onDeleteSuccess={handleEntityDeleted}
      />
      
      {/* Data table with row actions */}
      <EntityDataTable
        columns={columns}
        data={entities}
        renderRowActions={(entity) => (
          <SalesController
            sales={[entity]}
            showCreateButton={false}
            onUpdateSuccess={handleEntityUpdated}
            onDeleteSuccess={handleEntityDeleted}
          />
        )}
      />
    </div>
  );
}
```

#### Benefits of the Controller Pattern

1. **Reduced Boilerplate**: Parent components don't need to manage dialog state
2. **Consistent UI**: Standard buttons and interactions for entity management
3. **Table Integration**: Easily add row actions to tables
4. **Separation of Concerns**: Dialog logic is fully encapsulated
5. **Reusability**: Controllers can be used across multiple views

#### When to Use the Controller Pattern

Use the controller pattern when:

1. You have entity CRUD operations with standard actions
2. You need to integrate with tables or lists
3. You want to minimize state management in parent components
4. You have multiple places that need the same dialog functionality
5. You want to standardize the UI for entity management across the application

For a complete example of the controller pattern, see `src/components/sales/SalesController.tsx`.

#### Controller Pattern for Confirmation Flows

For entities that require a confirmation step, we can implement a controller pattern that combines a form dialog and a confirmation dialog:

```tsx
// TankController.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTankDialog } from "@/hooks/useTankDialog";
import { TankFormDialogStandardized } from "./TankFormDialogStandardized";

interface TankControllerProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function TankController({
  onSuccess,
  className,
  buttonText = "Add New Tank",
  variant = "default",
  size = "default",
  showIcon = true,
}: TankControllerProps) {
  const { 
    openDialog,
    // Other properties from the hook
  } = useTankDialog({
    onSuccess
  });

  return (
    <>
      <Button
        onClick={openDialog}
        className={className}
        variant={variant}
        size={size}
      >
        {showIcon && <Plus className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <TankFormDialogStandardized onSuccess={onSuccess} />
    </>
  );
}
```

In this pattern, we:
1. Create a controller that manages both a form dialog and a confirmation dialog
2. Use a specialized hook (`useTankDialog`) that handles the multi-step flow
3. Keep all logic contained within the hook to maintain clean components
4. Allow for customizing the trigger button with various props

This approach is particularly useful for:
1. Critical operations that require confirmation
2. Multi-step forms that have a final review step
3. Operations with complex validation logic that spans across steps

Using the controller in a parent component:

```tsx
function TanksPage() {
  const refetchTanks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
  }, [queryClient]);
  
  return (
    <div>
      <h1>Fuel Tanks</h1>
      
      <TankController 
        onSuccess={refetchTanks}
        buttonText="Add New Fuel Tank"
        variant="default"
        size="default"
      />
      
      {/* Rest of the page */}
    </div>
  );
}
```

#### Benefits of the Controller Pattern

1. **Reduced Boilerplate**: Parent components don't need to manage dialog state
2. **Consistent UI**: Standard buttons and interactions for entity management
3. **Table Integration**: Easily add row actions to tables
4. **Separation of Concerns**: Dialog logic is fully encapsulated
5. **Reusability**: Controllers can be used across multiple views
6. **Simplified Confirmation Flows**: Multi-step processes with confirmations are integrated

#### Controller Pattern Selection Guide

1. **Simple Entity CRUD**: Use `EntityController` with create, update, delete actions
2. **Critical Operations**: Use confirmation flow controllers like `TankController`
3. **Complex Workflows**: Use multi-step controllers with `useMultiStepDialog`
4. **Table Integration**: Use controllers with the `renderRowActions` pattern

See the full examples:
- `src/components/sales/SalesController.tsx`
- `src/components/tanks/TankController.tsx`
- `src/components/employees/EmployeeController.tsx`

### Multi-Step Dialogs

For complex workflows that need to be broken down into multiple steps, you can implement a multi-step dialog using our standardized components.

#### Basic Implementation

For simple multi-step dialogs, you can manage the steps manually:

```tsx
function BasicMultiStepDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  // Get step title and description
  const getStepInfo = (step) => {
    switch (step) {
      case 1: return { title: "Step 1", description: "First step description" };
      case 2: return { title: "Step 2", description: "Second step description" };
      case 3: return { title: "Step 3", description: "Final step description" };
      default: return { title: "", description: "" };
    }
  };
  
  // Render step content based on current step
  const renderStepContent = (step) => {
    switch (step) {
      case 1: return <StepOneContent onSubmit={handleStepOneSubmit} />;
      case 2: return <StepTwoContent onSubmit={handleStepTwoSubmit} />;
      case 3: return <StepThreeContent onSubmit={handleStepThreeSubmit} />;
      default: return null;
    }
  };
  
  // Actions for each step (back/next buttons)
  const getStepActions = (step) => {
    switch (step) {
      case 1:
        return (
          <Button type="submit" form="step1-form">Next</Button>
        );
      case 2:
        return (
          <>
            <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
            <Button type="submit" form="step2-form">Next</Button>
          </>
        );
      case 3:
        return (
          <>
            <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
            <Button type="submit" form="step3-form">Submit</Button>
          </>
        );
      default:
        return null;
    }
  };
  
  // Handle dialog close
  const handleOpenChange = (open) => {
    if (!open) {
      // Reset when dialog closes
      setCurrentStep(1);
      setFormData({});
    }
    setIsOpen(open);
  };
  
  return (
    <StandardDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={getStepInfo(currentStep).title}
      description={getStepInfo(currentStep).description}
      actions={getStepActions(currentStep)}
    >
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between">
          <div>Step {currentStep} of 3</div>
          <div>{currentStep * 33}%</div>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full" 
            style={{ width: `${currentStep * 33}%` }}
          />
        </div>
      </div>
      
      {/* Step content */}
      {renderStepContent(currentStep)}
    </StandardDialog>
  );
}
```

#### Advanced Implementation with Custom Hook

For more complex multi-step dialogs, create a custom hook to manage state:

```tsx
// useMultiStepDialog.ts
function useMultiStepDialog(totalSteps = 3) {
  const dialog = useDialog();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  const updateFormData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);
  
  const reset = useCallback(() => {
    setCurrentStep(1);
    setFormData({});
    setIsSubmitting(false);
  }, []);
  
  const handleOpenChange = useCallback((open) => {
    if (!open) {
      // Reset when dialog closes
      reset();
    }
    dialog.onOpenChange(open);
  }, [dialog, reset]);
  
  return {
    isOpen: dialog.isOpen,
    currentStep,
    formData,
    isSubmitting,
    totalSteps,
    progress: Math.round((currentStep / totalSteps) * 100),
    open: dialog.open,
    close: dialog.close,
    onOpenChange: handleOpenChange,
    nextStep,
    prevStep,
    updateFormData,
    setIsSubmitting,
    reset,
    triggerRef: dialog.triggerRef,
  };
}
```

Using the hook in a component:

```tsx
function MultiStepDialogWithHook() {
  const dialog = useMultiStepDialog(3);
  
  // The rest of your implementation...
  
  return (
    <>
      <Button onClick={dialog.open}>Open Dialog</Button>
      
      <StandardDialog
        open={dialog.isOpen}
        onOpenChange={dialog.onOpenChange}
        title={getStepTitle(dialog.currentStep)}
        description={getStepDescription(dialog.currentStep)}
        actions={getStepActions(dialog.currentStep)}
      >
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex justify-between">
            <div>Step {dialog.currentStep} of {dialog.totalSteps}</div>
            <div>{dialog.progress}%</div>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full" 
              style={{ width: `${dialog.progress}%` }}
            />
          </div>
        </div>
        
        {/* Step content */}
        {renderStepContent(dialog.currentStep)}
      </StandardDialog>
    </>
  );
}
```

#### Best Practices for Multi-Step Dialogs

1. **Form Data Persistence**: Preserve form data between steps
2. **Validation per Step**: Validate each step before allowing the user to proceed
3. **Progress Indicator**: Show clear visual indication of progress 
4. **Back Navigation**: Allow users to go back to previous steps without losing data
5. **Reset on Close**: Reset the entire form when the dialog is closed without completion
6. **Loading States**: Show loading indicators during final submission
7. **Error Handling**: Provide clear error messages at each step

#### Example

See `src/examples/MultiStepDialogExample.tsx` for a complete implementation of both basic and hook-based multi-step dialogs.

### Nested Dialogs

For dialogs that need to open other dialogs, ensure proper focus management:

```tsx
function NestedDialogExample() {
  const parentDialog = useDialog();
  const childDialog = useDialog();
  
  return (
    <>
      <Button onClick={parentDialog.open} ref={parentDialog.triggerRef}>
        Open Parent Dialog
      </Button>
      
      <StandardDialog
        open={parentDialog.isOpen}
        onOpenChange={parentDialog.onOpenChange}
        title="Parent Dialog"
        description="This dialog can open a child dialog"
      >
        <Button 
          onClick={childDialog.open} 
          ref={childDialog.triggerRef}
        >
          Open Child Dialog
        </Button>
        
        <StandardDialog
          open={childDialog.isOpen}
          onOpenChange={childDialog.onOpenChange}
          title="Child Dialog"
          description="This is a nested dialog"
        >
          Child dialog content
        </StandardDialog>
      </StandardDialog>
    </>
  );
}
```

Key considerations for nested dialogs:
1. Use the `triggerRef` to maintain proper focus management
2. Ensure child dialogs are rendered within the parent dialog
3. Close child dialogs when parent dialogs close 