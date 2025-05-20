import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/shared/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/primitives/button';

/**
 * Standard Dialog component with consistent styling and behavior
 */
export interface StandardDialogProps {
  /** Dialog title */
  title: string;
  /** Optional dialog description */
  description?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Optional trigger element that opens the dialog */
  trigger?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether the dialog is currently open */
  isOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional custom width for the dialog */
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Optional custom height for the dialog */
  height?: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show a close button in the header */
  showCloseButton?: boolean;
  /** Optional additional class names */
  className?: string;
}

export function StandardDialog({
  title,
  description,
  children,
  trigger,
  footer,
  isOpen,
  onOpenChange,
  width = 'md',
  height = 'auto',
  showCloseButton = true,
  className,
}: StandardDialogProps) {
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  const heightClasses = {
    auto: '',
    sm: 'max-h-[300px]',
    md: 'max-h-[500px]',
    lg: 'max-h-[700px]',
    xl: 'max-h-[900px]',
    full: 'max-h-screen'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(
          widthClasses[width],
          heightClasses[height],
          className
        )}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            {showCloseButton && (
              <DialogClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            )}
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className={cn(
          "py-4",
          height !== 'auto' && "overflow-y-auto"
        )}>
          {children}
        </div>
        
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
