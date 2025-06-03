import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/core/components/ui/switch";
import { Label } from "@/core/components/ui/label";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { useToast } from "@/hooks";
import { useAuth } from "@/features/auth";
import { Bell, Mail, MessageCircle, TrendingUp, AlertTriangle } from "lucide-react";

interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  salesReports: boolean;
  inventoryAlerts: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
}

export function NotificationSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailAlerts: user?.notification_prefs?.email_alerts || false,
    smsAlerts: user?.notification_prefs?.sms_alerts || false,
    salesReports: user?.notification_prefs?.sales_reports || true,
    inventoryAlerts: user?.notification_prefs?.inventory_alerts || true,
    systemUpdates: true,
    securityAlerts: true,
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("settings.notificationsUpdated", "Notifications updated"),
        description: t("settings.notificationsUpdatedDescription", "Your notification preferences have been saved."),
      });
    } catch (error) {
      toast({
        title: t("common.error", "Error"),
        description: t("settings.notificationsUpdateError", "Failed to update notification preferences."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationGroups = [
    {
      title: t("settings.businessNotifications", "Business Notifications"),
      icon: <TrendingUp className="h-5 w-5" />,
      items: [
        {
          key: "salesReports" as const,
          label: t("settings.salesReports", "Sales Reports"),
          description: t("settings.salesReportsDescription", "Receive daily and weekly sales summaries"),
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          key: "inventoryAlerts" as const,
          label: t("settings.inventoryAlerts", "Inventory Alerts"),
          description: t("settings.inventoryAlertsDescription", "Get notified when fuel levels are low"),
          icon: <AlertTriangle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: t("settings.communicationChannels", "Communication Channels"),
      icon: <Bell className="h-5 w-5" />,
      items: [
        {
          key: "emailAlerts" as const,
          label: t("settings.emailNotifications", "Email Notifications"),
          description: t("settings.emailNotificationsDescription", "Receive notifications via email"),
          icon: <Mail className="h-4 w-4" />,
        },
        {
          key: "smsAlerts" as const,
          label: t("settings.smsNotifications", "SMS Notifications"),
          description: t("settings.smsNotificationsDescription", "Receive urgent alerts via SMS"),
          icon: <MessageCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: t("settings.systemNotifications", "System Notifications"),
      icon: <Bell className="h-5 w-5" />,
      items: [
        {
          key: "systemUpdates" as const,
          label: t("settings.systemUpdates", "System Updates"),
          description: t("settings.systemUpdatesDescription", "Get notified about system maintenance and updates"),
          icon: <Bell className="h-4 w-4" />,
          disabled: true, // Always enabled for important system notifications
        },
        {
          key: "securityAlerts" as const,
          label: t("settings.securityAlerts", "Security Alerts"),
          description: t("settings.securityAlertsDescription", "Critical security notifications"),
          icon: <AlertTriangle className="h-4 w-4" />,
          disabled: true, // Always enabled for security
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {notificationGroups.map((group, groupIndex) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {group.icon}
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.items.map((item, itemIndex) => (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <Label htmlFor={item.key} className="text-sm font-medium">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={item.key}
                    checked={preferences[item.key]}
                    onCheckedChange={(checked) => handlePreferenceChange(item.key, checked)}
                    disabled={item.disabled || isLoading}
                  />
                </div>
                {itemIndex < group.items.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading 
            ? t("common.saving", "Saving...") 
            : t("common.save", "Save Preferences")
          }
        </Button>
      </div>
    </div>
  );
} 