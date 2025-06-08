/**
 * Centralized Tank Type Definitions
 * 
 * This file contains all tank-related type definitions used across the application.
 * Import from this file instead of creating duplicate type definitions.
 */

/**
 * Base fuel type interface
 */
export interface FuelType {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

/**
 * Tank level change record
 */
export interface TankLevelChange {
  id: string;
  tank_id: string;
  previous_level: number;
  new_level: number;
  change_amount: number;
  change_type: 'add' | 'subtract';
  reason?: string;
  created_at: string;
  created_by?: string;
}

/**
 * Main Tank/FuelTank interface
 * This is the canonical definition used throughout the application
 */
export interface Tank {
  id: string;
  name: string;
  fuel_type_id: string;
  fuel_type?: FuelType;
  capacity: number;
  current_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Optional fields for extended functionality
  location?: string;
  last_filled_at?: string;
  installation_date?: string;
  notes?: string;
}

/**
 * Alias for backward compatibility
 */
export type FuelTank = Tank;

/**
 * Tank creation request payload
 */
export interface TankCreate {
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  is_active: boolean;
  location?: string;
  notes?: string;
}

/**
 * Tank update request payload
 */
export interface TankUpdate {
  name?: string;
  capacity?: number;
  current_level?: number;
  fuel_type_id?: string;
  is_active?: boolean;
  location?: string;
  notes?: string;
}

/**
 * Tank level adjustment request
 */
export interface TankLevelAdjustment {
  change_amount: number;
  change_type: 'add' | 'subtract';
  reason?: string;
}

/**
 * Tank summary statistics
 */
export interface TankSummary {
  totalTanks: number;
  activeTanks: number;
  totalCapacity: number;
  totalCurrentLevel: number;
  lowLevelTanks: number;
  criticalLevelTanks: number;
}

/**
 * Tank status helper type
 */
export type TankStatus = 'active' | 'maintenance' | 'inactive';

/**
 * Tank level status based on capacity percentage
 */
export type TankLevelStatus = 'critical' | 'low' | 'normal' | 'high' | 'full';

/**
 * Helper type for tank with computed properties
 */
export interface TankWithStatus extends Tank {
  status: TankStatus;
  levelStatus: TankLevelStatus;
  percentFull: number;
  availableCapacity: number;
} 