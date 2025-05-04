import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // Use server.open to automatically use the correct port
    strictPort: false, // Allow fallback to another port if 8080 is unavailable
    port: 8080,
    hmr: {
      // Improve HMR connection stability
      timeout: 5000,
      // Don't specify clientPort to let Vite auto-detect it
      webSocketServer: 'ws',
    },
  },
  // Add base configuration to ensure proper path resolution
  base: '/',
  define: {
    // Add global module definition to avoid 'module is not defined' errors
    'global': {},
    'process.env': {},
    // Fix for require not defined error
    'require': 'window.require'
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    visualizer({
      open: true,
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
    exclude: [
      '@radix-ui/react-scroll-area',
      '@tanstack/react-query',
      'next-themes'
    ],
    // Increase the timeout for dependency optimization
    force: mode === 'development',
    esbuildOptions: {
      // Improve ESBuild performance
      target: 'es2020',
      // Handle CommonJS modules better
      format: 'esm',
      resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      define: {
        global: 'window'
      },
    },
    // Improve handling of dynamic imports
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tabler/icons-react',
      'lucide-react',
    ],
  },
  build: {
    // Enable source maps when analyzing
    sourcemap: mode === 'analyze',
    // Improve chunking strategy
    chunkSizeWarningLimit: 1000,
    // Configure module preloading for better dynamic imports
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        return deps;
      },
    },
    commonjsOptions: {
      // Improve handling of CommonJS dependencies
      transformMixedEsModules: true,
      include: [/node_modules/],
      // Prevent errors in specific modules
      defaultIsModuleExports: true,
      dynamicRequireTargets: [
        // Target specific modules causing issues
      ],
    },
    rollupOptions: {
      output: {
        // Improve code splitting
        experimentalMinChunkSize: 10000,
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          
          // UI libraries
          if (id.includes('@radix-ui/') || 
              id.includes('next-themes/')) {
            return 'vendor-ui';
          }
          
          // Icons
          if (id.includes('@tabler/icons-react')) {
            return 'vendor-icons';
          }
          
          // Routing
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          
          // Data fetching
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query';
          }
          
          // i18n
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'vendor-i18n';
          }
        },
      },
    },
  },
}));
