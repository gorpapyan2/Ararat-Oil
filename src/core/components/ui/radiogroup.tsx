import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/shared/utils/cn";

/**
 * RadioGroup component props
 */
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /**
   * Optional label for the radio group
   */
  label?: string;

  /**
   * Optional help text or description
   */
  description?: string;

  /**
   * Error message to display when invalid
   */
  error?: string;

  /**
   * Orientation of the radio buttons
   */
  orientation?: "horizontal" | "vertical";
}

/**
 * RadioGroupItem component props
 */
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /**
   * Label text to display next to the radio button
   */
  label: string;

  /**
   * Optional description to display below the radio button
   */
  description?: string;
}

/**
 * RadioGroup component for selecting a single value from multiple options
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option-1">
 *   <RadioGroup.Item value="option-1" label="Option 1" />
 *   <RadioGroup.Item value="option-2" label="Option 2" />
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      label,
      description,
      error,
      orientation = "vertical",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn(
            "grid gap-2",
            orientation === "horizontal" && "grid-flow-col auto-cols-max",
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * RadioGroupItem component representing a single radio button
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, id, label, description, ...props }, ref) => {
  const generatedId = React.useId();
  const itemId = id || generatedId;

  return (
    <div className="flex items-start space-x-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={itemId}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      <div className="space-y-1 leading-none">
        <label
          htmlFor={itemId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
// Define the compound component type
type RadioGroupCompound = typeof RadioGroup & {
  Item: typeof RadioGroupItem;
};

// Cast RadioGroup to the compound component type
(RadioGroup as RadioGroupCompound).Item = RadioGroupItem;

export { RadioGroup, RadioGroupItem };
