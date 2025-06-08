
import { fillingSystemsApi } from "@/core/api/endpoints/filling-systems";

export const getFillingSystemsWithFilters = async (filters?: any) => {
  const response = await fillingSystemsApi.getFillingSystemsByTank();
  return response.data || [];
};

export const getFillingSystemById = async (id: string) => {
  const response = await fillingSystemsApi.getFillingSystemById(id);
  return response.data;
};

export const createFillingSystem = async (data: any) => {
  const response = await fillingSystemsApi.createFillingSystem(data);
  return response.data;
};

export const updateFillingSystem = async (id: string, data: any) => {
  const response = await fillingSystemsApi.updateFillingSystem(id, data);
  return response.data;
};

export const deleteFillingSystem = async (id: string) => {
  const response = await fillingSystemsApi.deleteFillingSystem(id);
  return response.data;
};

export const validateTankIds = async (tankIds: string[]) => {
  // Simple validation - in a real app, you'd check against the API
  return tankIds.length > 0;
};
