# Tailwind CSS Configuration Guide

## Overview

This guide documents our Tailwind CSS configuration for the Ararat OIL Management System. It includes best practices, explanations of customizations, and solutions to common issues.

## Core Configuration

Our Tailwind configuration (in `tailwind.config.ts`) extends the default theme with:

- Custom color palette using CSS variables
- Font families configuration
- Border radius utilities
- Custom scrollbar utilities

## Font Configuration

We've configured the following font families:

```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  serif: ['Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
  mono: ['Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
}
```

### Usage

The font utilities can be used as follows:

```jsx
<p className="font-sans">This text uses our primary sans-serif font (Inter)</p>
<p className="font-serif">This text uses our serif font</p>
<p className="font-mono">This text uses our monospace font</p>
```

## Common Issues and Solutions

### 1. "Cannot apply unknown utility class: font-sans"

This error occurs when the `fontFamily` configuration is missing from the Tailwind configuration.

**Solution**: Ensure the `fontFamily` object is defined in the `theme.extend` section of `tailwind.config.ts`.

### 2. PostCSS Configuration

Our PostCSS configuration uses `@tailwindcss/postcss` instead of the traditional `tailwindcss` plugin. This provides better compatibility with newer Tailwind versions.

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 3. CSS Variable Usage

We use CSS variables for theming, defined in `index.css`. These map to Tailwind utilities through the color definitions in `tailwind.config.ts`.

Example from our config:
```typescript
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
}
```

Example usage:
```jsx
<button className="bg-primary text-primary-foreground">
  Primary Button
</button>
```

## Extending Tailwind

When adding new UI components or design elements:

1. Check if existing utilities satisfy the design requirements
2. If custom styling is needed, extend the Tailwind theme in `tailwind.config.ts`
3. For one-off styles, use the `@apply` directive in CSS or inline styles in components
4. For repeated patterns, create reusable components with Tailwind classes

## Performance Considerations

- Use JIT (Just-In-Time) mode for faster development builds
- Be mindful of unnecessary class variants that increase bundle size
- Consider using PurgeCSS in production builds to remove unused styles

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code Extension
- [Tailwind UI](https://tailwindui.com/) - Component library 