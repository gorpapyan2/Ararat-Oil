import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  FormInput, 
  FormSelect, 
  FormCheckbox, 
  FormTextarea,
  FormDatePicker,
  FormCurrencyInput,
  FormRadioGroup,
  FormSwitch
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  birthdate: z.date({
    required_error: "Please select a date",
  }),
  role: z.string().min(1, "Please select a role"),
  experience: z.number().min(0, "Amount cannot be negative"),
  employmentType: z.string().min(1, "Please select an employment type"),
  skills: z.string().optional(),
  receiveNotifications: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type FormValues = z.infer<typeof formSchema>;

export function StandardFormExample() {
  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      name: "",
      email: "",
      birthdate: undefined,
      role: "",
      experience: undefined,
      employmentType: "",
      skills: "",
      receiveNotifications: false,
      termsAccepted: false
    }
  });

  const { isSubmitting, onSubmit } = useFormSubmitHandler<FormValues>(
    form,
    async (data) => {
      console.log("Form submitted:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    },
    {
      onSuccess: () => {
        console.log("Form submitted successfully");
        form.reset();
      },
      onError: (error) => {
        console.error("Form submission error:", error);
      }
    }
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Employee Registration Form</CardTitle>
        <CardDescription>
          Complete this form to register as an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDatePicker
              name="birthdate"
              label="Date of Birth"
              description="Must be 18 years or older"
              form={form}
              placeholder="Select date"
              disabled={(date) => date > new Date()}
            />
            
            <FormCurrencyInput
              name="experience"
              label="Years of Experience"
              description="Enter years of relevant experience"
              form={form}
              placeholder="0"
              symbol="yrs"
            />
          </div>
          
          <FormSelect
            name="role"
            label="Job Role"
            description="Select your primary job role"
            form={form}
            options={[
              { value: "developer", label: "Software Developer" },
              { value: "designer", label: "UI/UX Designer" },
              { value: "manager", label: "Project Manager" },
              { value: "analyst", label: "Business Analyst" },
              { value: "tester", label: "QA Engineer" }
            ]}
            placeholder="Select job role"
          />
          
          <FormRadioGroup
            name="employmentType"
            label="Employment Type"
            description="Select your preferred employment arrangement"
            form={form}
            options={[
              { value: "fulltime", label: "Full-Time" },
              { value: "parttime", label: "Part-Time" },
              { value: "contract", label: "Contract" },
              { value: "intern", label: "Internship" }
            ]}
            orientation="horizontal"
          />
          
          <FormTextarea
            name="skills"
            label="Skills & Qualifications"
            description="Describe your key skills and qualifications"
            form={form}
            placeholder="List your skills and relevant qualifications..."
            rows={4}
          />
          
          <FormSwitch
            name="receiveNotifications"
            label="Email Notifications"
            description="Receive updates about your application"
            form={form}
            switchLabel="Enabled"
          />
          
          <FormCheckbox
            name="termsAccepted"
            label="I accept the terms and conditions"
            description="You must agree to our terms to continue"
            form={form}
          />
          
          <CardFooter className="flex justify-end gap-2 px-0">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
} 