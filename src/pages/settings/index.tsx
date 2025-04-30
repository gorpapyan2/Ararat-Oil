import React, { useState, lazy, Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IconUser,
  IconMoon,
  IconBell,
  IconLock,
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from "@/components/ui-custom/page-header";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoutePrefetch } from "@/hooks/useRoutePrefetch";

// Lazy load settings sections
const ProfileSettings = lazy(() => import("./ProfileSettings"));
const AppearanceSettings = lazy(() => import("./AppearanceSettings"));
const NotificationSettings = lazy(() => import("./NotificationSettings"));
const SecuritySettings = lazy(() => import("./SecuritySettings"));

export default function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");

  // Prefetch the next likely tab when user is on the current tab
  const tabMap = {
    profile: "appearance",
    appearance: "notifications",
    notifications: "security",
    security: "profile"
  };

  // Prefetch the next tab after a delay
  const nextTab = tabMap[activeTab as keyof typeof tabMap];
  
  // Use useCallback to memoize the function
  const prefetchNextTab = useCallback(() => {
    switch (nextTab) {
      case "profile": 
        import("./ProfileSettings");
        break;
      case "appearance": 
        import("./AppearanceSettings");
        break;
      case "notifications": 
        import("./NotificationSettings");
        break;
      case "security": 
        import("./SecuritySettings");
        break;
    }
  }, [nextTab]);

  // Use timeout to delay prefetching
  React.useEffect(() => {
    const timeoutId = setTimeout(prefetchNextTab, 2000);
    return () => clearTimeout(timeoutId);
  }, [prefetchNextTab]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <Suspense fallback={<Loading variant="inline" text="Loading profile settings..." />}>
            <ProfileSettings />
          </Suspense>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Suspense fallback={<Loading variant="inline" text="Loading appearance settings..." />}>
            <AppearanceSettings />
          </Suspense>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Suspense fallback={<Loading variant="inline" text="Loading notification settings..." />}>
            <NotificationSettings />
          </Suspense>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Suspense fallback={<Loading variant="inline" text="Loading security settings..." />}>
            <SecuritySettings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
} 