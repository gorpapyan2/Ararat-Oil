import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { PageHeader } from "@/core/components/ui/page-header";
import { IconGasStation, IconTank, IconTruck, IconCoin } from "@/core/components/ui/icons";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { useTranslation } from "react-i18next";
import { useBreadcrumbs } from "@/core/providers/BreadcrumbProvider";

// Import from feature modules
import { FillingSystemManagerStandardized } from "@/features/filling-systems";
import { TankManager } from "@/features/tanks";
import { FuelSuppliesManagerStandardized } from "@/features/fuel-supplies";

// Tab values
const TABS = {
  FILLING_SYSTEMS: "filling-systems",
  TANKS: "tanks",
  FUEL_SUPPLIES: "fuel-supplies",
};

export default function FuelManagement() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const breadcrumbSegments = useMemo(
    () => [
      { name: "Dashboard", href: "/" },
      { name: "Fuel Management", href: "/fuel-management", isCurrent: true },
    ],
    []
  );

  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: "Fuel Management",
  });

  // Get active tab from URL or default to filling systems
  const activeTab = searchParams.get("tab") || TABS.FILLING_SYSTEMS;

  // State for action buttons (passed to child components)
  const [fillingSystemsAction, setFillingSystemsAction] =
    useState<React.ReactNode>(null);
  const [tanksAction, setTanksAction] = useState<React.ReactNode>(null);
  const [fuelSuppliesAction, setFuelSuppliesAction] =
    useState<React.ReactNode>(null);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    searchParams.set("tab", value);
    setSearchParams(searchParams);
  };

  // Get the current action based on active tab
  const getCurrentAction = () => {
    switch (activeTab) {
      case TABS.FILLING_SYSTEMS:
        return fillingSystemsAction;
      case TABS.TANKS:
        return tanksAction;
      case TABS.FUEL_SUPPLIES:
        return fuelSuppliesAction;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t("common.fuelManagement")}
        description={
          t("fuelManagement.description") ||
          "Manage your fuel systems, tanks, and supplies"
        }
        actions={getCurrentAction()}
      />

      {/* Tabs Navigation */}
      <Tabs
        defaultValue={activeTab}
        onValueChange={handleTabChange}
        value={activeTab}
        className="w-full"
      >
        <div className="border-b">
          <TabsList className="bg-transparent h-12 p-0 w-full justify-start space-x-2">
            <TabsTrigger
              value={TABS.FILLING_SYSTEMS}
              className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconGasStation className="h-4 w-4 mr-2" />
              {t("common.fillingSystems")}
            </TabsTrigger>

            <TabsTrigger
              value={TABS.TANKS}
              className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconTank className="h-4 w-4 mr-2" />
              {t("common.tanks")}
            </TabsTrigger>

            <TabsTrigger
              value={TABS.FUEL_SUPPLIES}
              className="data-[state=active]:bg-gray-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconTruck className="h-4 w-4 mr-2" />
              {t("common.fuelSupplies")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value={TABS.FILLING_SYSTEMS} className="m-0">
            <FillingSystemManagerStandardized
              onRenderAction={setFillingSystemsAction}
            />
          </TabsContent>

          <TabsContent value={TABS.TANKS} className="m-0">
            <TankManager onRenderAction={setTanksAction} />
          </TabsContent>

          <TabsContent value={TABS.FUEL_SUPPLIES} className="m-0">
            <FuelSuppliesManagerStandardized
              onRenderAction={setFuelSuppliesAction}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
