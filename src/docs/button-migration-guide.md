# Button Migration Guide

This guide outlines how to migrate existing button implementations to the new standardized button components.

## Migration Strategy

Follow these steps to migrate your existing button implementations:

1. **Identify the button type**
2. **Choose the appropriate component**
3. **Update props and imports**
4. **Test the component**

## Button Component Selection

| If your button... | Use this component | Example |
|-------------------|-------------------|---------|
| Is a basic button | `Button` | `<Button>Submit</Button>` |
| Only contains an icon | `IconButton` | `<IconButton icon={<SearchIcon />} ariaLabel="Search" />` |
| Creates or adds new items | `CreateButton` | `<CreateButton label="Add User" />` |
| Performs async operations | `LoadingButton` | `<LoadingButton onClick={handleSave}>Save</LoadingButton>` |
| Performs destructive actions | `ActionButton` | `<ActionButton isDestructive onClick={handleDelete}>Delete</ActionButton>` |
| Is actually a link | `ButtonLink` | `<ButtonLink href="/docs">Documentation</ButtonLink>` |

## Migration Examples

### Example 1: Basic Button

**Before:**
```tsx
<button 
  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
  onClick={handleClick}
>
  Submit
</button>
```

**After:**
```tsx
import { Button } from "@/components/ui/button";

<Button 
  variant="default"
  onClick={handleClick}
>
  Submit
</Button>
```

### Example 2: Icon Button

**Before:**
```tsx
<button 
  className="p-2 hover:bg-gray-100 rounded-full"
  onClick={handleSearch}
  aria-label="Search"
>
  <SearchIcon className="h-5 w-5" />
</button>
```

**After:**
```tsx
import { IconButton } from "@/components/ui/icon-button";
import { SearchIcon } from "lucide-react";

<IconButton 
  icon={<SearchIcon className="h-4 w-4" />}
  ariaLabel="Search"
  variant="ghost"
  onClick={handleSearch}
/>
```

### Example 3: Create Button

**Before:**
```tsx
<button 
  className="flex items-center bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2"
  onClick={handleAdd}
>
  <PlusIcon className="h-5 w-5 mr-2" />
  Add User
</button>
```

**After:**
```tsx
import { CreateButton } from "@/components/ui/create-button";

<CreateButton 
  label="Add User"
  onClick={handleAdd}
/>
```

### Example 4: Loading Button

**Before:**
```tsx
function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveData();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 disabled:opacity-50"
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="mr-2" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </button>
  );
}
```

**After:**
```tsx
import { LoadingButton } from "@/components/ui/loading-button";

function SaveButton() {
  const handleSave = async () => {
    await saveData();
  };
  
  return (
    <LoadingButton
      onClick={handleSave}
      loadingText="Saving..."
    >
      Save
    </LoadingButton>
  );
}
```

### Example 5: Dangerous Actions

**Before:**
```tsx
function DeleteButton() {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem();
    }
  };
  
  return (
    <button 
      className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
```

**After:**
```tsx
import { ActionButton } from "@/components/ui/action-button";

function DeleteButton() {
  const handleDelete = () => {
    deleteItem();
  };
  
  return (
    <ActionButton
      isDestructive
      onClick={handleDelete}
      confirmationMessage="Are you sure you want to delete this item?"
    >
      Delete
    </ActionButton>
  );
}
```

### Example 6: Button Links

**Before:**
```tsx
<a 
  href="/documentation"
  className="bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-2"
>
  View Documentation
</a>
```

**After:**
```tsx
import { ButtonLink } from "@/components/ui/button";

<ButtonLink 
  href="/documentation"
  variant="secondary"
>
  View Documentation
</ButtonLink>
```

## Common Migration Issues

### 1. Handling Complex Buttons

For buttons with complex requirements, you can:
- Use the base `Button` component with custom props
- Compose multiple components together
- Extend the existing components by creating a new specialized component

### 2. Class Names

When migrating, you may need to adjust classNames:

```tsx
// Before
<button className="my-custom-class some-other-class">Click Me</button>

// After
<Button className="my-custom-class">Click Me</Button>
```

Only include custom classes that modify the base styling. Most styling needs are handled by the built-in variants.

### 3. Event Handlers

All standard event handlers work as expected with the new components:

```tsx
<Button 
  onClick={handleClick}
  onMouseEnter={handleMouseEnter}
  onFocus={handleFocus}
>
  Click Me
</Button>
```

## Compatibility Layer (Optional)

If you need to maintain backward compatibility temporarily, consider creating wrapper components that use the new standardized components internally. 

## Button Selection Guide

To help you choose the right button component for different use cases, follow this decision guide:

### When to use each button type:

1. **Button**: Use for general actions when none of the specialized buttons below are applicable.
   ```tsx
   <Button variant="default">Submit</Button>
   ```

2. **IconButton**: Use for icon-only buttons where the icon itself conveys the meaning.
   ```tsx
   <IconButton 
     icon={<SearchIcon className="h-4 w-4" />}
     ariaLabel="Search"
     variant="ghost"
   />
   ```

3. **LoadingButton**: Use for buttons that trigger asynchronous operations.
   ```tsx
   <LoadingButton 
     onClick={async () => { await saveData(); }}
     loadingText="Saving..."
   >
     Save
   </LoadingButton>
   ```

4. **CreateButton**: Use for actions that create new items or resources.
   ```tsx
   <CreateButton onClick={handleCreateNew} label="Add Employee" />
   ```

