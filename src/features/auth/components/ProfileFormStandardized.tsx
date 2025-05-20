import { memo } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks";
import { useRenderCount } from "@/utils/performance";

// Icons
import {
  IconCamera,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Separator } from '@/core/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { FormInput } from '@/core/components/ui/composed/form-fields';
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define the form validation schema
const profileSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional(),
  position: z
    .string()
    .optional(),
});

// Infer the form data type from the schema
type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: any;
  profile: any;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  avatarUrl?: string;
  onChangeAvatar?: () => void;
  onRemoveAvatar?: () => void;
}

function ProfileFormStandardized({ 
  user, 
  profile, 
  onSubmit,
  avatarUrl,
  onChangeAvatar,
  onRemoveAvatar
}: ProfileFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("ProfileFormStandardized");

  // Initialize form with Zod
  const form = useZodForm({
    schema: profileSchema,
    defaultValues: {
      fullName: profile?.full_name || user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      position: profile?.position || "",
    },
  });
  
  // Get form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<ProfileFormData>(
    form,
    async (data) => {
      try {
        await onSubmit(data);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    }
  );

  // Reset form to initial values
  const resetForm = () => {
    form.reset({
      fullName: profile?.full_name || user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      position: profile?.position || "",
    });
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = form.getValues().fullName || user?.email || "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.profile.title")}</CardTitle>
        <CardDescription>
          {t("settings.profile.description")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarUrl || profile?.avatar_url}
                alt={form.getValues().fullName}
              />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.profile.photo")}</h3>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={onChangeAvatar}
                >
                  <IconCamera className="h-4 w-4 mr-2" />
                  {t("settings.profile.change")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={onRemoveAvatar}
                >
                  <IconX className="h-4 w-4 mr-2" />
                  {t("settings.profile.remove")}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="fullName"
              label={t("settings.profile.fullName")}
              form={form}
              placeholder={t("settings.profile.fullName")}
            />

            <FormInput
              name="email"
              label={t("settings.profile.email")}
              form={form}
              type="email"
              placeholder="john@example.com"
              disabled={!!user?.email} // Disable if provided by auth
            />

            <FormInput
              name="phone"
              label={t("settings.profile.phone")}
              form={form}
              placeholder="+1 (555) 000-0000"
            />

            <FormInput
              name="position"
              label={t("settings.profile.position")}
              form={form}
              placeholder={t("settings.profile.position")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            {t("settings.profile.cancel")}
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("settings.profile.saving") : t("settings.profile.saveChanges")}
            {!isSubmitting && <IconCheck className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Export a memoized version for better performance
export default memo(ProfileFormStandardized); 