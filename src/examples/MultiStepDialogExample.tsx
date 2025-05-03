import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StandardDialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { z } from "zod";
import { useDialog } from "@/hooks/useDialog";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

// Define schemas for each step
const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const step2Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
});

const step3Schema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  otherDetails: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

// Combined schema type for the final form data
type MultiStepFormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
];

const interestOptions = [
  { value: "software_development", label: "Software Development" },
  { value: "data_science", label: "Data Science" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
];

export function MultiStepDialogExample() {
  // Dialog state
  const [activeTab, setActiveTab] = useState("basic");
  
  // Create a hook-based form version
  const hookDialog = useMultiStepDialog();
  
  // Create a basic version
  const basicDialog = useDialog();
  const [basicStep, setBasicStep] = useState(1);
  const [basicFormData, setBasicFormData] = useState<Partial<MultiStepFormData>>({});
  
  // Form for step 1
  const step1Form = useZodForm({
    schema: step1Schema,
    defaultValues: {
      firstName: basicFormData.firstName || "",
      lastName: basicFormData.lastName || "",
      email: basicFormData.email || "",
    },
  });
  
  // Form for step 2
  const step2Form = useZodForm({
    schema: step2Schema,
    defaultValues: {
      companyName: basicFormData.companyName || "",
      jobTitle: basicFormData.jobTitle || "",
      industry: basicFormData.industry || "",
    },
  });
  
  // Form for step 3
  const step3Form = useZodForm({
    schema: step3Schema,
    defaultValues: {
      interests: basicFormData.interests || [],
      otherDetails: basicFormData.otherDetails || "",
      termsAccepted: basicFormData.termsAccepted || false,
    },
  });
  
  // Handle step 1 submission
  const { onSubmit: handleStep1Submit } = useFormSubmitHandler(
    step1Form,
    (data) => {
      setBasicFormData((prev) => ({ ...prev, ...data }));
      setBasicStep(2);
      return true;
    }
  );
  
  // Handle step 2 submission
  const { onSubmit: handleStep2Submit } = useFormSubmitHandler(
    step2Form,
    (data) => {
      setBasicFormData((prev) => ({ ...prev, ...data }));
      setBasicStep(3);
      return true;
    }
  );
  
  // Handle step 3 submission
  const { onSubmit: handleStep3Submit, isSubmitting: isSubmittingStep3 } = useFormSubmitHandler(
    step3Form,
    (data) => {
      // Combine all data and submit
      const finalData = {
        ...basicFormData,
        ...data,
      } as MultiStepFormData;
      
      console.log("Form submitted:", finalData);
      setTimeout(() => {
        basicDialog.close();
        setBasicStep(1);
        // Reset form data after submission
        setBasicFormData({});
        step1Form.reset();
        step2Form.reset();
        step3Form.reset();
      }, 1000);
      
      return true;
    }
  );
  
  // Get step title and description
  const getStepInfo = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Personal Information",
          description: "Please provide your personal details",
        };
      case 2:
        return {
          title: "Professional Information",
          description: "Please provide your professional details",
        };
      case 3:
        return {
          title: "Preferences",
          description: "Select your interests and preferences",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };
  
  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <form id="step1-form" onSubmit={handleStep1Submit} className="space-y-4">
            <FormInput
              name="firstName"
              label="First Name"
              form={step1Form}
              placeholder="John"
            />
            <FormInput
              name="lastName"
              label="Last Name"
              form={step1Form}
              placeholder="Doe"
            />
            <FormInput
              name="email"
              label="Email"
              form={step1Form}
              placeholder="john.doe@example.com"
              type="email"
            />
          </form>
        );
      case 2:
        return (
          <form id="step2-form" onSubmit={handleStep2Submit} className="space-y-4">
            <FormInput
              name="companyName"
              label="Company Name"
              form={step2Form}
              placeholder="Acme Inc."
            />
            <FormInput
              name="jobTitle"
              label="Job Title"
              form={step2Form}
              placeholder="Software Engineer"
            />
            <FormSelect
              name="industry"
              label="Industry"
              form={step2Form}
              options={industryOptions}
              placeholder="Select your industry"
            />
          </form>
        );
      case 3:
        return (
          <form id="step3-form" onSubmit={handleStep3Submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests</label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((option) => (
                  <FormCheckbox
                    key={option.value}
                    name="interests"
                    label={option.label}
                    value={option.value}
                    form={step3Form}
                  />
                ))}
              </div>
              {step3Form.formState.errors.interests && (
                <p className="text-sm text-red-500">
                  {step3Form.formState.errors.interests.message}
                </p>
              )}
            </div>
            <FormTextarea
              name="otherDetails"
              label="Other Details"
              form={step3Form}
              placeholder="Any other information you'd like to share..."
            />
            <FormCheckbox
              name="termsAccepted"
              label="I accept the terms and conditions"
              form={step3Form}
            />
          </form>
        );
      default:
        return null;
    }
  };
  
  // Actions for each step
  const getStepActions = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={basicDialog.close}
            >
              Cancel
            </Button>
            <Button type="submit" form="step1-form">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBasicStep(1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button type="submit" form="step2-form">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBasicStep(2)}
              disabled={isSubmittingStep3}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              form="step3-form"
              disabled={isSubmittingStep3}
            >
              {isSubmittingStep3 ? (
                "Submitting..."
              ) : (
                <>
                  Submit <CheckCircle2 className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Handle dialog close
  const handleBasicDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset everything when dialog is closed
      setBasicStep(1);
      setBasicFormData({});
      step1Form.reset();
      step2Form.reset();
      step3Form.reset();
    }
    basicDialog.onOpenChange(open);
  };
  
  // Progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="text-sm font-medium">Step {basicStep} of 3</div>
          <div className="text-sm text-muted-foreground">
            {basicStep === 1 ? "33%" : basicStep === 2 ? "66%" : "100%"}
          </div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: basicStep === 1 ? "33%" : basicStep === 2 ? "66%" : "100%" }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-8">Multi-Step Dialog Example</h1>
      
      <div className="mb-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Use Cases</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>User Onboarding:</strong> Breaking a large form into manageable steps
          </li>
          <li>
            <strong>Complex Workflows:</strong> Guiding users through sequential decision-making processes
          </li>
          <li>
            <strong>Wizard Interfaces:</strong> Creating installation or configuration wizards
          </li>
          <li>
            <strong>Progressive Disclosure:</strong> Revealing information gradually as needed
          </li>
        </ul>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Implementation</TabsTrigger>
          <TabsTrigger value="advanced">Hook-based Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Multi-Step Dialog</CardTitle>
              <CardDescription>
                Manual state management with StandardDialog component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button onClick={basicDialog.open}>
                  Open Multi-Step Form
                </Button>
                
                <StandardDialog
                  open={basicDialog.isOpen}
                  onOpenChange={handleBasicDialogOpenChange}
                  title={getStepInfo(basicStep).title}
                  description={getStepInfo(basicStep).description}
                  actions={getStepActions(basicStep)}
                  maxWidth="sm:max-w-[550px]"
                >
                  {renderStepIndicator()}
                  {renderStepContent(basicStep)}
                </StandardDialog>
              </div>
              
              <div className="mt-6 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Implementation Details</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Stores form data between steps in component state</li>
                  <li>Uses separate Zod schema and form for each step</li>
                  <li>Manages step transitions manually</li>
                  <li>Progress indicator shows current position in workflow</li>
                  <li>Form validation occurs at each step before proceeding</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hook-based Multi-Step Dialog</CardTitle>
              <CardDescription>
                Using a custom hook for advanced state management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button onClick={hookDialog.open}>
                  Open Multi-Step Form
                </Button>
                
                <MultiStepDialogWrapper
                  dialog={hookDialog}
                  onComplete={(data) => {
                    console.log("Advanced form submitted:", data);
                  }}
                />
              </div>
              
              <div className="mt-6 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Implementation Benefits</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Abstracts all state management into a reusable hook</li>
                  <li>Handles form persistence between steps automatically</li>
                  <li>Provides a cleaner component API</li>
                  <li>Centralizes validation logic</li>
                  <li>More maintainable for complex multi-step flows</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Practices for Multi-Step Dialogs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">User Experience</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Show clear progress indicators</li>
                  <li>Allow backward navigation without data loss</li>
                  <li>Provide descriptive step titles and instructions</li>
                  <li>Group related information in each step</li>
                  <li>Validate each step before proceeding</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Technical Implementation</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Use separate validation schemas for each step</li>
                  <li>Preserve form data between steps</li>
                  <li>Reset form state when dialog closes</li>
                  <li>Handle loading states during final submission</li>
                  <li>Consider form field dependencies between steps</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Accessibility Considerations</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Announce step changes to screen readers</li>
                <li>Maintain focus management between steps</li>
                <li>Provide keyboard shortcuts for navigation (e.g., Enter to proceed)</li>
                <li>Ensure all validation errors are properly announced</li>
                <li>Allow users to review all information before final submission</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// A custom hook for multi-step dialog state management
