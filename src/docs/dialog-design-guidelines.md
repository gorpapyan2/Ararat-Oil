# Dialog Design Guidelines

This document provides design guidelines for creating and using dialog components in our application. Following these guidelines ensures a consistent user experience and maintains accessibility standards.

## Table of Contents

1. [Dialog Types](#dialog-types)
2. [When to Use Dialogs](#when-to-use-dialogs)
3. [Dialog Structure](#dialog-structure)
4. [Dialog Content](#dialog-content)
5. [Actions and Buttons](#actions-and-buttons)
6. [Form Dialogs](#form-dialogs)
7. [Error States](#error-states)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Visual Design](#visual-design)
10. [Examples](#examples)

## Dialog Types

Our application uses several types of dialogs, each with a specific purpose:

1. **Standard Dialog**: General-purpose dialog for displaying content, forms, or interactive elements
2. **Confirmation Dialog**: Asks the user to confirm an action before proceeding
3. **Alert Dialog**: Informs the user about important information or errors
4. **Delete Confirmation Dialog**: Specific confirmation dialog for deletion actions
5. **Form Dialog**: Contains a form for data entry or editing

## When to Use Dialogs

Use dialogs sparingly and intentionally:

✅ **Appropriate Uses**:

- Capturing user input that requires immediate attention
- Confirming destructive or significant actions
- Displaying critical information that requires acknowledgment
- Creating or editing records within the context of the current page
- Displaying more information without navigating away

❌ **Avoid Using Dialogs For**:

- Complex multi-step workflows (consider a dedicated page)
- Displaying non-critical information
- Replacing navigation (use pages instead)
- Very large forms with many fields
- Displaying errors that could be shown inline

## Dialog Structure

Every dialog should maintain this structure:

1. **Header**:

   - Clear, concise title that describes the purpose
   - Optional description for additional context
   - Optional close button (X)

2. **Content Area**:

   - Main content of the dialog
   - Appropriately spaced from the header and footer
   - Scrollable if content exceeds maximum height

3. **Footer/Actions**:
   - Primary and secondary action buttons
   - Consistent button order and positioning
   - Clear button labels

## Dialog Content

Keep dialog content focused and minimal:

- **Be Concise**: Use clear, direct language
- **Focus on the Task**: Include only what's necessary for the current task
- **Hierarchy**: Maintain clear visual hierarchy with headings and spacing
- **Whitespace**: Use adequate spacing to improve readability
- **Maximum Height**: Content should not exceed 80% of the viewport height
- **Scrolling**: Enable scrolling for content areas when necessary, but keep headers and footers fixed

## Actions and Buttons

Button guidelines for dialogs:

- **Button Order**:

  - Destructive or high-impact actions on the right
  - Cancel or back buttons on the left
  - Primary action buttons with accent color
  - Secondary action buttons with neutral styling

- **Button Labels**:

  - Use verb-noun format for clarity: "Save Changes" not just "Save"
  - Be specific about the action: "Delete Item" not just "Delete"
  - Avoid vague terms like "OK" or "Yes" when possible

- **Loading States**:
  - Show loading indicators on buttons during async operations
  - Disable all buttons during loading to prevent double submission
  - Provide visual feedback when operations complete

## Form Dialogs

Guidelines for dialogs containing forms:

- **Validation**:

  - Use inline validation with clear error messages
  - Show validation errors next to the relevant fields
  - Validate on blur or submit, not on every keystroke
  - Use Zod schemas for consistent validation

- **Field Layout**:

  - Organize fields logically in a single column when possible
  - Group related fields with appropriate spacing
  - Use appropriate field widths based on expected input length
  - Consider field dependencies and conditionally show fields as needed

- **Default Values and Focus**:
  - Pre-fill fields with sensible defaults when possible
  - Auto-focus the first interactive element when dialog opens
  - Use appropriate keyboard shortcuts (Enter to submit, Esc to cancel)

## Error States

Handling errors in dialogs:

- **Form Errors**:

  - Display validation errors inline next to the relevant fields
  - Use clear, actionable error messages
  - Show a summary of errors at the top for accessibility if many errors exist

- **Submission Errors**:

  - Display submission errors at the top of the form
  - Include specific details about what went wrong
  - Provide guidance on how to resolve the issue
  - Maintain entered data when errors occur

- **Network Errors**:
  - Show toast notifications for network failures
  - Allow retry options when appropriate
  - Preserve form state during connection issues

## Accessibility Guidelines

All dialogs must follow these accessibility guidelines:

- **Focus Management**:

  - Trap focus within the dialog when open
  - Return focus to the triggering element when closed
  - Auto-focus the first interactive element or the close button

- **Keyboard Navigation**:

  - Support Escape key to close
  - Support Tab key to navigate through focusable elements
  - Add appropriate keyboard shortcuts for common actions

- **Screen Readers**:

  - Use appropriate ARIA attributes (role, aria-labelledby, aria-describedby)
  - Ensure proper heading structure
  - Announce errors and changes appropriately

- **Color and Contrast**:
  - Maintain sufficient color contrast (WCAG AA minimum)
  - Don't rely on color alone to convey information
  - Test with color blindness simulators

## Visual Design

Consistent visual design for dialogs:

- **Width**: Standard dialog widths should be used:

  - Small: `sm:max-w-[425px]`
  - Medium: `sm:max-w-[525px]`
  - Large: `sm:max-w-[640px]`
  - Extra Large: `sm:max-w-[800px]`

- **Spacing**:

  - Consistent padding around content: `p-6`
  - Space between header and content: `mt-6`
  - Space between content and footer: `mt-6`
  - Space between footer buttons: `ml-2`

- **Elevation and Borders**:

  - Use standard border-radius
  - Consistent shadow for elevation
  - Optional dividers between sections

- **Animation**:
  - Subtle entrance/exit animations
  - Avoid overly complex or lengthy animations
  - Consider reduced motion preferences

## Examples

### Standard Dialog Example

```tsx
<StandardDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Account Settings"
  description="Update your account preferences"
  actions={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" form="settings-form">
        Save Changes
      </Button>
    </>
  }
>
  <form id="settings-form" onSubmit={handleSubmit}>
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Display Name</Label>
        <Input id="name" defaultValue="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="john.doe@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="theme">Theme</Label>
        <Select defaultValue="system">
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </form>
</StandardDialog>
```

### Confirmation Dialog Example

```tsx
<ConfirmDialog
  open={isConfirmOpen}
  onOpenChange={setIsConfirmOpen}
  title="Publish Changes"
  description="Publishing these changes will make them visible to all users. Are you sure you want to continue?"
  onConfirm={handlePublish}
  onCancel={() => setIsConfirmOpen(false)}
  confirmText="Yes, Publish Now"
  cancelText="No, Keep Drafting"
  isLoading={isPublishing}
/>
```

### Delete Confirmation Dialog Example

```tsx
<DeleteConfirmDialog
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  title="Delete Account"
  description="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
  onConfirm={handleAccountDeletion}
  deleteText="Permanently Delete Account"
  isLoading={isDeleting}
/>
```

### Alert Dialog Example

```tsx
<AlertMessageDialog
  open={isAlertOpen}
  onOpenChange={setIsAlertOpen}
  title="License Expired"
  description="Your license has expired. Please renew your subscription to continue using premium features."
  severity="warning"
  buttonText="Go to Subscription Page"
  onClose={handleNavigateToSubscription}
/>
```

## Best Practices Summary

1. **Clarity**: Ensure dialog purpose is immediately clear through title and content
2. **Simplicity**: Keep dialogs focused on a single task or piece of information
3. **Consistency**: Maintain consistent styling, layout, and behavior across all dialogs
4. **Performance**: Optimized rendering and animations for smooth user experience
5. **Accessibility**: Ensure all dialogs are fully accessible to all users
6. **Error Handling**: Provide clear error messages and recovery paths
7. **Progressive Disclosure**: Show additional options only when needed
8. **Context Preservation**: Maintain context and state during dialog interactions
