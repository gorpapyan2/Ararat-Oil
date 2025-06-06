import React, { useState, useEffect } from "react";
import { tanksApi } from '@/core/api';
import { tanksApi, fuelSuppliesApi } from "@/core/api";
import type { Tank } from "@/core/api/types";
import { useTranslation } from "react-i18next";
import { ErrorBoundary } from "@sentry/react";
import { KpiCardGrid } from "./KpiCardGrid";
import { SuppliesTableStandardized } from "./SuppliesTableStandardized";
import { useSuppliesFilters } from "../store/useSuppliesFilters";
import { Button } from "@/core/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { FuelSupply } from "../types";

interface SuppliesDashboardProps {
  className?: string;
}

const SuppliesDashboard: React.FC<SuppliesDashboardProps> = ({ className }) => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const filters = useSuppliesFilters();
  const [fuelSupplies, setFuelSupplies] = useState<FuelSupply[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Use core/api instead of services
        const [tanksResponse] = await Promise.all([
          tanksApi.getTanks()
        ]);

        // TODO: Re-enable fuel supplies once types are aligned
        setFuelSupplies([]);
        setTanks(tanksResponse.data || []);
      } catch (error) {
        console.error("Error loading supplies dashboard data:", error);
        // Set empty arrays on error instead of using mock data
        setFuelSupplies([]);
        setTanks([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate summary data
  const summary = {
    totalLiters: fuelSupplies.reduce((sum, s) => sum + s.quantity_liters, 0),
    totalCost: fuelSupplies.reduce((sum, s) => sum + s.total_cost, 0),
    lastDelivery: fuelSupplies[0]?.delivery_date || new Date().toISOString(),
    currentTankLevel: tanks.reduce((sum, t) => sum + t.current_level, 0),
    tankCapacity: tanks.reduce((sum, t) => sum + t.capacity, 0),
    byFuelType:
      fuelSupplies.reduce(
        (acc, s) => {
          const type = s.tank?.fuel_type || "unknown";
          if (!acc[type]) {
            acc[type] = { quantity: 0, cost: 0, averagePrice: 0 };
          }
          acc[type].quantity += s.quantity_liters;
          acc[type].cost += s.total_cost;
          acc[type].averagePrice = acc[type].cost / acc[type].quantity;
          return acc;
        },
        {} as Record<
          string,
          { quantity: number; cost: number; averagePrice: number }
        >
      ) || {},
  };

  const handleAddSupply = () => {
    // TODO: Implement fuel supply form dialog
    console.log("Add supply clicked - form dialog needed");
    setIsFormOpen(false);
  };

  return (
    <ErrorBoundary fallback={<div>Error loading supplies dashboard</div>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("supplies.title", "Fuel Supplies")}
          </h2>
          <Button onClick={handleAddSupply}>
            <Plus className="mr-2 h-4 w-4" />
            {t("supplies.addSupply", "Add Supply")}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <KpiCardGrid summary={summary} isLoading={loading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SuppliesTableStandardized
            supplies={fuelSupplies}
            isLoading={loading}
            tanks={tanks}
            providers={[]}
          />
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default SuppliesDashboard;