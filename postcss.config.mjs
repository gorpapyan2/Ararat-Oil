// PostCSS configuration for Tailwind CSS v4
export default {
  plugins: {
    // Process imports first to ensure correct order
    'postcss-import': {},
    '@tailwindcss/postcss': {
      // Force proper CSS import order processing
      prepend: [
        { raw: '/* Ensure CSS imports are at the top */' }
      ]
    },
    autoprefixer: {},
  },
}; 