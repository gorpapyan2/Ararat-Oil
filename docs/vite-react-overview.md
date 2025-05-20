# Vite React Project Overview

## Introduction

This guide provides an overview of our Vite + React + TypeScript project structure, configuration, and best practices. It serves as a reference for developers working on the Ararat OIL Management System.

## Project Structure

Our project follows a feature-based architecture with the following structure:

```
src/
├── features/                 # Feature modules
│   ├── auth/                # Authentication feature
│   ├── fuel-sales/          # Fuel sales feature
│   ├── employees/           # Employees feature
│   └── ...                  # Other features
├── shared/                   # Shared components and utilities
│   ├── components/          # Shared UI components
│   ├── hooks/               # Shared hooks
│   └── utils/               # Shared utilities
├── core/                     # Core application code
│   ├── api/                 # API client setup
│   ├── components/          # Core UI components
│   ├── config/              # App configuration
│   ├── i18n/                # Internationalization
│   ├── providers/           # Context providers
│   └── store/               # Global state management
├── layouts/                  # Layout components
├── pages/                    # Page components
├── services/                 # Core services
├── types/                    # Global TypeScript types
├── utils/                    # Global utilities
├── main.tsx                  # Application entry point
├── App.tsx                   # Main App component
└── vite-env.d.ts            # Vite environment declarations
```

## Vite Configuration

Our Vite configuration is in `vite.config.ts` and includes the following key features:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Custom plugins...
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    strictPort: false,
  },
});
```

Key elements:
- Path aliasing with `@/` prefix for importing from the src directory
- React plugin for JSX support
- Server configuration for development

## Build and Development

### Development Server

```bash
npm run dev
```

This starts the Vite development server with:
- Hot Module Replacement (HMR)
- Error overlay
- Fast refresh for React components

### Production Build

```bash
npm run build
```

This builds the application for production:
- Code splitting
- Tree shaking
- Minification and optimization
- Static asset processing

## Important Dependencies

Our project relies on these key dependencies:

- **React**: UI library
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **TailwindCSS**: Utility-first CSS framework
- **Supabase**: Backend database and authentication

## Best Practices

### Imports

Use absolute imports with the `@/` alias:

```typescript
// Good
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/features/auth';

// Avoid
import { Button } from '../../shared/components/ui/button';
import { useAuth } from '../../../features/auth';
```

### Code Splitting

Use lazy loading with React.lazy and Suspense for better performance:

```typescript
// In route definitions
const EmployeePage = lazy(() => import('@/pages/EmployeePage'));

// Render with Suspense
<Suspense fallback={<Loading />}>
  <EmployeePage />
</Suspense>
```

### TypeScript

Follow TypeScript best practices:
- Define explicit interfaces for props
- Use proper return types for functions
- Leverage utility types (Partial, Pick, Omit)
- Use type guards for runtime checks

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/reference/react)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) 