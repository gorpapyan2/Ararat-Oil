import React from 'react';
import { z } from "zod";
import { useZodForm } from "@/hooks/use-form";
import { 
  FormInput, 
  FormSelect, 
  FormCheckbox, 
  FormTextarea,
  FormDatePicker,
  FormCurrencyInput,
  FormRadioGroup,
  FormSwitch
} from '@/core/components/ui/composed/form-fields';
import { Button } from "@/core/components/ui/primitives/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/primitives/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  startDate: z.date({ required_error: "Please select a start date" }),
  salary: z.number({ required_error: "Please enter a salary amount" }),
  department: z.string().min(1, "Please select a department"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  notifications: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StandardFormExample() {
  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      email: "",
      role: "",
      description: "",
      startDate: undefined,
      salary: undefined,
      department: "",
      agreeToTerms: false,
      notifications: false,
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Form submitted with values:", values);
    alert("Form submitted! Check console for values.");
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Employee Information Form</CardTitle>
        <CardDescription>
          Enter employee details to add them to the system.
          All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="employee-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              name="name"
              label="Full Name"
              description="Employee's full legal name"
              placeholder="John Doe"
              required
              form={form}
            />

            <FormInput
              name="email"
              label="Email Address"
              description="Work email address"
              placeholder="john.doe@company.com"
              required
              form={form}
            />

            <FormSelect
              name="role"
              label="Job Role"
              description="Current position within the company"
              required
              form={form}
              options={[
                { value: "developer", label: "Developer" },
                { value: "designer", label: "Designer" },
                { value: "manager", label: "Manager" },
                { value: "admin", label: "Administrator" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select a role"
            />

            <FormDatePicker
              name="startDate"
              label="Start Date"
              description="First day of employment"
              required
              form={form}
              placeholder="Select date"
            />

            <FormCurrencyInput
              name="salary"
              label="Annual Salary"
              description="Base salary without bonuses"
              required
              form={form}
              placeholder="0.00"
              symbol="$"
            />

            <FormRadioGroup
              name="department"
              label="Department"
              description="Primary department alignment"
              required
              form={form}
              options={[
                { value: "engineering", label: "Engineering" },
                { value: "design", label: "Design" },
                { value: "marketing", label: "Marketing" },
                { value: "sales", label: "Sales" },
                { value: "support", label: "Support" },
              ]}
              orientation="vertical"
            />
          </div>

          <FormTextarea
            name="description"
            label="Job Description"
            description="Brief overview of responsibilities"
            placeholder="Enter job responsibilities and key objectives"
            required
            form={form}
            rows={4}
          />

          <div className="space-y-4">
            <FormCheckbox
              name="agreeToTerms"
              label="Terms and Conditions"
              description="I confirm that the information provided is accurate"
              required
              form={form}
            />

            <FormSwitch
              name="notifications"
              label="Email Notifications"
              description="Receive updates about payroll and benefits"
              form={form}
              switchLabel="Enabled"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset Form
        </Button>
        <Button type="submit" form="employee-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
} 