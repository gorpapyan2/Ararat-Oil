import { FuelSupply, CreateFuelSupplyRequest, UpdateFuelSupplyRequest } from "../types";

const API_BASE = "/api/fuel-supplies";

export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  const response = await fetch(`${API_BASE}`);
  if (!response.ok) {
    throw new Error("Failed to fetch fuel supplies");
  }
  return response.json();
}

export async function createFuelSupply(supply: CreateFuelSupplyRequest): Promise<FuelSupply> {
  const response = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supply),
  });
  if (!response.ok) {
    throw new Error("Failed to create fuel supply");
  }
  return response.json();
}

export async function updateFuelSupply(
  id: string,
  supply: UpdateFuelSupplyRequest
): Promise<FuelSupply> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supply),
  });
  if (!response.ok) {
    throw new Error("Failed to update fuel supply");
  }
  return response.json();
}

export async function deleteFuelSupply(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete fuel supply");
  }
} 