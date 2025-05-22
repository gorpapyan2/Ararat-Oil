# Tailwind CSS v4 Cheat Sheet

## Core Concepts

### Color Format
Tailwind CSS v4 uses RGB format for all colors.

```diff
- color: #ffffff;          ❌
+ color: rgb(255 255 255); ✅

- bg-[#ff0000]            ❌
+ bg-[rgb(255 0 0)]       ✅
```

### CSS Variables
CSS variables must use the `--color-` prefix and RGB values.

```diff
- --primary: 142 48% 44%;                 ❌
+ --color-primary: 58 166 85;             ✅

- color: hsl(var(--primary));             ❌
+ color: rgb(var(--color-primary));       ✅
```

### Import Syntax
The import syntax has changed in CSS files.

```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
```

### Theme Block
CSS variables are defined in a theme block.

```css
@theme {
  --color-primary: 58 166 85;
  --color-secondary: 111 114 185;
  /* other color variables */
}
```

## Common Patterns

### Background Colors

```html
<!-- Basic background -->
<div class="bg-background"></div>

<!-- With opacity -->
<div class="bg-primary/10"></div>

<!-- Using arbitrary values -->
<div class="bg-[rgb(58 166 85)]"></div>
```

### Text Colors

```html
<!-- Basic text color -->
<div class="text-primary"></div>

<!-- With opacity -->
<div class="text-primary/80"></div>
```

### Borders

```html
<!-- Border color -->
<div class="border border-primary"></div>

<!-- Border with opacity -->
<div class="border border-primary/25"></div>
```

## Troubleshooting

### Blank Screen / No Styles
Check for:
1. Proper CSS variable format (RGB values)
2. Correct import syntax
3. Preflight styles loaded correctly

### Colors Not Appearing Correctly
1. Ensure all colors are in RGB format
2. Check CSS variable names have `--color-` prefix
3. Verify RGB values are space-separated (not comma-separated)

### Component Background Issues
If backgrounds are not working:
1. Check `bg-background` references
2. Verify opacity modifiers are working
3. Check for hardcoded hex colors in class names

## Migration Tools

Run our custom migration tools:

```bash
# Convert colors in the codebase
npm run tailwind:convert-colors

# Run full upgrade process
npm run tailwind:full-upgrade
```

## Resources

- [Official Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Full Migration Guide](docs/tailwind-v4-migration.md)
- [Color Reference](https://tailwindcss.com/docs/customizing-colors) 