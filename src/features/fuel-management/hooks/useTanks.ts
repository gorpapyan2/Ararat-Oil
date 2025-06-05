/**
 * @deprecated This file has been superseded by @/shared/hooks/useTanks
 * Please import tank hooks from @/shared/hooks/useTanks instead
 * 
 * This file is maintained for backward compatibility but will be removed in a future version.
 */

export {
  useTanks,
  useTank,
  useTankLevelChanges,
  useFuelTypes,
  useTankMutations,
  useTanksManager,
  TANK_QUERY_KEYS,
} from "@/shared/hooks/useTanks";

// Re-export types for backward compatibility
export type {
  Tank,
  FuelTank,
  TankCreate,
  TankUpdate,
  TankLevelChange,
  FuelType,
} from "@/shared/types/tank.types";
