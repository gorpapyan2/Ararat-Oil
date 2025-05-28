import { useState, memo } from "react";
import { useAuth } from "@/features/auth";
import { useRenderCount } from "@/utils/performance";
import ProfileFormStandardized from "@/features/auth/components/ProfileFormStandardized";
import { useToast } from "@/hooks";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
} from "@/i18n/i18n";
import { ProfileFormData } from '@/hooks/useProfileDialog';

function ProfileSettings() {
  const { user, profile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const { toast } = useToast();

  // Log render count in development
  useRenderCount("ProfileSettings");

  // Handle profile update
  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would actually update the profile
      console.log("Profile data to update:", data);

      // Show success toast with standardized message
      toast({
        title: "Success",
        description: getApiSuccessMessage(
          apiNamespaces.settings,
          "update",
          "profile"
        ),
      });

      return Promise.resolve();
    } catch (error) {
      // Show error toast with standardized message
      toast({
        title: "Error",
        description: getApiErrorMessage(
          apiNamespaces.settings,
          "update",
          "profile"
        ),
        variant: "destructive",
      });

      return Promise.reject(error);
    }
  };

  // Avatar handlers
  const handleChangeAvatar = () => {
    // In a real implementation, you'd open a file picker
    console.log("Change avatar clicked");
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    console.log("Remove avatar clicked");

    // Show success toast for avatar removal
    toast({
      title: "Success",
      description: getApiSuccessMessage(
        apiNamespaces.settings,
        "update",
        "avatar"
      ),
    });
  };

  return (
    <ProfileFormStandardized
      user={user}
      profile={profile}
      onSubmit={handleProfileUpdate}
      avatarUrl={avatarUrl}
      onChangeAvatar={handleChangeAvatar}
      onRemoveAvatar={handleRemoveAvatar}
    />
  );
}

// Export a memoized version for better performance
export default memo(ProfileSettings);
