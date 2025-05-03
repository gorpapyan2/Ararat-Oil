# Toast Implementation Consolidation Plan

## Background

The codebase currently has two toast implementations:
1. `src/hooks/useToast.ts` - Uses the app store with Zustand and has typed interfaces
2. `src/hooks/use-toast.ts` - Appears to be from shadcn/ui with its own state management

Additionally, there are related files:
- `src/components/ui/toast.tsx` - UI components for toasts 
- `src/components/ui/use-toast.ts` - A small re-export file
- `src/components/ui/toaster.tsx` - Toast container component

## Consolidation Strategy

### 1. Choose the Primary Implementation

We'll standardize on `useToast.ts` because:
- It's integrated with the app's store management
- It has a cleaner API with success/error/warning/info methods
- It follows the PascalCase naming convention used for other hooks

### 2. Migration Steps

1. **Component Audit**: 
   - Identify all components using either toast implementation
   - Document which components use which implementation

2. **Create Consolidated Implementation**:
   - Update `useToast.ts` to include any missing features from `use-toast.ts`
   - Ensure it has all the necessary types and integration with UI components

3. **Update Components**:
   - Migrate any components using `use-toast.ts` to use `useToast.ts`
   - Test each component to ensure toast functionality works correctly

4. **Remove Deprecated Files**:
   - Remove `src/hooks/use-toast.ts` once all components are migrated
   - Update or remove `src/components/ui/use-toast.ts` as appropriate

### 3. Implementation Details

```typescript
// Updated src/hooks/useToast.ts
import { useAppStore } from "@/store/useAppStore";
import { v4 as uuidv4 } from "uuid";
import { Toast, ToastType } from "@/types/toast";

interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  duration?: number;
  type?: ToastType;
  action?: React.ReactNode;
}

export const useToast = () => {
  const { addToast, removeToast, updateToast } = useAppStore();

  const toast = (options: ToastOptions) => {
    const id = uuidv4();
    const toastData: Toast = {
      id,
      title: options.title,
      description: options.description || options.message,
      message: options.message || options.description || "",
      duration: options.duration || 5000,
      type: options.type || "info",
      action: options.action,
      createdAt: new Date(),
    };

    addToast(toastData);

    // Auto dismiss after duration
    if (options.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, options.duration || 5000);
    }

    // Return functions to control the toast
    return {
      id,
      dismiss: () => removeToast(id),
      update: (newOptions: Partial<ToastOptions>) => {
        updateToast(id, {
          ...newOptions,
        });
      },
    };
  };

  // Convenience methods
  const success = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "success" });
  const error = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "error" });
  const warning = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "warning" });
  const info = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "info" });

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
    update: updateToast,
  };
};
```

### 4. Store Updates

Ensure the app store has the necessary toast state operations:

```typescript
// In useAppStore.ts or relevant store file
addToast: (toast: Toast) => set((state) => ({
  toasts: [toast, ...state.toasts].slice(0, TOAST_LIMIT),
})),

removeToast: (id: string) => set((state) => ({
  toasts: state.toasts.filter((t) => t.id !== id),
})),

updateToast: (id: string, partialToast: Partial<Toast>) => set((state) => ({
  toasts: state.toasts.map((t) => 
    t.id === id ? { ...t, ...partialToast } : t
  ),
})),
```

## Testing

1. Create a test page/component that exercises all toast functionality
2. Verify styling is consistent across all toast types
3. Test toast dismissal (auto and manual)
4. Test toast updating

## Timeline

1. Component Audit - 1 day
2. Consolidated Implementation - 1 day
3. Component Updates - 1-2 days
4. Testing - 1 day
5. Remove Deprecated Files - 0.5 day

Total: 4-5 days 