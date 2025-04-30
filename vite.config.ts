import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Improve HMR connection stability
      timeout: 5000,
    },
  },
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
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add main field for better CommonJS compatibility
    mainFields: ['browser', 'module', 'main'],
    // Force ESM modules for problematic packages
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: [
      '@radix-ui/react-scroll-area',
      '@tanstack/react-query',
      'react-router-dom',
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
  },
  build: {
    // Enable source maps when analyzing
    sourcemap: mode === 'analyze',
    // Improve chunking strategy
    chunkSizeWarningLimit: 1000,
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
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-scroll-area', 'next-themes'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
}));
