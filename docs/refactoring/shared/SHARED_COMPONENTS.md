# Shared Components Migration

This document tracks the identification and migration of shared components.

## UI Components
**Current Location**: `src/components/ui/`
**Target Location**: `src/shared/components/`

### Components to Migrate
- [ ] Button
- [ ] Input
- [ ] Form
- [x] Dialog
- [ ] Table
- [ ] Card
- [ ] Modal
- [ ] Dropdown
- [ ] Tabs
- [ ] Accordion
- [ ] Alert
- [ ] Badge
- [ ] Breadcrumb
- [ ] Calendar
- [ ] Checkbox
- [ ] DatePicker
- [ ] FileInput
- [ ] Loading
- [ ] Pagination
- [ ] Progress
- [ ] Radio
- [ ] Select
- [ ] Slider
- [ ] Switch
- [ ] Textarea
- [ ] Toast
- [ ] Tooltip

## Common Components
**Current Location**: `src/components/common/`
**Target Location**: `src/shared/components/`

### Components to Migrate
- [ ] ErrorBoundary
- [ ] Layout components
- [ ] Navigation components
- [ ] Header components
- [ ] Footer components
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

## Migration Guidelines
1. Each component should be self-contained
2. Include proper TypeScript types
3. Include unit tests
4. Include documentation
5. Follow consistent naming conventions
6. Use proper prop types and defaults
7. Implement proper error handling
8. Follow accessibility guidelines

## Progress Tracking
- [ ] UI Components Migration
  - [ ] Basic Components
  - [ ] Form Components
  - [ ] Layout Components
  - [ ] Feedback Components
  - [ ] Navigation Components
- [ ] Common Components Migration
  - [ ] Error Handling
  - [ ] Layout
  - [ ] States
  - [ ] Navigation

## Migrated Components
- **Dialog**: StandardDialog and DeleteConfirmDialog
  - Location: `src/shared/components/common/dialog`
  - Import: `import { StandardDialog, DeleteConfirmDialog } from '@/shared/components/common';`
  - Migration Guide: `docs/refactoring/shared/DIALOG_MIGRATION.md`

## Next Steps
1. Review each component for dependencies
2. Create migration plan for each component
3. Update imports in existing code
4. Test components after migration
5. Update documentation

## Notes
- Keep components as generic as possible
- Ensure proper prop types and documentation
- Maintain consistent styling
- Follow accessibility guidelines
- Consider performance implications 