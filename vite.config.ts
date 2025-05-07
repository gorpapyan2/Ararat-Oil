import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
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
    react({
      jsxImportSource: 'react'
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
    exclude: [
      '@radix-ui/react-scroll-area',
      '@tanstack/react-query',
      'next-themes',
      '@tabler/icons-react',
      'react-router-dom',
      'react-i18next',
      'i18next'
    ],
    // Increase the timeout for dependency optimization
    force: true,
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
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      'lucide-react',
      'void-elements',
      'html-parse-stringify',
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
      'tailwindcss-animate'
    ],
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
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
        },
      },
    },
  },
}));
