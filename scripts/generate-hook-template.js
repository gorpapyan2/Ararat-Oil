/**
 * Hook Template Generator Script
 * 
 * This script generates a standardized hook template following
 * the patterns defined in the hook standardization guide.
 * 
 * Usage: node scripts/generate-hook-template.js <feature-name> <hook-name>
 * Example: node scripts/generate-hook-template.js filling-systems useFillingSystem
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const FEATURES_DIR = path.resolve(SRC_DIR, 'features');

// Colors for console output
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m'
};

/**
 * Get command line arguments
 */
function getArgs() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error(`${COLORS.RED}Error: Incorrect number of arguments${COLORS.RESET}`);
    console.log(`Usage: node scripts/generate-hook-template.js <feature-name> <hook-name>`);
    console.log(`Example: node scripts/generate-hook-template.js filling-systems useFillingSystem`);
    process.exit(1);
  }
  
  return {
    featureName: args[0],
    hookName: args[1]
  };
}

/**
 * Validate feature exists
 */
function validateFeature(featureName) {
  const featureDir = path.join(FEATURES_DIR, featureName);
  
  if (!fs.existsSync(featureDir)) {
    console.error(`${COLORS.RED}Error: Feature '${featureName}' does not exist at ${featureDir}${COLORS.RESET}`);
    process.exit(1);
  }
  
  return featureDir;
}

/**
 * Ensure hooks directory exists
 */
function ensureHooksDirectory(featureDir) {
  const hooksDir = path.join(featureDir, 'hooks');
  
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
    console.log(`${COLORS.BLUE}Created hooks directory at ${hooksDir}${COLORS.RESET}`);
  }
  
  return hooksDir;
}

/**
 * Generate capitalized entity name from hook name
 */
function getEntityName(hookName) {
  // Extract entity name from hook name (remove 'use' prefix)
  if (!hookName.startsWith('use')) {
    console.error(`${COLORS.YELLOW}Warning: Hook name should start with 'use' prefix${COLORS.RESET}`);
    return hookName.charAt(0).toUpperCase() + hookName.slice(1);
  }
  
  const entityName = hookName.slice(3); // Remove 'use' prefix
  return entityName.charAt(0).toUpperCase() + entityName.slice(1);
}

/**
 * Get camelCase version of an entity name
 */
