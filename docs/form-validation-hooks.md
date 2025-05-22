# Form Validation Hooks

This document outlines the standardized form validation hooks available in the application. These hooks provide consistent validation patterns, error handling, and schema definitions across all forms.

## Overview

Our form validation system consists of several specialized hooks that work together to provide a comprehensive solution:

1. `useFormValidation` - The main entry point that combines all other hooks
2. `useZodForm` - Integrates React Hook Form with Zod validation
3. `useFormSubmitHandler` - Handles form submission with loading states and error handling
4. `useCommonValidation` - Provides common validation patterns for standard field types
5. `useFieldValidation` - Specialized validation for complex fields (credit cards, postal codes, etc.)
6. `useFormSchemas` - Pre-built schemas for common form types (login, registration, etc.)

## Benefits of Using These Hooks

- 🔄 **Reduced Duplication**: Common validation patterns defined in one place
- 🔒 **Improved Type Safety**: Full TypeScript support with proper type inference
- 🌐 **Internationalization**: All error messages support i18n through react-i18next
- 📱 **Consistent UX**: Standardized form behavior and error handling
- 🔄 **Reusability**: Easy to compose and reuse validation logic

## Quick Start

```tsx
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";

// Define your form schema using Zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Use the hook in your component
function LoginForm() {
  const { 
    form, 
    isSubmitting, 
    formError, 
    handleSubmit,
  } = useFormValidation({
    schema: formSchema,
    defaultValues: { email: "", password: "" },
    onSubmit: async (data) => {
      await loginUser(data);
    },
    submitOptions: {
      successMessage: "Welcome back!",
      resetOnSuccess: true,
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="error">{formError}</div>}
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
```

## Detailed API Reference

### useFormValidation

The main hook that integrates all validation functionality.

```tsx
const {
  form,                 // React Hook Form instance
  isSubmitting,         // Boolean indicating submission state
  formError,            // Form-level error message
  setFormError,         // Function to set form error manually
  clearError,           // Function to clear form error
  handleSubmit,         // Form submission handler
  validation,           // Access to validation utilities
} = useFormValidation({
  schema,               // Zod schema
  defaultValues,        // Default form values
  onSubmit,             // Submit handler function
  formOptions,          // Additional React Hook Form options
  submitOptions,        // Options for submission handling
});
```

### useCommonValidation

Provides common validation patterns for standard form fields.

```tsx
const {
  requiredString,      // Creates a required string schema with min length
  email,               // Email validation
  password,            // Password validation with requirements
  confirmPassword,     // Password confirmation that matches another field
  phoneNumber,         // Phone number validation
  number,              // Number validation with min/max
  date,                // Date validation with constraints
  checkedBox,          // Checkbox that must be checked
  conditionalField,    // Field that is conditionally required
} = useCommonValidation();

// Example usage
const schema = z.object({
  name: requiredString(2, "name"),
  email: email(),
  password: password(8),
  confirmPassword: confirmPassword("password"),
});
```

### useFieldValidation

Specialized validation for complex field types.

```tsx
const {
  validateCreditCard,   // Function to validate credit card numbers
  creditCardSchema,     // Credit card validation schema
  expirationDateSchema, // Card expiration date schema (MM/YY)
  cvvSchema,            // CVV code validation
  urlSchema,            // URL validation with optional HTTPS requirement
  postalCodeSchema,     // Postal/ZIP code validation with country support
  idSchema,             // Custom identifier validation
  dateRangeSchema,      // Date validation with range constraints
} = useFieldValidation();

// Example usage
const schema = z.object({
  cardNumber: creditCardSchema(),
  expirationDate: expirationDateSchema(),
  cvv: cvvSchema("other"), // or "amex" for 4-digit CVV
  website: urlSchema({ requireHttps: true }),
});
```

### useFormSchemas

Provides pre-built schemas for common form types.

```tsx
const {
  loginSchema,           // Login form schema
  registrationSchema,    // Registration form schema
  profileSchema,         // Profile form schema
  passwordChangeSchema,  // Password change form schema
  addressSchema,         // Address form schema
  paymentSchema,         // Payment method form schema
} = useFormSchemas();

// Example usage
const loginForm = useFormValidation({
  schema: loginSchema(),
  defaultValues: {
    email: "",
    password: "",
    rememberMe: false,
  },
  onSubmit: handleLogin,
});
```

