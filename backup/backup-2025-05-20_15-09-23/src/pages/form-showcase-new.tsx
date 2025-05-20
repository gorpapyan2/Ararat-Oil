/**
 * This is a replacement for the form-showcase page that uses bridge components.
 * When the components directory is fully migrated, this file should replace form-showcase.tsx
 */

import { StandardFormExample } from "@/components/examples/StandardFormExample";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/composed/form-fields';
import { Button } from '@/components/ui/button';

export default function FormShowcasePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Form Components Showcase"
        description="Demonstration of all standardized form components"
      />

      <Tabs defaultValue="example">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="example">Complete Example</TabsTrigger>
          <TabsTrigger value="components">Individual Components</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="example" className="mt-6">
          <StandardFormExample />
        </TabsContent>
        
        <TabsContent value="components" className="mt-6">
          <IndividualComponentsShowcase />
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <ApiReference />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IndividualComponentsShowcase() {
  const simpleSchema = z.object({
    text: z.string().min(1, "Required field"),
    select: z.string().min(1, "Please select an option"),
    checkbox: z.boolean(),
    textarea: z.string(),
    date: z.date().optional(),
    currency: z.number().optional(),
    radio: z.string().min(1, "Please select an option"),
    switch: z.boolean()
  });

  const form = useZodForm({
    schema: simpleSchema,
    defaultValues: {
      text: "",
      select: "",
      checkbox: false,
      textarea: "",
      date: undefined,
      currency: undefined,
      radio: "",
      switch: false
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ComponentCard 
        title="FormInput" 
        description="Basic text input component with validation"
      >
        <FormInput
          name="text"
          label="Text Input"
          description="Standard text input field"
          form={form}
          placeholder="Enter some text"
        />
        <Button className="mt-2" onClick={() => form.setFocus("text")}>
          Focus Field
        </Button>
      </ComponentCard>

      <ComponentCard 
        title="FormSelect" 
        description="Dropdown select component"
      >
        <FormSelect
          name="select"
          label="Select Input"
          description="Dropdown select with options"
          form={form}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" }
          ]}
          placeholder="Select an option"
        />
      </ComponentCard>

      <ComponentCard 
        title="FormCheckbox" 
        description="Checkbox component with label"
      >
        <FormCheckbox
          name="checkbox"
          label="Checkbox Input"
          description="Toggle checkbox state"
          form={form}
        />
      </ComponentCard>

      <ComponentCard 
        title="FormTextarea" 
        description="Multi-line text input"
      >
        <FormTextarea
          name="textarea"
          label="Textarea Input"
          description="For longer text content"
          form={form}
          placeholder="Enter multiple lines of text"
          rows={3}
        />
      </ComponentCard>

      <ComponentCard 
        title="FormDatePicker" 
        description="Date selection with calendar popover"
      >
        <FormDatePicker
          name="date"
          label="Date Input"
          description="Select a date from the calendar"
          form={form}
          placeholder="Select a date"
        />
      </ComponentCard>

      <ComponentCard 
        title="FormCurrencyInput" 
        description="Specialized input for currency values"
      >
        <FormCurrencyInput
          name="currency"
          label="Currency Input"
          description="Enter a monetary amount"
          form={form}
          placeholder="0.00"
          symbol="$"
        />
      </ComponentCard>

      <ComponentCard 
        title="FormRadioGroup" 
        description="Radio button group for exclusive selection"
      >
        <FormRadioGroup
          name="radio"
          label="Radio Input"
          description="Select one option from the group"
          form={form}
          options={[
            { value: "radio1", label: "Radio 1" },
            { value: "radio2", label: "Radio 2" },
            { value: "radio3", label: "Radio 3" }
          ]}
          orientation="vertical"
        />
      </ComponentCard>

      <ComponentCard 
        title="FormSwitch" 
        description="Toggle switch component"
      >
        <FormSwitch
          name="switch"
          label="Switch Input"
          description="Toggle switch state with label"
          form={form}
          switchLabel="Active"
        />
      </ComponentCard>
    </div>
  );
}

function ComponentCard({ title, description, children }: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ApiReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Components API Reference</CardTitle>
        <CardDescription>
          Common props and usage patterns for all form components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Common Props</h3>
          <div className="border rounded-md p-4">
            <ul className="space-y-2">
              <li><code className="font-mono bg-secondary p-1 rounded-sm">name</code>: Field name (required)</li>
              <li><code className="font-mono bg-secondary p-1 rounded-sm">label</code>: Field label text</li>
              <li><code className="font-mono bg-secondary p-1 rounded-sm">description</code>: Additional descriptive text</li>
              <li><code className="font-mono bg-secondary p-1 rounded-sm">form</code>: React Hook Form instance</li>
              <li><code className="font-mono bg-secondary p-1 rounded-sm">className</code>: Optional class for the form item container</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Form Hooks</h3>
          <div className="border rounded-md p-4">
            <p className="mb-2"><code className="font-mono bg-secondary p-1 rounded-sm">useZodForm</code></p>
            <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-sm">
{`const form = useZodForm({
  schema: mySchema,
  defaultValues: {
    fieldName: initialValue
  }
});`}
            </pre>
            
            <p className="mt-4 mb-2"><code className="font-mono bg-secondary p-1 rounded-sm">useFormContext</code></p>
            <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-sm">
{`import { useFormContext } from "react-hook-form";

function ChildComponent() {
  const form = useFormContext();
  // Now you can access form methods
}`}
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Form Submission</h3>
          <div className="border rounded-md p-4">
            <pre className="bg-secondary p-3 rounded-md overflow-x-auto text-sm">
{`function onSubmit(values) {
  // Handle form submission
}

<form onSubmit={form.handleSubmit(onSubmit)}>
  {/* Form fields */}
  <Button type="submit">Submit</Button>
</form>`}
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Field-Specific Props</h3>
          <div className="border rounded-md p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-1">FormInput</h4>
              <ul className="ml-4 space-y-1 text-sm">
                <li><code className="font-mono bg-secondary p-1 rounded-sm">type</code>: Input type (text, password, email, etc.)</li>
                <li><code className="font-mono bg-secondary p-1 rounded-sm">placeholder</code>: Placeholder text</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">FormSelect</h4>
              <ul className="ml-4 space-y-1 text-sm">
                <li><code className="font-mono bg-secondary p-1 rounded-sm">options</code>: Array of {`{ value, label }`} objects</li>
                <li><code className="font-mono bg-secondary p-1 rounded-sm">placeholder</code>: Placeholder text</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">FormCurrencyInput</h4>
              <ul className="ml-4 space-y-1 text-sm">
                <li><code className="font-mono bg-secondary p-1 rounded-sm">symbol</code>: Currency symbol ($, €, etc.)</li>
                <li><code className="font-mono bg-secondary p-1 rounded-sm">allowNegative</code>: Allow negative values</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 