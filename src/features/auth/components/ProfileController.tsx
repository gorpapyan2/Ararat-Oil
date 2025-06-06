import { Button } from "@/core/components/ui/button";
import { useProfileDialog } from '@/hooks/useProfileDialog';
import { ProfileDialogStandardized } from "./ProfileDialogStandardized";
import { IconUserCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";

/**
 * Profile data structure
 */
export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  position?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileControllerProps {
  user?: User;
  profile?: UserProfile;
  onSuccess?: (data: ProfileFormData) => void;
  onAvatarChange?: (url: string) => void;
  className?: string;
  buttonText?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function ProfileController({
  user,
  profile,
  onSuccess,
  onAvatarChange,
  className,
  buttonText,
  variant = "outline",
  size = "default",
  showIcon = true,
}: ProfileControllerProps) {
  const { t } = useTranslation();

  const { openDialog, isOpen, setIsOpen } = useProfileDialog({
    onSuccess,
    onAvatarChange,
    currentUser: user,
    currentProfile: profile,
  });

  return (
    <>
      <Button
        onClick={openDialog}
        className={className}
        variant={variant}
        size={size}
      >
        {showIcon && <IconUserCircle className="h-4 w-4 mr-2" />}
        {buttonText || t("settings.profile.editProfile")}
      </Button>

      <ProfileDialogStandardized
        user={user}
        profile={profile}
        onSuccess={onSuccess}
        onAvatarChange={onAvatarChange}
      />
    </>
  );
}
