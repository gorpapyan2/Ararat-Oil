import React from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/page-header";
import { Home } from "lucide-react";
import { BreadcrumbPageWrapper } from "@/core/providers/BreadcrumbPageWrapper";

export default function IndexPage() {
  const { t } = useTranslation();
  
  return (
    <BreadcrumbPageWrapper
      breadcrumbs={[
        { 
          name: t("common.dashboard"), 
          href: "/", 
          icon: <Home className="h-4 w-4" />,
          isCurrent: true
        }
      ].map(crumb => ({
        ...crumb,
        label: crumb.name
      }))}
      title={t("common.dashboard")}
    >
      <div className="space-y-6">
        <PageHeader
          title={t("common.dashboard")}
          description={t("dashboard.description") || "Welcome to Ararat Oil management system"}
          icon={<Home className="h-6 w-6 mr-2" />}
        />
        
        {/* Dashboard content would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample cards */}
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">Quick Stats</h3>
            <p className="text-muted-foreground">Content would go here</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">Recent Activity</h3>
            <p className="text-muted-foreground">Content would go here</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-2">Notifications</h3>
            <p className="text-muted-foreground">Content would go here</p>
          </div>
        </div>
      </div>
    </BreadcrumbPageWrapper>
  );
} 