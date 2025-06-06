import { useState } from "react";
import { Button } from "@/core/components/ui/primitives/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/core/components/ui/primitives/avatar";
import { Separator } from "@/core/components/ui/composed/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { useProfileDialog } from '@/hooks/useProfileDialog';
import { useProfileDialog, ProfileFormData } from "@/hooks/useProfileDialog";
import { IconCamera, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "./ProfileController";

interface ProfileDialogStandardizedProps {
  user?: User;
  profile?: UserProfile;
  onSuccess?: (data: ProfileFormData) => void;
  onAvatarChange?: (url: string) => void;
}

export function ProfileDialogStandardized({
  user,
  profile,
  onSuccess,
  onAvatarChange,
}: ProfileDialogStandardizedProps) {
  const { t } = useTranslation();

  // Create schema inside the component where hooks can be called
  const profileSchema = z.object({
    fullName: z
      .string({
        required_error: t(
          "settings.profile.fullNameRequired",
          "Full name is required"
        ),
      })
      .min(
        2,
        t(
          "settings.profile.fullNameMinLength",
          "Full name must be at least 2 characters"
        )
      ),
    email: z
      .string({
        required_error: t(
          "settings.profile.emailRequired",
          "Email is required"
        ),
      })
      .email(
        t("settings.profile.invalidEmail", "Please enter a valid email address")
      ),
    phone: z.string().optional(),
    position: z.string().optional(),
  });

  // Type for the form values based on the schema
  type ProfileFormValues = z.infer<typeof profileSchema>;

  const {
    isOpen,
    setIsOpen,
    avatarUrl,
    handleSubmit: submitProfile,
    handleChangeAvatar,
    handleRemoveAvatar,
    getDefaultValues,
    getInitials,
  } = useProfileDialog({
    onSuccess,
    onAvatarChange,
    currentUser: user,
    currentProfile: profile,
  });

  // Default values for the form
  const defaultValues = getDefaultValues();

  // Submit handler
  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const result = await submitProfile(data);

      if (result) {
        sonnerToast.success(
          t("settings.profile.success", "Profile updated successfully")
        );
        return true;
      }
      return false;
    } catch (error) {
      sonnerToast.error(t("settings.profile.error", "Error updating profile"), {
        description: error instanceof Error ? error.message : undefined,
      });
      return false;
    }
  };

  // Get an initial value for fullName to use in the avatar fallback
  const [fullNameValue, setFullNameValue] = useState(defaultValues.fullName);

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("settings.profile.title", "Edit Profile")}
      schema={profileSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={t("settings.profile.saveChanges", "Save changes")}
      size="lg"
    >
      {({ control }) => {
        return (
          <>
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={fullNameValue} />
                <AvatarFallback className="text-lg">
                  {getInitials(fullNameValue)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {t("settings.profile.photo", "Profile Photo")}
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleChangeAvatar}
                  >
                    <IconCamera className="h-4 w-4 mr-2" />
                    {t("settings.profile.change", "Change")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    {t("settings.profile.remove", "Remove")}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("settings.profile.fullName", "Full Name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t(
                          "settings.profile.fullName",
                          "Full Name"
                        )}
                        onChange={(e) => {
                          field.onChange(e);
                          setFullNameValue(e.target.value);
                        }}
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
                    <FormLabel>
                      {t("settings.profile.email", "Email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="john@example.com"
                        disabled={!!user?.email}
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
                    <FormLabel>
                      {t("settings.profile.phone", "Phone")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 (555) 000-0000" />
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
                    <FormLabel>
                      {t("settings.profile.position", "Position")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("settings.profile.position", "Position")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      }}
    </FormDialog>
  );
}
