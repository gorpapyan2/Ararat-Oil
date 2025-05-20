import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/utils/cn';

/**
 * Slider component props
 */
export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * Label for the slider
   */
  label?: string;
  
  /**
   * Description text
   */
  description?: string;
  
  /**
   * Error message to display
   */
  errorMessage?: string;
  
  /**
   * Whether the slider is in an error state
   */
  error?: boolean;
  
  /**
   * Whether to show the current value
   */
  showValue?: boolean;
  
  /**
   * Format function for the displayed value
   * @default (value) => `${value}`
   */
  formatValue?: (value: number) => string;
  
  /**
   * Whether to show markers for steps
   */
  showMarkers?: boolean;
  
  /**
   * Number of markers to show (if showMarkers is true)
   * @default 5
   */
  markerCount?: number;
  
  /**
   * Custom CSS class for markers
   */
  markerClassName?: string;
}

/**
 * Slider component for selecting a numeric value or range
 * 
 * @example
 * ```tsx
 * <Slider defaultValue={[50]} max={100} step={1} />
 * <Slider defaultValue={[25, 75]} max={100} step={5} />
 * <Slider label="Volume" showValue />
 * ```
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  label,
  description,
  error,
  errorMessage,
  showValue = false,
  formatValue = (value: number) => `${value}`,
  showMarkers = false,
  markerCount = 5,
  markerClassName,
  className, 
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props 
}, ref) => {
  const id = React.useId();
  const isRange = (defaultValue || value || []).length > 1;
  const actualValue = value || defaultValue || [min];
  
  // Generate markers positions
  const markers = React.useMemo(() => {
    if (!showMarkers) return [];
    
    const count = Math.min(markerCount, Math.floor((max - min) / step) + 1);
    if (count <= 1) return [];
    
    const markers = [];
    const interval = (max - min) / (count - 1);
    
    for (let i = 0; i < count; i++) {
      markers.push(min + i * interval);
    }
    
    return markers;
  }, [min, max, step, showMarkers, markerCount]);
  
  // Format displayed values
  const displayValues = actualValue.map(formatValue);
  
  return (
    <div className="space-y-2">
      {/* Label and value display */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label 
              htmlFor={id}
              className={cn(
                "text-sm font-medium leading-none",
                error && "text-destructive"
              )}
            >
              {label}
            </label>
          )}
          
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {isRange 
                ? displayValues.join(' - ')
                : displayValues[0]
              }
            </span>
          )}
        </div>
      )}
      
      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {/* Slider with markers */}
      <div className="relative">
        {/* Markers */}
        {showMarkers && markers.length > 0 && (
          <div className="absolute inset-x-0 -top-3 flex justify-between pointer-events-none">
            {markers.map((marker, index) => (
              <div 
                key={index}
                className={cn(
                  "h-2 w-0.5 bg-muted-foreground/50",
                  markerClassName
                )}
              />
            ))}
          </div>
        )}
        
        {/* Actual slider */}
        <SliderPrimitive.Root
          ref={ref}
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track
            className={cn(
              "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
              error && "bg-destructive/20"
            )}
          >
            <SliderPrimitive.Range className={cn(
              "absolute h-full bg-primary",
              error && "bg-destructive"
            )} />
          </SliderPrimitive.Track>
          
          {actualValue.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                error && "border-destructive"
              )}
            />
          ))}
        </SliderPrimitive.Root>
      </div>
      
      {/* Error message */}
      {error && errorMessage && (
        <p className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
