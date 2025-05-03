# Standard Dialog API Reference

This document provides a comprehensive reference for our standardized dialog components and hooks.

## Component APIs

### StandardDialog

A general-purpose dialog component that serves as the foundation for all dialog patterns.

```tsx
import { StandardDialog } from "@/components/ui/dialog";

<StandardDialog
  open={boolean}                     // Required: Controls the visibility of the dialog
  onOpenChange={(open) => void}      // Required: Handler for changing open state
  title={string}                     // Required: Dialog title (displayed in header)
  description={string}               // Optional: Additional context (displayed below title)
  children={ReactNode}               // Optional: Dialog content
  actions={ReactNode}                // Optional: Footer buttons (typically Save/Cancel buttons)
  maxWidth={string}                  // Optional: CSS width class for the dialog (default: "sm:max-w-md")
  className={string}                 // Optional: Additional CSS classes
  showCloseButton={boolean}          // Optional: Whether to show an X close button (default: true)
  preventOutsideClose={boolean}      // Optional: Prevent closing when clicking overlay (default: false)
/>
```

Example usage:
```tsx
<StandardDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Profile"
  description="Update your profile information."
  actions={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="profile-form">
        Save
      </Button>
    </>
  }
>
  <form id="profile-form" onSubmit={handleSubmit}>
    {/* Form content */}
  </form>
</StandardDialog>
```

### ConfirmDialog

A specialized dialog for confirming user actions.

```tsx
import { ConfirmDialog } from "@/components/ui/dialog";

<ConfirmDialog
  open={boolean}                     // Required: Controls the visibility of the dialog
  onOpenChange={(open) => void}      // Required: Handler for changing open state
  title={string}                     // Required: Dialog title
  description={string}               // Required: Description of the action being confirmed
  onConfirm={() => void | Promise}   // Required: Handler for confirm action
  onCancel={() => void}              // Optional: Handler for cancel action
  confirmText={string}               // Optional: Custom text for confirm button (default: "Confirm")
  cancelText={string}                // Optional: Custom text for cancel button (default: "Cancel")
  isLoading={boolean}                // Optional: Loading state for confirm button
  isDestructive={boolean}            // Optional: Whether action is destructive (shows warning styling)
  maxWidth={string}                  // Optional: CSS width class for the dialog
/>
```

Example usage:
```tsx
<ConfirmDialog
  open={isConfirmOpen}
  onOpenChange={setIsConfirmOpen}
  title="Publish Changes"
  description="Are you sure you want to publish these changes? This will make them visible to all users."
  onConfirm={handlePublish}
  isLoading={isPublishing}
/>
```

### DeleteConfirmDialog

A specialized dialog for confirming deletion actions.

```tsx
import { DeleteConfirmDialog } from "@/components/ui/dialog";

<DeleteConfirmDialog
  open={boolean}                     // Required: Controls the visibility of the dialog
  onOpenChange={(open) => void}      // Required: Handler for changing open state
  title={string}                     // Optional: Dialog title (default: "Confirm Deletion")
  description={string}               // Required: Description of what's being deleted
  onConfirm={() => void | Promise}   // Required: Handler for delete action
  onCancel={() => void}              // Optional: Handler for cancel action
  deleteText={string}                // Optional: Custom text for delete button (default: "Delete")
  cancelText={string}                // Optional: Custom text for cancel button (default: "Cancel")
  isLoading={boolean}                // Optional: Loading state for delete button
  showWarningIcon={boolean}          // Optional: Whether to show warning icon (default: true)
/>
```

Example usage:
```tsx
<DeleteConfirmDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  description="Are you sure you want to delete this item? This action cannot be undone."
  onConfirm={handleDelete}
  isLoading={isDeleting}
/>
```

### AlertMessageDialog

A dialog for displaying alerts, messages, or information to users.

```tsx
import { AlertMessageDialog } from "@/components/ui/dialog";

<AlertMessageDialog
  open={boolean}                     // Required: Controls the visibility of the dialog
  onOpenChange={(open) => void}      // Required: Handler for changing open state
  title={string}                     // Required: Dialog title
  description={string | ReactNode}   // Required: Message content
  buttonText={string}                // Optional: Custom text for close button (default: "OK")
  severity={"info" | "warning" | "error"} // Optional: Severity level (default: "info")
  onClose={() => void}               // Optional: Handler when dialog is closed
/>
```

Example usage:
```tsx
<AlertMessageDialog
  open={isAlertOpen}
  onOpenChange={setIsAlertOpen}
  title="Operation Completed"
  description="Your changes have been saved successfully."
  buttonText="Got it"
  severity="info"
/>
```

