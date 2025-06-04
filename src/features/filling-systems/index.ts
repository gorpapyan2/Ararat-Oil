/**
 * Filling Systems Feature
 *
 * This feature manages fuel dispensing systems, including creating, updating,
 * and associating them with fuel tanks. It provides components for managing
 * filling systems and diagnosing issues with tank associations.
 */

// Re-export components
export { FillingSystemManagerStandardized } from "./components/FillingSystemManagerStandardized";
export { FillingSystemFormStandardized } from "./components/FillingSystemFormStandardized";
export { FillingSystemList } from "./components/FillingSystemList";
export { FillingSystemHeader } from "./components/FillingSystemHeader";
export { ConfirmDeleteDialogStandardized } from "./components/ConfirmDeleteDialogStandardized";

// Re-export hooks
export { useFillingSystem } from "./hooks/useFillingSystem";

// Re-export types
export * from "./types";

// Re-export services
export * from "./services";
