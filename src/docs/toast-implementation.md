# Toast Implementation Documentation

## Overview

This project uses a consolidated toast notification system that provides a simple and consistent way to display notifications to users. The implementation combines the best features of two previous approaches:

1. A Zustand-based global store for state management
2. A component-based toast UI with flexible styling

## Key Features

- **Centralized State Management**: Toast state is managed in the global app store
- **Typed API**: Full TypeScript support for toast options and returns
- **Multiple Toast Types**: Support for success, error, warning, and info toasts
- **Customizable UI**: Flexible positioning and styling
- **Action Support**: Toasts can include interactive buttons
- **Accessibility**: Full keyboard navigation and screen reader support

## Usage

### Basic Usage

```tsx
import { useToast } from '@/hooks';

function MyComponent() {
  const { toast, success, error, warning, info } = useToast();
  
  function handleAction() {
    success({
      title: "Success!",
      description: "Your action was completed successfully.",
      duration: 5000, // 5 seconds
    });
  }
  
  return <button onClick={handleAction}>Complete Action</button>;
}
```

### Toast with Action Button

```tsx
import { useToast } from '@/hooks';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const { toast } = useToast();
  
  function handleActionWithConfirmation() {
    const { dismiss } = toast({
      title: "Confirm Action",
      description: "Are you sure you want to proceed?",
      duration: Infinity, // Won't auto-dismiss
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Handle confirmation
            dismiss();
          }}
        >
          Confirm
        </Button>
      ),
    });
  }
  
  return <button onClick={handleActionWithConfirmation}>Start Action</button>;
}
```

### Outside of React Components

You can use toasts outside of React components:

```tsx
import { toast, success, error } from '@/hooks';

// In an async function
async function fetchData() {
  try {
    const data = await api.get('/some-endpoint');
    success({ title: "Data loaded", description: "Your data has been loaded successfully" });
    return data;
  } catch (err) {
    error({ title: "Error", description: err.message });
    throw err;
  }
}
```

## API Reference

### useToast Hook

The `useToast` hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| toasts | Toast[] | Array of current toast notifications |
| toast | (options: ToastOptions) => { id: string, dismiss: () => void, update: (newOptions: Partial<ToastOptions>) => void } | Main function to display a toast |
| success | (options: Omit<ToastOptions, "type">) => { id: string, dismiss: () => void, update: (newOptions: Partial<ToastOptions>) => void } | Shorthand for success toasts |
| error | (options: Omit<ToastOptions, "type">) => { id: string, dismiss: () => void, update: (newOptions: Partial<ToastOptions>) => void } | Shorthand for error toasts |
| warning | (options: Omit<ToastOptions, "type">) => { id: string, dismiss: () => void, update: (newOptions: Partial<ToastOptions>) => void } | Shorthand for warning toasts |
| info | (options: Omit<ToastOptions, "type">) => { id: string, dismiss: () => void, update: (newOptions: Partial<ToastOptions>) => void } | Shorthand for info toasts |
| dismiss | (id: string) => void | Function to dismiss a toast by ID |
| update | (id: string, options: Partial<ToastOptions>) => void | Function to update an existing toast |

### ToastOptions

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| title | string | Toast title | undefined |
| description | string | Toast description/content | undefined |
| message | string | Alternative to description | undefined |
| duration | number | Duration in milliseconds | 5000 |
| type | "success" \| "error" \| "warning" \| "info" | Toast type | "info" |
| action | React.ReactNode | Action button or component | undefined |
| onOpenChange | (open: boolean) => void | Callback when open state changes | undefined |

## Components

### ToastContainer

Renders the toasts in the UI:

```tsx
<ToastContainer 
  position="bottom-right" // "top-right" | "top-left" | "bottom-right" | "bottom-left"
  className="custom-class"
/>
```

### Toaster

A convenience component that automatically renders the ToastContainer:

```tsx
// In your layout or app root
<Toaster />
```

## Implementation Details

The toast system is implemented across several files:

- `src/hooks/useToast.ts`: The main hook for using toasts
- `src/store/useAppStore.ts`: The global store containing toast state
- `src/components/ui/toast-container.tsx`: The container component for rendering toasts
- `src/components/ui/toaster.tsx`: A convenience component for including toasts in layouts
- `src/types/toast.d.ts`: TypeScript types for the toast system 