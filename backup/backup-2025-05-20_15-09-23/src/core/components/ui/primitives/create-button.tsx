import * as React from "react";
import { Button, ButtonProps } from '@/core/components/ui/button';
import { PlusIcon } from "lucide-react";
import { cn } from "@/shared/utils";

/**
 * Props for the CreateButton component
 */
export interface CreateButtonProps extends Omit<ButtonProps, 'startIcon'> {
  /**
   * Label to display on the button
   * @default "Create New"
   */
  label?: string;

  /**
   * Optional icon to use instead of the default PlusIcon
   */
  icon?: React.ReactNode;
}

/**
 * CreateButton component for adding new items
 * 
 * Standardized button with a plus icon for create/add actions
 */
export const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ 
    className, 
    label = "Create New", 
    icon,
    variant = "default",
    ...props 
  }, ref) => {
    return (
      <Button
        className={cn("gap-1", className)}
        ref={ref}
        variant={variant}
        startIcon={icon || <PlusIcon className="h-4 w-4" />}
        {...props}
      >
        {label}
      </Button>
    );
  }
);

CreateButton.displayName = "CreateButton"; 