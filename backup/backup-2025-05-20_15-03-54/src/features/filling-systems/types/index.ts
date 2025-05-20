/**
 * Type definitions for the Filling Systems feature
 */

/**
 * Represents a filling system in the application domain
 */
export interface FillingSystem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: string;
  tank_id: string;
  tank_name?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Type for creating a new filling system
 */
export interface CreateFillingSystemRequest {
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: string;
  tank_id: string;
  location?: string;
}

/**
 * Type for updating an existing filling system
 */
export interface UpdateFillingSystemRequest {
  name?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  type?: string;
  tank_id?: string;
  location?: string;
}

/**
 * Filling system filtering options
 */
export interface FillingSystemFilters {
  status?: 'active' | 'inactive' | 'maintenance';
  tank_id?: string;
  search?: string;
}

/**
 * Statistics for a filling system
 */
export interface FillingSystemStats {
  total_sales: number;
  total_volume: number;
  average_daily_sales: number;
  last_maintenance?: string;
} 