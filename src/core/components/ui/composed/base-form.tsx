/**
 * Base form components for standardizing form implementations
 * This file provides shared form patterns to reduce duplication across the codebase
 */
import React from "react";
import { Button } from "@/core/components/ui/buttons/button";
import { cn } from "@/shared/utils";

/**
 * Props for FormActions component
 */
export interface FormActionsProps {
  /** Handler for cancel button click */
  onCancel?: () => void;
  /** Handler for submit button click */
  onSubmit?: () => void;
  /** Cancel button text */
  cancelText?: string;
  /** Submit button text */
  submitText?: string;
  /** Is the form in a loading/submitting state */
  isSubmitting?: boolean;
  /** Whether to show the cancel button */
  showCancel?: boolean;
  /** Class name for the actions container */
  className?: string;
}

/**
 * Standardized form actions component
 * Reduces duplication across form implementations
 */
export function FormActions({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isSubmitting = false,
  showCancel = true,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-4", className)}>
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      )}
      <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
        {submitText}
      </Button>
    </div>
  );
}

/**
 * Props for FormField component
 */
export interface FormFieldProps {
  /** Label for the form field */
  label: string;
  /** ID for the form field */
  id: string;
  /** Description for the form field */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Children to render inside the form field */
  children: React.ReactNode;
}

/**
 * Standardized form field component
 * Provides a consistent layout for form fields
 */
export function FormField({
  label,
  id,
  description,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
      {children}
    </div>
  );
}
