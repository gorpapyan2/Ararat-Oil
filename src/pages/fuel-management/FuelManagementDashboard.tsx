import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconGasStation, IconTank, IconTruck, IconArrowRight } from "@tabler/icons-react";
import { supabase } from "@/integrations/supabase/client";

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
        .from("tanks")
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.fuelManagement")}
        description={t("fuelManagement.description") || "Manage your fuel systems, tanks, and supplies"}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filling Systems Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <IconGasStation className="mr-2 h-5 w-5 text-primary" />
              {t("common.fillingSystems")}
            </CardTitle>
            <CardDescription>
              {t("fillingSystems.description") || "Manage your fuel dispensers and pumps"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fillingSystems?.count || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t("fillingSystems.totalCount", { count: fillingSystems?.count || 0 })}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/fuel-management/filling-systems")}
            >
              {t("common.manage")}
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Tanks Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <IconTank className="mr-2 h-5 w-5 text-primary" />
              {t("common.tanks")}
            </CardTitle>
            <CardDescription>
              {t("tanks.description") || "Manage your fuel storage tanks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tanks?.count || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t("tanks.totalCount", { count: tanks?.count || 0 })}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/fuel-management/tanks")}
            >
              {t("common.manage")}
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Fuel Supplies Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <IconTruck className="mr-2 h-5 w-5 text-primary" />
              {t("common.fuelSupplies")}
            </CardTitle>
            <CardDescription>
              {t("fuelSupplies.description") || "Track your fuel supply deliveries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fuelSupplies?.count || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t("fuelSupplies.totalCount", { count: fuelSupplies?.count || 0 })}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/fuel-management/fuel-supplies")}
            >
              {t("common.manage")}
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 