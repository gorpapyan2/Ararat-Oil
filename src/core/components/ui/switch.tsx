/**
 * This file re-exports switch components from the primitives directory.
 * This helps maintain backward compatibility with existing imports.
 */

import React from 'react';
import { cn } from '@/shared/utils';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  defaultChecked?: boolean;
  className?: string;
}

export function Switch({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  defaultChecked = false,
  className 
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const switchChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (disabled) return;
    
    const newChecked = !switchChecked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={switchChecked}
      disabled={disabled}
      onClick={handleChange}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        switchChecked 
          ? "bg-primary" 
          : "bg-input",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          switchChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
