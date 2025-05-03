# Dialog Primitives Implementation Guide

## Overview

This document outlines the implementation of accessible dialog primitives as part of our dialog standardization effort. These primitives will serve as the foundation for all dialog components in our application and ensure consistent accessibility across implementations.

## Accessibility Requirements

When implementing dialogs, several accessibility requirements must be met:

1. **Focus Management**
   - Focus must be trapped within the dialog when open
   - Focus must return to the triggering element when closed
   - The first focusable element should receive focus when dialog opens

2. **Keyboard Navigation**
   - ESC key should close the dialog
   - TAB key should cycle through focusable elements
   - SHIFT+TAB should reverse the tab order

3. **ARIA Attributes**
   - `role="dialog"` for standard dialogs
   - `role="alertdialog"` for important messages requiring user attention
   - `aria-modal="true"` to indicate modal behavior
   - `aria-labelledby` to reference the dialog title
   - `aria-describedby` to reference the dialog description

4. **Screen Reader Announcements**
   - Dialog opening should be announced
   - Dialog title and description should be read when opened
   - Focus management should be properly conveyed to assistive technology

## Implementation Approach

We'll implement dialog primitives in three main components:

1. **DialogPrimitive**: Base primitive for standard dialogs
2. **AlertDialogPrimitive**: For critical alerts requiring user confirmation
3. **SheetDialogPrimitive**: For slide-in panel dialogs (side drawers)

## DialogPrimitive Implementation

```tsx
// src/components/ui/primitives/dialog.tsx
import * as React from 'react';
import { useId } from 'react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useKeyboardHandler } from '@/hooks/use-keyboard-handler';

export interface DialogPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * The element that triggered the dialog, used to return focus when closed
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Content of the dialog
   */
  children: React.ReactNode;
  /**
   * Title of the dialog, for accessibility
   */
  title: string;
  /**
   * Optional description of the dialog, for accessibility
   */
  description?: string;
  /**
   * Whether the dialog is modal (blocks interaction with the rest of the page)
   */
  modal?: boolean;
}

export const DialogPrimitive = React.forwardRef<HTMLDivElement, DialogPrimitiveProps>(
  (
    {
      open,
      onOpenChange,
      triggerRef,
      children,
      title,
      description,
      modal = true,
      ...props
    },
    forwardedRef
  ) => {
    // Create refs for focus management
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(forwardedRef, dialogRef);
    
    // Create IDs for accessibility attributes
    const titleId = useId();
    const descriptionId = useId();
    
    // Focus trap to keep focus inside dialog
    useFocusTrap(dialogRef, open);
    
    // Handle keyboard events (ESC to close)
    useKeyboardHandler(
      dialogRef,
      open,
      {
        Escape: () => onOpenChange(false)
      }
    );
    
    // Store previous active element to restore focus on close
    const previousActiveRef = React.useRef<HTMLElement | null>(null);
    
    // Handle focus management when dialog opens/closes
    React.useEffect(() => {
      if (open) {
        // Store current active element
        previousActiveRef.current = document.activeElement as HTMLElement;
        
        // Focus first focusable element in dialog
        requestAnimationFrame(() => {
          if (dialogRef.current) {
            const focusableElements = getFocusableElements(dialogRef.current);
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            } else {
              // If no focusable elements, focus the dialog itself
              dialogRef.current.focus();
            }
          }
        });
      } else if (previousActiveRef.current) {
        // Return focus to previous element when closing
        previousActiveRef.current.focus();
      }
    }, [open]);
    
    // Handle click outside to close
    const handleOutsideClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (
          dialogRef.current &&
          e.target instanceof Node &&
          !dialogRef.current.contains(e.target)
        ) {
          onOpenChange(false);
        }
      },
      [onOpenChange]
    );
    
    // Don't render anything if dialog is closed
    if (!open) return null;
    
    return (
      <div
        role="presentation"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        onClick={handleOutsideClick}
      >
        {/* Modal backdrop */}
        {modal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            aria-hidden="true"
          />
        )}
        
        {/* Dialog container */}
        <div
          ref={combinedRef}
          role="dialog"
          aria-modal={modal}
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1} // Make dialog focusable but not in tab order
          className="relative z-50 max-h-[85vh] w-[90vw] max-w-md overflow-auto rounded-md bg-background p-6 shadow-lg focus:outline-none"
          {...props}
        >
          {/* Hidden but accessible title */}
          <div id={titleId} className="sr-only">
            {title}
          </div>
          
          {/* Hidden but accessible description */}
          {description && (
            <div id={descriptionId} className="sr-only">
              {description}
            </div>
          )}
          
          {children}
        </div>
      </div>
    );
  }
);

DialogPrimitive.displayName = 'DialogPrimitive';
```

## AlertDialogPrimitive Implementation

```tsx
// src/components/ui/primitives/alert-dialog.tsx
import * as React from 'react';
import { DialogPrimitive, DialogPrimitiveProps } from './dialog';

export interface AlertDialogPrimitiveProps extends Omit<DialogPrimitiveProps, 'role'> {
  /**
   * Severity of the alert
   */
  severity?: 'info' | 'warning' | 'danger';
}

export const AlertDialogPrimitive = React.forwardRef<HTMLDivElement, AlertDialogPrimitiveProps>(
  ({ severity = 'info', ...props }, ref) => {
    return (
      <DialogPrimitive
        ref={ref}
        role="alertdialog" // Use alertdialog role for screen readers
        modal={true} // Alert dialogs should always be modal
        {...props}
      />
    );
  }
);

AlertDialogPrimitive.displayName = 'AlertDialogPrimitive';
```