## Hook APIs

### useDialog

Basic hook for dialog state management.

```tsx
import { useDialog } from "@/hooks/useDialog";

const dialog = useDialog({
  defaultOpen?: boolean,             // Optional: Initial open state (default: false)
  onOpenChange?: (open: boolean) => void, // Optional: Side effect when open state changes
});

// Return value:
// {
//   isOpen: boolean,                  // Current open state
//   onOpenChange: (open: boolean) => void, // Handler for changing open state
//   open: () => void,                 // Function to open the dialog
//   close: () => void,                // Function to close the dialog
//   toggle: () => void,               // Function to toggle the dialog
//   triggerRef: RefObject<HTMLElement>, // Ref to attach to trigger element (for focus management)
// }
```

Example usage:
```tsx
const dialog = useDialog();

return (
  <>
    <Button onClick={dialog.open} ref={dialog.triggerRef}>
      Open Dialog
    </Button>
    
    <StandardDialog
      open={dialog.isOpen}
      onOpenChange={dialog.onOpenChange}
      title="Settings"
      // ...other props
    >
      Dialog content
    </StandardDialog>
  </>
);
```

### useConfirmDialog

Hook for confirmation dialog state with loading state handling.

```tsx
import { useConfirmDialog } from "@/hooks/useDialog";

const confirmDialog = useConfirmDialog({
  onConfirm: () => void | Promise<void>, // Required: Handler for confirm action
  onCancel?: () => void,                 // Optional: Handler for cancel action
  defaultOpen?: boolean,                 // Optional: Initial open state (default: false)
});

// Return value:
// {
//   isOpen: boolean,                  // Current open state
//   isLoading: boolean,               // Current loading state
//   onOpenChange: (open: boolean) => void, // Handler for changing open state
//   open: () => void,                 // Function to open the dialog
//   close: () => void,                // Function to close the dialog
//   onConfirm: () => Promise<void>,   // Function to trigger confirm action
//   onCancel: () => void,             // Function to trigger cancel action
//   triggerRef: RefObject<HTMLElement>, // Ref to attach to trigger element
// }
```

Example usage:
```tsx
const confirmDialog = useConfirmDialog({
  onConfirm: async () => {
    await saveChanges();
    // Loading state is handled by the hook
  }
});

return (
  <>
    <Button 
      onClick={confirmDialog.open} 
      ref={confirmDialog.triggerRef}
    >
      Save Changes
    </Button>
    
    <ConfirmDialog
      open={confirmDialog.isOpen}
      onOpenChange={confirmDialog.onOpenChange}
      title="Save Changes"
      description="Are you sure you want to save these changes?"
      onConfirm={confirmDialog.onConfirm}
      onCancel={confirmDialog.onCancel}
      isLoading={confirmDialog.isLoading}
    />
  </>
);
```

### useAlertDialog

Hook for alert dialog state with dynamic content.

```tsx
import { useAlertDialog } from "@/hooks/useDialog";

const alertDialog = useAlertDialog();

// Return value:
// {
//   isOpen: boolean,                  // Current open state
//   title: string,                    // Current dialog title
//   description: string | ReactNode,  // Current dialog description
//   severity: "info" | "warning" | "error", // Current severity
//   buttonText: string,               // Current button text
//   onOpenChange: (open: boolean) => void, // Handler for changing open state
//   open: (config: AlertDialogConfig) => void, // Function to open with config
//   close: () => void,                // Function to close the dialog
// }

// AlertDialogConfig:
// {
//   title: string,
//   description: string | ReactNode,
//   severity?: "info" | "warning" | "error",
//   buttonText?: string,
// }
```

Example usage:
```tsx
const alertDialog = useAlertDialog();

// Function to show error
const showError = (message: string) => {
  alertDialog.open({
    title: "Error",
    description: message,
    severity: "error"
  });
};

return (
  <>
    <Button onClick={() => showError("Something went wrong!")}>
      Test Error
    </Button>
    
    <AlertMessageDialog
      open={alertDialog.isOpen}
      onOpenChange={alertDialog.onOpenChange}
      title={alertDialog.title}
      description={alertDialog.description}
      severity={alertDialog.severity}
      buttonText={alertDialog.buttonText}
    />
  </>
);
```

### useConfirmationDialog

Hook for flexible confirmation dialogs with multiple variants and dynamic content.

