import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { z } from "zod";

// Define the schema for the profile form
export const profileSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Define types for user and profile data
interface UserData {
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface ProfileData {
  full_name?: string;
  phone?: string;
  position?: string;
  avatar_url?: string;
}

interface UseProfileDialogOptions {
  onSuccess?: (data: ProfileFormData) => void;
  onAvatarChange?: (url: string) => void;
  currentUser?: UserData;
  currentProfile?: ProfileData;
}

export function useProfileDialog({
  onSuccess,
  onAvatarChange,
  currentUser,
  currentProfile,
}: UseProfileDialogOptions = {}) {
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentProfile?.avatar_url || "");

  const { toast } = useToast();

  // Open/close handlers
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      setIsSubmitting(true);

      try {
        // In a real app, update profile here
        // Example: await updateProfile(data);

        // Simulate API call in this example
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });

        onSuccess?.(data);
        closeDialog();
        return true;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error updating profile",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast, onSuccess, closeDialog]
  );

  // Avatar handlers
  const handleChangeAvatar = useCallback(() => {
    // In a real implementation, this would open a file picker
    // and upload the image to storage
    const newAvatarUrl = `/images/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`;
    setAvatarUrl(newAvatarUrl);
    onAvatarChange?.(newAvatarUrl);
  }, [onAvatarChange]);

  const handleRemoveAvatar = useCallback(() => {
    setAvatarUrl("");
    onAvatarChange?.("");
  }, [onAvatarChange]);

  // Get default values for the form
  const getDefaultValues = useCallback(() => {
    return {
      fullName:
        currentProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        "",
      email: currentUser?.email || "",
      phone: currentProfile?.phone || "",
      position: currentProfile?.position || "",
    };
  }, [currentProfile, currentUser]);

  // Get initials for avatar fallback
  const getInitials = useCallback((name: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, []);

  return {
    // Dialog state
    isOpen,
    setIsOpen,
    isSubmitting,
    avatarUrl,

    // Dialog actions
    openDialog,
    closeDialog,
    handleSubmit,
    handleChangeAvatar,
    handleRemoveAvatar,

    // Helpers
    getDefaultValues,
    getInitials,
  };
}
