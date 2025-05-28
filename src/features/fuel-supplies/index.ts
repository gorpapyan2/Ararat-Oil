/**
 * Fuel Supplies Feature
 *
 * This feature manages fuel supply records, including deliveries from providers,
 * quantity tracking, pricing, and inventory management.
 */

// Re-export components
export { FuelSuppliesTable } from "./components/FuelSuppliesTable";
export { FuelSuppliesSummary } from "./components/summary/FuelSuppliesSummary";
export { FuelSuppliesManagerStandardized } from "./components/FuelSuppliesManagerStandardized";

// Re-export hooks
export { useFuelSupplies } from "./hooks/useFuelSupplies";
export type { FuelSuppliesFilters } from "./hooks/useFuelSupplies";
export { useFuelSuppliesFilters } from "./hooks/useFuelSuppliesFilters";
export type { FuelSuppliesFilterState } from "./hooks/useFuelSuppliesFilters";

// Re-export services
export { fuelSuppliesService } from "./services";

// Re-export utilities
export {
  calculateCostPerLiter,
  calculateTotalCost,
  calculateExpectedVolume,
  calculateVolumeDiscrepancy,
  isDiscrepancySignificant,
} from "./utils/calculations";

// Re-export types
export type {
  FuelSupply,
  CreateFuelSupplyRequest,
  UpdateFuelSupplyRequest,
} from "./types";
