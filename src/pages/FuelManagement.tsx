import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui-custom/page-header";
import { IconGasStation, IconTank, IconTruck } from "@tabler/icons-react";

// Import existing managers
import { FillingSystemManager } from "@/components/filling-systems/FillingSystemManager";
import { TankManager } from "@/components/tanks/TankManager";
import { FuelSuppliesManager } from "@/components/fuel-supplies/FuelSuppliesManager";
import { useTranslation } from "react-i18next";

// Tab values
const TABS = {
  FILLING_SYSTEMS: "filling-systems",
  TANKS: "tanks",
  FUEL_SUPPLIES: "fuel-supplies",
};

export default function FuelManagement() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

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
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconGasStation className="h-4 w-4 mr-2" />
              {t("common.fillingSystems")}
            </TabsTrigger>

            <TabsTrigger
              value={TABS.TANKS}
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconTank className="h-4 w-4 mr-2" />
              {t("common.tanks")}
            </TabsTrigger>

            <TabsTrigger
              value={TABS.FUEL_SUPPLIES}
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 h-12"
            >
              <IconTruck className="h-4 w-4 mr-2" />
              {t("common.fuelSupplies")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value={TABS.FILLING_SYSTEMS} className="m-0">
            <FillingSystemManager />
          </TabsContent>

          <TabsContent value={TABS.TANKS} className="m-0">
            <TankManager onRenderAction={setTanksAction} />
          </TabsContent>

          <TabsContent value={TABS.FUEL_SUPPLIES} className="m-0">
            <FuelSuppliesManager onRenderAction={setFuelSuppliesAction} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
