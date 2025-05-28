/**
 * Type definitions for the Tanks feature
 */

export * from "./tanks.types";

// Re-export a specific Tank type for other features to use
export type Tank = import("./tanks.types").FuelTank;
