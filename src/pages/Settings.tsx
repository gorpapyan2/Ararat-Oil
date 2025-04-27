import React, { useState } from "react";
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
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from "@/components/ui-custom/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui-custom/card";

// Import UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();

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
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <IconMoon className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <IconBell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <IconLock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and contact details
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
                    <h3 className="text-sm font-medium">Profile Photo</h3>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <IconCamera className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <IconX className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={profileForm.position}
                      onChange={handleProfileChange}
                      placeholder="Manager"
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
                  Cancel
                </Button>
                <Button type="submit" disabled={profileForm.isLoading}>
                  {profileForm.isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <IconCheck className="h-4 w-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "light" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconSun className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Light</span>
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "dark" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconMoon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Dark</span>
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 cursor-pointer hover:border-primary ${theme === "system" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <IconDeviceDesktop className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sidebar</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebarCollapsed" className="text-base">
                      Collapsed Sidebar
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Start with sidebar collapsed by default
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
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleNotificationSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAlerts" className="text-base">
                        Email Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via email
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
                        SMS Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive urgent alerts via SMS
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
                        Sales Reports
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily sales reports
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
                        Inventory Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory is low
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
                  Reset
                </Button>
                <Button type="submit" disabled={notificationPrefs.isLoading}>
                  {notificationPrefs.isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <IconCheck className="h-4 w-4" />
                      Save Preferences
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long and include a
                      mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
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
                  Cancel
                </Button>
                <Button type="submit" disabled={passwordForm.isLoading}>
                  {passwordForm.isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <IconCheck className="h-4 w-4" />
                      Update Password
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage additional security settings for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your active sessions and sign out from other devices
                  </p>
                </div>
                <Button variant="outline">Manage Sessions</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-red-600 dark:text-red-500">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
