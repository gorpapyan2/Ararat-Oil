import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/page-header";
import { Button } from "@/core/components/ui/button";
import { Settings, User, Bell, Lock, Palette } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "@/core/components/ui/breadcrumbs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/core/components/ui/card";
import { ProfileSettings } from "@/features/settings/components/ProfileSettings";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";
import { SecuritySettings } from "@/features/settings/components/SecuritySettings";
import { ThemeSettings } from "@/features/settings/components/ThemeSettings";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { useAuth } from "@/features/auth";

export function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Configure breadcrumbs
  const breadcrumbSegments = useMemo(
    () => [
      {
        name: t("common.dashboard"),
        href: "/",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        name: t("common.settings"),
        href: "/settings",
        isCurrent: true,
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    [t]
  );

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.settings"),
  });

  const tabItems = [
    {
      value: "profile",
      label: t("settings.profile"),
      icon: <User className="h-4 w-4" />,
      component: <ProfileSettings />,
    },
    {
      value: "notifications",
      label: t("settings.notifications"),
      icon: <Bell className="h-4 w-4" />,
      component: <NotificationSettings />,
    },
    {
      value: "security",
      label: t("settings.security"),
      icon: <Lock className="h-4 w-4" />,
      component: <SecuritySettings />,
    },
    {
      value: "appearance",
      label: t("settings.appearance"),
      icon: <Palette className="h-4 w-4" />,
      component: <ThemeSettings />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 space-y-6">
      <PageHeader
        title={t("common.settings")}
        description={t("settings.description", "Manage your account settings and preferences")}
        className="text-white"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700/50">
          {tabItems.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            <Card className="bg-gray-800/50 backdrop-blur border border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {tab.icon}
                  {tab.label}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t(`settings.${tab.value}Description`, `Configure your ${tab.label.toLowerCase()} settings`)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tab.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
