# Dialog Components

This document describes the standardized dialog components available in our application.

## Overview

Our dialog system consists of several components that build on each other:

1. **StandardDialog**: The base dialog component with consistent styling and behavior
2. **FormDialog**: A specialized dialog for forms that integrates with `StandardForm`
3. **ConfirmDialog**: A specialized dialog for confirmation actions
4. **DeleteConfirmDialog**: A specialized dialog for delete confirmations (pre-existing)

## StandardDialog

`StandardDialog` provides a consistent base for all dialogs in the application.

### Features

- Consistent styling, animations, and layout
- Support for title, description, and custom content
- Customizable size and position
- Option to prevent closing when clicking outside
- Accessible via keyboard navigation

### Usage

```tsx
import { StandardDialog } from "@/shared/components/common/dialog/StandardDialog";
import { Button } from "@/core/components/ui/primitives/button";

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <StandardDialog
      open={open}
      onOpenChange={setOpen}
      title="Dialog Title"
      description="Optional description text"
      actions={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAction}>Confirm</Button>
        </>
      }
      size="md"
      position="center"
    >
      <div>Dialog content goes here</div>
    </StandardDialog>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | required | Controls whether the dialog is open |
| `onOpenChange` | (open: boolean) => void | required | Callback fired when the dialog open state changes |
| `title` | string | required | Title of the dialog |
| `description` | string | undefined | Optional description text |
| `children` | ReactNode | required | Dialog content |
| `actions` | ReactNode | undefined | Footer actions, typically buttons |
| `className` | string | undefined | Optional class name for the dialog container |
| `showCloseButton` | boolean | true | Whether to show a close button in the top right |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' | 'md' | Size of the dialog |
| `maxWidth` | string | undefined | Custom maximum width if the size variants don't fit your need |
| `position` | 'center' \| 'top' | 'center' | Position of the dialog |
| `preventOutsideClose` | boolean | false | Whether to prevent closing when clicking outside the dialog |

## FormDialog

`FormDialog` combines `StandardDialog` with `StandardForm` to create a consistent form dialog pattern.

### Features

- All features of StandardDialog
- Integration with our form validation system
- Standardized footer with submit/cancel buttons
- Handling of form submission states

### Usage

```tsx
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { Control, FieldValues } from "react-hook-form";

function MyFormDialog() {
  const [open, setOpen] = useState(false);
  
  // Define schema
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
  });
  
  // Define default values
  const defaultValues = {
    name: "",
    email: "",
  };
  
  // Handle submit
  const handleSubmit = async (data) => {
    try {
      // Submit data
      return true; // Return true for success
    } catch (error) {
      return false; // Return false for failure
    }
  };
  
  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title="Create Item"
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText="Create"
      size="md"
    >
      {({ control }) => (
        <>
          <FormField
            control={control as Control<FieldValues>}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control as Control<FieldValues>}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </FormDialog>
  );
}
```

### Props

`FormDialog` includes all props from `StandardDialog` except `actions` and `children`, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | z.ZodType | required | Form schema for validation |
| `defaultValues` | object | required | Default values for the form |
| `onSubmit` | (data: T) => Promise<boolean> | required | Callback fired when the form is submitted |
| `children` | (props: { control: any }) => ReactNode | required | Form content render function |
| `submitText` | string | "Save" | Text for the submit button |
| `cancelText` | string | "Cancel" | Text for the cancel button |
| `isSubmitting` | boolean | false | Whether the form is currently submitting |
| `preventCloseOnSubmit` | boolean | true | Whether to prevent closing the dialog when submitting |
| `formClassName` | string | undefined | Additional class name for the form |

## ConfirmDialog

`ConfirmDialog` provides a standardized dialog for confirmation actions.

### Features

- All features of StandardDialog
- Standardized confirmation UI with icon
- Standardized buttons for confirm/cancel
- Handling of confirmation states

### Usage

```tsx
import { ConfirmDialog } from "@/shared/components/common/dialog/ConfirmDialog";
import { AlertTriangle } from "lucide-react";

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  const handleConfirm = async () => {
    // Perform confirmation action
  };
  
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Confirm Action"
      description="Are you sure you want to perform this action?"
      onConfirm={handleConfirm}
      confirmText="Yes, Proceed"
      confirmVariant="destructive"
      icon={<AlertTriangle className="h-6 w-6" />}
      iconBgColor="bg-yellow-100"
      iconColor="text-yellow-500"
    >
      <p className="text-center">
        This action cannot be undone.
      </p>
    </ConfirmDialog>
  );
}
```

### Props

`ConfirmDialog` includes all props from `StandardDialog` except `actions`, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConfirm` | () => void \| Promise<void> | required | Callback fired when the confirmation is accepted |
| `onCancel` | () => void | undefined | Callback fired when the confirmation is canceled |
| `confirmText` | string | "Confirm" | Text for the confirm button |
| `cancelText` | string | "Cancel" | Text for the cancel button |
| `confirmVariant` | ButtonProps['variant'] | "default" | Variant of the confirm button |
| `isConfirming` | boolean | false | Whether the confirmation is being processed |
| `icon` | ReactNode | <HelpCircle /> | Icon to display in the confirmation dialog |
| `iconBgColor` | string | "bg-primary/10" | Color of the icon background |
| `iconColor` | string | "text-primary" | Color of the icon |

## DeleteConfirmDialog

`DeleteConfirmDialog` is a pre-existing specialized dialog for delete confirmations.

### Usage

```tsx
import { DeleteConfirmDialog } from "@/shared/components/common/dialog/DeleteConfirmDialog";

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  const handleDelete = async () => {
    // Perform delete action
  };
  
  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Confirm Deletion"
      description="Are you sure you want to delete this item?"
      onConfirm={handleDelete}
      deleteText="Delete"
      isLoading={false}
    />
  );
}
```

## Best Practices

1. **Use the most specific dialog component** for your use case:
   - For forms, use `FormDialog`
   - For confirmations, use `ConfirmDialog`
   - For delete confirmations, use `DeleteConfirmDialog`
   - For custom dialogs, use `StandardDialog`

2. **Consistent titles and button text**:
   - For create actions: "Create [Item]" + "Create" button
   - For edit actions: "Edit [Item]" + "Save" button
   - For delete actions: "Confirm Deletion" + "Delete" button
   - For general confirmations: "Confirm [Action]" + "Confirm" button

3. **Form validation**:
   - Always use zod schemas for form validation
   - Provide clear error messages with i18n support
   - Handle submission errors gracefully

4. **Accessibility**:
   - Ensure keyboard navigation works (Tab, Escape, Enter)
   - Set focus on the primary action button when dialog opens
   - Use aria attributes for screen readers

5. **Responsive design**:
   - Use appropriate size for the content
   - Consider mobile views with responsive layouts
   - Use grid layouts for form fields to adjust to different screen sizes 