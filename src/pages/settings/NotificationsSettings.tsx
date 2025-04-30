import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useRenderCount } from "@/utils/performance";

// UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui-custom/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function NotificationsSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Log render count in development
  useRenderCount("NotificationsSettings");
  
  // State for notification preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
    taskReminders: true,
    mentionNotifications: true,
  });

  // Handle preference toggle
  const handleToggle = (key: keyof typeof preferences) => (checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }));
  };

  // Handle form submission
  const handleSave = () => {
    // TODO: Save to backend
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.notifications.title")}</CardTitle>
        <CardDescription>
          {t("settings.notifications.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t("settings.notifications.generalTitle")}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-base">
                  {t("settings.notifications.emailNotifications")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.emailDescription")}
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={handleToggle("emailNotifications")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="text-base">
                  {t("settings.notifications.pushNotifications")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.pushDescription")}
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={handleToggle("pushNotifications")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails" className="text-base">
                  {t("settings.notifications.marketingEmails")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.marketingDescription")}
                </p>
              </div>
              <Switch
                id="marketingEmails"
                checked={preferences.marketingEmails}
                onCheckedChange={handleToggle("marketingEmails")}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t("settings.notifications.appNotifications")}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts" className="text-base">
                  {t("settings.notifications.securityAlerts")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.securityDescription")}
                </p>
              </div>
              <Switch
                id="securityAlerts"
                checked={preferences.securityAlerts}
                onCheckedChange={handleToggle("securityAlerts")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="productUpdates" className="text-base">
                  {t("settings.notifications.productUpdates")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.updatesDescription")}
                </p>
              </div>
              <Switch
                id="productUpdates"
                checked={preferences.productUpdates}
                onCheckedChange={handleToggle("productUpdates")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="taskReminders" className="text-base">
                  {t("settings.notifications.taskReminders")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.remindersDescription")}
                </p>
              </div>
              <Switch
                id="taskReminders"
                checked={preferences.taskReminders}
                onCheckedChange={handleToggle("taskReminders")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mentionNotifications" className="text-base">
                  {t("settings.notifications.mentionNotifications")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications.mentionsDescription")}
                </p>
              </div>
              <Switch
                id="mentionNotifications"
                checked={preferences.mentionNotifications}
                onCheckedChange={handleToggle("mentionNotifications")}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>
          {t("common.saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Export a memoized version for better performance
export default memo(NotificationsSettings); 