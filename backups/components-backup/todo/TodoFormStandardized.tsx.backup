import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/useZodForm";
import { FormProvider } from "react-hook-form";

// Define the form schema using Zod
const todoSchema = z.object({
  text: z.string().min(1, "Task description is required"),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
});

// Type for the form values from the schema
export type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormStandardizedProps {
  onSubmit: (data: TodoFormValues) => void;
  initialValues?: Partial<TodoFormValues>;
  submitButtonText?: string;
}

export function TodoFormStandardized({
  onSubmit,
  initialValues,
  submitButtonText = "Add Task",
}: TodoFormStandardizedProps) {
  // Priority options
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // Initialize form with the schema and default values
  const form = useZodForm({
    schema: todoSchema,
    defaultValues: {
      text: initialValues?.text || "",
      priority: initialValues?.priority || "medium",
    },
  });

  // Form submission handler with loading state
  const { handleSubmit, isSubmitting } = useFormSubmitHandler<TodoFormValues>(
    (data) => {
      onSubmit(data);
      if (!initialValues) {
        form.reset({ text: "", priority: "medium" });
      }
    }
  );

  return (
    <FormProvider {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow">
            <FormInput
              name="text"
              label="Task"
              form={form}
              placeholder="What needs to be done?"
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-32">
            <FormSelect
              name="priority"
              label="Priority"
              form={form}
              options={priorityOptions}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
} 