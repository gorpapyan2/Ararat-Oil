import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file if exists
const envFile = fs.existsSync('.env') ? '.env' : '.env.local';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

// Get port from environment or use a fallback
function getServerPort() {
  const envPort = process.env.VITE_PORT || process.env.PORT;
  if (envPort) {
    return parseInt(envPort, 10);
  }
  
  // Default port if not specified in env
  return 3006;
}

// Helper to determine the input based on mode
function getInputForMode(mode: string): string | Record<string, string> {
  if (mode === 'debug') {
    return {
      main: path.resolve(__dirname, 'index.html'),
      debug: path.resolve(__dirname, 'src/main.debug.tsx')
    };
  }
  if (mode === 'test') {
    return {
      main: path.resolve(__dirname, 'index.html'),
      test: path.resolve(__dirname, 'src/test-main.tsx')
    };
  }
  if (mode === 'minimal') {
    return {
      minimal: path.resolve(__dirname, 'index-minimal.html')
    };
  }
  if (mode === 'bridge') {
    return {
      main: path.resolve(__dirname, 'index.html'),
      bridge: path.resolve(__dirname, 'src/bridge-main.tsx')
    };
  }
  // Default case for normal development mode
  return path.resolve(__dirname, 'index.html');
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  server: {
    port: getServerPort(),
    strictPort: false, // Allow Vite to try other ports if the specified one is in use
    host: true,
    watch: {
      usePolling: true,
    },
    open: true,
    // Add hmr configuration to prevent blank screen issues
    hmr: {
      overlay: true,
      timeout: 30000,
    },
  },
  // Add base configuration to ensure proper path resolution
  base: '/',
  define: {
    // Add global module definition to avoid 'module is not defined' errors
    'global': 'globalThis',
    'process.env': process.env,
  },
  css: {
    // Enable source maps for easier debugging
    devSourcemap: true,
    // Add preprocessOptions to ensure proper import ordering
    preprocessorOptions: {
      css: {
        // Ensure @import statements are processed in the correct order
        charset: false,
        // Always add imports at the beginning
        additionalData: '/* Ensure imports first */\n',
      },
    },
  },
  plugins: [
    // Use Tailwind CSS v4 Vite plugin
    tailwindcss(),
    react({
      jsxImportSource: 'react',
    }),
    command === 'serve' && componentTagger(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add main field for better CommonJS compatibility
    mainFields: ['browser', 'module', 'main'],
    // Force ESM modules for problematic packages
    dedupe: ['react', 'react-dom'],
    // Ensure .tsx files are properly handled
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      'lucide-react',
      '@tabler/icons-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'tailwindcss-animate',
      'recharts'
    ],
    exclude: [
      // Exclude Node.js utility scripts
      'src/utils/component-audit.js'
    ],
    esbuildOptions: {
      target: 'es2020',
      format: 'esm',
      resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      define: {
        global: 'window'
      },
      // Add logLevel for better debugging
      logLevel: 'error',
    },
    // Ensure dependencies are properly pre-bundled
    force: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Improve chunking strategy
    chunkSizeWarningLimit: 1000,
    // Configure module preloading for better dynamic imports
    modulePreload: {
      polyfill: true,
    },
    commonjsOptions: {
      // Improve handling of CommonJS dependencies
      transformMixedEsModules: true,
      include: [/node_modules/],
      // Prevent errors in specific modules
      defaultIsModuleExports: true,
    },
    rollupOptions: {
      external: [
        // Exclude Node.js utility scripts from the bundle
        /.*component-audit\.js$/
      ],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'chart-vendor': ['recharts'],
          'icon-vendor': ['@tabler/icons-react', 'lucide-react'],
        },
      },
      input: getInputForMode(mode),
    },
    // Add CSS specific settings
    cssCodeSplit: true,
    cssMinify: true,
  },
}));
