
import * as React from "react";
import { cn } from "@/lib/utils";
import { ToggleButton, ToggleButtonProps } from "@/components/ui/toggle-button";

export interface ToggleButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  multiple?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  orientation?: "horizontal" | "vertical";
  activeVariant?: ToggleButtonProps["activeVariant"];
  inactiveVariant?: ToggleButtonProps["inactiveVariant"];
}

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
    // Normalize value to always be an array internally
    const normalizeValue = (val: string | string[] | undefined): string[] => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    // Internal state for uncontrolled component
    const [internalValue, setInternalValue] = React.useState<string[]>(
      normalizeValue(value)
    );
    
    // Determine if component is controlled
    const isControlled = value !== undefined && onChange !== undefined;
    const selectedValues = isControlled ? normalizeValue(value) : internalValue;
      
    // Handle toggle button clicks
    const handleToggle = (toggleValue: string, isActive: boolean) => {
      let newValue: string | string[];
      
      if (multiple) {
        // For multiple selection, add or remove from array
        const currentValues = selectedValues;
        const newValues = isActive
          ? [...currentValues, toggleValue]
          : currentValues.filter(v => v !== toggleValue);
        newValue = newValues;
      } else {
        // For single selection, replace or clear
        newValue = isActive ? toggleValue : "";
      }
      
      // Update internal state or call onChange
      if (isControlled) {
        onChange!(newValue);
      } else {
        const newInternalValue = Array.isArray(newValue) ? newValue : [newValue].filter(Boolean);
        setInternalValue(newInternalValue);
      }
    };
    
    // Process children to inject isActive and onToggle props
    const processedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      // Only process ToggleButton children
      const childValue = child.props?.value;
      if (!childValue) {
        console.warn("Button within ToggleButtonGroup must have a 'value' prop");
        return child;
      }
      
      const isActive = selectedValues.includes(childValue);
      
      return React.cloneElement(child as React.ReactElement<any>, {
        isActive,
        onToggle: (active: boolean) => handleToggle(childValue, active),
        activeVariant: child.props.activeVariant || activeVariant,
        inactiveVariant: child.props.inactiveVariant || inactiveVariant,
      });
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
