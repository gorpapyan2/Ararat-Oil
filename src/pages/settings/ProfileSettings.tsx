import { useState, memo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRenderCount } from "@/utils/performance";
import ProfileFormStandardized from "@/components/settings/ProfileFormStandardized";

function ProfileSettings() {
  const { user, profile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  
  // Log render count in development
  useRenderCount("ProfileSettings");

  // Handle profile update
  const handleProfileUpdate = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Here you would actually update the profile
    console.log("Profile data to update:", data);
  };

  // Avatar handlers
  const handleChangeAvatar = () => {
    // In a real implementation, you'd open a file picker
    console.log("Change avatar clicked");
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    console.log("Remove avatar clicked");
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