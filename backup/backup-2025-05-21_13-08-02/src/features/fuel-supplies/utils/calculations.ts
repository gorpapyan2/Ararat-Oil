/**
 * Fuel Supply Calculation Utilities
 * Feature-specific utilities for fuel supply calculations
 */

/**
 * Calculates the cost per liter of fuel
 * @param totalCost Total cost of the fuel supply
 * @param volume Volume in liters
 * @returns Cost per liter
 */
export function calculateCostPerLiter(totalCost: number, volume: number): number {
  if (!volume || volume <= 0) return 0;
  return totalCost / volume;
}

/**
 * Calculates the total cost of a fuel supply
 * @param costPerLiter Cost per liter
 * @param volume Volume in liters
 * @returns Total cost
 */
export function calculateTotalCost(costPerLiter: number, volume: number): number {
  return costPerLiter * volume;
}

/**
 * Calculates the expected volume from tank readings
 * @param startLevel Starting level in liters
 * @param endLevel Ending level in liters
 * @returns Expected volume based on tank readings
 */
export function calculateExpectedVolume(startLevel: number, endLevel: number): number {
  return Math.max(0, endLevel - startLevel);
}

/**
 * Calculates the volume discrepancy between expected and reported
 * @param expectedVolume Expected volume from tank readings
 * @param reportedVolume Reported volume from delivery
 * @returns Discrepancy in liters (positive means excess)
 */
export function calculateVolumeDiscrepancy(expectedVolume: number, reportedVolume: number): number {
  return reportedVolume - expectedVolume;
}

/**
 * Checks if volume discrepancy exceeds acceptable threshold
 * @param discrepancy Volume discrepancy in liters
 * @param reportedVolume Reported volume in liters
 * @param threshold Acceptable threshold percentage (default: 2%)
 * @returns True if discrepancy exceeds threshold
 */
export function isDiscrepancySignificant(
  discrepancy: number, 
  reportedVolume: number, 
  threshold = 0.02
): boolean {
  if (reportedVolume === 0) return false;
  return Math.abs(discrepancy / reportedVolume) > threshold;
} 