```tsx
import { useConfirmationDialog } from "@/hooks/useDialog";

export type ConfirmationVariant = "default" | "destructive" | "warning" | "info";

export interface ConfirmationOptions {
  title?: string;
  message: string;
  variant?: ConfirmationVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

const confirmationDialog = useConfirmationDialog({
  defaultOptions?: Partial<ConfirmationOptions>, // Optional: Default configuration for the dialog
});

// Return value:
// {
//   isOpen: boolean,                  // Current open state
//   setIsOpen: (open: boolean) => void, // Handler for changing open state
//   isLoading: boolean,               // Current loading state
//   options: ConfirmationOptions,     // Current options configuration
//   openDialog: (customOptions?: Partial<ConfirmationOptions>) => void, // Open with options
//   closeDialog: () => void,          // Function to close the dialog
//   handleConfirm: () => Promise<void>, // Function to trigger confirm action
//   handleCancel: () => void,         // Function to trigger cancel action
// }
```

Example usage:
```tsx
const confirmationDialog = useConfirmationDialog();

// Button that triggers the confirmation
<Button 
  onClick={() => confirmationDialog.openDialog({
    title: "Delete Item",
    message: "Are you sure you want to delete this item?",
    variant: "destructive",
    confirmLabel: "Delete",
    onConfirm: handleDelete
  })}
>
  Delete
</Button>

// The confirmation dialog component
<ConfirmationDialogStandardized
  open={confirmationDialog.isOpen}
  onOpenChange={confirmationDialog.setIsOpen}
  defaultOptions={confirmationDialog.options}
/>
```

### useLoginDialog

Hook for login dialog management with support for email/password and social logins.

```tsx
import { useLoginDialog } from "@/hooks/useDialog";

export type AuthProvider = "google" | "github" | "microsoft" | "apple";

const loginDialog = useLoginDialog({
  onLoginSuccess?: (user: any) => void,    // Optional: Callback after successful login
  onSignUpClick?: () => void,              // Optional: Callback for sign up button
  onForgotPasswordClick?: () => void,      // Optional: Callback for forgot password
  onSocialLogin?: (provider: AuthProvider) => Promise<void>, // Optional: Social login handler
  initialValues?: Partial<LoginFormData>,  // Optional: Initial form values
  redirectUrl?: string,                    // Optional: Redirect URL after successful login
  availableProviders?: AuthProvider[],     // Optional: Available social login providers
});

// Return value:
// {
//   isOpen: boolean,                    // Current open state
//   setIsOpen: (open: boolean) => void, // Handler for changing open state
//   isSubmitting: boolean,              // Whether form is submitting
//   socialLoading: AuthProvider | null, // Currently loading social provider
//   authError: string | null,           // Authentication error if any
//   openDialog: () => void,             // Function to open the dialog
//   closeDialog: () => void,            // Function to close the dialog
//   handleSubmit: (data: LoginFormData) => Promise<boolean>, // Submit handler
//   handleSocialLogin: (provider: AuthProvider) => Promise<void>, // Social login handler
//   handleSignUpClick: () => void,      // Sign up button handler
//   handleForgotPasswordClick: () => void, // Forgot password handler
//   getDefaultValues: () => object,     // Get default form values
//   availableProviders: AuthProvider[], // Available social login providers
// }
```

Example usage:
```tsx
const loginDialog = useLoginDialog({
  onLoginSuccess: (user) => {
    console.log("User logged in:", user);
    // Update auth context or redirect
  },
  onSignUpClick: () => {
    // Navigate to sign up page or open sign up dialog
    router.push("/signup");
  },
  onSocialLogin: async (provider) => {
    try {
      // Handle social login
      await auth.signInWithProvider(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    }
  },
  redirectUrl: "/dashboard",
  availableProviders: ["google", "github"],
});

// Button that triggers the login dialog
<Button onClick={loginDialog.openDialog}>
  Sign In
</Button>

// The login dialog component
<LoginDialogStandardized
  open={loginDialog.isOpen}
  onOpenChange={loginDialog.setIsOpen}
  onLoginSuccess={loginDialog.onLoginSuccess}
  onSignUpClick={loginDialog.onSignUpClick}
  onForgotPasswordClick={loginDialog.onForgotPasswordClick}
  onSocialLogin={loginDialog.onSocialLogin}
  availableProviders={loginDialog.availableProviders}
  redirectUrl={loginDialog.redirectUrl}
/>
```

## Custom Dialog Hooks

Your application can define custom dialog hooks for specific entity types.

### Example: useEmployeeDialog

