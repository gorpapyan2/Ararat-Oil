import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FuelTypeCode, PaymentStatus } from "@/types";
import { SalesFilters } from "../types";

interface UseSalesFiltersProps {
  defaultFilters?: Partial<SalesFilters>;
}

export function useSalesFilters({
  defaultFilters = {},
}: UseSalesFiltersProps = {}) {
  const { t } = useTranslation(["common", "sales"]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params or defaults
  const initialFilters: SalesFilters = useMemo(() => {
    const searchTerm =
      searchParams.get("search") || defaultFilters.searchTerm || "";
    const fuelType = (searchParams.get("fuelType") ||
      defaultFilters.fuelType ||
      "all") as FuelTypeCode | "all";
    const paymentStatus = (searchParams.get("paymentStatus") ||
      defaultFilters.paymentStatus ||
      "all") as PaymentStatus | "all";
    const fillingSystem =
      searchParams.get("fillingSystem") ||
      defaultFilters.fillingSystem ||
      "all";

    // Handle date range
    let dateRange: SalesFilters["dateRange"] = undefined;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (startDate) {
      dateRange = {
        from: new Date(startDate),
        to: endDate ? new Date(endDate) : undefined,
      };
    } else if (defaultFilters.dateRange) {
      dateRange = defaultFilters.dateRange;
    }

    // Handle min/max quantity
    const minQuantity = searchParams.get("minQuantity")
      ? Number(searchParams.get("minQuantity"))
      : defaultFilters.minQuantity;

    const maxQuantity = searchParams.get("maxQuantity")
      ? Number(searchParams.get("maxQuantity"))
      : defaultFilters.maxQuantity;

    // Handle min/max amount
    const minAmount = searchParams.get("minAmount")
      ? Number(searchParams.get("minAmount"))
      : defaultFilters.minAmount;

    const maxAmount = searchParams.get("maxAmount")
      ? Number(searchParams.get("maxAmount"))
      : defaultFilters.maxAmount;

    return {
      searchTerm,
      dateRange,
      fuelType,
      paymentStatus,
      fillingSystem,
      minQuantity,
      maxQuantity,
      minAmount,
      maxAmount,
    };
  }, [searchParams, defaultFilters]);

  const [filters, setFilters] = useState<SalesFilters>(initialFilters);

  // Sync filters with URL params
  const updateFilters = useCallback(
    (newFilters: Partial<SalesFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // Update URL params
      const params = new URLSearchParams();

      if (updatedFilters.searchTerm)
        params.set("search", updatedFilters.searchTerm);
      if (updatedFilters.fuelType && updatedFilters.fuelType !== "all") {
        params.set("fuelType", updatedFilters.fuelType);
      }
      if (
        updatedFilters.paymentStatus &&
        updatedFilters.paymentStatus !== "all"
      ) {
        params.set("paymentStatus", updatedFilters.paymentStatus);
      }
      if (
        updatedFilters.fillingSystem &&
        updatedFilters.fillingSystem !== "all"
      ) {
        params.set("fillingSystem", updatedFilters.fillingSystem);
      }

      // Handle date range
      if (updatedFilters.dateRange?.from) {
        params.set(
          "startDate",
          updatedFilters.dateRange.from.toISOString().split("T")[0]
        );

        if (updatedFilters.dateRange.to) {
          params.set(
            "endDate",
            updatedFilters.dateRange.to.toISOString().split("T")[0]
          );
        }
      }

      // Handle min/max quantity
      if (updatedFilters.minQuantity)
        params.set("minQuantity", updatedFilters.minQuantity.toString());
      if (updatedFilters.maxQuantity)
        params.set("maxQuantity", updatedFilters.maxQuantity.toString());

      // Handle min/max amount
      if (updatedFilters.minAmount)
        params.set("minAmount", updatedFilters.minAmount.toString());
      if (updatedFilters.maxAmount)
        params.set("maxAmount", updatedFilters.maxAmount.toString());

      setSearchParams(params);
    },
    [filters, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters as SalesFilters);
    setSearchParams(new URLSearchParams());
  }, [defaultFilters, setSearchParams]);

  // Predefined filter options
  const filterOptions = useMemo(() => {
    return {
      fuelTypes: [
        { value: "all", label: t("common:all") },
        { value: "diesel", label: t("sales:fuelTypes.diesel") },
        { value: "gas", label: t("sales:fuelTypes.gas") },
        { value: "petrol_regular", label: t("sales:fuelTypes.petrol_regular") },
        { value: "petrol_premium", label: t("sales:fuelTypes.petrol_premium") },
      ],
      paymentStatuses: [
        { value: "all", label: t("common:all") },
        { value: "pending", label: t("sales:paymentStatuses.pending") },
        { value: "completed", label: t("sales:paymentStatuses.completed") },
        { value: "cancelled", label: t("sales:paymentStatuses.cancelled") },
        { value: "paid", label: t("sales:paymentStatuses.paid") },
        { value: "failed", label: t("sales:paymentStatuses.failed") },
        { value: "refunded", label: t("sales:paymentStatuses.refunded") },
      ],
    };
  }, [t]);

  return {
    filters,
    updateFilters,
    resetFilters,
    filterOptions,
  };
}
