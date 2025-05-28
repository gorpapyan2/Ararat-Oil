/**
 * Loading Button Component
 *
 * An extension of the Button component that handles loading states.
 * Displays a spinner when in loading state and can show loading text.
 */

import * as React from "react";
import { cn } from "@/utils";
import { Button, ButtonProps } from "./button";
import { LoadingProps } from "./types";

// Import the spinner component
// If you need to adjust the import path, please do so
import { Spinner } from "../spinner";

/**
 * Loading Button Props Interface
 */
export interface LoadingButtonProps extends ButtonProps, LoadingProps {}

/**
 * Loading Button Component
 *
 * A button that can show loading state with a spinner.
 * When in loading state, the button is automatically disabled.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [isLoading, setIsLoading] = useState(false);
 *
 * <LoadingButton
 *   isLoading={isLoading}
 *   onClick={async () => {
 *     setIsLoading(true);
 *     await someAsyncOperation();
 *     setIsLoading(false);
 *   }}
 * >
 *   Save Changes
 * </LoadingButton>
 *
 * // With custom loading text
 * <LoadingButton
 *   isLoading={isSubmitting}
 *   loadingText="Submitting..."
 *   type="submit"
 * >
 *   Submit
 * </LoadingButton>
 * ```
 */
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    {
      isLoading = false,
      loadingText,
      children,
      className,
      spinnerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner
              className={cn("mr-2 h-4 w-4", spinnerClassName)}
              aria-hidden="true"
            />
            <span>{loadingText || children}</span>
            {/* Add visually hidden text for screen readers */}
            {!loadingText && <span className="sr-only">Loading</span>}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
