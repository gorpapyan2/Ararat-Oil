/**
 * Centralized export point for UI components
 * This allows importing components from a single point, reducing duplication:
import { Button } from '@/core/components/ui';
 */

/**
 * Optimized UI components index for better tree-shaking and bundle size
 * Using selective imports instead of wildcard exports to reduce unused code inclusion
 */

// Core primitive components - selective exports only
export {
  Button,
  buttonVariants,
  type ButtonProps
} from "./button";

export {
  Input,
  type InputProps
} from "./input";

export {
  Label
} from "./label";

export {
  Textarea
} from "./textarea";

export {
  Checkbox
} from "./checkbox";

// Dialog components - essential exports only
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./dialog";

// Form components
export {
  StandardizedForm
} from "./StandardizedForm";

// Card components - using new standardized system
export * from "./cards";

// Button variants - only what exists
export {
  IconButton,
  LoadingButton,
  type IconButtonProps,
  type LoadingButtonProps
} from "./buttons";

// Utility components - commonly used
export {
  Spinner
} from "./spinner";

export {
  Skeleton
} from "./skeleton";

export {
  Toast
} from "./toast";

// Only export what's actually needed for tree-shaking optimization
// Removed all problematic and non-existent exports
