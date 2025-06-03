/**
 * Centralized export point for UI components
 * This allows importing components from a single point, reducing duplication:
 * import { Button, TextField, StandardForm } from '@/core/components/ui';
 */

// Import and re-export individually to avoid naming conflicts
// Base form components
import { StandardForm, FormRow } from "./composed/base-form";
import type { StandardFormProps } from "./composed/base-form";
// Import FormRowProps from the correct location
import type { FormRowProps } from "./types/form-types";

// Base dialog components
import {
  StandardDialog as BaseStandardDialog,
  ConfirmDialog as BaseConfirmDialog,
  DeleteConfirmDialog as BaseDeleteConfirmDialog,
} from "./composed/base-dialog";
import type {
  StandardDialogProps as BaseStandardDialogProps,
  ConfirmDialogProps as BaseConfirmDialogProps,
  DeleteConfirmDialogProps as BaseDeleteConfirmDialogProps,
} from "./composed/base-dialog";

// Import card components from the new card system
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard,
  InfoCard,
  CardGrid,
  CardGroup,
} from "./cards";

// Re-export with clear namespacing
export {
  // Base form components
  StandardForm,
  FormRow,
};

// Re-export type definitions
export type {
  StandardFormProps,
  FormRowProps,
  BaseStandardDialogProps,
  BaseConfirmDialogProps,
  BaseDeleteConfirmDialogProps,
};

// Re-export renamed dialog components
export { BaseStandardDialog, BaseConfirmDialog, BaseDeleteConfirmDialog };

// Re-export card components
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard,
  InfoCard,
  CardGrid,
  CardGroup,
};

// Re-export card component types
export type * from "./cards/types";

// Re-export composed components that don't have conflicts
export * from "./composed/form-fields";
export * from "./composed/dialog";
// Export daterangepicker selectively to avoid conflicts
import { DateRangePicker } from "./composed/daterangepicker";
export { DateRangePicker };
export * from "./composed/datepicker";

// Handle sheet conflicts
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./primitives/sheet";

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};

// Re-export primitive components selectively to avoid conflicts
// Alert dialog components
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./primitives/alert-dialog";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
};

// Continue with other primitives that don't have conflicts or missing modules
export * from "./primitives/accordion";
export * from "./primitives/badge";
export * from "./primitives/button";
export * from "./primitives/calendar";
// Remove old card exports and use the new system instead
// export * from './primitives/card';
export * from "./primitives/checkbox";
export * from "./primitives/context-menu";
export * from "./primitives/dialog";
export * from "./primitives/dropdown-menu";
export * from "./primitives/form";
export * from "./primitives/hover-card";
export * from "./primitives/input";
export * from "./primitives/label";
export * from "./primitives/menubar";
export * from "./primitives/navigation-menu";
export * from "./primitives/popover";
export * from "./primitives/progress";
export * from "./primitives/radio-group";
// Remove missing module references
// export * from './primitives/scroll-area';
export * from "./primitives/select";
// export * from './primitives/separator';
// export * from './primitives/slider';
export * from "./primitives/switch";
export * from "./primitives/table";
export * from "./primitives/tabs";
export * from "./primitives/textarea";
export * from "./primitives/toast";
export * from "./primitives/toggle";
export * from "./primitives/tooltip";

// Main component exports (not primitives)
// export * from "./badge"; // Removed duplicate
export * from "./button";
// export * from "./card"; // Commented out to avoid conflicts with cards system
export * from "./checkbox";
export * from "./input";
export * from "./label";
export * from "./textarea";
