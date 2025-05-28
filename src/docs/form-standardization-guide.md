# Form Standardization Guide

This guide outlines our standardized approach to forms in the application.

## Core Components

All form components follow a consistent API pattern:

- `name`: Field name (required)
- `label`: Field label text
- `description`: Additional descriptive text
- `form`: The React Hook Form instance
- `className`: Optional class for the form item container

### FormInput

A standardized text input field with validation.

```tsx
<FormInput
  name="username"
  label="Username"
  description="Your unique username"
  form={form}
  type="text"
  placeholder="Enter your username"
  autoComplete="username"
  inputClassName="w-full"
/>
```

Additional props:

- `type`: Input type (text, email, password, etc.)
- `placeholder`: Placeholder text
- `autoComplete`: HTML autocomplete attribute
- `inputClassName`: Class applied to the input element

### FormSelect

A dropdown select component with options.

```tsx
<FormSelect
  name="country"
  label="Country"
  description="Select your country"
  form={form}
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
  ]}
  placeholder="Select a country"
  selectClassName="w-full"
/>
```

Additional props:

- `options`: Array of options with value and label
- `placeholder`: Placeholder text
- `selectClassName`: Class applied to the select element

### FormCheckbox

A checkbox component with label.

```tsx
<FormCheckbox
  name="terms"
  label="I agree to the terms and conditions"
  description="You must agree to continue"
  form={form}
  disabled={false}
/>
```

Additional props:

- `disabled`: Whether the checkbox is disabled

### FormTextarea

A multi-line text input.

```tsx
<FormTextarea
  name="bio"
  label="Biography"
  description="Tell us about yourself"
  form={form}
  placeholder="Enter your bio"
  rows={4}
  textareaClassName="w-full"
/>
```

Additional props:

- `placeholder`: Placeholder text
- `rows`: Number of visible text rows
- `textareaClassName`: Class applied to the textarea element

### FormSwitch

A toggle switch component.

```tsx
<FormSwitch
  name="notifications"
  label="Notifications"
  description="Receive email notifications"
  form={form}
  switchLabel="Enabled"
/>
```

Additional props:

- `switchLabel`: Label text for the switch state

### FormRadioGroup

A group of radio buttons.

```tsx
<FormRadioGroup
  name="plan"
  label="Subscription Plan"
  description="Select your preferred plan"
  form={form}
  options={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" },
  ]}
  orientation="vertical"
/>
```

Additional props:

- `options`: Array of options with value and label
- `orientation`: Layout direction ("horizontal" or "vertical")

### FormCurrencyInput

A specialized input for currency values.

```tsx
<FormCurrencyInput
  name="amount"
  label="Amount"
  description="Enter payment amount"
  form={form}
  placeholder="0.00"
  symbol="$"
  disabled={false}
  inputClassName="w-full"
/>
```

Additional props:

- `placeholder`: Placeholder text
- `symbol`: Currency symbol to display
- `disabled`: Whether the input is disabled
- `inputClassName`: Class applied to the input element

### FormDatePicker

A date picker with calendar popover.

```tsx
<FormDatePicker
  name="birthdate"
  label="Date of Birth"
  description="Select your birthdate"
  form={form}
  placeholder="Select date"
  disabled={(date) => date > new Date()}
  buttonClassName="w-full"
/>
```

Additional props:

- `placeholder`: Placeholder text
- `disabled`: Function to determine disabled dates
- `buttonClassName`: Class applied to the date picker button

## Hooks and Utilities

### useZodForm

A hook that combines React Hook Form with Zod schema validation.

```tsx
const formSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useZodForm({
  schema: formSchema,
  defaultValues: {
    username: "",
    email: "",
    password: "",
  },
});
```

### useFormSubmitHandler

A hook that handles form submission with loading state.

```tsx
const { isSubmitting, onSubmit } = useFormSubmitHandler(form, async (data) => {
  // Submit data to API
  await api.createUser(data);
});

return (
  <form onSubmit={onSubmit}>
    {/* Form fields */}
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </Button>
  </form>
);
```

## Complete Example

```tsx
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.string().min(1),
  bio: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm() {
  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      email: "",
      role: "",
      bio: "",
      terms: false,
    },
  });

  const { isSubmitting, onSubmit } = useFormSubmitHandler<FormValues>(
    form,
    async (data) => {
      // Submit data
      console.log(data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormInput
        name="name"
        label="Full Name"
        description="Your legal full name"
        form={form}
        placeholder="John Doe"
      />

      <FormInput
        name="email"
        label="Email Address"
        form={form}
        type="email"
        placeholder="john@example.com"
      />

      <FormSelect
        name="role"
        label="Role"
        form={form}
        options={[
          { value: "user", label: "User" },
          { value: "admin", label: "Administrator" },
          { value: "manager", label: "Manager" },
        ]}
      />

      <FormTextarea
        name="bio"
        label="Biography"
        description="A short description about yourself"
        form={form}
        placeholder="Tell us about yourself"
        rows={4}
      />

      <FormCheckbox
        name="terms"
        label="I agree to the terms and conditions"
        form={form}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Account"}
      </Button>
    </form>
  );
}
```

## Accessibility Considerations

All form components are built with accessibility in mind:

1. Use labels for all form fields
2. Provide clear error messages
3. Add descriptions for complex fields
4. Ensure keyboard navigation works
5. Use ARIA attributes appropriately

## Validation Messages

Error messages from Zod validation will be displayed below each field. To customize error messages, provide them in your Zod schema:

```tsx
const schema = z.object({
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .min(18, "You must be at least 18 years old"),
});
```

## Example Form

See `src/components/examples/FormExample.tsx` for a complete example of a form using all the standardized components.
