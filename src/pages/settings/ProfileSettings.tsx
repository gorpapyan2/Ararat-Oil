import React, { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui-custom/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Interface for the form state
interface ProfileFormState {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  avatar: string;
  isLoading: boolean;
}

function ProfileSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  // Log render count in development
  useRenderCount("ProfileSettings");

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    fullName: profile?.full_name || user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    position: profile?.position || "",
    avatar: profile?.avatar_url || "",
    isLoading: false,
  });

  // Handle form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileForm((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProfileForm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Reset form
  const resetForm = () => {
    setProfileForm({
      fullName: profile?.full_name || user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      position: profile?.position || "",
      avatar: profile?.avatar_url || "",
      isLoading: false,
    });
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = profileForm.fullName || user?.email || "User";
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
                src={profileForm.avatar}
                alt={profileForm.fullName}
              />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.profile.photo")}</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <IconCamera className="h-4 w-4 mr-2" />
                  {t("settings.profile.change")}
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <IconX className="h-4 w-4 mr-2" />
                  {t("settings.profile.remove")}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("settings.profile.fullName")}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                placeholder={t("settings.profile.fullName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("settings.profile.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="john@example.com"
                disabled={!!user?.email} // Disable if provided by auth
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("settings.profile.phone")}</Label>
              <Input
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t("settings.profile.position")}</Label>
              <Input
                id="position"
                name="position"
                value={profileForm.position}
                onChange={handleProfileChange}
                placeholder={t("settings.profile.position")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            {t("settings.profile.cancel")}
          </Button>
          <Button type="submit" disabled={profileForm.isLoading}>
            {profileForm.isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("settings.profile.saving")}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <IconCheck className="h-4 w-4" />
                {t("settings.profile.saveChanges")}
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Export a memoized version for better performance
export default memo(ProfileSettings); 