```tsx
import { useState, useCallback } from "react";
import { Employee } from "@/types";

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
  
  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedEmployee(null);
    }
  }, []);
  
  const handleSubmit = useCallback(
    async (data: z.infer<typeof employeeSchema>) => {
      setIsSubmitting(true);
      try {
        if (selectedEmployee?.id) {
          // Update employee
          const updatedEmployee = await updateEmployee({
            ...data,
            id: selectedEmployee.id,
          });
          onUpdateSuccess?.(updatedEmployee);
        } else {
          // Create employee
          const newEmployee = await createEmployee(data);
          onCreateSuccess?.(newEmployee);
        }
        setIsOpen(false);
      } catch (error) {
        // Handle error (show toast, etc.)
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedEmployee, onCreateSuccess, onUpdateSuccess]
  );
  
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
```

Usage in component:
```tsx
export function EmployeeManager() {
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: () => {
      toast({
        title: "Employee created",
        description: "The employee has been added successfully.",
      });
    },
    onUpdateSuccess: () => {
      toast({
        title: "Employee updated",
        description: "The employee has been updated successfully.",
      });
    },
  });
  
  return (
    <div>
      <Button onClick={employeeDialog.openCreate}>
        Add Employee
      </Button>
      
      <EmployeeDialogHooked 
        onCreateSuccess={employeeDialog.onCreateSuccess}
        onUpdateSuccess={employeeDialog.onUpdateSuccess}
      />
    </div>
  );
}
```

### Example: useSalesDialog

For managing sales dialogs, we provide the `useSalesDialog` hook:

```tsx
import { useSalesDialog } from "@/hooks/useSalesDialog";

const salesDialog = useSalesDialog({
  onCreateSuccess?: (sale: Sale) => void,      // Optional: Callback when a sale is created
  onUpdateSuccess?: (sale: Sale) => void,      // Optional: Callback when a sale is updated
  onDeleteSuccess?: (id: string) => void,      // Optional: Callback when a sale is deleted
});

// Return value:
// {
//   isEditDialogOpen: boolean,              // Whether the edit dialog is open
//   isDeleteDialogOpen: boolean,            // Whether the delete dialog is open
//   selectedSale: Sale | null,              // The currently selected sale
//   isSubmitting: boolean,                  // Whether a form submission is in progress
//   handleEditDialogOpenChange: (open: boolean) => void, // Handler for edit dialog open state
//   setIsEditDialogOpen: (open: boolean) => void, // Direct setter for edit dialog state
//   setIsDeleteDialogOpen: (open: boolean) => void, // Direct setter for delete dialog state
//   openCreateDialog: () => void,           // Function to open the dialog for creating a sale
//   openEditDialog: (sale: Sale) => void,   // Function to open the dialog for editing a sale
//   openDeleteDialog: (sale: Sale) => void, // Function to open the dialog for deleting a sale
//   handleSubmit: (data: any) => Promise<void>, // Function to handle form submission
//   handleDelete: () => Promise<void>,      // Function to handle sale deletion
// }
```

Example usage:
```tsx
export function SalesPage() {
  const salesDialog = useSalesDialog({
    onCreateSuccess: () => {
      toast({
        title: "Sale created",
        description: "The sale has been added successfully.",
      });
      refetchSales();
    },
    onUpdateSuccess: () => {
      toast({
        title: "Sale updated",
        description: "The sale has been updated successfully.",
      });
      refetchSales();
    },
    onDeleteSuccess: () => {
      toast({
        title: "Sale deleted",
        description: "The sale has been deleted successfully.",
      });
      refetchSales();
    },
  });
  
  return (
    <div>
      <Button onClick={salesDialog.openCreateDialog}>
        Add Sale
      </Button>
      
      <SalesDialogsHooked 
        onCreateSuccess={salesDialog.onCreateSuccess}
        onUpdateSuccess={salesDialog.onUpdateSuccess}
        onDeleteSuccess={salesDialog.onDeleteSuccess}
      />
    </div>
  );
}
```

### Example: useTankDialog

For managing fuel tank creation dialogs, we provide the `useTankDialog` hook:

```tsx
import { useTankDialog, tankFormSchema } from "@/hooks/useTankDialog";

const tankDialog = useTankDialog({
  onSuccess?: () => void,      // Optional: Callback when a tank is successfully created
});

// Return value:
// {
//   isFormOpen: boolean,                    // Whether the form dialog is open
//   setIsFormOpen: (open: boolean) => void, // Setter for form dialog state
//   isConfirmOpen: boolean,                 // Whether the confirmation dialog is open
//   setIsConfirmOpen: (open: boolean) => void, // Setter for confirmation dialog state
//   isSubmitting: boolean,                  // Whether a submission is in progress
//   pendingTankData: TankFormData | null,   // The pending data awaiting confirmation
//   openDialog: () => void,                 // Function to open the form dialog
//   closeDialog: () => void,                // Function to close the form dialog
//   handleFormSubmit: (data: TankFormData) => ValidationResult | null, // Function to process form data
//   handleConfirm: () => Promise<void>,     // Function to handle confirmation
//   handleCancel: () => void,               // Function to handle cancellation
//   fuelTypeOptions: Array<{value: string, label: string}>, // Options for fuel type select field
// }
```

