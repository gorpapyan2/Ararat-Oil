import React, { useState, lazy, Suspense, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IconUser,
  IconMoon,
  IconBell,
  IconLock,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page-header";
import { Home, Settings } from "lucide-react";
import { BreadcrumbPageWrapper } from "@/core/providers/BreadcrumbPageWrapper";

// Lazy load settings sections
const ProfileSettings = lazy(() => import("./ProfileSettings"));
const AppearanceSettings = lazy(() => import("./AppearanceSettings"));
const NotificationSettings = lazy(() => import("./NotificationSettings"));
const SecuritySettings = lazy(() => import("./SecuritySettings"));

export default function SettingsPage() {
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
    <BreadcrumbPageWrapper
      breadcrumbs={[
        { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
        { 
          name: t("common.settings"), 
          href: "/settings", 
          icon: <Settings className="h-4 w-4" />,
          isCurrent: true
        }
      ]}
      title={t("common.settings")}
    >
      <div className="space-y-6">
        <PageHeader
          title={t("common.settings")}
          description={t("settings.description") || "Configure your application settings"}
          icon={<Settings className="h-6 w-6 mr-2" />}
        />
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-4">User Preferences</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm">
                    <option>English</option>
                    <option>Armenian</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <div>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BreadcrumbPageWrapper>
  );
} 