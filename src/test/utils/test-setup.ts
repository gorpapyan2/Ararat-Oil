/**
 * Re-export test utilities from the JSX implementation
 * This avoids JSX syntax in .ts files
 */
export {
  createTestQueryClient,
  setupHookTest,
  setupErrorTest,
  setupMutationTest,
} from "./test-setup.impl";
