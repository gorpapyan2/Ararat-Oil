import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  IconSettings,
  IconUser,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
  IconBell,
  IconLock,
  IconCamera,
  IconCheck,
  IconX,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { useBreadcrumbs } from "@/core/providers/BreadcrumbProvider";
import { Settings as SettingsIcon } from "lucide-react";

// Import our custom UI components
import { PageHeader } from '@/core/components/ui/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/core/components/ui/card';

// Import UI components
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Separator } from '@/core/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { Switch } from '@/core/components/ui/switch';
import { useToast } from "@/hooks";
import { useTheme } from "@/core/providers/theme-provider";
import { useAuth } from '@/features/auth';
import { ActionButton } from '@/core/components/ui/action-button';
import { LoadingButton } from '@/core/components/ui/loading-button';
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function Settings() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();

  usePageBreadcrumbs({
    segments: [
      { name: "Dashboard", href: "/" },
      { name: "Settings", href: "/settings", isCurrent: true }
    ],
    title: "Settings"
  });

  // Set custom breadcrumbs for this page
  useEffect(() => {
    setBreadcrumbs([
      {
        name: t("common.dashboard"),
        href: "/",
      },
      {
        name: t("common.settings"),
        href: "/settings",
        isCurrent: true,
        icon: <SettingsIcon size={16} />
      }
    ]);
    
    // Clean up the breadcrumbs when component unmounts
    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs, t]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    position: profile?.position || "",
    avatar: profile?.avatar_url || "",
    isLoading: false,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    isLoading: false,
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailAlerts: profile?.notification_prefs?.email_alerts || false,
    smsAlerts: profile?.notification_prefs?.sms_alerts || false,
    salesReports: profile?.notification_prefs?.sales_reports || false,
    inventoryAlerts: profile?.notification_prefs?.inventory_alerts || false,
    isLoading: false,
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification preference changes
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
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

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    setPasswordForm((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPasswordForm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Handle notification preferences submission
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationPrefs((prev) => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setNotificationPrefs((prev) => ({ ...prev, isLoading: false }));
    }
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
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            <span>{t("settings.tabs.profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <IconMoon className="h-4 w-4" />
            <span>{t("settings.tabs.appearance")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <IconBell className="h-4 w-4" />
            <span>{t("settings.tabs.notifications")}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <IconLock className="h-4 w-4" />
            <span>{t("settings.tabs.security")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile.title")}</CardTitle>
              <CardDescription>
                {t("settings.profile.description")}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
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
                  onClick={() =>
                    setProfileForm({
                      fullName:
                        profile?.full_name ||
                        user?.user_metadata?.full_name ||
                        "",
                      email: user?.email || "",
                      phone: profile?.phone || "",
                      position: profile?.position || "",
                      avatar: profile?.avatar_url || "",
                      isLoading: false,
                    })
                  }
                >
                  {t("settings.profile.cancel")}
                </Button>
                <LoadingButton 
                  onClick={handleProfileSubmit}
                  type="submit"
                  initialLoading={profileForm.isLoading}
                  loadingText={t("settings.profile.saving")}
                  startIcon={<IconCheck className="h-4 w-4" />}
                >
                  {t("settings.profile.saveChanges")}
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance.title")}</CardTitle>
              <CardDescription>
                {t("settings.appearance.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("settings.appearance.theme")}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "light" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconSun className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("settings.appearance.light")}</span>
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "dark" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconMoon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("settings.appearance.dark")}</span>
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "system" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconDeviceLaptop className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{t("settings.appearance.system")}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("settings.appearance.sidebar")}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebarCollapsed" className="text-base">
                      {t("settings.appearance.collapsedSidebar")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.appearance.collapsedSidebarDescription")}
                    </p>
                  </div>
                  <Switch
                    id="sidebarCollapsed"
                    checked={
                      localStorage.getItem("sidebarCollapsed") === "true"
                    }
                    onCheckedChange={(checked) => {
                      localStorage.setItem("sidebarCollapsed", String(checked));
                      toast({
                        title: "Preference saved",
                        description:
                          "Sidebar preference will apply on next page load.",
                      });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>
                {t("settings.notifications.description")}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificationSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAlerts" className="text-base">
                        {t("settings.notifications.emailAlerts")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.notifications.emailAlertsDescription")}
                      </p>
                    </div>
                    <Switch
                      id="emailAlerts"
                      checked={notificationPrefs.emailAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailAlerts", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsAlerts" className="text-base">
                        {t("settings.notifications.smsAlerts")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.notifications.smsAlertsDescription")}
                      </p>
                    </div>
                    <Switch
                      id="smsAlerts"
                      checked={notificationPrefs.smsAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsAlerts", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="salesReports" className="text-base">
                        {t("settings.notifications.salesReports")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.notifications.salesReportsDescription")}
                      </p>
                    </div>
                    <Switch
                      id="salesReports"
                      checked={notificationPrefs.salesReports}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("salesReports", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventoryAlerts" className="text-base">
                        {t("settings.notifications.inventoryAlerts")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("settings.notifications.inventoryAlertsDescription")}
                      </p>
                    </div>
                    <Switch
                      id="inventoryAlerts"
                      checked={notificationPrefs.inventoryAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("inventoryAlerts", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setNotificationPrefs({
                      emailAlerts:
                        profile?.notification_prefs?.email_alerts || false,
                      smsAlerts:
                        profile?.notification_prefs?.sms_alerts || false,
                      salesReports:
                        profile?.notification_prefs?.sales_reports || false,
                      inventoryAlerts:
                        profile?.notification_prefs?.inventory_alerts || false,
                      isLoading: false,
                    })
                  }
                >
                  {t("settings.notifications.reset")}
                </Button>
                <LoadingButton 
                  onClick={handleNotificationSubmit}
                  type="submit"
                  initialLoading={notificationPrefs.isLoading}
                  loadingText={t("settings.notifications.saving")}
                  startIcon={<IconCheck className="h-4 w-4" />}
                >
                  {t("settings.notifications.savePreferences")}
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security.title")}</CardTitle>
              <CardDescription>
                {t("settings.security.description")}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t("settings.security.currentPassword")}</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("settings.security.newPassword")}</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("settings.security.passwordRequirements")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("settings.security.confirmPassword")}</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                      isLoading: false,
                    })
                  }
                >
                  {t("settings.security.cancel")}
                </Button>
                <LoadingButton 
                  onClick={handlePasswordSubmit}
                  type="submit"
                  initialLoading={passwordForm.isLoading}
                  loadingText={t("settings.security.updating")}
                  startIcon={<IconCheck className="h-4 w-4" />}
                >
                  {t("settings.security.updatePassword")}
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.security.accountSecurityTitle")}</CardTitle>
              <CardDescription>
                {t("settings.security.accountSecurityDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">{t("settings.security.sessionManagementTitle")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.security.sessionManagementDescription")}
                  </p>
                </div>
                <Button variant="outline">{t("settings.security.manageSessions")}</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-red-600 dark:text-red-500">
                    {t("settings.security.dangerZoneTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.security.dangerZoneDescription")}
                  </p>
                </div>
                <ActionButton 
                  isDestructive
                  requireConfirmation
                  confirmationMessage={t("settings.security.deleteAccountConfirmation")}
                  onClick={() => console.log("Delete account action")}
                >
                  {t("settings.security.deleteAccount")}
                </ActionButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
