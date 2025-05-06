import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FillingSystemManagerStandardized } from "@/components/filling-systems/FillingSystemManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { Home, Fuel, Settings } from "lucide-react";
import { IconGasStation } from "@tabler/icons-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function FillingSystemsPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: [
      { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
      { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
      { 
        name: t("common.fillingSystems"), 
        href: "/fuel-management/filling-systems", 
        isCurrent: true,
        icon: <Settings className="h-4 w-4" />
      }
    ],
    title: t("common.fillingSystems")
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.fillingSystems")}
        description={t("fillingSystems.description") || "Manage your fuel dispensers and pumps"}
        icon={<IconGasStation className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <FillingSystemManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 