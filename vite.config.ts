import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      '@radix-ui/react-scroll-area',
      'i18next-http-backend',
      '@tanstack/react-query',
      'react-router-dom',
      'next-themes'
    ],
    // Increase the timeout for dependency optimization
    force: mode === 'development',
    esbuildOptions: {
      // Improve ESBuild performance
      target: 'es2020',
    },
  },
  build: {
    // Improve chunking strategy
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-scroll-area', 'next-themes'],
        },
      },
    },
  },
}));