5. **ActionButton**: Use for actions that need confirmation or have important consequences.
   ```tsx
   <ActionButton 
     isDestructive
     confirmationMessage="This action cannot be undone. Are you sure?"
     onConfirmedClick={handleDelete}
   >
     Delete Account
   </ActionButton>
   ```

6. **ButtonLink**: Use for navigation when you want the look of a button.
   ```tsx
   <ButtonLink href="/reports" variant="outline">View Reports</ButtonLink>
   ```

7. **ToggleButton**: Use for binary state toggling (on/off, active/inactive).
   ```tsx
   <ToggleButton 
     isActive={isFilterActive}
     onToggle={(active) => setIsFilterActive(active)}
   >
     Filter
   </ToggleButton>
   ```

8. **ToggleButtonGroup**: Use for selecting from a group of related options.
   ```tsx
   <ToggleButtonGroup 
     value={selectedView} 
     onChange={(value) => setSelectedView(value)}
   >
     <ToggleButton value="list">List</ToggleButton>
     <ToggleButton value="grid">Grid</ToggleButton>
     <ToggleButton value="table">Table</ToggleButton>
   </ToggleButtonGroup>
   ```

9. **ButtonGroup**: Use for organizing related buttons into a cohesive control group.
   ```tsx
   <ButtonGroup attached>
     <Button variant="outline">Previous</Button>
     <Button variant="outline">Current</Button>
     <Button variant="outline">Next</Button>
   </ButtonGroup>
   ```

### Common Migration Patterns

Here are some common migration patterns you can follow:

#### 1. Form Submission Buttons

**Before:**
```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <Loading variant="inline" size="sm" text="Saving..." />
  ) : (
    "Save"
  )}
</Button>
```

**After:**
```tsx
<LoadingButton 
  type="submit" 
  isLoading={isSubmitting}
  loadingText="Saving..."
>
  Save
</LoadingButton>
```

#### 2. Icon-Only Buttons

**Before:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  onClick={handleAction}
  aria-label="Edit item"
>
  <PencilIcon className="h-4 w-4" />
</Button>
```

**After:**
```tsx
<IconButton 
  variant="ghost" 
  icon={<PencilIcon className="h-4 w-4" />}
  onClick={handleAction}
  ariaLabel="Edit item"
/>
```

#### 3. Confirmation Buttons

**Before:**
```tsx
<Button 
  variant="destructive" 
  onClick={() => setShowConfirmation(true)}
>
  Delete Account
</Button>

{showConfirmation && (
  <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Your account will be permanently deleted.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowConfirmation(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
```

**After:**
```tsx
<ActionButton 
  variant="destructive"
  confirmationTitle="Are you sure?"
  confirmationMessage="This action cannot be undone. Your account will be permanently deleted."
  onConfirmedClick={handleDeleteAccount}
>
  Delete Account
</ActionButton>
```

#### 4. Navigation Buttons

**Before:**
```tsx
<Button variant="outline" onClick={() => navigate("/reports")}>
  <FileTextIcon className="mr-2 h-4 w-4" />
  View Reports
</Button>
```

**After:**
```tsx
<ButtonLink 
  href="/reports" 
  variant="outline"
  startIcon={<FileTextIcon className="h-4 w-4" />}
>
  View Reports
</ButtonLink>
```

#### 5. Toggle Button

**Before:**
```tsx
<Button 
  variant={isDarkMode ? "default" : "outline"}
  onClick={() => setIsDarkMode(!isDarkMode)}
>
  {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
  {isDarkMode ? "Light Mode" : "Dark Mode"}
</Button>
```

**After:**
```tsx
<ToggleButton 
  isActive={isDarkMode} 
  onToggle={(active) => setIsDarkMode(active)}
>
  {isDarkMode ? <SunIcon className="h-4 w-4 mr-2" /> : <MoonIcon className="h-4 w-4 mr-2" />}
  {isDarkMode ? "Light Mode" : "Dark Mode"}
</ToggleButton>
```

#### 6. Button Group

**Before:**
```tsx
<div className="flex space-x-2">
  <Button variant="outline">Previous</Button>
  <Button variant="outline">Current</Button>
  <Button variant="outline">Next</Button>
</div>
```

**After:**
```tsx
<ButtonGroup>
  <Button variant="outline">Previous</Button>
  <Button variant="outline">Current</Button>
  <Button variant="outline">Next</Button>
</ButtonGroup>
```

**Before (attached buttons):**
```tsx
<div className="inline-flex">
  <Button className="rounded-r-none border-r-0">Previous</Button>
  <Button className="rounded-none border-x-0">Current</Button>
  <Button className="rounded-l-none border-l-0">Next</Button>
</div>
```

**After:**
```tsx
<ButtonGroup attached>
  <Button>Previous</Button>
  <Button>Current</Button>
  <Button>Next</Button>
</ButtonGroup>
```

## Best Practices

1. **Always provide accessible labels**: Use `ariaLabel` for IconButton and ensure buttons have clear text or proper aria-labels.

2. **Use proper loading states**: Avoid disabling buttons without visual feedback during async operations.

3. **Consistent sizing**: Match button sizes within the same UI section for visual harmony.

4. **Clear action description**: Button text should clearly describe the action that will occur.

5. **Appropriate variants**: Use semantic variants like "destructive" for delete actions and "default" for primary actions.

6. **Group related buttons**: Use ButtonGroup or ToggleButtonGroup for related actions.

7. **Icon placement**: Follow the pattern of using startIcon for action reinforcement and endIcon for direction or expansion.

8. **Responsive considerations**: Ensure buttons are properly sized for touch targets on mobile devices.

By following these guidelines, you'll maintain consistency across the application while providing the best possible user experience. 