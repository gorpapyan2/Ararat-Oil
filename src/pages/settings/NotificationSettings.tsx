import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useRenderCount } from "@/utils/performance";

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui-custom/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  Calendar,
  UserPlus,
  Lock
} from "lucide-react";

function NotificationSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("NotificationSettings");
  
  // Notification states
  const [notifications, setNotifications] = useState({
    // Email notifications
    emailSystem: true,
    emailSecurity: true,
    emailMarketing: false,
    emailNewsletter: true,
    
    // System notifications
    pushAll: true,
    pushMessages: true,
    pushSecurity: true,
    pushReminders: true,
    pushMentions: true,
    
    // Sound settings
    soundEnabled: true,
    soundMessages: true,
    soundNotifications: true,
  });

  // Update notification setting
  const updateNotification = (key: keyof typeof notifications) => (checked: boolean) => {
    setNotifications({
      ...notifications,
      [key]: checked
    });
  };

  // Handle form submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.notifications.title")}</CardTitle>
          <CardDescription>
            {t("settings.notifications.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t("settings.notifications.emailNotifications")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailSystem" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.systemEmails")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.systemEmailsDescription")}
                  </span>
                </Label>
                <Switch
                  id="emailSystem"
                  checked={notifications.emailSystem}
                  onCheckedChange={updateNotification("emailSystem")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailSecurity" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.securityEmails")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.securityEmailsDescription")}
                  </span>
                </Label>
                <Switch
                  id="emailSecurity"
                  checked={notifications.emailSecurity}
                  onCheckedChange={updateNotification("emailSecurity")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailMarketing" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.marketingEmails")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.marketingEmailsDescription")}
                  </span>
                </Label>
                <Switch
                  id="emailMarketing"
                  checked={notifications.emailMarketing}
                  onCheckedChange={updateNotification("emailMarketing")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailNewsletter" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.newsletterEmails")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.newsletterEmailsDescription")}
                  </span>
                </Label>
                <Switch
                  id="emailNewsletter"
                  checked={notifications.emailNewsletter}
                  onCheckedChange={updateNotification("emailNewsletter")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* System Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {t("settings.notifications.pushNotifications")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushAll" className="flex flex-col space-y-1">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {t("settings.notifications.allNotifications")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.allNotificationsDescription")}
                  </span>
                </Label>
                <Switch
                  id="pushAll"
                  checked={notifications.pushAll}
                  onCheckedChange={updateNotification("pushAll")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushMessages" className="flex flex-col space-y-1">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {t("settings.notifications.messageNotifications")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.messageNotificationsDescription")}
                  </span>
                </Label>
                <Switch
                  id="pushMessages"
                  checked={notifications.pushMessages}
                  onCheckedChange={updateNotification("pushMessages")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushSecurity" className="flex flex-col space-y-1">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t("settings.notifications.securityNotifications")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.securityNotificationsDescription")}
                  </span>
                </Label>
                <Switch
                  id="pushSecurity"
                  checked={notifications.pushSecurity}
                  onCheckedChange={updateNotification("pushSecurity")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushReminders" className="flex flex-col space-y-1">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t("settings.notifications.reminderNotifications")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.reminderNotificationsDescription")}
                  </span>
                </Label>
                <Switch
                  id="pushReminders"
                  checked={notifications.pushReminders}
                  onCheckedChange={updateNotification("pushReminders")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushMentions" className="flex flex-col space-y-1">
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t("settings.notifications.mentionNotifications")}
                  </span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.mentionNotificationsDescription")}
                  </span>
                </Label>
                <Switch
                  id="pushMentions"
                  checked={notifications.pushMentions}
                  onCheckedChange={updateNotification("pushMentions")}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {t("settings.notifications.soundSettings")}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="soundEnabled" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.enableSounds")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.enableSoundsDescription")}
                  </span>
                </Label>
                <Switch
                  id="soundEnabled"
                  checked={notifications.soundEnabled}
                  onCheckedChange={updateNotification("soundEnabled")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="soundMessages" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.messageSounds")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.messageSoundsDescription")}
                  </span>
                </Label>
                <Switch
                  id="soundMessages"
                  checked={notifications.soundMessages}
                  disabled={!notifications.soundEnabled}
                  onCheckedChange={updateNotification("soundMessages")}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="soundNotifications" className="flex flex-col space-y-1">
                  <span>{t("settings.notifications.notificationSounds")}</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    {t("settings.notifications.notificationSoundsDescription")}
                  </span>
                </Label>
                <Switch
                  id="soundNotifications"
                  checked={notifications.soundNotifications}
                  disabled={!notifications.soundEnabled}
                  onCheckedChange={updateNotification("soundNotifications")}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {t("common.saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// Export a memoized version for better performance
export default memo(NotificationSettings); 