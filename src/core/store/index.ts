/**
 * Core State Management Exports
 *
 * This file centralizes exports for all core state management modules.
 * Import from this file rather than from individual store files.
 */

export * from "./appStore";
export * from "./authStore";
export * from "./storeTypes";
export * from "./todoStore";

// Export hooks for using stores
export { useStore } from "./hooks/useStore";

// Export Zustand and store utilities for custom store creation
export { create } from "zustand";
export type { StateCreator } from "zustand";
