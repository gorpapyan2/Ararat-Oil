import * as React from "react";

/**
 * Props for the ButtonPrimitive component.
 * This is the basic button without styling.
 */
export interface ButtonPrimitiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Forward ref to the root button element
   */
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

/**
 * Base primitive Button component
 * Handles basic button functionality without styling
 */
export const ButtonPrimitive = React.forwardRef<HTMLButtonElement, ButtonPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
ButtonPrimitive.displayName = "ButtonPrimitive";

/**
 * Props for the AnchorButtonPrimitive component.
 * This is for link elements that should look like buttons.
 */
export interface AnchorButtonPrimitiveProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Forward ref to the root anchor element
   */
  ref?: React.ForwardedRef<HTMLAnchorElement>;
}

/**
 * Base primitive Anchor Button component
 * For creating anchor links styled as buttons
 */
export const AnchorButtonPrimitive = React.forwardRef<HTMLAnchorElement, AnchorButtonPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return <a ref={ref} className={className} {...props} />;
  }
);
AnchorButtonPrimitive.displayName = "AnchorButtonPrimitive";

/**
 * Props for the LoadingSpinnerPrimitive component.
 */
export interface LoadingSpinnerPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the root spinner element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Loading Spinner component for buttons
 */
export const LoadingSpinnerPrimitive = React.forwardRef<HTMLDivElement, LoadingSpinnerPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={className}
        {...props}
      />
    );
  }
);
LoadingSpinnerPrimitive.displayName = "LoadingSpinnerPrimitive"; 