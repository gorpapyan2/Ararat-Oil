#!/usr/bin/env node

/**
 * Hook Migration Script
 * 
 * This script analyzes existing React Query hooks and provides guidance
 * for migrating them to the new standardized API hooks system.
 * 
 * Usage: node scripts/migrate-hooks.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const FEATURES_DIR = path.resolve(SRC_DIR, 'features');
const HOOKS_PATTERN = '*/hooks/*.{ts,tsx}';
const OUTPUT_DIR = path.resolve(__dirname, '../migration-analysis');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Patterns to identify common React Query hooks
const patterns = {
  useQuery: /useQuery\s*\(\s*\[?['"]([^'"]+)['"]/g,
  useMutation: /useMutation\s*\(\s*(?:\(\s*[^)]*\)\s*=>\s*)?([a-zA-Z0-9_.]+)/g,
  queryClient: /queryClient\.(invalidateQueries|setQueryData|getQueryData|removeQueries)/g,
  customHook: /export\s+(?:function|const)\s+use([A-Z][a-zA-Z0-9]+)/g,
};

// Templates for replacements
const templates = {
  useApiQuery: `
  // Before:
  const { data, isLoading } = useQuery(['resourceName', id], () => fetchResource(id));
  
  // After:
  const { data, isLoading } = useApiQuery({
    queryKey: ['resourceName', id],
    queryFn: () => fetchResource(id)
  });`,

  useApiMutation: `
  // Before:
  const { mutateAsync } = useMutation(
    (data) => createResource(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
      }
    }
  );
  
  // After:
  const { mutate } = useApiMutation({
    mutationFn: (data) => createResource(data),
    invalidateQueries: ['resources']
  });`,

  createResourceHooks: `
  // Before:
  export function useResource() {
    const { data, isLoading } = useQuery(['resources'], fetchResources);
    const { mutateAsync: create } = useMutation(createResource);
    const { mutateAsync: update } = useMutation(updateResource);
    const { mutateAsync: remove } = useMutation(deleteResource);
    
    return {
      resources: data || [],
      isLoading,
      create,
      update,
      remove
    };
  }
  
  // After:
  const resourceService = {
    getList: (filters) => fetchResources(filters),
    getById: (id) => fetchResource(id),
    create: (data) => createResource(data),
    update: (id, data) => updateResource(id, data),
    delete: (id) => deleteResource(id)
  };
  
  const {
    useList: useResourceList,
    useById: useResourceById,
    useCreate: useCreateResource,
    useUpdate: useUpdateResource,
    useDelete: useDeleteResource
  } = createResourceHooks({
    service: resourceService,
    resourceName: 'resource',
    resourcePath: 'resources'
  });
  
  export function useResource() {
    const resourceList = useResourceList();
    const createResource = useCreateResource();
    const updateResource = useUpdateResource();
    const deleteResource = useDeleteResource();
    
    return {
      resources: resourceList.data || [],
      isLoading: resourceList.isLoading,
      create: createResource.mutate,
      update: updateResource.mutate,
      remove: deleteResource.mutate
    };
  }
  `
};

// Find all hook files
const hookFiles = glob.sync(path.join(FEATURES_DIR, '**', HOOKS_PATTERN), {
  ignore: ['**/__tests__/**', '**/*-refactored.{ts,tsx}']
});

console.log(`Found ${hookFiles.length} hook files to analyze...`);

// Process each file
hookFiles.forEach(file => {
  const relativePath = path.relative(SRC_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  
  // Analysis results
  const analysis = {
    path: relativePath,
    size: content.length,
    queries: [],
    mutations: [],
    customHooks: [],
    queryClientUsage: [],
    migrationEffort: 0 // 0-10 scale
  };
  
  // Find all queries
  let match;
  while ((match = patterns.useQuery.exec(content)) !== null) {
    analysis.queries.push({
      queryKey: match[1],
      line: getLineNumber(content, match.index)
    });
  }
  
  // Find all mutations
  while ((match = patterns.useMutation.exec(content)) !== null) {
    analysis.mutations.push({
      mutationFn: match[1],
      line: getLineNumber(content, match.index)
    });
  }
  
  // Find all custom hooks
  while ((match = patterns.customHook.exec(content)) !== null) {
    analysis.customHooks.push({
      name: 'use' + match[1],
      line: getLineNumber(content, match.index)
    });
  }
  
  // Find query client usage
  while ((match = patterns.queryClient.exec(content)) !== null) {
    analysis.queryClientUsage.push({
      operation: match[1],
      line: getLineNumber(content, match.index)
    });
  }
  
  // Generate migration suggestions
  const suggestions = [];
  
  // If file has both queries and mutations, likely needs createResourceHooks
  if (analysis.queries.length > 0 && analysis.mutations.length > 0) {
    suggestions.push({
      type: 'createResourceHooks',
      priority: 'high',
      description: 'Consider using createResourceHooks for this feature',
      example: templates.createResourceHooks
    });
  }
  
  // If file has only queries
  if (analysis.queries.length > 0 && analysis.mutations.length === 0) {
    suggestions.push({
      type: 'useApiQuery',
      priority: 'medium',
      description: 'Update useQuery calls to useApiQuery',
      example: templates.useApiQuery
    });
  }
  
  // If file has only mutations
  if (analysis.queries.length === 0 && analysis.mutations.length > 0) {
    suggestions.push({
      type: 'useApiMutation',
      priority: 'medium',
      description: 'Update useMutation calls to useApiMutation',
      example: templates.useApiMutation
    });
  }
  
  // Calculate migration effort
  // Factors: number of queries/mutations, custom hooks, queryClient usage, file size
  const queryMutationCount = analysis.queries.length + analysis.mutations.length;
  const customHookComplexity = analysis.customHooks.length * 2;
  const queryClientComplexity = analysis.queryClientUsage.length;
  const sizeComplexity = Math.min(3, Math.floor(content.length / 2000));
  
  analysis.migrationEffort = Math.min(10, 
    Math.ceil(
      (queryMutationCount * 0.5) + 
      customHookComplexity + 
      queryClientComplexity + 
      sizeComplexity
    )
  );
  
  analysis.suggestions = suggestions;
  
  // Save analysis to output file
  const outputFile = path.join(OUTPUT_DIR, path.basename(file).replace(/\.[^.]+$/, '.json'));
  fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
  
  console.log(`Analyzed ${relativePath} - Migration effort: ${analysis.migrationEffort}/10`);
});

console.log(`\nMigration analysis complete! Results saved to ${OUTPUT_DIR}`);
console.log('\nNext steps:');
console.log('1. Review the generated migration files');
console.log('2. Start with high-priority migrations (effort 7-10)');
console.log('3. Follow the migration guide in docs/feature-hook-refactoring-guide.md');

// Helper function to get line number from character index
function getLineNumber(content, index) {
  const lines = content.substr(0, index).split('\n');
  return lines.length;
} 