// vite.config.ts
import { defineConfig } from "file:///C:/Users/gor_p/Documents/Ararat%20OIL/web-tech-whisperer-vibe/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gor_p/Documents/Ararat%20OIL/web-tech-whisperer-vibe/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/gor_p/Documents/Ararat%20OIL/web-tech-whisperer-vibe/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///C:/Users/gor_p/Documents/Ararat%20OIL/web-tech-whisperer-vibe/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import fs from "fs";
import dotenv from "file:///C:/Users/gor_p/Documents/Ararat%20OIL/web-tech-whisperer-vibe/node_modules/dotenv/lib/main.js";
var __vite_injected_original_dirname = "C:\\Users\\gor_p\\Documents\\Ararat OIL\\web-tech-whisperer-vibe";
var envFile = fs.existsSync(".env") ? ".env" : ".env.local";
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}
function getServerPort() {
  const envPort = process.env.VITE_PORT || process.env.PORT;
  if (envPort) {
    return parseInt(envPort, 10);
  }
  return 3001;
}
var vite_config_default = defineConfig(({ command, mode }) => ({
  server: {
    port: getServerPort(),
    strictPort: false,
    // Allow Vite to try other ports if the specified one is in use
    host: true,
    watch: {
      usePolling: true
    },
    open: true
  },
  // Add base configuration to ensure proper path resolution
  base: "/",
  define: {
    // Add global module definition to avoid 'module is not defined' errors
    "global": {},
    "process.env": {},
    // Fix for require not defined error
    "require": "window.require"
  },
  plugins: [
    react({
      jsxImportSource: "react"
    }),
    command === "serve" && componentTagger(),
    mode === "analyze" && visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    // Add main field for better CommonJS compatibility
    mainFields: ["browser", "module", "main"],
    // Force ESM modules for problematic packages
    dedupe: ["react", "react-dom"],
    // Ensure .tsx files are properly handled
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "lucide-react",
      "@tabler/icons-react",
      "@radix-ui/react-icons",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "tailwindcss-animate",
      "recharts"
    ],
    esbuildOptions: {
      target: "es2020",
      format: "esm",
      resolveExtensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
      define: {
        global: "window"
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // Improve chunking strategy
    chunkSizeWarningLimit: 1e3,
    // Configure module preloading for better dynamic imports
    modulePreload: {
      polyfill: true
    },
    commonjsOptions: {
      // Improve handling of CommonJS dependencies
      transformMixedEsModules: true,
      include: [/node_modules/],
      // Prevent errors in specific modules
      defaultIsModuleExports: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast"
          ],
          "query-vendor": ["@tanstack/react-query", "@tanstack/react-query-devtools"],
          "chart-vendor": ["recharts"],
          "icon-vendor": ["@tabler/icons-react", "lucide-react"]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnb3JfcFxcXFxEb2N1bWVudHNcXFxcQXJhcmF0IE9JTFxcXFx3ZWItdGVjaC13aGlzcGVyZXItdmliZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ29yX3BcXFxcRG9jdW1lbnRzXFxcXEFyYXJhdCBPSUxcXFxcd2ViLXRlY2gtd2hpc3BlcmVyLXZpYmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2dvcl9wL0RvY3VtZW50cy9BcmFyYXQlMjBPSUwvd2ViLXRlY2gtd2hpc3BlcmVyLXZpYmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuXG4vLyBMb2FkIGVudmlyb25tZW50IHZhcmlhYmxlcyBmcm9tIC5lbnYgZmlsZSBpZiBleGlzdHNcbmNvbnN0IGVudkZpbGUgPSBmcy5leGlzdHNTeW5jKCcuZW52JykgPyAnLmVudicgOiAnLmVudi5sb2NhbCc7XG5pZiAoZnMuZXhpc3RzU3luYyhlbnZGaWxlKSkge1xuICBkb3RlbnYuY29uZmlnKHsgcGF0aDogZW52RmlsZSB9KTtcbn1cblxuLy8gR2V0IHBvcnQgZnJvbSBlbnZpcm9ubWVudCBvciB1c2UgYSBmYWxsYmFja1xuZnVuY3Rpb24gZ2V0U2VydmVyUG9ydCgpIHtcbiAgY29uc3QgZW52UG9ydCA9IHByb2Nlc3MuZW52LlZJVEVfUE9SVCB8fCBwcm9jZXNzLmVudi5QT1JUO1xuICBpZiAoZW52UG9ydCkge1xuICAgIHJldHVybiBwYXJzZUludChlbnZQb3J0LCAxMCk7XG4gIH1cbiAgXG4gIC8vIERlZmF1bHQgcG9ydCBpZiBub3Qgc3BlY2lmaWVkIGluIGVudlxuICByZXR1cm4gMzAwMTtcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IGdldFNlcnZlclBvcnQoKSxcbiAgICBzdHJpY3RQb3J0OiBmYWxzZSwgLy8gQWxsb3cgVml0ZSB0byB0cnkgb3RoZXIgcG9ydHMgaWYgdGhlIHNwZWNpZmllZCBvbmUgaXMgaW4gdXNlXG4gICAgaG9zdDogdHJ1ZSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICB9LFxuICAgIG9wZW46IHRydWUsXG4gIH0sXG4gIC8vIEFkZCBiYXNlIGNvbmZpZ3VyYXRpb24gdG8gZW5zdXJlIHByb3BlciBwYXRoIHJlc29sdXRpb25cbiAgYmFzZTogJy8nLFxuICBkZWZpbmU6IHtcbiAgICAvLyBBZGQgZ2xvYmFsIG1vZHVsZSBkZWZpbml0aW9uIHRvIGF2b2lkICdtb2R1bGUgaXMgbm90IGRlZmluZWQnIGVycm9yc1xuICAgICdnbG9iYWwnOiB7fSxcbiAgICAncHJvY2Vzcy5lbnYnOiB7fSxcbiAgICAvLyBGaXggZm9yIHJlcXVpcmUgbm90IGRlZmluZWQgZXJyb3JcbiAgICAncmVxdWlyZSc6ICd3aW5kb3cucmVxdWlyZSdcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHtcbiAgICAgIGpzeEltcG9ydFNvdXJjZTogJ3JlYWN0J1xuICAgIH0pLFxuICAgIGNvbW1hbmQgPT09ICdzZXJ2ZScgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgbW9kZSA9PT0gJ2FuYWx5emUnICYmIHZpc3VhbGl6ZXIoe1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJyxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICB9KSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgICAvLyBBZGQgbWFpbiBmaWVsZCBmb3IgYmV0dGVyIENvbW1vbkpTIGNvbXBhdGliaWxpdHlcbiAgICBtYWluRmllbGRzOiBbJ2Jyb3dzZXInLCAnbW9kdWxlJywgJ21haW4nXSxcbiAgICAvLyBGb3JjZSBFU00gbW9kdWxlcyBmb3IgcHJvYmxlbWF0aWMgcGFja2FnZXNcbiAgICBkZWR1cGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgLy8gRW5zdXJlIC50c3ggZmlsZXMgYXJlIHByb3Blcmx5IGhhbmRsZWRcbiAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nXSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICdyZWFjdC9qc3gtZGV2LXJ1bnRpbWUnLFxuICAgICAgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsXG4gICAgICAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5LWRldnRvb2xzJyxcbiAgICAgICdsdWNpZGUtcmVhY3QnLFxuICAgICAgJ0B0YWJsZXIvaWNvbnMtcmVhY3QnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1pY29ucycsXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtbmF2aWdhdGlvbi1tZW51JyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcicsXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlcGFyYXRvcicsXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LXRhYnMnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCcsXG4gICAgICAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5JyxcbiAgICAgICdjbHN4JyxcbiAgICAgICd0YWlsd2luZC1tZXJnZScsXG4gICAgICAndGFpbHdpbmRjc3MtYW5pbWF0ZScsXG4gICAgICAncmVjaGFydHMnXG4gICAgXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIGZvcm1hdDogJ2VzbScsXG4gICAgICByZXNvbHZlRXh0ZW5zaW9uczogWycubWpzJywgJy5qcycsICcudHMnLCAnLmpzeCcsICcudHN4JywgJy5qc29uJ10sXG4gICAgICBkZWZpbmU6IHtcbiAgICAgICAgZ2xvYmFsOiAnd2luZG93J1xuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICAvLyBJbXByb3ZlIGNodW5raW5nIHN0cmF0ZWd5XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC8vIENvbmZpZ3VyZSBtb2R1bGUgcHJlbG9hZGluZyBmb3IgYmV0dGVyIGR5bmFtaWMgaW1wb3J0c1xuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiB0cnVlLFxuICAgIH0sXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAvLyBJbXByb3ZlIGhhbmRsaW5nIG9mIENvbW1vbkpTIGRlcGVuZGVuY2llc1xuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXG4gICAgICBpbmNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLFxuICAgICAgLy8gUHJldmVudCBlcnJvcnMgaW4gc3BlY2lmaWMgbW9kdWxlc1xuICAgICAgZGVmYXVsdElzTW9kdWxlRXhwb3J0czogdHJ1ZSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAndWktdmVuZG9yJzogW1xuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zZWxlY3QnLFxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10YWJzJyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9hc3QnXG4gICAgICAgICAgXSxcbiAgICAgICAgICAncXVlcnktdmVuZG9yJzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknLCAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5LWRldnRvb2xzJ10sXG4gICAgICAgICAgJ2NoYXJ0LXZlbmRvcic6IFsncmVjaGFydHMnXSxcbiAgICAgICAgICAnaWNvbi12ZW5kb3InOiBbJ0B0YWJsZXIvaWNvbnMtcmVhY3QnLCAnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlYLFNBQVMsb0JBQW9CO0FBQzlZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxRQUFRO0FBQ2YsT0FBTyxZQUFZO0FBTm5CLElBQU0sbUNBQW1DO0FBU3pDLElBQU0sVUFBVSxHQUFHLFdBQVcsTUFBTSxJQUFJLFNBQVM7QUFDakQsSUFBSSxHQUFHLFdBQVcsT0FBTyxHQUFHO0FBQzFCLFNBQU8sT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2pDO0FBR0EsU0FBUyxnQkFBZ0I7QUFDdkIsUUFBTSxVQUFVLFFBQVEsSUFBSSxhQUFhLFFBQVEsSUFBSTtBQUNyRCxNQUFJLFNBQVM7QUFDWCxXQUFPLFNBQVMsU0FBUyxFQUFFO0FBQUEsRUFDN0I7QUFHQSxTQUFPO0FBQ1Q7QUFHQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxPQUFPO0FBQUEsRUFDbEQsUUFBUTtBQUFBLElBQ04sTUFBTSxjQUFjO0FBQUEsSUFDcEIsWUFBWTtBQUFBO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFBQTtBQUFBLEVBRUEsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBO0FBQUEsSUFFTixVQUFVLENBQUM7QUFBQSxJQUNYLGVBQWUsQ0FBQztBQUFBO0FBQUEsSUFFaEIsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLGlCQUFpQjtBQUFBLElBQ25CLENBQUM7QUFBQSxJQUNELFlBQVksV0FBVyxnQkFBZ0I7QUFBQSxJQUN2QyxTQUFTLGFBQWEsV0FBVztBQUFBLE1BQy9CLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUE7QUFBQSxJQUVBLFlBQVksQ0FBQyxXQUFXLFVBQVUsTUFBTTtBQUFBO0FBQUEsSUFFeEMsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBO0FBQUEsSUFFN0IsWUFBWSxDQUFDLFFBQVEsT0FBTyxPQUFPLFFBQVEsUUFBUSxPQUFPO0FBQUEsRUFDNUQ7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsbUJBQW1CLENBQUMsUUFBUSxPQUFPLE9BQU8sUUFBUSxRQUFRLE9BQU87QUFBQSxNQUNqRSxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQSxJQUVYLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGlCQUFpQjtBQUFBO0FBQUEsTUFFZix5QkFBeUI7QUFBQSxNQUN6QixTQUFTLENBQUMsY0FBYztBQUFBO0FBQUEsTUFFeEIsd0JBQXdCO0FBQUEsSUFDMUI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLGdCQUFnQixDQUFDLFNBQVMsV0FBVztBQUFBLFVBQ3JDLGFBQWE7QUFBQSxZQUNYO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0EsZ0JBQWdCLENBQUMseUJBQXlCLGdDQUFnQztBQUFBLFVBQzFFLGdCQUFnQixDQUFDLFVBQVU7QUFBQSxVQUMzQixlQUFlLENBQUMsdUJBQXVCLGNBQWM7QUFBQSxRQUN2RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
