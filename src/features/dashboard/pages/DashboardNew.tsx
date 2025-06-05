import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useToast } from "@/hooks";
import { DashboardMetrics, IncomeExpenseOverview } from "@/features/dashboard";
import { fetchDashboardData } from "@/features/dashboard/services/dashboard";
import type { DashboardData } from "@/features/dashboard/types";

function DashboardNew() {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading dashboard data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-6">
      <DashboardMetrics />
      <IncomeExpenseOverview />
    </div>
  );
}

export default DashboardNew;
