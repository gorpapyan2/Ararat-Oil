import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/utils/cn';

/**
 * Switch component props
 */
export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /**
   * Label to display next to the switch
   */
  label?: string;
  
  /**
   * Which side of the switch to display the label
   */
  labelPosition?: 'start' | 'end';
  
  /**
   * Description text to display below the switch
   */
  description?: string;
  
  /**
   * Size variant of the switch
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the switch is in an error state
   */
  error?: boolean;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
}

/**
 * Switch component for toggling between on and off states
 * 
 * @example
 * ```tsx
 * <Switch />
 * <Switch label="Dark mode" />
 * <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ 
  className, 
  label, 
  labelPosition = 'end',
  description,
  size = 'md',
  error,
  errorMessage,
  ...props 
}, ref) => {
  const id = React.useId();
  
  const sizeMap = {
    sm: {
      container: 'h-4 w-7',
      thumb: 'h-3 w-3',
      thumbTranslate: 'translate-x-3',
    },
    md: {
      container: 'h-5 w-9',
      thumb: 'h-4 w-4',
      thumbTranslate: 'translate-x-4',
    },
    lg: {
      container: 'h-6 w-11',
      thumb: 'h-5 w-5',
      thumbTranslate: 'translate-x-5',
    },
  };
  
  const switchElement = (
    <SwitchPrimitive.Root
      id={id}
      ref={ref}
      className={cn(
        "peer relative rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        error && "border-destructive focus-visible:ring-destructive",
        sizeMap[size].container,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block rounded-full bg-background transition-transform",
          "data-[state=checked]:translate-x-0 data-[state=unchecked]:translate-x-0",
          sizeMap[size].thumb,
          "data-[state=checked]:" + sizeMap[size].thumbTranslate
        )}
      />
    </SwitchPrimitive.Root>
  );
  
  // If no label, just return the switch
  if (!label) {
    return (
      <div className="space-y-2">
        {switchElement}
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {error && errorMessage && (
          <p className="text-xs text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
  
  // Return switch with label
  return (
    <div className="space-y-2">
      <div className={cn(
        "flex items-center gap-2",
        labelPosition === 'start' ? 'flex-row-reverse justify-end' : 'flex-row'
      )}>
        {switchElement}
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive"
          )}
        >
          {label}
        </label>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && errorMessage && (
        <p className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