## Best Practices

1. **Prefer Pre-built Schemas**: Use `useFormSchemas()` for common form types instead of creating schemas from scratch.

2. **Use Translated Error Messages**: All validation hooks support i18n. Make sure your translation files include the necessary validation messages.

3. **Composition Over Configuration**: Compose smaller schemas into larger ones for complex forms:

   ```tsx
   const schema = z.object({
     ...addressSchema().shape,
     ...paymentSchema().shape,
     additionalInfo: z.string().optional(),
   });
   ```

4. **Keep Validation Close to UI**: Define form schemas in the same file as the form component when possible.

5. **Common Validation Patterns**: Use the common validation patterns for consistency:

   ```tsx
   // Instead of this:
   z.string().min(1, "Required").email("Invalid email")
   
   // Use this:
   validation.email()
   ```

## Advanced Usage Examples

### Conditional Validation

```tsx
const schema = z.object({
  hasCreditCard: z.boolean(),
  creditCardNumber: z.string().optional()
    .refine(
      (val, ctx) => {
        if (ctx.parent.hasCreditCard) {
          return !!val;
        }
        return true;
      },
      { message: "Credit card number is required" }
    ),
});
```

### Dynamic Form Schema

```tsx
function useProductForm(productType: 'physical' | 'digital') {
  const { requiredString } = useCommonValidation();
  
  const baseSchema = z.object({
    name: requiredString(2, "name"),
    price: z.number().min(0),
  });
  
  const physicalSchema = z.object({
    weight: z.number().min(0),
    dimensions: z.string(),
    stockQuantity: z.number().int().min(0),
  });
  
  const digitalSchema = z.object({
    fileSize: z.number().min(0),
    downloadLink: z.string().url(),
  });
  
  const schema = productType === 'physical'
    ? baseSchema.merge(physicalSchema)
    : baseSchema.merge(digitalSchema);
    
  return useFormValidation({
    schema,
    // ...other options
  });
}
```

## Common Patterns

### Form with Server Validation Errors

```tsx
const { form, handleSubmit, setFormError } = useFormValidation({
  schema,
  onSubmit: async (data) => {
    try {
      await submitToServer(data);
    } catch (error) {
      // Display server validation errors
      if (error.code === 'validation_error') {
        // Set form-level error
        setFormError(error.message);
        
        // Set field-level errors
        error.fields?.forEach((field) => {
          form.setError(field.name, {
            type: 'server',
            message: field.message,
          });
        });
      }
    }
  },
});
```

### Multi-step Form Validation

```tsx
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const { validation } = useFormValidation({ /* ... */ });
  
  // Define schemas for each step
  const stepSchemas = {
    1: z.object({
      name: validation.common.requiredString(2, "name"),
      email: validation.common.email(),
    }),
    2: z.object({
      address: validation.schemas.addressSchema(),
    }),
    3: z.object({
      payment: validation.schemas.paymentSchema(),
    }),
  };
  
  // Validate current step only
  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[step];
    const isValid = await form.trigger();
    
    if (isValid) {
      setStep(step + 1);
    }
  };
  
  // Full form submission on last step
  const onSubmit = async (data) => {
    if (step === 3) {
      await submitFullForm(data);
    } else {
      validateCurrentStep();
    }
  };
  
  // ...render step-specific fields
}
```

## Troubleshooting

### Common Issues

1. **Type Inference Not Working**:
   - Make sure you're using the generic parameter correctly: `useFormValidation<typeof mySchema>(...)`
   - Check that your schema is properly defined with `z.object({})`

2. **Validation Not Triggering**:
   - Ensure the form field name matches the schema property
   - Check that you're using `form.control` in the `FormField` component

3. **Custom Validation Not Working**:
   - For complex validation needs, use Zod's `.refine()` or `.superRefine()` methods
   - Check parent values with `ctx.parent` in refinements

### Schema Debugging

To debug Zod schemas, use the `.safeParse()` method:

```tsx
const result = mySchema.safeParse(data);
if (!result.success) {
  console.log('Validation errors:', result.error.format());
}
```

## Migration Guide

If you're migrating existing forms to use these hooks:

1. Replace direct `useForm` calls with `useZodForm` or `useFormValidation`
2. Move validation schemas to use the common patterns
3. Replace manual submission handling with `useFormSubmitHandler`
4. Update error handling to use the `formError` state 