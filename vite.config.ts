import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcssVite from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      // React support
      react({
        // Remove problematic babel plugins
        babel: undefined,
      }),

      // Tailwind CSS v4 integration (ensures CSS generation & HMR)
      tailwindcssVite(),
    ],
    
    css: {
      postcss: './postcss.config.mjs',
      // Enhanced CSS processing
      cssCodeSplit: true,
      cssMinify: isProduction,
      cssTarget: 'chrome87', // Modern browsers
      devSourcemap: !isProduction,
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@/components': resolve(__dirname, './src/components'),
        '@/lib': resolve(__dirname, './src/lib'),
        '@/hooks': resolve(__dirname, './src/hooks'),
        '@/utils': resolve(__dirname, './src/utils'),
        '@/types': resolve(__dirname, './src/types'),
        '@/assets': resolve(__dirname, './src/assets'),
        '@/styles': resolve(__dirname, './src/styles'),
        '@/features': resolve(__dirname, './src/features'),
        '@/core': resolve(__dirname, './src/core'),
        '@/shared': resolve(__dirname, './src/shared'),
        '@/layouts': resolve(__dirname, './src/layouts'),
      },
    },
    
    server: {
      port: 3000,
      host: true,
      open: true,
      // Enhanced HMR
      hmr: {
        overlay: true,
      },
      // CORS settings for development
      cors: true,
    },
    
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      // Enhanced chunk splitting for better caching
      rollupOptions: {
        output: {
          // Intelligent chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId 
              ? chunkInfo.facadeModuleId.split('/').pop() 
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name || '')) {
              return 'css/[name]-[hash].[ext]';
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
              return 'img/[name]-[hash].[ext]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'fonts/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          },
          // Advanced manual chunks for optimal loading
          manualChunks: {
            // React ecosystem
            'react-vendor': ['react', 'react-dom'],
            
            // React Router
            'router': ['react-router-dom'],
            
            // React Query
            'query': ['@tanstack/react-query'],
            
            // UI Library - Radix UI
            'ui-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-tooltip',
            ],
            
            // Icons and utilities
            'icons-vendor': ['lucide-react', '@tabler/icons-react'],
            
            // Utility libraries
            'utils-vendor': [
              'clsx',
              'class-variance-authority',
              'tailwind-merge',
              'date-fns',
              'uuid'
            ],
            
            // Form handling
            'forms-vendor': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod'
            ],
            
            // Data visualization
            'charts-vendor': ['recharts'],
            
            // Animation libraries
            'animation-vendor': ['framer-motion'],
            
            // Supabase and authentication
            'auth-vendor': ['@supabase/supabase-js'],
            
            // Development tools (only in development)
            ...(isProduction ? {} : {
              'dev-vendor': ['@tanstack/react-query-devtools']
            })
          },
        },
      },
      
      // Asset optimization
      assetsDir: 'assets',
      assetsInlineLimit: 4096, // 4kb
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Target modern browsers for smaller bundles
      target: 'es2020',
      
      // CSS optimization
      cssTarget: 'chrome87',
      
      // Experimental features for better performance
      reportCompressedSize: isProduction,
      
      // Terser options for better minification
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
      } : undefined,
    },
    
    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react',
        'clsx',
        'tailwind-merge',
      ],
      exclude: [
        // Exclude large dependencies that don't need pre-bundling
        '@tanstack/react-query-devtools',
      ],
    },
    
    // Enable experimental features
    experimental: {
      renderBuiltUrl(filename) {
        // Custom URL rendering for CDN or asset optimization
        return filename;
      },
    },
    
    // Performance optimizations
    esbuild: {
      // Remove console logs in production
      drop: isProduction ? ['console', 'debugger'] : [],
      // Legal comments handling
      legalComments: 'none',
    },
    
    // Preview server configuration
    preview: {
      port: 3000,
      host: true,
      cors: true,
    },
    
    // Define global constants
    define: {
      // Eliminate feature flags for smaller bundle
      __DEV__: !isProduction,
      __PROD__: isProduction,
      // App version from package.json
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    
    // Worker configuration for web workers
    worker: {
      format: 'es',
    },
    
    // JSON configuration
    json: {
      namedExports: true,
      stringify: false,
    },
  };
});
