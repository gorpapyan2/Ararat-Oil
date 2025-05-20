# Ararat OIL Project Documentation

## Core Documentation

- [**Environment Configuration**](./environment-configuration.md) - Setup and configuration of environment variables
- [**Type Mapping Patterns**](./type-mapping-patterns.md) - Patterns for mapping between database and domain models
- [**Tailwind Config Guide**](./tailwind-config-guide.md) - Overview of Tailwind CSS configuration
- [**Accessibility Guide**](./accessibility.md) - Standards and practices for accessibility
- [**Vite React Overview**](./vite-react-overview.md) - Project structure and configuration for Vite+React
- [**TypeScript Configuration**](./linter-fixes.md) - TypeScript configuration and best practices

## Refactoring Documentation

The [refactoring](./refactoring/) directory contains detailed documentation about the ongoing architectural refactoring:

- [**Architecture Overview**](./refactoring/ARCHITECTURE_OVERVIEW.md) - Current architecture and feature structure
- [**Refactoring Plan**](./refactoring/REFACTORING_PLAN.md) - Detailed plan with progress tracking
- Implementation reports and status updates

## Project Status

The project is currently undergoing a major refactoring to a feature-based architecture. The refactoring is:
- ✅ Phase 1: Setup and Planning (100% complete)
- ✅ Phase 2: Feature Migration (100% complete)
- ✅ Phase 3: Shared Code Migration (100% complete)
- 🚧 Phase 4: Core Functionality Migration (90% complete)
- 🚧 Phase 5: Cleanup and Testing (70% complete)

## Project Status Updates

### Component Migration Project - ✅ Complete (100%)

The component migration project has successfully completed! All 57 UI components have been migrated to the new primitives-based architecture.

Key achievements:
- Created 15 new re-export files
- Updated 25 existing re-export files
- Fixed various import path and dependency issues
- Developed an enhanced component showcase
- Created comprehensive documentation

For more details:
- [Component Migration Completion Summary](./refactoring/completion-summary.md)
- [Fixes Applied During Migration](./fixes-applied.md)

### How to View the Component Showcase

To see all the migrated components in action:

1. Start the development server: `npm run dev`
2. Navigate to: http://localhost:3003/dev/component-showcase

The showcase includes examples of all 57 components, organized into categories:
- Basic UI components (buttons, badges, avatars)
- Data display components (cards, tables, accordions)
- Input components (form fields, selectors, date pickers)
- Layout components (tabs, layouts)
- Feedback components (alerts, progress indicators, skeletons)

## Documentation Standards

When updating documentation:

1. Use Markdown for all documentation files
2. Include code examples where appropriate
3. Update status markers (✅, 🚧, ❌) to reflect current progress
4. Keep each document focused on a single topic
5. Cross-reference related documents where appropriate

## Developer Tools

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3003/` (or another port if 3003 is in use).

### Component Showcase

To view all UI components in the showcase:

```bash
# Start the development server
npm run dev

# Navigate to the component showcase
http://localhost:3003/dev/component-showcase
```

### Linting

To run ESLint with automatic fixes:

```bash
npm run lint:fix
```

This command will automatically fix linting issues while respecting the ignore rules specified in the `.eslintignore` file.

### Building for Production

To build the application for production:

```bash
npm run build
```

The output will be generated in the `dist` directory. 