
import { useState } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { StandardForm } from "@/core/components/ui/composed/base-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { Alert, AlertDescription } from "@/core/components/ui/primitives/alert";
import { UserProfile } from "./ProfileController";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Define ProfileFormData type
export type ProfileFormData = {
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
};

interface ProfileFormStandardizedProps {
  profile?: UserProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<boolean>;
  isLoading?: boolean;
}

export function ProfileFormStandardized({
  profile,
  onSubmit,
  isLoading = false,
}: ProfileFormStandardizedProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Create schema inside the component where hooks can be called
  const profileSchema = z.object({
    full_name: z
      .string()
      .min(2, t("profile.fullNameMinLength", "Full name must be at least 2 characters"))
      .optional(),
    email: z
      .string()
      .email(t("profile.invalidEmail", "Invalid email address"))
      .optional(),
    phone: z
      .string()
      .min(8, t("profile.phoneMinLength", "Phone number must be at least 8 characters"))
      .optional()
      .or(z.literal("")),
    position: z
      .string()
      .optional()
      .or(z.literal("")),
  });

  // Default values from profile
  const defaultValues: ProfileFormData = {
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    position: profile?.position || "",
  };

  // Submit handler
  const handleSubmit = async (data: ProfileFormData) => {
    setError(null);

    try {
      const success = await onSubmit(data);
      return success;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      return false;
    }
  };

  return (
    <StandardForm
      schema={profileSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={
        isLoading
          ? t("profile.updating", "Updating...")
          : t("profile.updateProfile", "Update Profile")
      }
      className="space-y-4"
    >
      {({ control }) => (
        <>
          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.fullName", "Full Name")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.email", "Email")}</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.phone", "Phone")}</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.position", "Position")}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </StandardForm>
  );
}