## Utility Functions

```tsx
// Helper utilities for the primitives

/**
 * Combines multiple refs into one
 */
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | null | undefined>) {
  const targetRef = React.useRef<T>(null);
  
  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);
  
  return targetRef;
}

/**
 * Gets all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  ) as HTMLElement[];
}
```

## Implementation of Focus Trap Hook

```tsx
// src/hooks/use-focus-trap.ts
import { useEffect, RefObject } from 'react';

/**
 * Hook that traps focus within a container when active
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // If shift+tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      
      // If tab on last element, move to first element
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef, isActive]);
}
```

## Implementation of Keyboard Handler Hook

```tsx
// src/hooks/use-keyboard-handler.ts
import { useEffect, RefObject } from 'react';

type KeyHandlers = {
  [key: string]: (e: KeyboardEvent) => void;
};

/**
 * Hook that handles keyboard events for a specific element
 */
export function useKeyboardHandler(
  elementRef: RefObject<HTMLElement>,
  isActive: boolean = true,
  handlers: KeyHandlers
) {
  useEffect(() => {
    if (!isActive || !elementRef.current) return;
    
    const element = elementRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = handlers[e.key];
      if (handler) {
        handler(e);
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [elementRef, isActive, handlers]);
}
```

## Testing Dialog Primitives

To ensure our dialog primitives meet accessibility requirements, we'll implement comprehensive tests:

```tsx
// src/components/ui/primitives/__tests__/dialog.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialogPrimitive } from '../dialog';

describe('DialogPrimitive', () => {
  // Test rendering and basic functionality
  it('renders when open and not when closed', () => {
    const { rerender } = render(
      <DialogPrimitive
        open={true}
        onOpenChange={() => {}}
        title="Test Dialog"
      >
        Dialog content
      </DialogPrimitive>
    );
    
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
    
    rerender(
      <DialogPrimitive
        open={false}
        onOpenChange={() => {}}
        title="Test Dialog"
      >
        Dialog content
      </DialogPrimitive>
    );
    
    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
  });
  
  // Test accessibility attributes
  it('has correct ARIA attributes', () => {
    render(
      <DialogPrimitive
        open={true}
        onOpenChange={() => {}}
        title="Test Dialog"
        description="Test Description"
      >
        Dialog content
      </DialogPrimitive>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
    
    const titleId = dialog.getAttribute('aria-labelledby');
    const descriptionId = dialog.getAttribute('aria-describedby');
    
    expect(screen.getByText('Test Dialog')).toHaveAttribute('id', titleId);
    expect(screen.getByText('Test Description')).toHaveAttribute('id', descriptionId);
  });
  
  // Test keyboard interaction
  it('closes on Escape key press', () => {
    const handleOpenChange = jest.fn();
    render(
      <DialogPrimitive
        open={true}
        onOpenChange={handleOpenChange}
        title="Test Dialog"
      >
        Dialog content
      </DialogPrimitive>
    );
    
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
  
  // Test click outside behavior
  it('closes when clicking outside', () => {
    const handleOpenChange = jest.fn();
    render(
      <DialogPrimitive
        open={true}
        onOpenChange={handleOpenChange}
        title="Test Dialog"
      >
        Dialog content
      </DialogPrimitive>
    );
    
    // Click the backdrop (outside the dialog)
    fireEvent.click(document.querySelector('[role="presentation"]')!);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
  
  // Test focus management
  it('traps focus within the dialog', async () => {
    render(
      <DialogPrimitive
        open={true}
        onOpenChange={() => {}}
        title="Test Dialog"
      >
        <button>First Button</button>
        <input type="text" />
        <button>Last Button</button>
      </DialogPrimitive>
    );
    
    const firstButton = screen.getByText('First Button');
    const lastButton = screen.getByText('Last Button');
    
    // First focusable element should be focused automatically
    expect(firstButton).toHaveFocus();
    
    // Tab to the last element
    await userEvent.tab();
    await userEvent.tab();
    expect(lastButton).toHaveFocus();
    
    // Tab again should loop back to first element
    await userEvent.tab();
    expect(firstButton).toHaveFocus();
    
    // Shift+Tab should go to last element
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(lastButton).toHaveFocus();
  });
});
```

## Browser and Screen Reader Testing

In addition to automated tests, we'll perform manual testing with the following combinations:

| Browser | Screen Reader | OS |
|---------|--------------|-----|
| Chrome | NVDA | Windows |
| Firefox | NVDA | Windows |
| Safari | VoiceOver | macOS |
| Chrome | ChromeVox | Chrome OS |
| Chrome | TalkBack | Android |
| Safari | VoiceOver | iOS |

For each combination, we'll test:

1. Dialog announcement when opened
2. Reading of dialog title and description
3. Navigation between focusable elements
4. Proper closing behavior with ESC key
5. Return of focus to trigger element

## Implementation Timeline

1. **Day 1-2**: Implement base dialog primitives
2. **Day 3**: Implement focus trap and keyboard hooks
3. **Day 4**: Write unit tests
4. **Day 5**: Perform manual testing with screen readers
5. **Day 6-7**: Address feedback and make improvements

## Success Criteria

Our dialog primitives implementation will be considered successful when:

1. All automatic tests pass
2. Manual testing with screen readers confirms proper behavior
3. Focus management works correctly
4. Keyboard navigation follows accessibility best practices
5. ARIA attributes are properly implemented
6. The implementation is flexible enough to support all required dialog types 