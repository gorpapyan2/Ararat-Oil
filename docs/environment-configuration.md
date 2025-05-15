# Environment Configuration Guide

## Overview

This guide documents the environment configuration approach for the Ararat OIL Management System. It includes information on environment variables, configuration files, and how to handle different deployment environments.

## Environment Files

We use the following environment files:

- `.env` - Base environment variables for all environments
- `.env.local` - Local overrides (not committed to version control)
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables

These files are processed using the `dotenv` package.

## Key Environment Variables

### Development Server

```
# Port for the Vite development server
VITE_PORT=3002
```

The development server will use the specified port, or fall back to 3001 if not specified. If a port is already in use, Vite will automatically try the next available port.

### API Configuration

```
# API endpoints
VITE_API_URL="http://localhost:54321"
VITE_SUPABASE_URL="http://localhost:54321"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Feature Flags

```
# Feature flags for enabling/disabling features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_MOCK_DATA=false
```

## Usage in Code

Environment variables are accessed through `import.meta.env` in Vite:

```typescript
// Example usage
const apiUrl = import.meta.env.VITE_API_URL;
const isDevToolsEnabled = import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';
```

## Port Management

### Configuration in Vite

Our Vite configuration handles port management with fallbacks:

```typescript
// vite.config.ts
function getServerPort() {
  const envPort = process.env.VITE_PORT || process.env.PORT;
  if (envPort) {
    return parseInt(envPort, 10);
  }
  return 3001; // Default port
}

export default defineConfig({
  server: {
    port: getServerPort(),
    strictPort: false, // Try next available port if busy
    // ...
  },
});
```

### Handling Port Conflicts

If you encounter port conflicts:

1. Check if another process is using the port: `netstat -ano | findstr :<PORT>`
2. Kill the process: `npx kill-port <PORT>`
3. Alternatively, specify a different port in `.env.local`

### Automated Port Management

For CI/CD environments, we automatically assign ports to avoid conflicts:

- Development environments: Configured in `.env.development`
- CI environments: Set via CI environment variables
- Production: Uses standard HTTP/HTTPS ports, configured by the hosting platform

## Best Practices

1. **Never hardcode environment-specific values** in your application code.
2. **Don't commit sensitive information** (API keys, secrets) to version control.
3. **Provide sensible defaults** for optional environment variables.
4. **Document all environment variables** in this guide.
5. **Use TypeScript types** for environment variables (see `src/types/env.d.ts`).

## Environment-Specific Builds

To build for a specific environment:

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod
```

Each build script automatically loads the appropriate environment file.

## Troubleshooting

### Environment Variables Not Available

If environment variables aren't available at runtime:

1. Ensure the variable has the `VITE_` prefix (required for client-side exposure).
2. Check if you've created the necessary environment file.
3. Restart the development server after changing environment files.

### Port Already in Use Errors

If you see "Port already in use" errors:

1. Use the `netstat` command to identify the process using the port.
2. Use `npx kill-port <PORT>` to free up the port.
3. Update your `.env.local` file to use a different port. 