function useMultiStepDialog() {
  const dialog = useDialog();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<MultiStepFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const updateFormData = (data: Partial<MultiStepFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  
  const reset = () => {
    setCurrentStep(1);
    setFormData({});
    setIsSubmitting(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset when dialog closes
      reset();
    }
    dialog.onOpenChange(open);
  };
  
  return {
    isOpen: dialog.isOpen,
    currentStep,
    formData,
    isSubmitting,
    open: dialog.open,
    close: dialog.close,
    onOpenChange: handleOpenChange,
    nextStep,
    prevStep,
    updateFormData,
    setIsSubmitting,
    reset,
    triggerRef: dialog.triggerRef,
  };
}

// Wrapper component for the advanced implementation
function MultiStepDialogWrapper({
  dialog,
  onComplete,
}: {
  dialog: ReturnType<typeof useMultiStepDialog>;
  onComplete: (data: MultiStepFormData) => void;
}) {
  // Form for step 1
  const step1Form = useZodForm({
    schema: step1Schema,
    defaultValues: {
      firstName: dialog.formData.firstName || "",
      lastName: dialog.formData.lastName || "",
      email: dialog.formData.email || "",
    },
  });
  
  // Form for step 2
  const step2Form = useZodForm({
    schema: step2Schema,
    defaultValues: {
      companyName: dialog.formData.companyName || "",
      jobTitle: dialog.formData.jobTitle || "",
      industry: dialog.formData.industry || "",
    },
  });
  
  // Form for step 3
  const step3Form = useZodForm({
    schema: step3Schema,
    defaultValues: {
      interests: dialog.formData.interests || [],
      otherDetails: dialog.formData.otherDetails || "",
      termsAccepted: dialog.formData.termsAccepted || false,
    },
  });
  
  // Handle step 1 submission
  const { onSubmit: handleStep1Submit } = useFormSubmitHandler(
    step1Form,
    (data) => {
      dialog.updateFormData(data);
      dialog.nextStep();
      return true;
    }
  );
  
  // Handle step 2 submission
  const { onSubmit: handleStep2Submit } = useFormSubmitHandler(
    step2Form,
    (data) => {
      dialog.updateFormData(data);
      dialog.nextStep();
      return true;
    }
  );
  
  // Handle step 3 submission
  const { onSubmit: handleStep3Submit } = useFormSubmitHandler(
    step3Form,
    (data) => {
      dialog.setIsSubmitting(true);
      
      // Combine all data and submit
      const finalData = {
        ...dialog.formData,
        ...data,
      } as MultiStepFormData;
      
      // Simulate API call
      setTimeout(() => {
        onComplete(finalData);
        dialog.setIsSubmitting(false);
        dialog.close();
      }, 1000);
      
      return true;
    }
  );
  
  // Get step title and description
  const getStepInfo = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Personal Information",
          description: "Please provide your personal details",
        };
      case 2:
        return {
          title: "Professional Information",
          description: "Please provide your professional details",
        };
      case 3:
        return {
          title: "Preferences",
          description: "Select your interests and preferences",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };
  
  // Render step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <form id="advanced-step1-form" onSubmit={handleStep1Submit} className="space-y-4">
            <FormInput
              name="firstName"
              label="First Name"
              form={step1Form}
              placeholder="John"
            />
            <FormInput
              name="lastName"
              label="Last Name"
              form={step1Form}
              placeholder="Doe"
            />
            <FormInput
              name="email"
              label="Email"
              form={step1Form}
              placeholder="john.doe@example.com"
              type="email"
            />
          </form>
        );
      case 2:
        return (
          <form id="advanced-step2-form" onSubmit={handleStep2Submit} className="space-y-4">
            <FormInput
              name="companyName"
              label="Company Name"
              form={step2Form}
              placeholder="Acme Inc."
            />
            <FormInput
              name="jobTitle"
              label="Job Title"
              form={step2Form}
              placeholder="Software Engineer"
            />
            <FormSelect
              name="industry"
              label="Industry"
              form={step2Form}
              options={industryOptions}
              placeholder="Select your industry"
            />
          </form>
        );
      case 3:
        return (
          <form id="advanced-step3-form" onSubmit={handleStep3Submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests</label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((option) => (
                  <FormCheckbox
                    key={option.value}
                    name="interests"
                    label={option.label}
                    value={option.value}
                    form={step3Form}
                  />
                ))}
              </div>
              {step3Form.formState.errors.interests && (
                <p className="text-sm text-red-500">
                  {step3Form.formState.errors.interests.message}
                </p>
              )}
            </div>
            <FormTextarea
              name="otherDetails"
              label="Other Details"
              form={step3Form}
              placeholder="Any other information you'd like to share..."
            />
            <FormCheckbox
              name="termsAccepted"
              label="I accept the terms and conditions"
              form={step3Form}
            />
          </form>
        );
      default:
        return null;
    }
  };
  
  // Actions for each step
  const getStepActions = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={dialog.close}
            >
              Cancel
            </Button>
            <Button type="submit" form="advanced-step1-form">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={dialog.prevStep}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button type="submit" form="advanced-step2-form">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={dialog.prevStep}
              disabled={dialog.isSubmitting}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button 
              type="submit" 
              form="advanced-step3-form"
              disabled={dialog.isSubmitting}
            >
              {dialog.isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit <CheckCircle2 className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="text-sm font-medium">Step {dialog.currentStep} of 3</div>
          <div className="text-sm text-muted-foreground">
            {dialog.currentStep === 1 ? "33%" : dialog.currentStep === 2 ? "66%" : "100%"}
          </div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: dialog.currentStep === 1 ? "33%" : dialog.currentStep === 2 ? "66%" : "100%" }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <StandardDialog
      open={dialog.isOpen}
      onOpenChange={dialog.onOpenChange}
      title={getStepInfo(dialog.currentStep).title}
      description={getStepInfo(dialog.currentStep).description}
      actions={getStepActions(dialog.currentStep)}
      maxWidth="sm:max-w-[550px]"
    >
      {renderStepIndicator()}
      {renderStepContent(dialog.currentStep)}
    </StandardDialog>
  );
} 