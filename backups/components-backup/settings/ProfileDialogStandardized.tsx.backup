import { StandardDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FormInput } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { useProfileDialog, profileSchema, ProfileFormData } from "@/hooks/useProfileDialog";
import { IconCamera, IconX, IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface ProfileDialogStandardizedProps {
  user?: any;
  profile?: any;
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
  
  const {
    isOpen,
    setIsOpen,
    isSubmitting,
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
  
  const form = useZodForm({
    schema: profileSchema,
    defaultValues: getDefaultValues(),
  });
  
  const { onSubmit } = useFormSubmitHandler<ProfileFormData>(
    form,
    submitProfile
  );
  
  return (
    <StandardDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("settings.profile.title")}
      description={t("settings.profile.description")}
      maxWidth="sm:max-w-lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarUrl}
              alt={form.getValues().fullName}
            />
            <AvatarFallback className="text-lg">
              {getInitials(form.getValues().fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("settings.profile.photo")}</h3>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleChangeAvatar}
              >
                <IconCamera className="h-4 w-4 mr-2" />
                {t("settings.profile.change")}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleRemoveAvatar}
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

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
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
        </div>
      </form>
    </StandardDialog>
  );
} 