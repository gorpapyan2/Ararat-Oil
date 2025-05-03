import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormSelect, FormCheckbox, FormTextarea, FormSwitch, FormRadioGroup } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/useZodForm";
import { emailSchema, requiredString, phoneSchema } from "@/lib/schemas/common";
import { useToast } from "@/hooks";

// Define the form schema using Zod
const formSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: emailSchema,
  phone: phoneSchema,
  department: z.string().min(1, "Please select a department"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  receiveCommunications: z.boolean(),
  preferredContact: z.enum(["email", "phone", "mail"], {
    required_error: "Please select a preferred contact method",
  }),
  notifications: z.boolean().default(false),
});

// Type for the form values from the schema
type ContactFormValues = z.infer<typeof formSchema>;

export function FormExample() {
  const { toast } = useToast();
  
  // Initialize the form with the schema
  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      message: "",
      receiveCommunications: false,
      preferredContact: "email",
      notifications: false,
    },
  });
  
  // Form submission handler
  const { handleSubmit, isSubmitting } = useFormSubmitHandler<ContactFormValues>(
    async (data) => {
      // Simulate a form submission
      console.log("Form submitted with data:", data);
      
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success toast
      toast({
        title: "Form submitted",
        description: "Your message has been received.",
      });
      
      // Reset the form
      form.reset();
    },
    {
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    }
  );
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Form</CardTitle>
        <CardDescription>
          Fill out this form to send us a message. We'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="firstName"
              label="First Name"
              form={form}
              placeholder="John"
            />
            <FormInput
              name="lastName"
              label="Last Name"
              form={form}
              placeholder="Doe"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="email"
              label="Email"
              type="email"
              form={form}
              placeholder="john.doe@example.com"
            />
            <FormInput
              name="phone"
              label="Phone"
              form={form}
              placeholder="+1234567890"
            />
          </div>
          
          <FormSelect
            name="department"
            label="Department"
            form={form}
            options={[
              { value: "sales", label: "Sales" },
              { value: "support", label: "Support" },
              { value: "billing", label: "Billing" },
              { value: "other", label: "Other" },
            ]}
            placeholder="Select a department"
          />
          
          <FormTextarea
            name="message"
            label="Message"
            form={form}
            placeholder="How can we help you?"
            rows={4}
          />
          
          <FormRadioGroup
            name="preferredContact"
            label="Preferred Contact Method"
            form={form}
            options={[
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "mail", label: "Mail" },
            ]}
            orientation="horizontal"
          />
          
          <FormCheckbox
            name="receiveCommunications"
            form={form}
            checkboxLabel="I agree to receive communications from the company"
            description="We'll never share your information with anyone else."
          />
          
          <FormSwitch
            name="notifications"
            label="Notifications"
            form={form}
            switchLabel="Receive notifications about your request"
            description="We'll send you updates about your request"
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
} 