import * as React from "react";
import { StandardDialog, StandardDialogProps } from "./StandardDialog";
import { StandardForm } from "@/core/components/ui/composed/base-form";
import { Button } from "@/core/components/ui/primitives/button";
import { DialogFooter } from "@/core/components/ui/primitives/dialog";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "@/shared/utils";
import {
  UseFormReturn,
  Control,
  FieldValues,
} from "react-hook-form";

/**
 * Props for FormDialog component
 */
export interface FormDialogProps<TFormValues extends FieldValues>
  extends Omit<StandardDialogProps, "actions" | "children"> {
  /**
   * Form schema for validation
   */
  schema: z.ZodType<TFormValues>;

  /**
   * Default values for the form
   */
  defaultValues: Partial<TFormValues>;

  /**
   * Callback fired when the form is submitted
   * @returns Promise<boolean> indicating success or failure
   */
  onSubmit: (data: TFormValues) => Promise<boolean>;

  /**
   * Form content render function
   */
  children: (props: { control: Control<TFormValues> }) => React.ReactNode;

  /**
   * Text for the submit button
   * @default "Save"
   */
  submitText?: string;

  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * Whether the form is currently submitting
   * @default false
   */
  isSubmitting?: boolean;

  /**
   * Whether to prevent closing the dialog when submitting
   * @default true
   */
  preventCloseOnSubmit?: boolean;

  /**
   * Additional class name for the form
   */
  formClassName?: string;
}

/**
 * FormDialog component
 *
 * A specialized dialog component for forms that combines StandardDialog with StandardForm
 * to create a consistent form dialog pattern throughout the application.
 *
 * @example
 * ```tsx
 * <FormDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Create New Item"
 *   schema={itemSchema}
 *   defaultValues={defaultValues}
 *   onSubmit={handleSubmit}
 * >
 *   {({ control }) => (
 *     <>
 *       <FormField
 *         control={control}
 *         name="name"
 *         render={({ field }) => (
 *           <FormItem>
 *             <FormLabel>Name</FormLabel>
 *             <FormControl>
 *               <Input {...field} />
 *             </FormControl>
 *             <FormMessage />
 *           </FormItem>
 *         )}
 *       />
 *     </>
 *   )}
 * </FormDialog>
 * ```
 */
export function FormDialog<TFormValues extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  children,
  submitText,
  cancelText,
  isSubmitting = false,
  preventCloseOnSubmit = true,
  className,
  formClassName,
  showCloseButton = true,
  maxWidth,
  size = "md",
  position = "center",
}: FormDialogProps<TFormValues>) {
  const { t } = useTranslation();

  // Handle form submission
  const handleSubmit = async (data: TFormValues) => {
    try {
      const success = await onSubmit(data);
      if (success && !preventCloseOnSubmit) {
        onOpenChange(false);
      }
      return success;
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    }
  };

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className={className}
      showCloseButton={showCloseButton}
      maxWidth={maxWidth}
      size={size}
      position={position}
    >
      <StandardForm
        schema={schema}
        defaultValues={defaultValues as TFormValues}
        onSubmit={handleSubmit}
        className={cn("py-4", formClassName)}
        footer={
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelText || t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("common.saving", "Saving...")
                : submitText || t("common.save", "Save")}
            </Button>
          </DialogFooter>
        }
        isSubmitting={isSubmitting}
      >
        {(methods: UseFormReturn<FieldValues>) =>
          children({ control: methods.control as Control<TFormValues> })
        }
      </StandardForm>
    </StandardDialog>
  );
}