Example usage with a form:
```tsx
export function TankFormDialog() {
  const {
    isFormOpen,
    setIsFormOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    isSubmitting,
    pendingTankData,
    handleFormSubmit,
    handleConfirm,
    handleCancel,
    fuelTypeOptions,
  } = useTankDialog({
    onSuccess: () => {
      toast({
        title: "Tank created",
        description: "The fuel tank has been created successfully.",
      });
      refetchTanks();
    },
  });
  
  const form = useZodForm({
    schema: tankFormSchema,
    defaultValues: {
      name: "",
      fuel_type: undefined,
      capacity: 0,
      current_level: 0,
    },
  });
  
  const onSubmit = (data: TankFormData) => {
    const validationResult = handleFormSubmit(data);
    if (validationResult) {
      form.setError(validationResult.error as any, {
        message: validationResult.message,
      });
    }
  };
  
  return (
    <>
      <StandardDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="Add New Fuel Tank"
        description="Enter the details of the new fuel tank"
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form fields here */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Tank"}
          </Button>
        </form>
      </StandardDialog>
      
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm New Tank"
        description="Confirm the details for the new fuel tank"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </>
  );
}
```

### Example: useProfileDialog

For managing user profile dialogs, we provide the `useProfileDialog` hook:

```tsx
import { useProfileDialog, profileSchema } from "@/hooks/useProfileDialog";

const profileDialog = useProfileDialog({
  onSuccess?: (data: ProfileFormData) => void,    // Optional: Callback when profile is updated
  onAvatarChange?: (url: string) => void,         // Optional: Callback when avatar is changed
  currentUser?: any,                              // Optional: Current user data
  currentProfile?: any,                           // Optional: Current profile data
});

// Return value:
// {
//   isOpen: boolean,                             // Whether the dialog is open
//   setIsOpen: (open: boolean) => void,          // Setter for dialog state
//   isSubmitting: boolean,                       // Whether a form submission is in progress
//   avatarUrl: string,                           // Current avatar URL
//   openDialog: () => void,                      // Function to open the dialog
//   closeDialog: () => void,                     // Function to close the dialog
//   handleSubmit: (data: ProfileFormData) => Promise<boolean>, // Function to handle form submission
//   handleChangeAvatar: () => void,              // Function to handle avatar change
//   handleRemoveAvatar: () => void,              // Function to handle avatar removal
//   getDefaultValues: () => object,              // Function to get form default values
//   getInitials: (name: string) => string,       // Function to get initials for avatar fallback
// }
```

Example usage with a profile form:
```tsx
export function ProfileEditor() {
  const { user, profile } = useAuth();
  const {
    isOpen,
    setIsOpen,
    isSubmitting,
    avatarUrl,
    handleSubmit,
    handleChangeAvatar,
    handleRemoveAvatar,
    getDefaultValues,
    getInitials,
  } = useProfileDialog({
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onAvatarChange: (url) => {
      console.log("Avatar changed to:", url);
    },
    currentUser: user,
    currentProfile: profile,
  });

  const form = useZodForm({
    schema: profileSchema,
    defaultValues: getDefaultValues(),
  });
  
  return (
    <StandardDialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Avatar section */}
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{getInitials(form.getValues().fullName)}</AvatarFallback>
        </Avatar>
        
        <Button onClick={handleChangeAvatar}>Change Avatar</Button>
        <Button onClick={handleRemoveAvatar}>Remove Avatar</Button>
        
        {/* Form fields */}
        {/* Form submission button */}
      </form>
    </StandardDialog>
  );
}
```

### Example: useMultiStepDialog

For creating multi-step dialogs and wizard-like interfaces, we provide the `useMultiStepDialog` hook:

