import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Switch } from "@/core/components/ui/switch";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import { useToast } from "@/hooks";
import { Lock, Shield, Smartphone, Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SecurityPreferences {
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
  loginNotifications: boolean;
}

export function SecuritySettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [securityPrefs, setSecurityPrefs] = useState<SecurityPreferences>({
    twoFactorAuth: false,
    sessionTimeout: true,
    loginNotifications: true,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("settings.passwordUpdated", "Password updated"),
        description: t("settings.passwordUpdatedDescription", "Your password has been changed successfully."),
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: t("settings.passwordUpdateError", "Failed to update password. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleSecurityPrefChange = (key: keyof SecurityPreferences, value: boolean) => {
    setSecurityPrefs(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSecurityPreferences = async () => {
    setIsSecurityLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("settings.securityUpdated", "Security settings updated"),
        description: t("settings.securityUpdatedDescription", "Your security preferences have been saved."),
      });
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: t("settings.securityUpdateError", "Failed to update security settings."),
        variant: "destructive",
      });
    } finally {
      setIsSecurityLoading(false);
    }
  };

  const securityOptions = [
    {
      key: "twoFactorAuth" as const,
      title: t("settings.twoFactorAuth", "Two-Factor Authentication"),
      description: t("settings.twoFactorAuthDescription", "Add an extra layer of security to your account"),
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      key: "sessionTimeout" as const,
      title: t("settings.sessionTimeout", "Session Timeout"),
      description: t("settings.sessionTimeoutDescription", "Automatically log out after period of inactivity"),
      icon: <Shield className="h-4 w-4" />,
    },
    {
      key: "loginNotifications" as const,
      title: t("settings.loginNotifications", "Login Notifications"),
      description: t("settings.loginNotificationsDescription", "Get notified when someone logs into your account"),
      icon: <Shield className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("settings.changePassword", "Change Password")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.currentPassword", "Current Password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showCurrentPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.newPassword", "New Password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showNewPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings.confirmPassword", "Confirm New Password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading 
                  ? t("common.saving", "Saving...") 
                  : t("settings.updatePassword", "Update Password")
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.securityPreferences", "Security Preferences")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityOptions.map((option, index) => (
            <div key={option.key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <div>
                    <Label htmlFor={option.key} className="text-sm font-medium">
                      {option.title}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={option.key}
                  checked={securityPrefs[option.key]}
                  onCheckedChange={(checked) => handleSecurityPrefChange(option.key, checked)}
                  disabled={isSecurityLoading}
                />
              </div>
              {index < securityOptions.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button onClick={saveSecurityPreferences} disabled={isSecurityLoading}>
              {isSecurityLoading 
                ? t("common.saving", "Saving...") 
                : t("common.save", "Save Security Settings")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 