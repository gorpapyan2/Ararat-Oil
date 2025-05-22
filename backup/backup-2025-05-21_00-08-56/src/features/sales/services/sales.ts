import { salesApi } from '@/core/api';
import { 
  Sale, 
  CreateSaleRequest, 
  UpdateSaleRequest, 
  SalesFilters,
  SalesExportOptions 
} from '../types';

/**
 * Fetches all sales with optional filters
 */
export const fetchSales = async (filters?: SalesFilters): Promise<Sale[]> => {
  const transformedFilters = filters 
    ? {
        ...filters,
        dateRange: filters.dateRange
          ? {
              from: filters.dateRange.from.toISOString(),
              to: filters.dateRange.to?.toISOString() || new Date().toISOString(),
            }
          : undefined,
      }
    : undefined;

  const response = await salesApi.getSales(transformedFilters);
  return response.data;
};

/**
 * Fetches a single sale by ID
 */
export const fetchSale = async (id: string): Promise<Sale> => {
  const response = await salesApi.getSaleById(id);
  return response.data;
};

/**
 * Creates a new sale
 */
export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const transformedData = {
    ...data,
    saleDate: typeof data.saleDate === 'object' 
      ? data.saleDate.toISOString() 
      : data.saleDate
  };
  
  const response = await salesApi.createSale(transformedData);
  return response.data;
};

/**
 * Updates an existing sale
 */
export const updateSale = async (id: string, data: Partial<CreateSaleRequest>): Promise<Sale> => {
  const transformedData = {
    ...data,
    saleDate: data.saleDate && typeof data.saleDate === 'object' 
      ? data.saleDate.toISOString() 
      : data.saleDate
  };
  
  const response = await salesApi.updateSale(id, transformedData);
  return response.data;
};

/**
 * Deletes a sale
 */
export const deleteSale = async (id: string): Promise<{ message: string }> => {
  const response = await salesApi.deleteSale(id);
  return response.data;
};

/**
 * Exports sales data based on provided options
 */
export const exportSales = async (options: SalesExportOptions): Promise<string> => {
  const transformedOptions = {
    ...options,
    startDate: typeof options.startDate === 'object' 
      ? options.startDate.toISOString() 
      : options.startDate,
    endDate: options.endDate && typeof options.endDate === 'object' 
      ? options.endDate.toISOString() 
      : options.endDate
  };
  
  return await salesApi.exportSales(transformedOptions);
}; 