```tsx
import { useMultiStepDialog } from "@/hooks/useDialog";

const multiStepDialog = useMultiStepDialog({
  totalSteps: number,               // Optional: Total number of steps (default: 3)
  defaultOpen?: boolean,            // Optional: Initial open state (default: false)
  defaultStep?: number,             // Optional: Initial step (default: 1)
  defaultData?: any,                // Optional: Initial form data (default: {})
  onComplete?: (data: any) => void, // Optional: Callback when all steps are complete
});

// Return value:
// {
//   isOpen: boolean,                  // Current open state
//   currentStep: number,              // Current step number
//   formData: any,                    // Combined form data across all steps
//   isSubmitting: boolean,            // Whether final submission is in progress
//   totalSteps: number,               // Total number of steps
//   progress: number,                 // Percentage progress (0-100)
//   open: () => void,                 // Function to open the dialog
//   close: () => void,                // Function to close the dialog
//   onOpenChange: (open: boolean) => void, // Handler for changing open state
//   nextStep: () => void,             // Move to the next step
//   prevStep: () => void,             // Move to the previous step
//   updateFormData: (data: any) => void, // Update form data
//   setIsSubmitting: (submitting: boolean) => void, // Update submitting state
//   reset: () => void,                // Reset dialog state
//   triggerRef: RefObject<HTMLElement>, // Ref to attach to trigger element
// }
```

Example usage:
```tsx
function RegistrationWizard() {
  const dialog = useMultiStepDialog({
    totalSteps: 3,
    onComplete: (data) => {
      // Submit the complete registration data
      registerUser(data);
    }
  });

  // Render different content based on current step
  const renderStepContent = () => {
    switch (dialog.currentStep) {
      case 1:
        return <PersonalInfoStep 
                 data={dialog.formData} 
                 onSubmit={(data) => {
                   dialog.updateFormData(data);
                   dialog.nextStep();
                 }} 
               />;
      case 2:
        return <AccountDetailsStep 
                 data={dialog.formData} 
                 onSubmit={(data) => {
                   dialog.updateFormData(data);
                   dialog.nextStep();
                 }} 
               />;
      case 3:
        return <ReviewAndSubmitStep 
                 data={dialog.formData} 
                 onSubmit={(data) => {
                   dialog.setIsSubmitting(true);
                   // Final submit
                   dialog.updateFormData(data);
                   dialog.close();
                 }} 
               />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button onClick={dialog.open}>
        Register
      </Button>

      <StandardDialog
        open={dialog.isOpen}
        onOpenChange={dialog.onOpenChange}
        title={`Step ${dialog.currentStep}: ${getStepTitle(dialog.currentStep)}`}
        description={getStepDescription(dialog.currentStep)}
        actions={
          <>
            {dialog.currentStep > 1 && (
              <Button variant="outline" onClick={dialog.prevStep}>
                Back
              </Button>
            )}
            {dialog.currentStep < dialog.totalSteps ? (
              <Button form={`step-${dialog.currentStep}-form`} type="submit">
                Next
              </Button>
            ) : (
              <Button 
                form={`step-${dialog.currentStep}-form`} 
                type="submit"
                disabled={dialog.isSubmitting}
              >
                {dialog.isSubmitting ? "Submitting..." : "Complete"}
              </Button>
            )}
          </>
        }
      >
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex justify-between">
            <div>Step {dialog.currentStep} of {dialog.totalSteps}</div>
            <div>{dialog.progress}%</div>
          </div>
          <div className="h-2 w-full bg-muted rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${dialog.progress}%` }}
            />
          </div>
        </div>

        {renderStepContent()}
      </StandardDialog>
    </>
  );
}
```

For a complete example, see `src/examples/MultiStepDialogExample.tsx`.

## Dialog Component Patterns

### SalesDialogsHooked

A reusable component that uses the `useSalesDialog` hook:

```tsx
import { SalesDialogsHooked } from "@/components/sales/SalesDialogsHooked";

<SalesDialogsHooked
  onCreateSuccess?: (sale: Sale) => void,  // Optional: Callback when a sale is created
  onUpdateSuccess?: (sale: Sale) => void,  // Optional: Callback when a sale is updated
  onDeleteSuccess?: (id: string) => void,  // Optional: Callback when a sale is deleted
  triggerButton?: React.ReactNode,         // Optional: Custom trigger button
/>
```

### SalesController

A higher-level component that provides a complete UI for managing sales:

```tsx
import { SalesController } from "@/components/sales/SalesController";

<SalesController
  sales?: Sale[],                        // Optional: List of sales to provide action buttons for
  showCreateButton?: boolean,            // Optional: Whether to show a create button (default: true)
  onCreateSuccess?: (sale: Sale) => void, // Optional: Callback when a sale is created
  onUpdateSuccess?: (sale: Sale) => void, // Optional: Callback when a sale is updated
  onDeleteSuccess?: (id: string) => void, // Optional: Callback when a sale is deleted
  className?: string,                    // Optional: Custom CSS class
