# Dialog Components Migration Guide

This guide helps with migrating from the old dialog component implementations to the new shared components structure.

## Overview of Changes

The dialog components have been refactored to improve:
- Type safety
- Consistent API
- Better accessibility
- Improved documentation
- Reduced duplication

## Migrating StandardDialog

### Before
```tsx
import { StandardDialog } from '@/components/ui/composed/dialog';
// or
import { StandardDialog } from '@/components/ui/dialog';
// or
import { StandardDialog } from '@/components/ui/standard-dialog';
```

### After
```tsx
import { StandardDialog } from '@/shared/components/common';
```

## Migrating DeleteConfirmDialog

### Before
```tsx
import { DeleteConfirmDialog } from '@/components/ui/composed/dialog';
```

### After
```tsx
import { DeleteConfirmDialog } from '@/shared/components/common';
```

## Props Changes

### StandardDialog

The StandardDialog props remain largely the same:

```tsx
interface StandardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
}
```

### DeleteConfirmDialog

The DeleteConfirmDialog props remain largely the same:

```tsx
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  deleteText?: string;
  cancelText?: string;
  isLoading?: boolean;
  className?: string;
}
```

## Migration Steps

1. Update imports to use the new location: `@/shared/components/common`
2. No prop changes are needed for existing components
3. New components may have additional props to match their specialized behavior
4. Test the updated implementations to ensure they function as expected

## Examples

### Standard Dialog Usage

```tsx
import { StandardDialog } from '@/shared/components/common';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      
      <StandardDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Dialog Title"
        description="This is a description of the dialog."
        actions={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Dialog content */}
        </div>
      </StandardDialog>
    </>
  );
}
```

### Confirm Delete Dialog Usage

```tsx
import { DeleteConfirmDialog } from '@/shared/components/common';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const handleDelete = () => {
    if (selectedItem) {
      // Delete logic here
    }
  };
  
  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => {
          setSelectedItem(item);
          setIsDeleteDialogOpen(true);
        }}
      >
        Delete
      </Button>
      
      {selectedItem && (
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          description={`Are you sure you want to delete ${selectedItem.name}?`}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
} 