export * from "./fuelSuppliesService";

// New API-based service implementation
import { fuelSuppliesApi } from "@/core/api/endpoints/fuel-supplies";
import type {
  FuelSupplyCreate,
  FuelSupplyUpdate,
  FuelSupply as ApiFuelSupply,
} from "@/core/api/types";
import type {
  FuelSupply,
  CreateFuelSupplyRequest,
  UpdateFuelSupplyRequest,
} from "../types";

// Extended API response type that includes relations
interface ApiFuelSupplyWithRelations extends ApiFuelSupply {
  tank_id?: string;
  shift_id?: string;
  payment_method?: string;
  payment_status?: string;
  provider?: { id: string; name: string };
  tank?: { id: string; name: string };
  employee?: { id: string; name: string };
}

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiSupply: ApiFuelSupplyWithRelations): FuelSupply {
  return {
    id: apiSupply.id,
    delivery_date: apiSupply.delivery_date,
    provider_id: apiSupply.supplier_id,
    tank_id: apiSupply.tank_id || "",
    quantity_liters: apiSupply.quantity,
    price_per_liter: apiSupply.unit_price,
    total_cost: apiSupply.total_price,
    comments: apiSupply.notes || "",
    shift_id: apiSupply.shift_id || "",
    payment_method: apiSupply.payment_method || "",
    payment_status: apiSupply.payment_status || "",
    created_at: apiSupply.created_at,
    updated_at: apiSupply.updated_at,
    provider: apiSupply.provider,
    tank: apiSupply.tank,
    employee: apiSupply.employee,
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(
  featureSupply: CreateFuelSupplyRequest
): FuelSupplyCreate {
  return {
    supplier_id: featureSupply.provider_id,
    fuel_type_id: featureSupply.tank_id, // This is just a guess - we may need proper mapping
    quantity: featureSupply.quantity_liters,
    unit_price: featureSupply.price_per_liter,
    total_price: featureSupply.total_cost,
    delivery_date: featureSupply.delivery_date,
    notes: featureSupply.comments,
  };
}

// Type for filters used in getFuelSupplies
interface FuelSupplyFilters {
  dateRange?: { from: Date; to: Date };
  providerId?: string;
  tankId?: string;
  paymentStatus?: string;
  searchQuery?: string;
}

/**
 * Gets all fuel supplies with optional filters
 */
export async function getFuelSupplies(filters?: FuelSupplyFilters) {
  const response = await fuelSuppliesApi.getFuelSupplies();

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response to feature type
  let supplies = (response.data || []).map(adaptApiResponseToFeatureType);

  // Apply filters client-side (these should eventually move to the API)
  if (filters) {
    if (filters.dateRange) {
      const fromDate = new Date(filters.dateRange.from).getTime();
      const toDate = new Date(filters.dateRange.to).getTime();
      supplies = supplies.filter((supply) => {
        const deliveryDate = new Date(supply.delivery_date).getTime();
        return deliveryDate >= fromDate && deliveryDate <= toDate;
      });
    }

    if (filters.providerId) {
      supplies = supplies.filter(
        (supply) => supply.provider_id === filters.providerId
      );
    }

    if (filters.tankId) {
      supplies = supplies.filter((supply) => supply.tank_id === filters.tankId);
    }

    if (filters.paymentStatus) {
      supplies = supplies.filter(
        (supply) => supply.payment_status === filters.paymentStatus
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      supplies = supplies.filter((supply) =>
        supply.comments?.toLowerCase().includes(query)
      );
    }
  }

  return supplies;
}

/**
 * Creates a new fuel supply
 */
export async function createFuelSupply(data: CreateFuelSupplyRequest) {
  // Convert feature type to API request
  const apiData = adaptFeatureTypeToApiRequest(data);

  const response = await fuelSuppliesApi.createFuelSupply(apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response back to feature type
  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Updates an existing fuel supply
 */
export async function updateFuelSupply(
  id: string,
  data: UpdateFuelSupplyRequest
) {
  // Convert feature type to API update request
  const apiData: FuelSupplyUpdate = {};

  if (data.provider_id) apiData.supplier_id = data.provider_id;
  if (data.tank_id) apiData.fuel_type_id = data.tank_id;
  if (data.quantity_liters !== undefined)
    apiData.quantity = data.quantity_liters;
  if (data.price_per_liter !== undefined)
    apiData.unit_price = data.price_per_liter;
  if (data.total_cost !== undefined) apiData.total_price = data.total_cost;
  if (data.delivery_date) apiData.delivery_date = data.delivery_date;
  if (data.comments) apiData.notes = data.comments;

  const response = await fuelSuppliesApi.updateFuelSupply(id, apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response back to feature type
  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Deletes a fuel supply
 */
export async function deleteFuelSupply(id: string) {
  const response = await fuelSuppliesApi.deleteFuelSupply(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export const fuelSuppliesService = {
  getFuelSupplies,
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
};