/>
```

Example usage with a data table:
```tsx
<SalesDataTable
  columns={columns}
  data={filteredSales}
  isLoading={isLoading}
  renderRowActions={(sale) => (
    <SalesController
      sales={[sale]}
      showCreateButton={false}
      onUpdateSuccess={handleSaleUpdated}
      onDeleteSuccess={handleSaleDeleted}
    />
  )}
/>
```

### TankController

A component that provides a complete UI for creating fuel tanks:

```tsx
import { TankController } from "@/components/tanks/TankController";

<TankController
  onSuccess?: () => void,                    // Optional: Callback when a tank is created
  className?: string,                        // Optional: Custom CSS class
  buttonText?: string,                       // Optional: Button text (default: "Add New Tank")
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive", // Optional: Button variant
  size?: "default" | "sm" | "lg" | "icon",   // Optional: Button size
  showIcon?: boolean,                        // Optional: Whether to show the plus icon
/>
```

Example usage:
```tsx
<TankController 
  onSuccess={() => {
    toast({
      title: "Success",
      description: "Tank created successfully",
    });
    refetchTanks();
  }}
  buttonText="Create Tank"
  variant="outline"
  size="sm"
/>
```

### ProfileController

A component that provides a complete UI for managing user profiles:

```tsx
import { ProfileController } from "@/components/settings/ProfileController";

<ProfileController
  user?: any,                                     // Optional: Current user data
  profile?: any,                                  // Optional: Current profile data
  onSuccess?: (data: ProfileFormData) => void,    // Optional: Callback when profile is updated
  onAvatarChange?: (url: string) => void,         // Optional: Callback when avatar is changed
  className?: string,                             // Optional: Custom CSS class
  buttonText?: string,                            // Optional: Button text (default: localized "Edit Profile")
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive", // Optional: Button variant
  size?: "default" | "sm" | "lg" | "icon",        // Optional: Button size
  showIcon?: boolean,                             // Optional: Whether to show the user icon
/>
```

Example usage:
```tsx
const { user, profile } = useAuth();

<ProfileController 
  user={user}
  profile={profile}
  onSuccess={(data) => {
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  }}
  onAvatarChange={(url) => {
    // Update avatar in user context
    updateUserAvatar(url);
  }}
  buttonText="Edit Your Profile"
  variant="ghost"
  size="sm"
/>
```

## Advanced Usage

### Nested Dialogs

For nested dialogs, ensure proper focus management by using the `triggerRef`:

```tsx
const parentDialog = useDialog();
const nestedDialog = useDialog();

return (
  <>
    <Button onClick={parentDialog.open} ref={parentDialog.triggerRef}>
      Open Parent
    </Button>
    
    <StandardDialog
      open={parentDialog.isOpen}
      onOpenChange={parentDialog.onOpenChange}
      title="Parent Dialog"
    >
      <Button onClick={nestedDialog.open} ref={nestedDialog.triggerRef}>
        Open Nested
      </Button>
      
      <StandardDialog
        open={nestedDialog.isOpen}
        onOpenChange={nestedDialog.onOpenChange}
        title="Nested Dialog"
      >
        Nested content
      </StandardDialog>
    </StandardDialog>
  </>
);
```

### Form Integration

For form dialogs, use the `form` attribute to connect buttons to forms:

```tsx
<StandardDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Edit Profile"
  actions={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="profile-form">
        Save
      </Button>
    </>
  }
>
  <form id="profile-form" onSubmit={handleSubmit}>
    {/* Form fields */}
  </form>
</StandardDialog>
```

### Dynamic Content

For dialogs with dynamic content based on state:

```tsx
const [step, setStep] = useState(1);

const StepContent = () => {
  switch (step) {
    case 1:
      return <Step1Form onNext={() => setStep(2)} />;
    case 2:
      return <Step2Form onBack={() => setStep(1)} onNext={() => setStep(3)} />;
    case 3:
      return <Step3Form onBack={() => setStep(2)} onComplete={handleComplete} />;
    default:
      return null;
  }
};

return (
  <StandardDialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) {
        // Reset step when dialog closes
        setStep(1);
      }
      setIsOpen(open);
    }}
    title={`Step ${step} of 3`}
    description={getStepDescription(step)}
  >
    <StepContent />
  </StandardDialog>
);
```

## Accessibility Notes

All components implement accessibility best practices:

- **Focus Management**: Focus is trapped within the dialog when open
- **Keyboard Navigation**: Support for Tab cycling and Escape key
- **ARIA Attributes**: Proper role, labelling, and descriptions
- **Screen Reader Support**: Appropriate announcements and structure

For maximum accessibility, ensure:

1. Dialog titles are clear and descriptive
2. Interactive elements have appropriate labels
3. Error messages are linked to form fields
4. Color is not the only means of conveying information 

### ConfirmationDialogStandardized

A flexible dialog for confirming user actions with support for multiple variants.

```tsx
import { ConfirmationDialogStandardized } from "@/components/dialogs/ConfirmationDialogStandardized";

