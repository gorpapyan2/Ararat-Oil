interface DeprecationUsage {
  path: string;
  count: number;
  lastUsed: string;
  deprecated: boolean;
  replacementSuggestion?: string;
}

const deprecationStore = new Map<string, DeprecationUsage>();

export function trackDeprecatedUsage(
  path: string, 
  replacementSuggestion?: string
) {
  const existing = deprecationStore.get(path);
  
  if (existing) {
    existing.count++;
    existing.lastUsed = new Date().toISOString();
  } else {
    deprecationStore.set(path, {
      path,
      count: 1,
      lastUsed: new Date().toISOString(),
      deprecated: true,
      replacementSuggestion,
    });
  }
  
  // Log in development
  if (import.meta.env.DEV) {
    console.warn(`🚨 Deprecated API used: ${path}${replacementSuggestion ? ` - Use ${replacementSuggestion} instead` : ''}`);
  }
}

export function getDeprecationUsageSummary(): DeprecationUsage[] {
  return Array.from(deprecationStore.values())
    .sort((a, b) => b.count - a.count);
}

export function clearDeprecationTracking() {
  deprecationStore.clear();
} 