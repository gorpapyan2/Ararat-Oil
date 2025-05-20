import * as React from "react";
import { cn } from "@/shared/utils";
import { ToggleButton, ToggleButtonProps } from '@/core/components/ui/toggle-button';

/**
 * Props for ToggleButtonGroup component
 */
export interface ToggleButtonGroupProps {
  /**
   * Children components (should be ToggleButton instances)
   */
  children: React.ReactNode;
  
  /**
   * CSS class names
   */
  className?: string;
  
  /**
   * Whether to allow multiple selections
   * @default false
   */
  multiple?: boolean;
  
  /**
   * Currently selected value(s)
   */
  value?: string | string[];
  
  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[]) => void;
  
  /**
   * Orientation of the button group
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  
  /**
   * Active variant for all toggle buttons in the group
   * @default "default"
   */
  activeVariant?: ToggleButtonProps["activeVariant"];
  
  /**
   * Inactive variant for all toggle buttons in the group
   * @default "outline"
   */
  inactiveVariant?: ToggleButtonProps["inactiveVariant"];
}

/**
 * ToggleButtonGroup component for grouping related toggle buttons
 *
 * Manages selection state and ensures proper accessibility
 */
export const ToggleButtonGroup = React.forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  ({ 
    children, 
    className, 
    multiple = false,
    value,
    onChange,
    orientation = "horizontal",
    activeVariant,
    inactiveVariant,
    ...props 
  }, ref) => {
    // Internal state for uncontrolled component
    const [internalValue, setInternalValue] = React.useState<string[]>(
      multiple 
        ? Array.isArray(value) ? value : value ? [value] : [] 
        : value ? [value] : []
    );
    
    // Determine if component is controlled
    const isControlled = value !== undefined && onChange !== undefined;
    const selectedValues = isControlled 
      ? (multiple ? (Array.isArray(value) ? value : value ? [value] : []) : (value ? [value] : []))
      : internalValue;
      
    // Handle toggle button clicks
    const handleToggle = (toggleValue: string, isActive: boolean) => {
      let newValue: string | string[];
      
      if (multiple) {
        // For multiple selection, add or remove from array
        newValue = isActive
          ? [...selectedValues, toggleValue]
          : selectedValues.filter(v => v !== toggleValue);
      } else {
        // For single selection, replace or clear
        newValue = isActive ? toggleValue : "";
      }
      
      // Update internal state or call onChange
      if (isControlled) {
        onChange!(multiple ? newValue : newValue as string);
      } else {
        setInternalValue(multiple ? newValue as string[] : [newValue as string]);
      }
    };
    
    // Process children to inject isActive and onToggle props
    const processedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      // Only process ToggleButton children
      if (child.type === ToggleButton || (child.props && child.props.isActive !== undefined)) {
        const childValue = child.props.value;
        if (!childValue) {
          console.warn("ToggleButton within ToggleButtonGroup must have a 'value' prop");
          return child;
        }
        
        const isActive = selectedValues.includes(childValue);
        
        return React.cloneElement(child, {
          isActive,
          onToggle: (active: boolean) => handleToggle(childValue, active),
          activeVariant: child.props.activeVariant || activeVariant,
          inactiveVariant: child.props.inactiveVariant || inactiveVariant,
        });
      }
      
      return child;
    });
    
    return (
      <div 
        ref={ref}
        className={cn(
          "inline-flex gap-1 rounded-md border",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        role="group"
        aria-orientation={orientation}
        {...props}
      >
        {processedChildren}
      </div>
    );
  }
);

ToggleButtonGroup.displayName = "ToggleButtonGroup"; 