<ConfirmationDialogStandardized
  open={boolean}                     // Optional: Controls the visibility of the dialog
  onOpenChange={(open) => void}      // Optional: Handler for changing open state
  defaultOptions={ConfirmationOptions} // Optional: Configuration for the dialog
/>

// ConfirmationOptions:
// {
//   title?: string,                  // Optional: Dialog title (default: "Confirm Action")
//   message: string,                 // Required: The message to display to the user
//   variant?: "default" | "destructive" | "warning" | "info", // Optional: Visual style
//   confirmLabel?: string,           // Optional: Label for confirm button (default: "Confirm")
//   cancelLabel?: string,            // Optional: Label for cancel button (default: "Cancel")
//   onConfirm?: () => void | Promise<void>, // Optional: Handler for confirm action
//   onCancel?: () => void,           // Optional: Handler for cancel action
// }
```

Example usage:
```tsx
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
```

### ConfirmationController

A higher-level component that provides a render props pattern for confirmation dialogs.

```tsx
import { ConfirmationController } from "@/components/dialogs/ConfirmationController";

<ConfirmationController
  defaultOptions={Partial<ConfirmationOptions>} // Optional: Default configuration
  children={(openConfirmation) => ReactNode}    // Required: Render function
/>

// The children prop is a function that receives an openConfirmation function which
// can be used to open the dialog with specific options.
```

Example usage:
```tsx
<ConfirmationController>
  {(openConfirmation) => (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => openConfirmation({
        title: "Delete Item",
        message: "Are you sure you want to delete this item?",
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

### LoginDialogStandardized

A standardized dialog for user authentication with email/password and social login support.

```tsx
import { LoginDialogStandardized } from "@/components/auth/LoginDialogStandardized";

<LoginDialogStandardized
  open={boolean}                      // Optional: Controls the visibility of the dialog
  onOpenChange={(open) => void}       // Optional: Handler for changing open state
  onLoginSuccess={(user) => void}     // Optional: Callback after successful login
  onSignUpClick={() => void}          // Optional: Callback for sign up button
  onForgotPasswordClick={() => void}  // Optional: Callback for forgot password
  onSocialLogin={(provider) => Promise<void>} // Optional: Social login handler
  initialValues={Partial<LoginFormData>} // Optional: Initial form values
  redirectUrl={string}                // Optional: Redirect URL after successful login
  availableProviders={AuthProvider[]} // Optional: Available social login providers
/>
```

Example usage:
```tsx
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
```

### LoginController

A higher-level component that provides a complete UI for user authentication.

```tsx
import { LoginController } from "@/components/auth/LoginController";

<LoginController
  onLoginSuccess={(user) => void}     // Optional: Callback after successful login
  onSignUpClick={() => void}          // Optional: Callback for sign up button
  onForgotPasswordClick={() => void}  // Optional: Callback for forgot password
  onSocialLogin={(provider) => Promise<void>} // Optional: Social login handler
  initialValues={Partial<LoginFormData>} // Optional: Initial form values
  redirectUrl={string}                // Optional: Redirect URL after successful login
  availableProviders={AuthProvider[]} // Optional: Available social login providers
  className={string}                  // Optional: Custom CSS class
  buttonText={string}                 // Optional: Button text (default: "Sign In")
  variant={ButtonVariant}             // Optional: Button variant (default: "default")
  size={ButtonSize}                   // Optional: Button size (default: "default")
  showIcon={boolean}                  // Optional: Whether to show the login icon
  children={ReactNode}                // Optional: Custom trigger element
/>
```

Example usage:
```tsx
// Basic usage
<LoginController
  onLoginSuccess={handleLoginSuccess}
  redirectUrl="/dashboard"
/>

// Customized button
<LoginController
  onLoginSuccess={handleLoginSuccess}
  redirectUrl="/dashboard"
  buttonText="Sign In"
  variant="outline"
  size="sm"
/>

// Custom trigger element
<LoginController
  onLoginSuccess={handleLoginSuccess}
  redirectUrl="/dashboard"
>
  <CustomButton>Sign In</CustomButton>
</LoginController>
``` 