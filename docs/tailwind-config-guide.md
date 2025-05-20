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

## Best Practices for Colors and Theming

### Approach 1: Direct Color References (Recommended)

For maximum compatibility, use direct Tailwind color utilities:

```jsx
// Recommended: Use direct color classes
<div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
  Content
</div>
```

#### Pros:
- Guaranteed compatibility with Tailwind
- Better IDE autocomplete support
- Clearer to developers what colors are being used
- Works with all Tailwind versions

#### Cons:
- Less flexible for theme changes (need to update all instances)
- More verbose for dark mode support

### Approach 2: CSS Variables with Proper Configuration

If using CSS variables is preferred, ensure the Tailwind configuration properly defines them:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // For full compatibility with CSS variables, ensure HSL format is correct
        background: "hsl(var(--background) / <alpha-value>)",
      }
    }
  }
}
```

```css
/* In your CSS */
:root {
  --background: 210 40% 98%;
}
.dark {
  --background: 222 47% 9.2%;
}
```

#### Important Notes:
- When using CSS variables with Tailwind, you must include the space notation in HSL values (e.g., `210 40% 98%`) 
- Adding `/ <alpha-value>` to the HSL string is necessary for opacity modifiers to work (e.g., `bg-background/50`)
- Test thoroughly after configuration changes to ensure compatibility

### Troubleshooting

If you encounter the error `Cannot apply unknown utility class: bg-background`:

1. Check if the color is properly defined in your Tailwind config
2. Verify the CSS variable syntax (spaces between HSL values, not commas)
3. Consider switching to direct color references for that component
4. When in doubt, prefer standard Tailwind colors over custom CSS variables

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

## Using Colors in the Project

### Important: Only Use Defined Colors

When using color classes in your components, ensure you only use colors that are explicitly defined in the `tailwind.config.js` file. The following colors are available:

- Basic colors: `white`, `black`
- Gray scale: `gray-50` through `gray-900`
- Blue scale: `blue-50` through `blue-900`
- Yellow scale: `yellow-50` through `yellow-900`
- Red scale: `red-50` through `red-900`
- Green scale: `green-50` through `green-900`

The configuration also includes semantic colors for specific UI elements:
- `primary` (green) and `primary-foreground` (white)
- `secondary` (light gray) and `secondary-foreground` (dark text)
- `accent` (yellow) and `accent-foreground` (dark text)
- `destructive` (red) and `destructive-foreground` (white)
- `muted`, `card`, `border`, `input`, etc.

### Avoid Using Undefined Colors

Do not use colors like `slate`, `zinc`, `neutral`, etc., as they are not defined in our configuration. If you need these colors, they should be added to the Tailwind configuration first.

### Dark Mode Support

For dark mode support, use the `dark:` prefix with appropriate colors:

```jsx
<div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-50">
  Dark mode compatible content
</div>
```

### Troubleshooting Color Issues

If you encounter an error like `Cannot apply unknown utility class: bg-[color]`, check if:

1. The color is properly defined in `tailwind.config.js`
2. You're using the correct syntax for the color (e.g., `gray-100` not `gray-100`)
3. The Tailwind configuration is being properly loaded

## Important: PostCSS Configuration

The project uses PostCSS to process Tailwind CSS. It requires a specific PostCSS setup due to the version of Tailwind CSS used:

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Required for our Tailwind version
    autoprefixer: {},
  },
}
```

### About the PostCSS Plugin

This project requires `@tailwindcss/postcss` rather than the standard `tailwindcss` plugin. This is specific to the version of Tailwind CSS we're using. When you encounter either of these errors:

1. `Cannot apply unknown utility class: bg-white`
2. `It looks like you're trying to use tailwindcss directly as a PostCSS plugin`

The solution is to ensure you're using the correct PostCSS plugin that matches your Tailwind version.

### Installation

Make sure the required package is installed:

```bash
npm install @tailwindcss/postcss
```

### Common Pitfalls

- Using the wrong PostCSS plugin for your Tailwind version
- Incorrect plugin order (Tailwind should process before autoprefixer)
- For ESM projects, use the `export default` syntax as shown above
- For CommonJS projects, use `module.exports` instead

## Safelist Configuration

To ensure critical utility classes are never purged during the build process, we've added a safelist to our Tailwind configuration. This is particularly important for dynamically generated class names or classes used in components that might not be immediately recognized by Tailwind's purge process.

```javascript
// tailwind.config.js
module.exports = {
  // ... other config
  safelist: [
    'bg-white',
    'bg-black',
    'text-white',
    'text-black',
    'bg-gray-50',
    'bg-gray-800',
    'bg-gray-900',
    'text-gray-50',
    'text-gray-900',
    'border-gray-200'
  ],
  // ... theme config
}
```

### When to Add Classes to the Safelist

Add classes to the safelist when:

1. You're using dynamically generated class names that Tailwind might not detect
2. You encounter "Cannot apply unknown utility class" errors for classes that should be available
3. Classes are being used in components loaded dynamically or conditionally

### Safelist Best Practices

- Only add classes that are genuinely needed but being purged
- Avoid adding too many classes to the safelist as it increases CSS bundle size
- Consider using pattern matching for related classes:

```javascript
safelist: [
  // Exact classes
  'bg-white',
  // Pattern matching (all bg-red classes)
  {
    pattern: /bg-red-\d+/,
  }
]
```