function getCamelCaseName(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * Generate hook template content
 */
function generateHookTemplate(featureName, hookName) {
  const entityName = getEntityName(hookName);
  const camelCaseEntity = getCamelCaseName(entityName);
  
  return `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  get${entityName}s,
  get${entityName}ById,
  create${entityName},
  update${entityName},
  delete${entityName}
  // Add other service functions as needed
} from '../services';
import type { ${entityName}, Create${entityName}Request, Update${entityName}Request } from '../types/${featureName}.types';

// Define query keys as array strings for consistency
const QUERY_KEYS = {
  ${camelCaseEntity}s: ['${camelCaseEntity}s'],
  ${camelCaseEntity}: (id: string) => ['${camelCaseEntity}', id]
};

/**
 * Hook for fetching all ${camelCaseEntity}s
 * @returns Query object for ${camelCaseEntity}s list
 */
export function use${entityName}s() {
  return useQuery<${entityName}[], Error>({
    queryKey: QUERY_KEYS.${camelCaseEntity}s,
    queryFn: get${entityName}s,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching a ${camelCaseEntity} by ID
 * @param id - ${entityName} ID
 * @returns Query object for single ${camelCaseEntity}
 */
export function use${entityName}(id: string) {
  return useQuery<${entityName}, Error>({
    queryKey: QUERY_KEYS.${camelCaseEntity}(id),
    queryFn: () => get${entityName}ById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for ${camelCaseEntity} mutations (create, update, delete)
 * @returns Mutation objects for ${camelCaseEntity} operations
 */
export function use${entityName}Mutations() {
  const queryClient = useQueryClient();

  // Create ${camelCaseEntity} mutation
  const create${entityName}Mutation = useMutation<
    ${entityName},
    Error,
    Create${entityName}Request
  >({
    mutationFn: create${entityName},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.${camelCaseEntity}s });
    }
  });

  // Update ${camelCaseEntity} mutation
  const update${entityName}Mutation = useMutation<
    ${entityName},
    Error,
    { id: string; data: Update${entityName}Request }
  >({
    mutationFn: ({ id, data }) => update${entityName}(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.${camelCaseEntity}s });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.${camelCaseEntity}(variables.id) });
    }
  });

  // Delete ${camelCaseEntity} mutation
  const delete${entityName}Mutation = useMutation<
    boolean,
    Error,
    string
  >({
    mutationFn: delete${entityName},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.${camelCaseEntity}s });
    }
  });

  return {
    create${entityName}: create${entityName}Mutation,
    update${entityName}: update${entityName}Mutation,
    delete${entityName}: delete${entityName}Mutation
  };
}

/**
 * Convenience hook that combines all ${camelCaseEntity} hooks for easy use in components
 * @returns Combined query results and mutation functions
 */
export function use${entityName}Manager() {
  const ${camelCaseEntity}sQuery = use${entityName}s();
  const mutations = use${entityName}Mutations();
  
  // Compute combined loading state
  const isLoading = ${camelCaseEntity}sQuery.isLoading;
  
  // Compute combined error state
  const error = ${camelCaseEntity}sQuery.error;
  
  return {
    // Data properties
    ${camelCaseEntity}s: ${camelCaseEntity}sQuery.data || [],
    
    // Combined states
    isLoading,
    error,
    
    // Individual states
    isLoading${entityName}s: ${camelCaseEntity}sQuery.isLoading,
    ${camelCaseEntity}sError: ${camelCaseEntity}sQuery.error,
    
    // Mutations
    ...mutations,
    
    // Refetch functions
    refetch${entityName}s: ${camelCaseEntity}sQuery.refetch,
    
    // Refetch all
    refetchAll: () => {
      ${camelCaseEntity}sQuery.refetch();
    }
  };
}`;
}

/**
 * Generate test template content
 */
function generateTestTemplate(featureName, hookName) {
  const entityName = getEntityName(hookName);
  const camelCaseEntity = getCamelCaseName(entityName);
  
  return `import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { 
  use${entityName}s, 
  use${entityName}, 
  use${entityName}Mutations,
  use${entityName}Manager 
} from '../${hookName}';
import { 
  get${entityName}s,
  get${entityName}ById,
  create${entityName},
  update${entityName},
  delete${entityName}
} from '../../services';

// Mock the service functions
vi.mock('../../services', () => ({
  get${entityName}s: vi.fn(),
  get${entityName}ById: vi.fn(),
  create${entityName}: vi.fn(),
  update${entityName}: vi.fn(),
  delete${entityName}: vi.fn()
}));

// Setup wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${hookName}', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('use${entityName}s', () => {
    it('should return ${camelCaseEntity}s when fetch is successful', async () => {
      const mock${entityName}s = [{ id: '1', name: 'Test ${entityName}' }];
      (get${entityName}s as any).mockResolvedValue(mock${entityName}s);
      
      const { result } = renderHook(() => use${entityName}s(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mock${entityName}s);
      expect(result.current.error).toBeNull();
      expect(get${entityName}s).toHaveBeenCalledTimes(1);
    });
    
    it('should return error when fetch fails', async () => {
      const error = new Error('Failed to fetch ${camelCaseEntity}s');
      (get${entityName}s as any).mockRejectedValue(error);
      
      const { result } = renderHook(() => use${entityName}s(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe('Failed to fetch ${camelCaseEntity}s');
      expect(result.current.data).toBeUndefined();
    });
  });
  
  // Add more tests for other hooks...
});`;
}

/**
 * Generate and save hook file
 */
function generateHookFile(hooksDir, featureName, hookName) {
  const hookFilePath = path.join(hooksDir, `${hookName}.ts`);
  const testFilePath = path.join(hooksDir, '__tests__', `${hookName}.test.ts`);
  
  // Check if the hook file already exists
  if (fs.existsSync(hookFilePath)) {
    console.error(`${COLORS.YELLOW}Warning: Hook file already exists at ${hookFilePath}${COLORS.RESET}`);
    const shouldOverwrite = process.env.OVERWRITE === 'true';
    
    if (!shouldOverwrite) {
      console.log(`Set OVERWRITE=true environment variable to overwrite existing files.`);
      return;
    }
  }
  
  // Create test directory if needed
  const testDir = path.join(hooksDir, '__tests__');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
    console.log(`${COLORS.BLUE}Created test directory at ${testDir}${COLORS.RESET}`);
  }
  
  // Generate and write hook template
  const hookContent = generateHookTemplate(featureName, hookName);
  fs.writeFileSync(hookFilePath, hookContent);
  console.log(`${COLORS.GREEN}Generated hook file at ${hookFilePath}${COLORS.RESET}`);
  
  // Generate and write test template
  const testContent = generateTestTemplate(featureName, hookName);
  fs.writeFileSync(testFilePath, testContent);
  console.log(`${COLORS.GREEN}Generated test file at ${testFilePath}${COLORS.RESET}`);
}

/**
 * Update package.json with the generation script
 */
function updatePackageJson() {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts['generate-hook']) {
      packageJson.scripts['generate-hook'] = 'node scripts/generate-hook-template.js';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`${COLORS.GREEN}Added 'generate-hook' script to package.json${COLORS.RESET}`);
    }
  } catch (error) {
    console.error(`${COLORS.RED}Error updating package.json:${COLORS.RESET}`, error);
  }
}

/**
 * Main function
 */
function main() {
  console.log(`${COLORS.MAGENTA}React Query Hook Template Generator${COLORS.RESET}`);
  console.log('='.repeat(50));
  
  // Get args
  const { featureName, hookName } = getArgs();
  
  // Validate feature
  const featureDir = validateFeature(featureName);
  
  // Ensure hooks directory
  const hooksDir = ensureHooksDirectory(featureDir);
  
  // Generate hook file
  generateHookFile(hooksDir, featureName, hookName);
  
  // Update package.json
  updatePackageJson();
  
  console.log(`\n${COLORS.GREEN}Hook template generated successfully!${COLORS.RESET}`);
  console.log(`You can now edit the generated files to match your specific requirements.`);
}

// Run the main function
main(); 