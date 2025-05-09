import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconGasStation, IconTank, IconTruck, IconArrowRight, IconBuildingFactory, IconTag } from "@tabler/icons-react";
import { supabase } from "@/services/supabase";

export default function FuelManagementDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch summary data for each section
  const { data: fillingSystems } = useQuery({
    queryKey: ["filling-systems-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("filling_systems")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: tanks } = useQuery({
    queryKey: ["tanks-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("fuel_tanks")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: fuelSupplies } = useQuery({
    queryKey: ["fuel-supplies-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("fuel_supplies")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: providers } = useQuery({
    queryKey: ["providers-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("petrol_providers")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.fuelManagement")}
        description={t("fuelManagement.description") || "Manage your fuel systems, tanks, supplies, and prices"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Filling Systems Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconGasStation className="h-5 w-5 mr-2 text-primary" />
              {t("common.fillingSystems")}
            </CardTitle>
            <CardDescription>{t("fillingSystems.description") || "Manage your fuel dispensers"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fillingSystems?.count || 0}</div>
            <p className="text-sm text-muted-foreground">{t("fuelManagement.totalFillingSystems")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("filling-systems")}>
              {t("common.manage")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Tanks Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTank className="h-5 w-5 mr-2 text-primary" />
              {t("common.tanks")}
            </CardTitle>
            <CardDescription>{t("tanks.description") || "Manage your fuel storage tanks"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tanks?.count || 0}</div>
            <p className="text-sm text-muted-foreground">{t("fuelManagement.totalTanks")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("tanks")}>
              {t("common.manage")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Fuel Supplies Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTruck className="h-5 w-5 mr-2 text-primary" />
              {t("common.fuelSupplies")}
            </CardTitle>
            <CardDescription>{t("fuelSupplies.description") || "Track your fuel supply deliveries"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fuelSupplies?.count || 0}</div>
            <p className="text-sm text-muted-foreground">{t("fuelManagement.totalFuelSupplies")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("fuel-supplies")}>
              {t("common.manage")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Providers Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconBuildingFactory className="h-5 w-5 mr-2 text-primary" />
              {t("common.providers")}
            </CardTitle>
            <CardDescription>{t("providers.description") || "Manage your fuel suppliers"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers?.count || 0}</div>
            <p className="text-sm text-muted-foreground">{t("fuelManagement.totalProviders")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("providers")}>
              {t("common.manage")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Fuel Prices Card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTag className="h-5 w-5 mr-2 text-primary" />
              {t("common.fuelPrices")}
            </CardTitle>
            <CardDescription>{t("fuelPrices.description") || "Manage your fuel prices"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t("fuelManagement.priceManagement")}</div>
            <p className="text-sm text-muted-foreground">{t("fuelManagement.updateFuelPrices")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("fuel-prices")}>
              {t("common.manage")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 