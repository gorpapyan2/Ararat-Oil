# TypeScript Configuration and Linter Guidelines

## Current TypeScript Configuration (Updated 2024)

Our project uses a strict TypeScript configuration to ensure type safety and code quality:

```json
// tsconfig.json highlights
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## ESLint Configuration

We use ESLint with TypeScript-specific rules to enforce best practices:

```json
// .eslintrc highlights
{
  "root": true,
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  "ignorePatterns": ["dist", ".eslintrc.cjs"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh", "@typescript-eslint"],
  "rules": {
    "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/order": ["error", { "groups": ["builtin", "external", "internal", "parent", "sibling", "index"] }]
  }
}
```

## Type Mapping Best Practices

When working with Supabase and our domain models, follow these patterns:

### Database to Domain Mapping

```typescript
// Define the mapper function
function mapDbToDomain(dbRecord: DatabaseType): DomainType {
  return {
    // Transform properties as needed
    id: dbRecord.id,
    // Handle nullable values with nullish coalescing
    name: dbRecord.name ?? '',
    // Transform dates or complex types
    createdAt: new Date(dbRecord.created_at),
  };
}

// Apply mapping when fetching data
async function fetchData() {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  return (data || []).map(mapDbToDomain);
}
```

### Domain to Database Mapping

```typescript
// Define the mapper function for saving data
function mapDomainToDb(domain: DomainType): DatabaseType {
  return {
    // Transform properties for database storage
    id: domain.id,
    name: domain.name,
    created_at: domain.createdAt.toISOString(),
  };
}

// Use with insert/update operations
async function saveData(domain: DomainType) {
  const dbData = mapDomainToDb(domain);
  const { data, error } = await supabase
    .from('table')
    .upsert(dbData)
    .select();
  
  if (error) throw error;
  return data ? mapDbToDomain(data[0]) : null;
}
```

## Common Issues and Solutions

### Handling Nullable Fields

Use nullish coalescing and optional chaining:

```typescript
// For potentially undefined/null values
const value = record?.field ?? defaultValue;

// For nested properties
const nestedValue = record?.nested?.property;
```

### Using Utility Types

Leverage TypeScript utility types for derived types:

```typescript
// For partial updates
type PartialDomain = Partial<DomainType>;

// For picking specific properties
type DomainSummary = Pick<DomainType, 'id' | 'name'>;

// For omitting properties
type DomainWithoutId = Omit<DomainType, 'id'>;

// For required fields
type RequiredDomain = Required<DomainType>;
```

### Type Guards

Implement type guards for runtime type safety:

```typescript
function isEmployee(obj: any): obj is Employee {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'position' in obj
  );
}

// Usage
if (isEmployee(data)) {
  // TypeScript knows 'data' is Employee here
  console.log(data.position);
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint TypeScript Plugin](https://github.com/typescript-eslint/typescript-eslint)
- [Utility Types Documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Type Guards and Type Assertions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)