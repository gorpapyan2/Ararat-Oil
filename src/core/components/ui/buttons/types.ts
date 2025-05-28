/**
 * Button Components - Shared Types
 *
 * This file contains common types and interfaces used across all button components.
 */

import * as React from "react";

/**
 * Available color variants for buttons
 * Matches the variants defined in the buttonVariants CVA in button.tsx
 */
export type ButtonColorVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

/**
 * Available size variants for buttons
 * Matches the sizes defined in the buttonVariants CVA in button.tsx
 */
export type ButtonSizeVariant = "default" | "sm" | "lg" | "icon";

/**
 * Icon position options for buttons that contain both text and icons
 */
export type ButtonIconPosition = "start" | "end";

/**
 * Common props related to loading states
 */
export interface LoadingProps {
  /**
   * Whether the button is currently in a loading state
   */
  isLoading?: boolean;

  /**
   * Text to display when in loading state (defaults to children)
   */
  loadingText?: string;

  /**
   * Additional class name to apply to the loading indicator
   */
  spinnerClassName?: string;
}

/**
 * Common props related to icons in buttons
 */
export interface IconProps {
  /**
   * The icon to display in the button
   */
  icon: React.ReactNode;

  /**
   * Accessible label for icon-only buttons (required when children not provided)
   */
  label?: string;

  /**
   * Position of the icon relative to the text
   * @default "start"
   */
  iconPosition?: ButtonIconPosition;
}

/**
 * Common props for toggle buttons
 */
export interface ToggleProps {
  /**
   * Whether the toggle is pressed/active
   */
  pressed?: boolean;

  /**
   * Callback when toggle state changes
   */
  onPressedChange?: (pressed: boolean) => void;
}
