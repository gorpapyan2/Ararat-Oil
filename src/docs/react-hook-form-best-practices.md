# React Hook Form Best Practices

## Common Error: "Cannot destructure property 'getFieldState' of 'useFormContext(...)' as it is null"

This error occurs when form components that use `useFormContext()` are rendered without being wrapped in a `FormProvider` component. All form field components in our UI library depend on this context being available.

## How to Fix the Error

### Option 1: Use the StandardizedForm Component (Recommended)

We've created a `StandardizedForm` component that automatically wraps your form with the appropriate `FormProvider`:

```tsx
import { StandardizedForm } from "@/components/ui/composed/StandardizedForm";

function MyForm() {
  const form = useZodForm({
    schema: mySchema,
    defaultValues: { name: "" },
  });

  const handleSubmit = (data) => {
    // Handle form submission
  };

  return (
    <StandardizedForm form={form} onSubmit={handleSubmit} className="space-y-4">
      <FormInput name="name" label="Name" form={form} />
      <Button type="submit">Submit</Button>
    </StandardizedForm>
  );
}
```

### Option 2: Add FormProvider Manually

If you need more control over your form, wrap your form with `FormProvider` manually:

```tsx
import { FormProvider } from "react-hook-form";

function MyForm() {
  const form = useZodForm({
    schema: mySchema,
    defaultValues: { name: "" },
  });

  const handleSubmit = (data) => {
    // Handle form submission
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput name="name" label="Name" form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
```

## When to Use FormProvider

You need to include a `FormProvider` whenever:

1. You're using form components from our UI library (FormInput, FormSelect, etc.)
2. You have nested components that need access to the form context
3. You're using useFormContext() anywhere in your component tree

## Troubleshooting Tips

If you encounter the "Cannot destructure property 'getFieldState'" error:

1. Check if your form is wrapped with `FormProvider` or `StandardizedForm`
2. Verify that you're passing the form object correctly to `FormProvider` with spread syntax: `{...form}`
3. Make sure any nested components that use form fields are within the `FormProvider`

## Root Cause Analysis

This error occurs because:

1. Our form field components use `useFormContext()` internally to access form state
2. Without a `FormProvider` higher up in the component tree, `useFormContext()` returns null
3. Attempting to destructure properties from null produces the error
